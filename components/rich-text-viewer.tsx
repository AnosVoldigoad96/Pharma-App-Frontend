"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { useEffect, useState } from "react";

interface RichTextViewerProps {
  content: string;
}

export function RichTextViewer({ content }: RichTextViewerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "blog-content text-foreground focus:outline-none",
      },
    },
  });

  // Update content when it changes
  useEffect(() => {
    if (editor && content && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Show fallback during SSR or if editor not ready
  if (!mounted || !editor) {
    return (
      <div
        className="blog-content text-foreground
          [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:mt-10 [&_h1]:mb-6 [&_h1]:text-foreground [&_h1]:leading-tight
          [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-foreground [&_h2]:leading-tight
          [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:text-foreground [&_h3]:leading-tight
          [&_h4]:text-lg [&_h4]:md:text-xl [&_h4]:font-semibold [&_h4]:mt-5 [&_h4]:mb-2 [&_h4]:text-foreground
          [&_p]:text-base [&_p]:md:text-lg [&_p]:leading-7 [&_p]:md:leading-8 [&_p]:mb-6 [&_p]:text-foreground/90
          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary/80 [&_a]:transition-colors
          [&_strong]:font-semibold [&_strong]:text-foreground
          [&_em]:italic [&_em]:text-foreground
          [&_code]:bg-muted [&_code]:text-foreground [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono [&_code]:border [&_code]:border-border
          [&_pre]:bg-muted [&_pre]:border [&_pre]:border-border [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:shadow-sm
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:border-0
          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:pr-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_blockquote]:text-muted-foreground [&_blockquote]:my-6 [&_blockquote]:bg-muted/50 [&_blockquote]:rounded-r-lg
          [&_ul]:list-disc [&_ul]:list-outside [&_ul]:ml-6 [&_ul]:my-6 [&_ul]:space-y-3 [&_ul]:text-foreground/90
          [&_ol]:list-decimal [&_ol]:list-outside [&_ol]:ml-6 [&_ol]:my-6 [&_ol]:space-y-3 [&_ol]:text-foreground/90
          [&_li]:text-base [&_li]:md:text-lg [&_li]:leading-7 [&_li]:md:leading-8 [&_li]:text-foreground/90
          [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:my-8 [&_img]:w-full [&_img]:h-auto [&_img]:shadow-md
          [&_hr]:border-border [&_hr]:my-10
          [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_table]:rounded-lg [&_table]:overflow-hidden [&_table]:border [&_table]:border-border
          [&_th]:border [&_th]:border-border [&_th]:bg-muted [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:text-foreground
          [&_td]:border [&_td]:border-border [&_td]:px-4 [&_td]:py-3 [&_td]:text-foreground/90
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div
      className="blog-content text-foreground
        [&_.ProseMirror_h1]:text-3xl [&_.ProseMirror_h1]:md:text-4xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-10 [&_.ProseMirror_h1]:mb-6 [&_.ProseMirror_h1]:text-foreground [&_.ProseMirror_h1]:leading-tight
        [&_.ProseMirror_h2]:text-2xl [&_.ProseMirror_h2]:md:text-3xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-8 [&_.ProseMirror_h2]:mb-4 [&_.ProseMirror_h2]:text-foreground [&_.ProseMirror_h2]:leading-tight
        [&_.ProseMirror_h3]:text-xl [&_.ProseMirror_h3]:md:text-2xl [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-6 [&_.ProseMirror_h3]:mb-3 [&_.ProseMirror_h3]:text-foreground [&_.ProseMirror_h3]:leading-tight
        [&_.ProseMirror_h4]:text-lg [&_.ProseMirror_h4]:md:text-xl [&_.ProseMirror_h4]:font-semibold [&_.ProseMirror_h4]:mt-5 [&_.ProseMirror_h4]:mb-2 [&_.ProseMirror_h4]:text-foreground
        [&_.ProseMirror_p]:text-base [&_.ProseMirror_p]:md:text-lg [&_.ProseMirror_p]:leading-7 [&_.ProseMirror_p]:md:leading-8 [&_.ProseMirror_p]:mb-6 [&_.ProseMirror_p]:text-foreground/90
        [&_.ProseMirror_a]:text-primary [&_.ProseMirror_a]:underline [&_.ProseMirror_a]:underline-offset-2 [&_.ProseMirror_a]:hover:text-primary/80 [&_.ProseMirror_a]:transition-colors
        [&_.ProseMirror_strong]:font-semibold [&_.ProseMirror_strong]:text-foreground
        [&_.ProseMirror_em]:italic [&_.ProseMirror_em]:text-foreground
        [&_.ProseMirror_code]:bg-muted [&_.ProseMirror_code]:text-foreground [&_.ProseMirror_code]:px-2 [&_.ProseMirror_code]:py-1 [&_.ProseMirror_code]:rounded [&_.ProseMirror_code]:text-sm [&_.ProseMirror_code]:font-mono [&_.ProseMirror_code]:border [&_.ProseMirror_code]:border-border
        [&_.ProseMirror_pre]:bg-muted [&_.ProseMirror_pre]:border [&_.ProseMirror_pre]:border-border [&_.ProseMirror_pre]:rounded-lg [&_.ProseMirror_pre]:p-4 [&_.ProseMirror_pre]:overflow-x-auto [&_.ProseMirror_pre]:my-6 [&_.ProseMirror_pre]:shadow-sm
        [&_.ProseMirror_pre_code]:bg-transparent [&_.ProseMirror_pre_code]:p-0 [&_.ProseMirror_pre_code]:border-0
        [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-primary [&_.ProseMirror_blockquote]:pl-6 [&_.ProseMirror_blockquote]:pr-4 [&_.ProseMirror_blockquote]:py-2 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-muted-foreground [&_.ProseMirror_blockquote]:my-6 [&_.ProseMirror_blockquote]:bg-muted/50 [&_.ProseMirror_blockquote]:rounded-r-lg
        [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:list-outside [&_.ProseMirror_ul]:ml-6 [&_.ProseMirror_ul]:my-6 [&_.ProseMirror_ul]:space-y-3 [&_.ProseMirror_ul]:text-foreground/90
        [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:list-outside [&_.ProseMirror_ol]:ml-6 [&_.ProseMirror_ol]:my-6 [&_.ProseMirror_ol]:space-y-3 [&_.ProseMirror_ol]:text-foreground/90
        [&_.ProseMirror_li]:text-base [&_.ProseMirror_li]:md:text-lg [&_.ProseMirror_li]:leading-7 [&_.ProseMirror_li]:md:leading-8 [&_.ProseMirror_li]:text-foreground/90
        [&_.ProseMirror_img]:rounded-lg [&_.ProseMirror_img]:border [&_.ProseMirror_img]:border-border [&_.ProseMirror_img]:my-8 [&_.ProseMirror_img]:w-full [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:shadow-md
        [&_.ProseMirror_hr]:border-border [&_.ProseMirror_hr]:my-10
        [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:my-6 [&_.ProseMirror_table]:rounded-lg [&_.ProseMirror_table]:overflow-hidden [&_.ProseMirror_table]:border [&_.ProseMirror_table]:border-border
        [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:bg-muted [&_.ProseMirror_th]:px-4 [&_.ProseMirror_th]:py-3 [&_.ProseMirror_th]:text-left [&_.ProseMirror_th]:font-semibold [&_.ProseMirror_th]:text-foreground
        [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:px-4 [&_.ProseMirror_td]:py-3 [&_.ProseMirror_td]:text-foreground/90
      "
    >
      <EditorContent editor={editor} />
    </div>
  );
}

