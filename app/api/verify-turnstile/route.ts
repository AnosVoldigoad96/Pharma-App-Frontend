import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { token } = await request.json();
        let secretKey = process.env.TURNSTILE_SECRET_KEY;
        const remoteIp = request.headers.get("x-forwarded-for") || "";

        console.log("Verifying Turnstile token...");

        if (secretKey) {
            // Sanitize the key: remove whitespace and quotes
            secretKey = secretKey.trim();
            if ((secretKey.startsWith('"') && secretKey.endsWith('"')) || (secretKey.startsWith("'") && secretKey.endsWith("'"))) {
                secretKey = secretKey.slice(1, -1);
            }
        }

        console.log("Secret Key loaded:", secretKey ? `${secretKey.substring(0, 4)}... (Length: ${secretKey.length})` : "NO");

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Token is required" },
                { status: 400 }
            );
        }

        if (!secretKey) {
            console.error("TURNSTILE_SECRET_KEY is not defined");
            return NextResponse.json(
                { success: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        // Manually construct the body string to ensure correct format
        const body = `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}&remoteip=${encodeURIComponent(remoteIp)}`;

        console.log("Sending request to Cloudflare...");

        const result = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: body,
            }
        );

        const outcome = await result.json();
        console.log("Cloudflare response:", JSON.stringify(outcome));

        if (outcome.success) {
            return NextResponse.json({ success: true });
        } else {
            console.error("Turnstile verification failed:", outcome);
            return NextResponse.json(
                { success: false, message: "Invalid CAPTCHA", details: outcome },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("Error verifying Turnstile token:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
