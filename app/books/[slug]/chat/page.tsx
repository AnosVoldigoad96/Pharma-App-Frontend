"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/auth-client";
import type { Chatbot, Book } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PharmaAIChat } from "@/components/pharma-ai-chat";
import { LibraryHero } from "@/components/library-hero";

export default function ChatbotPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch book by slug or ID
      let bookData: Book | null = null;

      // Check if slug is a valid UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      if (isUUID) {
        const { data } = await supabase
          .from("books")
          .select("*")
          .eq("id", slug)
          .single();
        bookData = data as Book;
      } else {
        const { data } = await supabase
          .from("books")
          .select("*")
          .eq("slug", slug)
          .single();
        bookData = data as Book;
      }

      if (bookData) {
        setBook(bookData);

        // Fetch chatbot using book ID
        const { data: chatbotData, error } = await supabase
          .from("chatbots")
          .select("*")
          .eq("linked_book_id", bookData.id)
          .single<Chatbot>();

        if (!error && chatbotData) {
          setChatbot(chatbotData as Chatbot);
        } else {
          console.error("Chatbot not found for book:", bookData.title);
        }
      } else {
        router.push("/books");
      }
      setLoading(false);
    };

    if (slug) {
      fetchData();
    }
  }, [slug, router]);

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

  if (!chatbot || !book) {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <LibraryHero
        heading={`Chat with ${chatbot.name}`}
        subtitle={`Ask questions about "${book.title}" and get instant answers.`}
      />

      <div className="flex-1 mx-auto max-w-7xl px-4 py-8 w-full">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="-ml-2 text-muted-foreground hover:text-foreground">
            <Link href={`/books/${book.slug || book.id}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Book Details
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px] lg:h-[calc(100vh-140px)] min-h-[600px]">
          {/* Chat Interface (3/4 width) */}
          <div className="lg:col-span-3 bg-card border rounded-lg shadow-sm overflow-hidden relative flex flex-col h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            <div className="flex-1 h-full overflow-hidden">
              <PharmaAIChat
                botId={chatbot.id}
                initialMessage={`Hello! I am ${chatbot.name}. I can answer questions specifically about "${book.title}". How can I help you?`}
                isEmbedded={true}
              />
            </div>
          </div>

          {/* AI Facts Sidebar (1/4 width, Hidden on Mobile/Tablet) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col gap-4">
            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                RAG Technology
              </h4>
              <p className="text-sm text-muted-foreground">
                Uses Retrieval-Augmented Generation to provide accurate answers based solely on this book's content.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Context Aware
              </h4>
              <p className="text-sm text-muted-foreground">
                Maintains conversation history to understand follow-up questions and complex queries.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                Privacy Focused
              </h4>
              <p className="text-sm text-muted-foreground">
                Your conversations are private and used only to improve your personal learning experience.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-4 shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Specialized Knowledge
              </h4>
              <p className="text-sm text-muted-foreground">
                Fine-tuned specifically for pharmaceutical terminology and drug interaction queries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
