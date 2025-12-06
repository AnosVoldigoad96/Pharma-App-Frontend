"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/auth-client";
import { useAuth } from "@/contexts/auth-context";
import type { Chatbot, Book } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Send, Trash2, Copy, Check, Bot, User, BookOpen } from "lucide-react";
import Image from "next/image";
import {
  saveChatMessage,
  loadChatHistory,
  clearChatHistory,
  generateSessionId,
} from "@/lib/supabase/chat-history";
import { limitMessagesForContext, estimateTokenCount, MAX_CONTEXT_MESSAGES, ENABLE_CHAT_HISTORY } from "@/lib/supabase/chat-config";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  id: string;
}

export default function ChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const bookId = params.id as string;
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isSending]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to focus input
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Generate new session ID for this page load
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);

      // Fetch book
      const { data: bookData } = await supabase
        .from("books")
        .select("*")
        .eq("id", bookId)
        .single();

      if (bookData) {
        setBook(bookData as Book);
      }

      // Fetch chatbot
      const { data: chatbotData, error } = await supabase
        .from("chatbots")
        .select("*")
        .eq("linked_book_id", bookId)
        .single();

      if (!error && chatbotData) {
        setChatbot(chatbotData as Chatbot);
        
        // New session starts fresh - always show welcome message
        // History from previous sessions is not loaded (new session = reset)
        // Always use default format, description is used elsewhere
        const chatbotName = chatbotData.name || "Assistant";
        const welcomeContent = `Hello! I am ${chatbotName}. How can I help you today?`;
        
        const welcomeMessage: ChatMessage = {
          role: "assistant",
          content: welcomeContent,
          timestamp: new Date(),
          id: `welcome-${Date.now()}`,
        };
        
        setChatMessages([welcomeMessage]);
        
        // Save welcome message to database if user is logged in AND history is enabled
        if (ENABLE_CHAT_HISTORY && user && chatbotData.id) {
          await saveChatMessage(
            user.id,
            chatbotData.id,
            newSessionId,
            "assistant",
            welcomeMessage.content
          );
        }
      } else {
        // No chatbot found, redirect to library
        router.push("/books");
      }
      setLoading(false);
    };

    if (bookId) {
      fetchData();
    }
  }, [bookId, router, user]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isSending || !chatbot) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    const userMsg: ChatMessage = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
      id: `user-${Date.now()}`,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    // Save user message to database if logged in AND history is enabled
    if (ENABLE_CHAT_HISTORY && user && sessionId) {
      await saveChatMessage(
        user.id,
        chatbot.id,
        sessionId,
        "user",
        userMessage
      );
    }

    try {
      // Prepare messages array
      // If history is disabled, only send the current message (saves tokens)
      let messagesToSend: Array<{ role: string; content: string }>;
      
      if (ENABLE_CHAT_HISTORY) {
        // With history: include conversation context (limited)
        const allMessages = chatMessages
          .filter((msg) => !msg.id.startsWith("welcome-")) // Exclude welcome messages from context
          .map((msg) => ({
            role: msg.role,
            content: msg.content,
          }));

        // Add the new user message
        allMessages.push({
          role: "user",
          content: userMessage,
        });

        // Limit messages to reduce token usage
        messagesToSend = limitMessagesForContext(allMessages);
        const estimatedTokens = estimateTokenCount(messagesToSend);
        console.log(`📊 Context: ${messagesToSend.length} messages, ~${estimatedTokens} tokens (limited from ${allMessages.length} messages)`);
      } else {
        // Without history: only send current message (minimal tokens)
        messagesToSend = [
          {
            role: "user",
            content: userMessage,
          },
        ];
        console.log(`📊 Context: 1 message (history disabled), ~${estimateTokenCount(messagesToSend)} tokens`);
      }

      // Call the chat API (matching CMS implementation: messages array and botId)
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messagesToSend,
          botId: chatbot.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
        id: `assistant-${Date.now()}`,
      };
      setChatMessages((prev) => [...prev, aiResponse]);

      // Save assistant response to database if logged in AND history is enabled
      if (ENABLE_CHAT_HISTORY && user && sessionId) {
        await saveChatMessage(
          user.id,
          chatbot.id,
          sessionId,
          "assistant",
          data.message
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: ChatMessage = {
        role: "assistant",
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}. Please try again.`
          : "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
        id: `error-${Date.now()}`,
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleClearChat = async () => {
    // Clear chat history from database if logged in AND history is enabled
    if (ENABLE_CHAT_HISTORY && user && chatbot && sessionId) {
      await clearChatHistory(user.id, chatbot.id, sessionId);
    }

    // Reset to welcome message
    // Always use default format, description is used elsewhere
    if (chatbot) {
      const chatbotName = chatbot.name || "Assistant";
      const welcomeContent = `Hello! I am ${chatbotName}. How can I help you today?`;
      
      const welcomeMessage: ChatMessage = {
        role: "assistant",
        content: welcomeContent,
        timestamp: new Date(),
        id: `welcome-${Date.now()}`,
      };
      setChatMessages([welcomeMessage]);

      // Save welcome message to database if logged in AND history is enabled
      if (ENABLE_CHAT_HISTORY && user && sessionId) {
        await saveChatMessage(
          user.id,
          chatbot.id,
          sessionId,
          "assistant",
          welcomeMessage.content
        );
      }
    }
  };

  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading chatbot...</p>
        </div>
      </div>
    );
  }

  if (!chatbot) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Chatbot not found</p>
          <Button asChild>
            <Link href="/books">Back to Library</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        {/* Mobile: Back Button */}
        <div className="mb-4 md:hidden">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/books">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Link>
          </Button>
        </div>

        {/* Two Column Layout - Vertically Symmetrical */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Book Details & Chatbot Info (Hidden on mobile, shown on desktop) */}
          <div className="hidden lg:flex lg:flex-col space-y-4" style={{ height: "calc(100vh - 200px)" }}>
            {/* Book Details Card - Scaled Down */}
            {book && (
              <div className="bg-card border rounded-lg shadow-sm p-4 space-y-3 flex-shrink-0">
                <Button variant="ghost" size="sm" asChild className="mb-1 -ml-1">
                  <Link href="/books">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Library
                  </Link>
                </Button>
                
                {book.cover_image ? (
                  <div className="relative w-full aspect-[3/4] max-w-[200px] mx-auto rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[3/4] max-w-[200px] mx-auto rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                
                <div className="text-center">
                  <h2 className="text-lg font-bold mb-1">{book.title}</h2>
                  {book.author && (
                    <p className="text-xs text-muted-foreground mb-1">By {book.author}</p>
                  )}
                  {book.edition && (
                    <p className="text-xs text-muted-foreground mb-2">Edition: {book.edition}</p>
                  )}
                  {book.tags && book.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-center mt-2">
                      {book.tags.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-muted px-2 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Chatbot Info Card - Scaled Down, fills remaining space */}
            <div className="bg-card border rounded-lg shadow-sm p-4 space-y-3 flex-1 flex flex-col">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{chatbot.name}</h3>
                  <p className="text-xs text-muted-foreground">AI Assistant</p>
                </div>
              </div>
              
              {chatbot.description && (
                <div className="pt-3 border-t flex-1">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {chatbot.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Interface (Full width on mobile, 2 columns on desktop) */}
          <div className="lg:col-span-2">
            {/* Mobile: Chatbot Header */}
            <div className="lg:hidden mb-4 bg-card border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{chatbot.name}</h3>
                    {book && (
                      <p className="text-xs text-muted-foreground">{book.title}</p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              {chatbot.description && (
                <p className="text-sm text-muted-foreground">{chatbot.description}</p>
              )}
            </div>

            {/* Desktop: Chat Header */}
            <div className="hidden lg:flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{chatbot.name}</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </Button>
            </div>

            {/* Chat Container */}
            <div className="bg-card border rounded-lg shadow-sm flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth">
            {chatMessages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Start a conversation...</p>
              </div>
            )}
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
                  <div
                    className={`rounded-lg p-3 md:p-4 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1 px-1">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.timestamp)}
                    </span>
                    <button
                      onClick={() => handleCopyMessage(message.content, message.id)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                    >
                      {copiedId === message.id ? (
                        <>
                          <Check className="h-3 w-3" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isSending && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-3 md:p-4 rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-muted/30 p-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={chatInput}
                  onChange={(e) => {
                    setChatInput(e.target.value);
                    // Auto-resize textarea
                    e.target.style.height = "auto";
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim() && !isSending) {
                        handleSendMessage();
                      }
                    }
                  }}
                  placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none max-h-[120px] bg-background"
                  disabled={isSending}
                  rows={1}
                />
                <span className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  {chatInput.length > 0 && `${chatInput.length} chars`}
                </span>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isSending}
                size="lg"
                className="h-[42px]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+K</kbd> or <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Cmd+K</kbd> to focus input
            </p>
          </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

