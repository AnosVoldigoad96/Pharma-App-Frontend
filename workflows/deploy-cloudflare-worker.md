---
description: How to deploy the Cloudflare Worker proxy for Gemini Audio
---

# Deploying Cloudflare Worker for Gemini Audio

This guide explains how to deploy the `workers/gemini-proxy.js` script to Cloudflare to secure your Gemini API key and enable reliable WebSocket connections.

## Prerequisites

1.  **Cloudflare Account:** You need a free Cloudflare account.
2.  **Node.js & npm:** Installed on your machine.

## Step 1: Install Wrangler (Cloudflare CLI)

Open your terminal and run:

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

Authenticate Wrangler with your Cloudflare account:

```bash
wrangler login
```

This will open a browser window. Click "Allow" to authorize.

## Step 3: Initialize the Worker

Navigate to the `workers` directory (or wherever you saved `gemini-proxy.js`):

```bash
cd workers
```

Initialize a new Wrangler project (if you haven't already):

```bash
wrangler init gemini-proxy
```

*   Select "No" to "Do you would like to use git?" (if inside an existing repo).
*   Select "No" to "No package.json found. Would you like to create one?".
*   **Important:** Replace the generated `src/index.js` (or similar) with the content of `gemini-proxy.js`. Or simply rename `gemini-proxy.js` to `src/index.js` if Wrangler created a `src` folder.

**Simplest Method:**
Just create a `wrangler.toml` file in the `workers` directory with the following content:

```toml
name = "gemini-proxy"
main = "gemini-proxy.js"
compatibility_date = "2024-01-01"
```

## Step 4: Deploy the Worker

Run the deploy command:

```bash
wrangler deploy
```

Wrangler will upload your script and output a URL, e.g., `https://gemini-proxy.your-subdomain.workers.dev`.

## Step 5: Set the Secret (API Key)

**Crucial Step:** You must securely store your Google API Key in the worker.

Run this command (replace `YOUR_GOOGLE_API_KEY` with your actual key):

```bash
wrangler secret put GEMINI_API_KEY
```

It will ask you to paste the key value. Paste it and hit Enter.

## Step 6: Update Frontend Configuration

1.  Copy your Worker URL (e.g., `https://gemini-proxy.your-subdomain.workers.dev`).
2.  Change the protocol to `wss://` (e.g., `wss://gemini-proxy.your-subdomain.workers.dev`).
3.  Add this to your `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_PROXY_URL=wss://gemini-proxy.your-subdomain.workers.dev
```

4.  Restart your Next.js development server.

## Verification

Your application will now connect to the proxy instead of Google directly. The proxy will inject the key and forward the traffic, solving the WebSocket 1008 errors and securing your credentials.
