export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // 1. Point to the Google Gemini API URL
        // The path from your frontend (e.g., /v1beta/models/...) is preserved
        const targetUrl = new URL(url.pathname + url.search, "https://generativelanguage.googleapis.com");

        // 2. Create a new request based on the original
        // We clone the original request to preserve headers (like Content-Type, Upgrade, etc.)
        const newRequest = new Request(targetUrl, request);

        // 3. INJECT THE KEY securely
        // We add it as a query parameter (standard for Gemini WebSockets)
        // Ensure GEMINI_API_KEY is set in your Cloudflare Worker secrets
        targetUrl.searchParams.set("key", env.GEMINI_API_KEY);

        // 4. Forward the request
        // Cloudflare's fetch handles WebSocket 'Upgrade' headers automatically.
        // If this is a WebSocket handshake, it establishes the tunnel.
        return fetch(targetUrl, newRequest);
    }
};
