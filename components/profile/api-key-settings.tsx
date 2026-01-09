"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Check, AlertCircle, Eye, EyeOff } from "lucide-react";

export function APIKeySettings() {
    const { profile, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [geminiKey, setGeminiKey] = useState("");
    const [groqKey, setGroqKey] = useState("");

    const [showGemini, setShowGemini] = useState(false);
    const [showGroq, setShowGroq] = useState(false);

    const hasGeminiKey = !!profile?.gemini_key_encrypted;
    const hasGroqKey = !!profile?.groq_key_encrypted;

    const handleSave = async () => {
        if (!geminiKey && !groqKey) {
            setMessage({ type: "error", text: "Please enter at least one API key." });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            // Get session token
            const { data: { session } } = await import("@/lib/supabase/auth-client").then(mod => mod.createClient().auth.getSession());

            if (!session) {
                setMessage({ type: "error", text: "You must be logged in to save keys." });
                setLoading(false);
                return;
            }

            const response = await fetch("/api/user/keys", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    geminiKey: geminiKey || undefined,
                    groqKey: groqKey || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to save keys");
            }

            setMessage({ type: "success", text: "API keys saved successfully!" });
            setGeminiKey("");
            setGroqKey("");
            await refreshProfile();
        } catch (error) {
            setMessage({
                type: "error",
                text: error instanceof Error ? error.message : "An error occurred"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg p-6 space-y-6 bg-card">
            <div>
                <h2 className="text-xl font-semibold mb-2">Bring Your Own Key (BYOK)</h2>
                <p className="text-muted-foreground text-sm">
                    Add your own API keys to bypass rate limits and ensure uninterrupted access to AI features.
                    Your keys are encrypted and stored securely.
                </p>
            </div>

            <div className="space-y-4">
                {/* Gemini Key Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                        <span>Google Gemini API Key</span>
                        {hasGeminiKey && (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Key saved
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            type={showGemini ? "text" : "password"}
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            placeholder={hasGeminiKey ? "••••••••••••••••" : "Enter your Gemini API Key"}
                            className="w-full p-2 pr-10 rounded-md border bg-background"
                        />
                        <button
                            type="button"
                            onClick={() => setShowGemini(!showGemini)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showGemini ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>.
                    </p>
                </div>

                {/* Groq Key Input */}
                <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                        <span>Groq API Key</span>
                        {hasGroqKey && (
                            <span className="text-xs text-green-500 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Key saved
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            type={showGroq ? "text" : "password"}
                            value={groqKey}
                            onChange={(e) => setGroqKey(e.target.value)}
                            placeholder={hasGroqKey ? "••••••••••••••••" : "Enter your Groq API Key"}
                            className="w-full p-2 pr-10 rounded-md border bg-background"
                        />
                        <button
                            type="button"
                            onClick={() => setShowGroq(!showGroq)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showGroq ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Get your key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Groq Console</a>.
                    </p>
                </div>

                {/* Status Message */}
                {message && (
                    <div className={`p-3 rounded-md text-sm flex items-center gap-2 ${message.type === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                        {message.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                        {message.text}
                    </div>
                )}

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={loading || (!geminiKey && !groqKey)}
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save API Keys"
                    )}
                </button>
            </div>
        </div>
    );
}
