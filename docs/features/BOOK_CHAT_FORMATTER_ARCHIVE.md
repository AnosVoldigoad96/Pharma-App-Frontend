# Book Chat HTML Formatter Implementation Archive

This document preserves the implementation details of the Book Chat HTML Formatter feature, which used a secondary AI model (`gemma-3-27b-it`) to format chat responses into structured HTML.

## Backend Implementation (`app/api/chat/route.ts`)

The following code was added to the `POST` handler in `app/api/chat/route.ts` to chain the formatter model:

```typescript
    // Step 4.5: Format response using secondary model (gemma-3-27b-it)
    console.log("4.5. Formatting response with gemma-3-27b-it...");
    const formatterSystemPrompt = `You are a helpful assistant that formats text into clean, readable HTML.
- Use <h3> for main headings and <h4> for subheadings.
- Use <ul> and <li> for unordered lists.
- Use <ol> and <li> for ordered lists.
- Use <table>, <thead>, <tbody>, <tr>, <th>, <td> for tables.
- Use <strong> for bold text.
- Use <em> for italic text.
- Use <code> for inline code and <pre><code> for code blocks.
- Do not include <html>, <head>, or <body> tags. Return ONLY the content inside the body.
- Apply Tailwind CSS classes for styling:
  - Tables: "min-w-full divide-y divide-gray-300 border border-gray-300 rounded-lg overflow-hidden"
  - Table Headers: "bg-gray-100 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
  - Table Cells: "whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-r border-gray-200 last:border-r-0"
  - Lists: "list-disc pl-5 space-y-1 my-2"
  - Headings: "font-bold text-foreground mt-4 mb-2"
- Do not change the original meaning or content of the text.`;

    const formatterMessages = [
      { role: "user", content: `Format the following text into HTML:\n\n${aiResponse}` }
    ];

    let formattedResponse = aiResponse;
    try {
      // Use Google AI (Gemini) client for Gemma 3
      formattedResponse = await callGoogleAI("gemma-3-27b-it", formatterMessages, formatterSystemPrompt, userKeys.gemini);
      console.log(`   ✓ Formatted response received (${formattedResponse.length} characters)`);
    } catch (formatError) {
      console.error("   ✗ Formatting failed, using original response:", formatError);
      // Fallback to original response if formatting fails
    }
```

And the response was updated to return `formattedResponse`:

```typescript
    return NextResponse.json({
      message: formattedResponse, // Was aiResponse
      model: modelName,
      usedRAG,
    });
```

## Frontend Implementation (`components/pharma-ai-chat.tsx`)

The message rendering logic was updated to render the HTML directly and use Tailwind typography (`prose`):

```tsx
<div className="text-sm leading-relaxed whitespace-pre-wrap prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{
    __html: msg.content
}} />
```

The original implementation used regex for simple formatting:

```tsx
<div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
    __html: msg.content
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-primary">$1</strong>')
        .replace(/`(.+?)`/g, '<code class="bg-muted px-1 rounded text-primary font-mono text-xs">$1</code>')
}} />
```
