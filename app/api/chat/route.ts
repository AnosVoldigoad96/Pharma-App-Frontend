import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Create Supabase client for server-side API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Google AI
const getGoogleAI = () => {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not configured");
  }
  return new GoogleGenerativeAI(apiKey);
};

// Google AI Studio (Gemini/Gemma) API
async function callGoogleAI(
  modelName: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const genAI = getGoogleAI();
  const model = genAI.getGenerativeModel({ model: modelName });

  // Format messages for Gemini API
  // Gemini expects alternating user/model messages, starting with user
  const contents = messages
    .filter((msg) => msg.role !== "system")
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

  // Gemma models don't support systemInstruction parameter
  // System prompt must be integrated into the first user message ONLY ONCE
  const isGemmaModel = modelName.toLowerCase().includes("gemma");

  try {
    if (isGemmaModel) {
      // For Gemma: prepend system prompt ONLY to the very first message (no history)
      // If there's conversation history, the system prompt was already included
      const hasHistory = messages.length > 1;

      if (!hasHistory && contents.length > 0 && contents[0].role === "user") {
        // First message ever - include system prompt
        contents[0].parts[0].text = `${systemPrompt}\n\nUser: ${contents[0].parts[0].text}`;
      }

      const result = await model.generateContent({ contents });
      const response = await result.response;
      return response.text();
    } else {
      // For Gemini: use systemInstruction parameter
      const result = await model.generateContent({
        contents,
        systemInstruction: systemPrompt,
      });
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Google AI API error:", error);
    throw new Error(`Google AI API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Groq API
async function callGroq(
  modelName: string,
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  // Format messages for Groq API
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.filter((msg) => msg.role !== "system"),
  ];

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages: formattedMessages,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "No response generated";
}

// Get embedding from Google's text-embedding-004 model
// Matches CMS implementation exactly
async function getEmbedding(text: string): Promise<number[]> {
  const genAI = getGoogleAI();
  const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

  try {
    const embeddingResult = await embeddingModel.embedContent(text);
    return embeddingResult.embedding.values;
  } catch (error) {
    console.error("Embedding API error:", error);
    throw new Error(`Google Embedding API error: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// RAG: Retrieve relevant knowledge from book_knowledge table
async function retrieveRelevantKnowledge(
  bookId: string,
  queryEmbedding: number[]
) {
  try {
    // Use Supabase's vector similarity search (pgvector)
    // This matches the CMS implementation using match_book_content
    console.log(`   → Calling match_book_content RPC function...`);
    console.log(`   → Parameters: book_id=${bookId}, threshold=0.4, count=4`);

    const { data, error } = await supabase.rpc("match_book_content", {
      query_embedding: queryEmbedding,
      target_book_id: bookId,
      match_threshold: 0.4,
      match_count: 4,
    });

    if (error) {
      console.error(`   ✗ RPC error: ${error.message}`);
      console.log("   → Falling back to simple book_id query...");

      // Fallback: Get knowledge by book_id without vector search
      const { data: fallbackData, error: fallbackError } = await supabase
        .from("book_knowledge")
        .select("content")
        .eq("book_id", bookId)
        .limit(4);

      if (fallbackError) {
        console.error(`   ✗ Fallback error: ${fallbackError.message}`);
        return "";
      }

      const fallbackResult = fallbackData?.map((item) => item.content).filter(Boolean).join("\n\n") || "";
      console.log(`   ✓ Fallback retrieved ${fallbackData?.length || 0} chunks`);
      return fallbackResult;
    }

    if (data && data.length > 0) {
      console.log(`   ✓ Vector search found ${data.length} relevant chunks`);
      data.forEach((item: any, index: number) => {
        console.log(`      Chunk ${index + 1}: similarity=${item.similarity?.toFixed(3) || "N/A"}, length=${item.content?.length || 0} chars`);
      });
      return data.map((item: any) => item.content).filter(Boolean).join("\n\n");
    }

    console.log("   ⚠ No matching chunks found (empty result)");
    return "";
  } catch (rpcError) {
    console.error(`   ✗ Exception during vector search: ${rpcError}`);
    console.log("   → Falling back to simple book_id query...");

    // Fallback: Get knowledge by book_id without vector search
    const { data: fallbackData } = await supabase
      .from("book_knowledge")
      .select("content")
      .eq("book_id", bookId)
      .limit(4);

    const fallbackResult = fallbackData?.map((item) => item.content).filter(Boolean).join("\n\n") || "";
    console.log(`   ✓ Fallback retrieved ${fallbackData?.length || 0} chunks`);
    return fallbackResult;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Match CMS implementation: accepts messages (array) and botId
    const { messages, botId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    if (!botId) {
      return NextResponse.json(
        { error: "botId is required" },
        { status: 400 }
      );
    }

    // Fetch chatbot details from Supabase
    const { data: chatbot, error: chatbotError } = await supabase
      .from("chatbots")
      .select("*")
      .eq("id", botId)
      .single();

    if (chatbotError || !chatbot) {
      return NextResponse.json(
        { error: "Chatbot not found" },
        { status: 404 }
      );
    }

    // Get the last user message for RAG
    const userMessages = messages.filter((msg: any) => msg.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1]?.content || "";

    // Estimate token usage
    const totalChars = messages.reduce((sum: number, msg: any) => sum + (msg.content?.length || 0), 0);
    const estimatedTokens = Math.ceil(totalChars / 4); // Rough estimate: 1 token ≈ 4 chars

    console.log("\n=== CHAT API REQUEST ===");
    console.log(`Bot ID: ${botId}`);
    console.log(`Bot Name: ${chatbot.name}`);
    console.log(`Model: ${chatbot.model_name}`);
    console.log(`Linked Book ID: ${chatbot.linked_book_id || "None"}`);
    console.log(`Messages in context: ${messages.length}`);
    console.log(`Estimated tokens: ~${estimatedTokens} (${totalChars} characters)`);
    console.log(`User Message: ${lastUserMessage.substring(0, 100)}...`);

    // Step 1: RAG Process (if linked_book_id is present)
    let relevantKnowledge = "";
    let usedRAG = false;

    if (chatbot.linked_book_id && lastUserMessage) {
      console.log("\n--- RAG PROCESS STARTED ---");
      try {
        // Embed the user's query
        console.log("1. Generating embedding for user query...");
        const queryEmbedding = await getEmbedding(lastUserMessage);
        console.log(`   ✓ Embedding generated (dimensions: ${queryEmbedding.length})`);

        // Retrieve relevant knowledge using RAG
        console.log("2. Searching for relevant knowledge chunks...");
        relevantKnowledge = await retrieveRelevantKnowledge(
          chatbot.linked_book_id,
          queryEmbedding
        );

        if (relevantKnowledge) {
          usedRAG = true;
          const knowledgeLength = relevantKnowledge.length;
          const knowledgePreview = relevantKnowledge.substring(0, 200);
          console.log(`   ✓ RAG retrieval successful`);
          console.log(`   - Knowledge chunks retrieved: ${knowledgeLength} characters`);
          console.log(`   - Preview: ${knowledgePreview}...`);
        } else {
          console.log("   ⚠ No relevant knowledge found (empty result)");
        }
      } catch (embeddingError) {
        console.error("   ✗ Embedding/RAG error:", embeddingError);
        // Continue without RAG context if embedding fails
      }
      console.log("--- RAG PROCESS COMPLETED ---\n");
    } else {
      if (!chatbot.linked_book_id) {
        console.log("\n⚠ RAG skipped: No linked_book_id in chatbot config");
      }
      if (!lastUserMessage) {
        console.log("\n⚠ RAG skipped: No user message found");
      }
    }

    // Step 2: Build enhanced system prompt with RAG context
    let enhancedSystemPrompt = chatbot.system_prompt;
    if (relevantKnowledge) {
      enhancedSystemPrompt = `${chatbot.system_prompt}\n\nRelevant context from the book:\n${relevantKnowledge}\n\nUse this context to provide accurate and helpful responses. If the context doesn't contain relevant information, say so.`;
      console.log("3. System prompt enhanced with RAG context");
      console.log(`   - Original prompt length: ${chatbot.system_prompt.length} chars`);
      console.log(`   - Enhanced prompt length: ${enhancedSystemPrompt.length} chars`);
    } else {
      console.log("3. Using original system prompt (no RAG context)");
    }

    // Step 3: Format messages (remove system messages as they're handled separately)
    const formattedMessages = messages
      .filter((msg: any) => msg.role !== "system")
      .map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      }));

    // Step 4: Determine which API to use based on model_name
    const modelName = chatbot.model_name;
    let aiResponse: string;

    console.log("4. Calling AI model...");
    // Check if it's a Llama variant (Groq)
    if (modelName.includes("llama") || modelName.includes("mixtral") || modelName.includes("groq")) {
      // Use Groq API
      console.log(`   → Using Groq API (${modelName})`);
      aiResponse = await callGroq(modelName, formattedMessages, enhancedSystemPrompt);
    } else {
      // Default to Google AI Studio (Gemini)
      console.log(`   → Using Google AI Studio (${modelName})`);
      aiResponse = await callGoogleAI(modelName, formattedMessages, enhancedSystemPrompt);
    }
    console.log(`   ✓ Response received (${aiResponse.length} characters)`);

    // Step 5: Return response with debug information (matching CMS format)
    console.log("\n=== RESPONSE SUMMARY ===");
    console.log(`Model: ${modelName}`);
    console.log(`RAG Used: ${usedRAG ? "✓ Yes" : "✗ No"}`);
    console.log(`Response Length: ${aiResponse.length} characters`);
    console.log("=======================\n");

    return NextResponse.json({
      message: aiResponse,
      model: modelName,
      usedRAG,
    });
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
