import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encrypt } from "@/lib/crypto";

async function validateGeminiKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        // 1. First, list available models to validate the key and find a supported model
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);

        if (!response.ok) {
            const text = await response.text();
            return {
                isValid: false,
                error: `API Key validation failed. Status: ${response.status}. Details: ${text}`
            };
        }

        const data = await response.json();
        const models = data.models || [];

        // 2. Find a model that supports 'generateContent'
        // We prefer standard models if available, but will take any that works.
        const validModel = models.find((m: any) =>
            m.supportedGenerationMethods &&
            m.supportedGenerationMethods.includes("generateContent")
        );

        if (!validModel) {
            return {
                isValid: false,
                error: "No models found that support content generation."
            };
        }

        // 3. Test generation with the found model
        // The model name usually comes as "models/model-name", SDK expects "model-name" or handles the prefix.
        // We'll use the full name as returned by the API which is safest.
        const modelName = validModel.name;

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent("Test");

        return { isValid: true };

    } catch (error) {
        console.error("Gemini dynamic validation failed:", error);
        return {
            isValid: false,
            error: error instanceof Error ? error.message : "Unknown validation error"
        };
    }
}

async function validateGroqKey(apiKey: string): Promise<{ isValid: boolean; error?: string }> {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/models", {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });
        if (!response.ok) {
            const text = await response.text();
            return { isValid: false, error: `Groq API error: ${response.status} ${text}` };
        }
        return { isValid: true };
    } catch (error) {
        console.error("Groq key validation failed:", error);
        return {
            isValid: false,
            error: error instanceof Error ? error.message : "Unknown validation error"
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');

        // Create a Supabase client with the SERVICE ROLE KEY
        // This bypasses RLS, allowing us to upsert the user profile.
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceKey) {
            console.error("SUPABASE_SERVICE_ROLE_KEY is missing.");
            return NextResponse.json(
                { error: "Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file." },
                { status: 500 }
            );
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Verify the user
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { geminiKey, groqKey } = body;

        if (!geminiKey && !groqKey) {
            return NextResponse.json(
                { error: "At least one key must be provided" },
                { status: 400 }
            );
        }

        const updates: any = {};

        // Validate Gemini Key
        if (geminiKey) {
            const validation = await validateGeminiKey(geminiKey);
            if (!validation.isValid) {
                return NextResponse.json(
                    { error: `Invalid Gemini API Key: ${validation.error}` },
                    { status: 400 }
                );
            }
        }

        // Validate Groq Key
        if (groqKey) {
            const validation = await validateGroqKey(groqKey);
            if (!validation.isValid) {
                return NextResponse.json(
                    { error: `Invalid Groq API Key: ${validation.error}` },
                    { status: 400 }
                );
            }
        }

        // Fetch current data to handle re-encryption if needed
        const { data: currentProfile } = await supabase
            .from('public_users')
            .select('gemini_key_encrypted, groq_key_encrypted, iv')
            .eq('user_id', user.id)
            .single();

        let finalGeminiKey = geminiKey;
        let finalGroqKey = groqKey;

        // If not provided in body, try to recover existing keys from DB
        if (!finalGeminiKey && currentProfile?.gemini_key_encrypted && currentProfile?.iv) {
            try {
                // We need to decrypt using the OLD IV
                const { decrypt } = require("@/lib/crypto");
                finalGeminiKey = decrypt(currentProfile.gemini_key_encrypted, currentProfile.iv);
            } catch (e) {
                console.error("Failed to decrypt existing Gemini key", e);
            }
        }

        if (!finalGroqKey && currentProfile?.groq_key_encrypted && currentProfile?.iv) {
            try {
                const { decrypt } = require("@/lib/crypto");
                finalGroqKey = decrypt(currentProfile.groq_key_encrypted, currentProfile.iv);
            } catch (e) {
                console.error("Failed to decrypt existing Groq key", e);
            }
        }

        // Generate NEW IV for the batch
        const crypto = require('crypto');
        const ALGORITHM = 'aes-256-cbc';
        const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';

        if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
            throw new Error("Invalid ENCRYPTION_KEY configuration");
        }

        const keyBuffer = Buffer.from(ENCRYPTION_KEY, 'hex');
        const ivBuffer = crypto.randomBytes(16);
        updates.iv = ivBuffer.toString('hex');

        // Encrypt keys with the NEW IV
        if (finalGeminiKey) {
            const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, ivBuffer);
            let encrypted = cipher.update(finalGeminiKey);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            updates.gemini_key_encrypted = encrypted.toString('hex');
        }

        if (finalGroqKey) {
            const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, ivBuffer);
            let encrypted = cipher.update(finalGroqKey);
            encrypted = Buffer.concat([encrypted, cipher.final()]);
            updates.groq_key_encrypted = encrypted.toString('hex');
        }

        // Update or Insert DB (Upsert)
        // We need email for upsert if creating a new record
        updates.user_id = user.id;
        updates.email = user.email;
        updates.updated_at = new Date().toISOString();

        const { data: updatedData, error: updateError } = await supabase
            .from("public_users")
            .upsert(updates, { onConflict: 'user_id' })
            .select();

        if (updateError) {
            console.error("Database update error:", updateError);
            return NextResponse.json(
                { error: "Failed to save keys" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Key save error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
