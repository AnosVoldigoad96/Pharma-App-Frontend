import { createClient } from "@/lib/supabase/auth-client";

export interface ChatHistoryMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/**
 * Save a chat message to the database
 */
export async function saveChatMessage(
  userId: string,
  chatbotId: string,
  sessionId: string,
  role: "user" | "assistant",
  content: string
): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();

  const { error } = await supabase.from("chatbot_conversations").insert({
    user_id: userId,
    chatbot_id: chatbotId,
    session_id: sessionId,
    role: role,
    content: content,
  });

  if (error) {
    console.error("Error saving chat message:", error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Load chat history for a user and chatbot session
 */
export async function loadChatHistory(
  userId: string,
  chatbotId: string,
  sessionId: string
): Promise<{ messages: ChatHistoryMessage[]; error?: any }> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("chatbot_conversations")
    .select("id, role, content, created_at")
    .eq("user_id", userId)
    .eq("chatbot_id", chatbotId)
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error loading chat history:", error);
    return { messages: [], error };
  }

  return {
    messages: (data || []).map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      content: msg.content,
      created_at: msg.created_at,
    })),
  };
}

/**
 * Clear chat history for a session (delete all messages)
 */
export async function clearChatHistory(
  userId: string,
  chatbotId: string,
  sessionId: string
): Promise<{ success: boolean; error?: any }> {
  const supabase = createClient();

  const { error } = await supabase
    .from("chatbot_conversations")
    .delete()
    .eq("user_id", userId)
    .eq("chatbot_id", chatbotId)
    .eq("session_id", sessionId);

  if (error) {
    console.error("Error clearing chat history:", error);
    return { success: false, error };
  }

  return { success: true };
}

/**
 * Generate a new session ID
 */
export function generateSessionId(): string {
  return crypto.randomUUID();
}

