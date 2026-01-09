---
description: How to deploy the Next.js application to Cloudflare Pages
---

# Deploying to Cloudflare Pages

This guide outlines the steps to deploy your Next.js application to Cloudflare Pages. This process is independent of your Vercel deployment and will not affect it.

## Prerequisites

1.  **Cloudflare Account**: You need a Cloudflare account.
2.  **GitHub Repository**: Your project must be pushed to a GitHub repository.

## Step 1: Install Adapter

We need to install the `@cloudflare/next-on-pages` adapter to make Next.js compatible with Cloudflare's Edge Runtime.

```bash
npm install -D @cloudflare/next-on-pages
```

## Step 2: Update `package.json`

Add a specific build script for Cloudflare Pages in your `package.json`:

```json
"scripts": {
  "pages:build": "npx @cloudflare/next-on-pages",
  // ... other scripts
}
```

## Step 3: Configure Image Optimization

Cloudflare Pages does not support the default Next.js Image Optimization. You have two options:

**Option A: Disable Optimization (Easiest)**
Update `next.config.ts` to disable image optimization. This means images will be served as-is.

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    // ... remotePatterns
  },
  // ...
};
```

**Option B: Use Cloudflare Images (Advanced)**
Use a custom loader to serve images via Cloudflare Images resizing service.

## Step 4: Deploy via Dashboard

1.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Go to **Workers & Pages** > **Create Application** > **Pages** > **Connect to Git**.
3.  Select your repository (`Pharma-App-Frontend`).
4.  **Configure Build Settings**:
    *   **Framework Preset**: `Next.js`
    *   **Build Command**: `npx @cloudflare/next-on-pages` (or `npm run pages:build`)
    *   **Build Output Directory**: `.vercel/output/static`
5.  **Environment Variables**:
    *   Copy all variables from your `.env.local` file to the **Environment Variables** section in Cloudflare.
    *   **Important**: Add `NODE_VERSION` with value `20` (or your current node version).

## Step 5: Verify

Once deployed, Cloudflare will provide a `*.pages.dev` URL. Visit this URL to verify your application is running correctly.
