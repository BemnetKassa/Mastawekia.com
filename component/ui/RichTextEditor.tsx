'use client';

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write the role responsibilities, benefits, and requirements.",
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "tiptap",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    const current = editor.getHTML();
    if (value && current !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition ${editor.isActive("bold")
            ? "border-amber-300/60 text-amber-200"
            : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition ${editor.isActive("italic")
            ? "border-amber-300/60 text-amber-200"
            : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition ${editor.isActive("bulletList")
            ? "border-amber-300/60 text-amber-200"
            : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            }`}
        >
          Bullets
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition ${editor.isActive("orderedList")
            ? "border-amber-300/60 text-amber-200"
            : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            }`}
        >
          Numbered
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] transition ${editor.isActive("blockquote")
            ? "border-amber-300/60 text-amber-200"
            : "border-white/10 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            }`}
        >
          Quote
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
