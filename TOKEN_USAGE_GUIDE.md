# Token Usage & Cost Management Guide

## Impact of Chat History on Token Usage

**Yes, chat history will increase token usage and API costs.** Here's what you need to know:

### How It Works

1. **Without History**: Each request sends only the current user message
   - Example: 50 tokens per request
   - Cost: Low, but no conversation context

2. **With History**: Each request sends the full conversation history
   - Example: 50 tokens (current) + 500 tokens (history) = 550 tokens per request
   - Cost: Higher, but maintains conversation context

### Current Implementation

The system is **optimized to limit token usage**:

- **Message Limit**: Only the last **10 messages** are sent (configurable)
- **Character Limit**: Maximum **8,000 characters** total (configurable)
- **Smart Truncation**: Older messages are truncated if needed

### Token Estimation

- **Rough estimate**: 1 token ≈ 4 characters
- **Example conversation**:
  - 10 messages × 200 chars = 2,000 chars ≈ 500 tokens
  - Plus system prompt + RAG context ≈ 1,000-2,000 tokens total per request

### Cost Impact

**Example with Gemini 2.0 Flash:**
- Input: $0.075 per 1M tokens
- Output: $0.30 per 1M tokens

**Per 1000 requests with history:**
- Input: ~1,500 tokens × 1000 = 1.5M tokens = **$0.11**
- Output: ~500 tokens × 1000 = 0.5M tokens = **$0.15**
- **Total: ~$0.26 per 1000 requests**

**Without history (single message):**
- Input: ~200 tokens × 1000 = 0.2M tokens = **$0.015**
- Output: ~500 tokens × 1000 = 0.5M tokens = **$0.15**
- **Total: ~$0.17 per 1000 requests**

**Difference: ~$0.09 per 1000 requests (53% increase)**

## Configuration Options

### Adjust Message Limit

Edit `lib/supabase/chat-config.ts`:

```typescript
// Reduce to save tokens (less context)
export const MAX_CONTEXT_MESSAGES = 5; // Only last 5 messages

// Increase for better context (more tokens)
export const MAX_CONTEXT_MESSAGES = 20; // Last 20 messages
```

### Adjust Character Limit

```typescript
// Reduce to save tokens
export const MAX_CONTEXT_CHARS = 4000; // ~1000 tokens

// Increase for longer conversations
export const MAX_CONTEXT_CHARS = 16000; // ~4000 tokens
```

## Optimization Strategies

### 1. **Reduce Message Limit** (Recommended)
- Set `MAX_CONTEXT_MESSAGES = 5` for cost savings
- Most recent messages provide the most relevant context
- Older messages are less important for context

### 2. **Disable History for Logged-Out Users**
- Only logged-in users get history
- Anonymous users get single-message requests (lower cost)

### 3. **Implement Message Summarization**
- Summarize old messages instead of sending full text
- Reduces tokens while maintaining context
- More complex to implement

### 4. **Use Sliding Window**
- Keep only last N messages
- Automatically drop oldest messages
- Already implemented in current code

## Monitoring Token Usage

The system logs token estimates in the console:

```
📊 Context: 8 messages, ~1200 tokens (limited from 15 messages)
=== CHAT API REQUEST ===
Messages in context: 8
Estimated tokens: ~1200 (4800 characters)
```

Check your terminal/console to monitor actual usage.

## Recommendations

### For Cost Optimization:
1. Set `MAX_CONTEXT_MESSAGES = 5-7`
2. Set `MAX_CONTEXT_CHARS = 4000-6000`
3. Monitor actual token usage via API logs
4. Consider disabling history for free-tier users

### For Better Context:
1. Set `MAX_CONTEXT_MESSAGES = 15-20`
2. Set `MAX_CONTEXT_CHARS = 12000-16000`
3. Accept higher token costs for better UX

### Balance Approach:
1. Set `MAX_CONTEXT_MESSAGES = 10` (current default)
2. Set `MAX_CONTEXT_CHARS = 8000` (current default)
3. Monitor and adjust based on actual usage

## API Provider Limits

Different models have different context windows:

- **Gemini 2.0 Flash**: 1M tokens context
- **Gemini 1.5 Pro**: 2M tokens context
- **Llama 3.3 (Groq)**: 128K tokens context

Your limits are well below these, so you're safe.

## Best Practices

1. **Start Conservative**: Begin with 5-7 messages
2. **Monitor Costs**: Check API usage dashboard regularly
3. **Adjust Based on Usage**: Increase if needed, decrease if costs are high
4. **Test Different Limits**: Find the sweet spot for your use case
5. **Consider User Tiers**: Different limits for free vs paid users

## Disabling History (If Needed)

If you want to completely disable history to save costs:

1. Edit `app/books/[id]/chat/page.tsx`
2. Change `limitMessagesForContext(allMessages)` to:
   ```typescript
   // Only send current message (no history)
   const limitedMessages = [allMessages[allMessages.length - 1]];
   ```

This will send only the current message, eliminating history costs.

