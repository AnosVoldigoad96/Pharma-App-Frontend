export interface Env {
    PDF_BUCKET: R2Bucket;
}

// Helper to add CORS headers to any response
function addCorsHeaders(response: Response) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set("Access-Control-Allow-Origin", "*");
    newHeaders.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    newHeaders.set("Access-Control-Allow-Headers", "Content-Type, Range");
    newHeaders.set("Access-Control-Max-Age", "86400");
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const key = decodeURIComponent(url.pathname.slice(1)); // Remove leading slash and decode

        // Handle CORS preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Range",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }

        if (!key) {
            return addCorsHeaders(new Response("File not found", { status: 404 }));
        }

        try {
            const object = await env.PDF_BUCKET.get(key, {
                range: request.headers.get("range") || undefined,
                onlyIf: request.headers,
            });

            if (!object) {
                return addCorsHeaders(new Response("Object Not Found", { status: 404 }));
            }

            const headers = new Headers();
            object.writeHttpMetadata(headers);
            headers.set("etag", object.httpEtag);

            // Type guard for R2Range with offset/length
            if (object.range && 'offset' in object.range && 'length' in object.range) {
                const range = object.range as { offset: number; length: number };
                const start = range.offset;
                const end = start + range.length - 1;
                headers.set("content-range", `bytes ${start}-${end}/${object.size}`);
            }

            // Check if body exists (R2ObjectBody vs R2Object)
            const hasBody = 'body' in object && object.body !== undefined;
            const status = hasBody ? (request.headers.get("range") ? 206 : 200) : 304;

            const response = new Response(hasBody ? (object as R2ObjectBody).body : null, {
                headers,
                status,
            });

            return addCorsHeaders(response);
        } catch (e) {
            return addCorsHeaders(new Response(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`, { status: 500 }));
        }
    },
};
