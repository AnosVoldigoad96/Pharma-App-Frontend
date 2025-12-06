/**
 * Chat Configuration
 * Adjust these values to control token usage and costs
 */

// FEATURE FLAG: Enable/disable chat history feature
// Set to false to disable history (saves tokens/costs)
// Set to true to enable history (better context, more tokens)
export const ENABLE_CHAT_HISTORY = false; // Currently disabled for free tier usage

// Maximum number of messages to include in API context
// Lower = fewer tokens, less cost, but less context
// Higher = more tokens, more cost, but better context
export const MAX_CONTEXT_MESSAGES = 10; // Only send last 10 messages

// Maximum total characters to include in context
// This is a safety limit to prevent extremely long messages
export const MAX_CONTEXT_CHARS = 8000; // ~2000 tokens (rough estimate)

/**
 * Truncate messages to fit within token limits
 */
export function limitMessagesForContext(
  messages: Array<{ role: string; content: string }>,
  maxMessages: number = MAX_CONTEXT_MESSAGES,
  maxChars: number = MAX_CONTEXT_CHARS
): Array<{ role: string; content: string }> {
  // Take only the last N messages
  const limitedMessages = messages.slice(-maxMessages);
  
  // Calculate total characters
  let totalChars = limitedMessages.reduce((sum, msg) => sum + msg.content.length, 0);
  
  // If over limit, truncate oldest messages first
  if (totalChars > maxChars) {
    const result: Array<{ role: string; content: string }> = [];
    let currentChars = 0;
    
    // Start from the end (most recent messages)
    for (let i = limitedMessages.length - 1; i >= 0; i--) {
      const msg = limitedMessages[i];
      const msgChars = msg.content.length;
      
      if (currentChars + msgChars <= maxChars) {
        result.unshift(msg); // Add to beginning (maintain order)
        currentChars += msgChars;
      } else {
        // Truncate this message if needed
        const remainingChars = maxChars - currentChars;
        if (remainingChars > 100) { // Only include if meaningful
          result.unshift({
            ...msg,
            content: msg.content.slice(-remainingChars) + "... [truncated]",
          });
        }
        break;
      }
    }
    
    return result;
  }
  
  return limitedMessages;
}

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 */
export function estimateTokenCount(messages: Array<{ role: string; content: string }>): number {
  const totalChars = messages.reduce((sum, msg) => sum + msg.content.length, 0);
  return Math.ceil(totalChars / 4); // Rough estimate
}

