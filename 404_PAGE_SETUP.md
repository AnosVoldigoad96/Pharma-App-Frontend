# 404 Page Setup Guide

This guide explains how to set up the custom 404 page with a transparent mascot video and animated background.

## Overview

The 404 page (`app/not-found.tsx`) features:
- **Animated background**: CSS-based sliding dot pattern
- **Transparent mascot video**: Custom video with alpha transparency
- **Responsive design**: Works on all devices
- **TypeScript**: Fully typed implementation

## Video File Requirements

You need to add video files to the `public/` directory:

### Required Files:

1. **`/public/mascot-chrome.webm`** (Required)
   - Format: WebM with Alpha channel
   - For: Chrome, Firefox, Edge
   - How to create:
     - Use [VideoCandy](https://videocandy.com/edit-video.html) or [Convertio](https://convertio.co/mp4-webm/)
     - Upload your video with transparent background
     - Export as WebM with Alpha

2. **`/public/mascot-safari.mov`** (Optional but recommended)
   - Format: HEVC (H.265) with Alpha channel (.mov)
   - For: Safari, iPhone, iPad
   - How to create:
     - Use professional tools or online converters
     - Export as HEVC with Alpha transparency
   - **Note**: If you don't have this file, Safari will fall back to the WebM or MP4

3. **`/public/mascot-fallback.mp4`** (Optional)
   - Format: Standard MP4
   - For: Fallback for older browsers
   - **Tip**: Use the "Same Color Hack" - match your site's background color

## Creating Your Video

### Step 1: Record Your Video
- Film yourself or your mascot
- Stand against a plain wall (white or solid color)
- This acts as a "poor man's green screen"

### Step 2: Remove Background (Free)
- **Option A**: [Adobe Express - Remove Video Background](https://www.adobe.com/express/feature/ai/video/remove-background)
- **Option B**: [CapCut](https://www.capcut.com/)
- Upload your video and let AI remove the background
- Download the result

### Step 3: Convert for Web

#### For Chrome/Firefox (WebM):
1. Go to [Convertio](https://convertio.co/mp4-webm/) or [VideoCandy](https://videocandy.com/edit-video.html)
2. Upload your transparent video
3. Convert to WebM format
4. Ensure "Alpha channel" or "Transparency" is enabled
5. Save as `mascot-chrome.webm` in `public/` folder

#### For Safari/iPhone (HEVC):
1. Use professional video editing software (Final Cut Pro, Adobe Premiere)
2. Export as HEVC (H.265) with Alpha channel
3. Save as `mascot-safari.mov` in `public/` folder
4. **Alternative**: If this is too difficult, skip it - the WebM will work on most devices

#### Fallback (MP4):
1. If you can't create transparent videos easily, use the "Same Color Hack":
   - Match your video background to your site's background color
   - In CapCut or similar, change background to exact hex code (e.g., `#1e1b4b`)
   - Export as standard MP4
   - Save as `mascot-fallback.mp4` in `public/` folder

## File Structure

```
public/
  ├── mascot-chrome.webm    (Required - WebM with Alpha)
  ├── mascot-safari.mov      (Optional - HEVC with Alpha)
  └── mascot-fallback.mp4   (Optional - Standard MP4)
```

## Testing

1. **Test the 404 page**: Navigate to any non-existent route (e.g., `/test-404`)
2. **Check video playback**: Ensure the video plays automatically and loops
3. **Test on different browsers**:
   - Chrome/Edge: Should use WebM
   - Safari/iPhone: Should use HEVC (if available) or fallback
   - Firefox: Should use WebM

## Customization

### Change Background Color
Edit `app/not-found.tsx`:
```tsx
// Change from bg-primary to your preferred color
<div className="relative flex h-screen w-full ... bg-indigo-900 ...">
```

### Adjust Animation Speed
Edit `app/globals.css`:
```css
.animate-sliding-bg {
  animation: slide 3s linear infinite; /* Change 3s to adjust speed */
}
```

### Change Dot Pattern Size
Edit `app/not-found.tsx`:
```tsx
backgroundSize: "40px 40px", // Change size here
```

And in `app/globals.css`:
```css
@keyframes slide {
  100% {
    background-position: 40px 40px; /* Match the size above */
  }
}
```

## Troubleshooting

### Video not showing?
- Check file paths in `app/not-found.tsx`
- Ensure files are in `public/` directory
- Check browser console for errors

### Black background on video?
- Your video might not have proper alpha channel
- Try the "Same Color Hack" method
- Ensure WebM has transparency enabled

### Video not playing on iPhone?
- Add the HEVC `.mov` file for best compatibility
- Ensure `playsInline` attribute is present (already included)

### Animation not working?
- Check that `animate-sliding-bg` class is applied
- Verify CSS is loaded in `globals.css`

## Notes

- The video will automatically play, loop, and be muted (required for autoplay)
- The `playsInline` attribute is critical for iOS devices
- The animated background uses pure CSS for performance
- All styling uses Tailwind CSS classes with theme colors

