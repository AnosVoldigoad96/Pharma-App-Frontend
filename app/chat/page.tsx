"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import { useRouter } from "next/navigation";
import type { Chatbot } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Send, Bot, Loader2 } from "lucide-react";

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    id: string;
}

export default function ChatPage() {
    const router = useRouter();
    const [chatbot, setChatbot] = useState<Chatbot | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messages, isSending]);

    // Check auth and fetch chatbot
    useEffect(() => {
        const initialize = async () => {
            const supabase = createClient();

            // Check authentication
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/login");
                return;
            }

            // Fetch Pharma Guru chatbot
            const { data, error } = await supabase
                .from("chatbots")
                .select("*")
                .ilike("name", "%Pharma Guru%")
                .single<Chatbot>();

            if (!error && data) {
                setChatbot(data as Chatbot);
                // Add welcome message
                const welcomeMessage: ChatMessage = {
                    role: "assistant",
                    content: `Hello! I'm ${data.name}, your AI Pharmaceutical Assistant. Ask me anything about pharmaceuticals, drug interactions, pharmacology, or pharmaceutical calculations!`,
                    id: `welcome-${Date.now()}`,
                };
                setMessages([welcomeMessage]);
            }

            setIsLoading(false);
        };

        initialize();
    }, [router]);

    // Format answer with markdown
    const formatAnswerToHTML = (text: string) => {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
            .replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>')
            .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
            .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
            .replace(/^\s*[\*\-\+]\s+(.+)$/gm, '• $1')
            .replace(/\n\n/g, '<br/><br/>')
            .replace(/\n/g, '<br/>')
            .replace(/[ \t]+/g, ' ')
            .trim();
    };

    const handleSendMessage = async () => {
        if (!input.trim() || isSending || !chatbot) return;

        const userMessage = input.trim();
        setInput("");

        const userMsg: ChatMessage = {
            role: "user",
            content: userMessage,
            id: `user-${Date.now()}`,
        };
        setMessages(prev => [...prev, userMsg]);
        setIsSending(true);

        try {
            const messageHistory = messages
                .filter(msg => !msg.id.startsWith("welcome-"))
                .map(msg => ({ role: msg.role, content: msg.content }));

            messageHistory.push({ role: "user", content: userMessage });

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: messageHistory, botId: chatbot.id }),
            });

            if (!response.ok) throw new Error("Failed to get response");

            const data = await response.json();
            const aiResponse: ChatMessage = {
                role: "assistant",
                content: data.message,
                id: `assistant-${Date.now()}`,
            };
            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            console.error("Error:", error);
            const errorMsg: ChatMessage = {
                role: "assistant",
                content: "Sorry, I encountered an error. Please try again.",
                id: `error-${Date.now()}`,
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsSending(false);
            inputRef.current?.focus();
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-chart-5/10 to-chart-3/10">
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <p className="text-muted-foreground">Loading chat...</p>
                </div>
            </div>
        );
    }

    if (!chatbot) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-chart-5/10 to-chart-3/10">
                <div className="text-center space-y-4">
                    <p className="text-destructive">Failed to load chatbot</p>
                    <Button onClick={() => router.push("/")}>Go Home</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-background via-chart-5/10 to-chart-3/10">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary/30">
                            <Bot className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{chatbot.name}</h1>
                            <p className="text-sm text-muted-foreground">AI Pharmaceutical Assistant</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-transparent"
            >
                <div className="container max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            {message.role === "assistant" && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                    <Bot className="h-4 w-4 text-primary" />
                                </div>
                            )}
                            <div
                                className={`rounded-lg px-4 py-3 max-w-[80%] ${message.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted"
                                    }`}
                            >
                                {message.role === "user" ? (
                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                ) : (
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none"
                                        dangerouslySetInnerHTML={{ __html: formatAnswerToHTML(message.content) }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    {isSending && (
                        <div className="flex gap-3 justify-start">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                            <div className="bg-muted rounded-lg px-4 py-3">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                    <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container max-w-4xl mx-auto px-4 py-4">
                    <div className="flex gap-2">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => {
                                setInput(e.target.value);
                                e.target.style.height = "auto";
                                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    if (input.trim() && !isSending) {
                                        handleSendMessage();
                                    }
                                }
                            }}
                            placeholder="Ask about pharmaceuticals..."
                            className="flex-1 px-4 py-3 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary min-h-[56px]"
                            disabled={isSending}
                            rows={1}
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={!input.trim() || isSending}
                            size="lg"
                            className="px-6"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
