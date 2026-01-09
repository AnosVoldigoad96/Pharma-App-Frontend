"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/auth-client";
import type { Chatbot } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Bot, LogIn, UserPlus } from "lucide-react";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function HeroChat() {
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [userQuestion, setUserQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const placeholders = [
    "What are the contraindications of aspirin?",
    "Explain pharmacokinetics vs pharmacodynamics",
    "How does metformin work?",
    "What is the mechanism of action of beta blockers?",
    "Calculate the loading dose for a patient...",
  ];

  // Fetch Pharma Guru chatbot and check authentication
  useEffect(() => {
    const fetchChatbot = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chatbots")
        .select("*")
        .ilike("name", "%Pharma Guru%")
        .single<Chatbot>();

      if (!error && data) {
        setChatbot(data as Chatbot);
      }
    };

    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    fetchChatbot();
    checkAuth();
  }, []);

  // Format answer text and convert markdown to HTML
  const formatAnswerToHTML = (text: string) => {
    return text
      // Convert bold (**text** or __text__)
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/__(.+?)__/g, '<strong class="font-semibold">$1</strong>')
      // Convert italic (*text* or _text_)
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/_(.+?)_/g, '<em class="italic">$1</em>')
      // Convert bullet points to HTML
      .replace(/^\s*[\*\-\+]\s+(.+)$/gm, '• $1')
      // Convert line breaks to <br> for paragraphs
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>')
      // Clean up excessive spaces
      .replace(/[ \t]+/g, ' ')
      .trim();
  };

  const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector("input");
    const question = input?.value.trim();

    if (!question || !chatbot) return;

    setUserQuestion(question);
    setShowAnswer(true);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Please provide a concise, brief answer: ${question}`
          }],
          botId: chatbot.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setAiAnswer(`⚠️ **Rate Limit Exceeded**\n\n${data.message}`);
          return;
        }
        throw new Error(data.error || "Failed to get response");
      }

      setAiAnswer(data.message);
    } catch (error) {
      console.error("Error:", error);
      setAiAnswer("Sorry, I encountered an error. Please sign in for full support.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!chatbot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-white/80 text-sm">Loading Pharma Guru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center">
      <AnimatePresence mode="wait">
        {!showAnswer ? (
          // Placeholder Input View
          <motion.div
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center w-full px-4"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ask {chatbot.name}
              </h2>
              <p className="text-white/80 text-lg">
                Your AI Pharmaceutical Assistant
              </p>
            </div>
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={() => { }}
              onSubmit={handleQuestionSubmit}
            />
          </motion.div>
        ) : (
          // Answer Box with CTA
          <motion.div
            key="answer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col w-full bg-background/40 backdrop-blur-xl border border-border/50 rounded-lg overflow-hidden shadow-2xl p-6"
          >
            {/* Question */}
            <div className="mb-6">
              <p className="text-white/60 text-sm mb-2">You asked:</p>
              <p className="text-white font-medium text-lg">{userQuestion}</p>
            </div>

            {/* Answer */}
            <div
              className="flex-1 mb-6 overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-white/10 hover:scrollbar-thumb-primary/70"
              style={{ maxHeight: "180px" }}
            >
              {isLoading ? (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                      <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 pr-2">
                    <div
                      className="text-white/95 text-base leading-relaxed font-light tracking-wide"
                      dangerouslySetInnerHTML={{ __html: formatAnswerToHTML(aiAnswer) }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* CTA - Conditional based on authentication */}
            <div className="border-t border-border/50 pt-6">
              <div className="text-center space-y-4">
                {isAuthenticated ? (
                  // Authenticated: Show Ask More button
                  <>
                    <p className="text-white/80 text-sm">
                      Want more answers?
                    </p>
                    <Link href="/chat">
                      <Button variant="default" size="lg" className="w-full sm:w-auto gap-2">
                        <Bot className="h-4 w-4" />
                        Ask More Questions
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Not authenticated: Show sign-in options
                  <>
                    <p className="text-white/80 text-sm">
                      Want more answers?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link href="/login?redirect=/chat">
                        <Button variant="default" className="w-full sm:w-auto gap-2">
                          <LogIn className="h-4 w-4" />
                          Sign In to Chat
                        </Button>
                      </Link>
                      <Link href="/signup?redirect=/chat">
                        <Button variant="outline" className="w-full sm:w-auto gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20">
                          <UserPlus className="h-4 w-4" />
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
