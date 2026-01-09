"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import type { Chatbot } from "@/lib/supabase/types";
import { Bot, LogIn, UserPlus, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { Button } from "@/components/ui/button";

export interface PharmaAIChatProps {
    botId?: string;
    initialMessage?: string;
    isEmbedded?: boolean;
}

export function PharmaAIChat({ botId, initialMessage, isEmbedded = false }: PharmaAIChatProps) {
    const [chatbot, setChatbot] = useState<Chatbot | null>(null);
    const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, tags?: string[] }>>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const placeholders = [
        "What are the contraindications of aspirin?",
        "Explain pharmacokinetics vs pharmacodynamics",
        "How does metformin work?",
        "What is the mechanism of action of beta blockers?",
        "Calculate the loading dose for a patient...",
    ];

    // Fetch chatbot and check authentication
    useEffect(() => {
        const fetchChatbot = async () => {
            const supabase = createClient();
            let query = supabase.from("chatbots").select("*");

            if (botId) {
                query = query.eq("id", botId);
            } else {
                query = query.ilike("name", "%Pharma Guru%");
            }

            const { data, error } = await query.single<Chatbot>();

            if (!error && data) {
                setChatbot(data as Chatbot);
                // Add initial welcome message
                setMessages([{
                    role: 'assistant',
                    content: initialMessage || "Hello! I'm your pharmaceutical AI assistant. How can I help you today?"
                }]);

                // If embedded and initial message is provided, show chat immediately
                if (isEmbedded && initialMessage) {
                    setShowChat(true);
                }
            }
        };

        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsAuthenticated(!!user);
        };

        fetchChatbot();
        checkAuth();
    }, [botId, initialMessage, isEmbedded]);

    // Auto-scroll to bottom - DISABLED per user request
    // useEffect(() => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // }, [messages, isLoading, showChat]);

    const sendMessageToApi = async (message: string) => {
        if (!chatbot) return;
        setIsLoading(true);
        try {
            // Create the new message object
            const newUserMessage = { role: "user" as const, content: message };

            // Prepare the messages array to send (history + new message)
            // We need to map our internal message format to what the API expects
            const messagesToSend = [...messages, newUserMessage].map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Get the session token
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch("/api/chat", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    messages: messagesToSend,
                    botId: chatbot.id
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403) {
                    setMessages(prev => [...prev, {
                        role: 'assistant',
                        content: `⚠️ **Rate Limit Exceeded**\n\n${data.message}`
                    }]);
                    return;
                }
                throw new Error(data.error || "Failed to get response");
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I encountered an error. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const inputEl = e.currentTarget.querySelector("input");
        const question = inputEl?.value.trim();

        if (!question) return;

        setShowChat(true);
        setMessages(prev => [...prev, { role: 'user', content: question }]);
        sendMessageToApi(question);
    };

    const handleFollowUpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const message = inputValue.trim();
        setInputValue("");
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        sendMessageToApi(message);
    };

    if (!chatbot) {
        return (
            <div className={`w-full flex items-center justify-center bg-card/95 backdrop-blur-xl border border-primary/20 ${isEmbedded ? 'h-full border-0 bg-transparent' : 'max-w-md mx-auto h-[500px] rounded-3xl'}`}>
                <div className="text-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-primary/80 text-sm">Initializing PharmaAI...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait">
                {!showChat ? (
                    <motion.div
                        key="initial-input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col items-center justify-center w-full px-4"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                                Ask {chatbot.name}
                            </h2>
                            <p className="text-muted-foreground text-lg">
                                Your AI Pharmaceutical Assistant
                            </p>
                        </div>
                        <PlaceholdersAndVanishInput
                            placeholders={placeholders}
                            onChange={() => { }}
                            onSubmit={handleInitialSubmit}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat-interface"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className={isEmbedded
                            ? "w-full h-full flex flex-col bg-transparent"
                            : "w-full max-w-md mx-auto overflow-hidden bg-card/95 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_25px_50px_rgba(0,0,0,0.2),0_0_100px_rgba(var(--primary),0.1)] flex flex-col h-[500px]"
                        }
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-muted/50 border-b border-primary/10 flex-shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Bot className="w-6 h-6 text-primary-foreground" />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card animate-[pulse-status_2s_ease-in-out_infinite]"></div>
                                </div>
                                <div>
                                    <h3 className="text-foreground font-semibold tracking-wide">{chatbot.name}</h3>
                                    <p className="text-primary text-sm flex items-center gap-1 font-medium">
                                        <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                        Online • Ready to help
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''} animate-[slide-in_0.3s_ease-out]`}>
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center shadow-lg">
                                            <span className="text-primary-foreground text-xs font-bold">AI</span>
                                        </div>
                                    )}

                                    <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${msg.role === 'assistant'
                                        ? 'rounded-tl-sm bg-primary/10 border border-primary/20 text-foreground'
                                        : 'rounded-tr-sm bg-secondary/20 border border-secondary/20 text-foreground'
                                        }`}>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                            __html: msg.content
                                                .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
                                                .replace(/`(.+?)`/g, '<code class="bg-muted px-1 rounded text-primary font-mono text-xs">$1</code>')
                                        }} />
                                    </div>

                                    {msg.role === 'user' && (
                                        <div className="w-8 h-8 rounded-lg bg-secondary flex-shrink-0 flex items-center justify-center shadow-lg">
                                            <span className="text-secondary-foreground text-xs font-bold">DR</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 animate-[slide-in_0.3s_ease-out]">
                                    <div className="w-8 h-8 rounded-lg bg-primary flex-shrink-0 flex items-center justify-center shadow-lg">
                                        <span className="text-primary-foreground text-xs font-bold">AI</span>
                                    </div>
                                    <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-primary/10 border border-primary/20">
                                        <div className="flex gap-1 h-5 items-center">
                                            <span className="w-2 h-2 bg-primary rounded-full animate-[typing-bounce_1.4s_ease-in-out_infinite]"></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-[typing-bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></span>
                                            <span className="w-2 h-2 bg-primary rounded-full animate-[typing-bounce_1.4s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area or CTA */}
                        {(!isAuthenticated && messages.filter(m => m.role === 'user').length >= 1) ? (
                            <div className="p-4 bg-muted/30 border-t border-primary/10 flex-shrink-0 animate-[slide-in_0.5s_ease-out]">
                                <div className="text-center space-y-3">
                                    <p className="text-muted-foreground text-sm">
                                        Sign in to continue the conversation
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                        <Link href="/login?redirect=/chat">
                                            <Button variant="default" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90">
                                                <LogIn className="h-4 w-4" />
                                                Sign In
                                            </Button>
                                        </Link>
                                        <Link href="/signup?redirect=/chat">
                                            <Button variant="outline" className="w-full sm:w-auto gap-2 border-primary/20 text-foreground hover:bg-primary/10">
                                                <UserPlus className="h-4 w-4" />
                                                Create Account
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (isEmbedded || isAuthenticated) ? (
                            <div className="p-4 bg-muted/30 border-t border-primary/10 flex-shrink-0">
                                <form onSubmit={handleFollowUpSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-background border border-primary/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        disabled={isLoading}
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={!inputValue.trim() || isLoading}
                                        className="rounded-xl bg-primary hover:bg-primary/90"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            !isLoading && (
                                <div className="p-4 bg-muted/30 border-t border-primary/10 flex-shrink-0 animate-[slide-in_0.5s_ease-out]">
                                    <div className="text-center space-y-3">
                                        <p className="text-muted-foreground text-sm">
                                            Want to ask more questions?
                                        </p>
                                        <Link href="/chat">
                                            <Button variant="default" className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0">
                                                <Bot className="h-4 w-4" />
                                                Continue in Full Chat
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            )
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
