import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { Youtube } from '@tiptap/extension-youtube';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { Highlight } from '@tiptap/extension-highlight';

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import css from 'highlight.js/lib/languages/css';
import js from 'highlight.js/lib/languages/javascript';
import ts from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';

import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Youtube as YoutubeIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Globe,
  Sparkles,
  Code,
  Terminal
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mediaAPI } from '@/services/api';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIAssistantModal } from '@/components/admin/AIAssistantModal';

const lowlight = createLowlight(common);
lowlight.register('html', html);
lowlight.register('css', css);
lowlight.register('js', js);
lowlight.register('ts', ts);
lowlight.register('python', python);
lowlight.register('bash', bash);

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  enableAI?: boolean;
  context?: string; // New context prop for AI
}

export const RichTextEditor = ({ content, onChange, placeholder, enableAI = true, context = '' }: RichTextEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        codeBlock: false, // Disable default codeBlock to use lowlight
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: 'bg-muted rounded-md p-4 my-4 font-mono text-sm overflow-x-auto',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline cursor-pointer',
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'rounded-lg border shadow-sm max-w-full h-auto',
        },
      }),
      Youtube.configure({
        controls: false,
        nocookie: true,
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder.configure({
        placeholder: placeholder || 'Start writing...',
      }),
      Subscript,
      Superscript,
      Highlight,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editable: true,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    // Trigger file input click
    fileInputRef.current?.click();
  };

  const addImageViaUrl = () => {
    const url = window.prompt('Masukkan URL Gambar (CDN/External):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const loadingToast = toast.loading('Mengupload gambar...');
        const response = await mediaAPI.upload(file);
        toast.dismiss(loadingToast);
        
        if (response.url) {
           editor.chain().focus().setImage({ src: response.url }).run();
           toast.success('Gambar berhasil diupload');
        }
      } catch (error) {
        console.error(error);
        toast.error('Gagal mengupload gambar');
      } finally {
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
      }
    }
  };

  const addYoutube = () => {
    const url = window.prompt('Masukkan URL YouTube');

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 480,
      })
    }
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-input rounded-md overflow-hidden bg-background flex flex-col h-full">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleImageUpload} 
      />
      <div className="border-b border-input bg-muted/50 p-2 flex flex-wrap gap-1 sticky top-0 z-10">
        {enableAI && (
          <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAiModalOpen(true)}
              className="h-8 gap-1.5 text-primary border-primary/20 hover:bg-primary/5"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">AI Write</span>
            </Button>
          </div>
        )}
        {/* Text Style */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('bold') && "bg-muted-foreground/20")}
            title="Bold"
            >
            <Bold className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('italic') && "bg-muted-foreground/20")}
            title="Italic"
            >
            <Italic className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('underline') && "bg-muted-foreground/20")}
            title="Underline"
            >
            <UnderlineIcon className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('strike') && "bg-muted-foreground/20")}
            title="Strikethrough"
            >
            <span className="line-through text-xs font-bold">S</span>
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('highlight') && "bg-muted-foreground/20")}
            title="Highlight"
            >
            <Highlighter className="h-4 w-4" />
            </Button>
        </div>

        {/* Script */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('subscript') && "bg-muted-foreground/20")}
            title="Subscript"
            >
            <SubscriptIcon className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('superscript') && "bg-muted-foreground/20")}
            title="Superscript"
            >
            <SuperscriptIcon className="h-4 w-4" />
            </Button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 1 }) && "bg-muted-foreground/20")}
            title="Heading 1"
            >
            <Heading1 className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("h-8 w-8 p-0", editor.isActive('heading', { level: 2 }) && "bg-muted-foreground/20")}
            title="Heading 2"
            >
            <Heading2 className="h-4 w-4" />
            </Button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: 'left' }) && "bg-muted-foreground/20")}
            title="Align Left"
            >
            <AlignLeft className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: 'center' }) && "bg-muted-foreground/20")}
            title="Align Center"
            >
            <AlignCenter className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: 'right' }) && "bg-muted-foreground/20")}
            title="Align Right"
            >
            <AlignRight className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={cn("h-8 w-8 p-0", editor.isActive({ textAlign: 'justify' }) && "bg-muted-foreground/20")}
            title="Justify"
            >
            <AlignJustify className="h-4 w-4" />
            </Button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('bulletList') && "bg-muted-foreground/20")}
            title="Bullet List"
            >
            <List className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('orderedList') && "bg-muted-foreground/20")}
            title="Ordered List"
            >
            <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('blockquote') && "bg-muted-foreground/20")}
            title="Quote"
            >
            <Quote className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('code') && "bg-muted-foreground/20")}
            title="Inline Code"
            >
            <Code className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn("h-8 w-8 p-0", editor.isActive('codeBlock') && "bg-muted-foreground/20")}
            title="Code Block"
            >
            <Terminal className="h-4 w-4" />
            </Button>
        </div>

        {/* Media */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={cn("h-8 w-8 p-0", editor.isActive('link') && "bg-muted-foreground/20")}
            title="Link"
            >
            <LinkIcon className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Image"
                    >
                        <ImageIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={addImage}>
                        Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={addImageViaUrl}>
                        Insert via URL (CDN)
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addYoutube}
            className="h-8 w-8 p-0"
            title="Youtube"
            >
            <YoutubeIcon className="h-4 w-4" />
            </Button>
        </div>

        {/* Table */}
        <div className="flex items-center gap-0.5 border-r border-border pr-2 mr-1">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            className="h-8 w-8 p-0"
            title="Insert Table"
            >
            <TableIcon className="h-4 w-4" />
            </Button>
            {/* We could add more table controls here (add row, delete row, etc.) but let's keep it simple for now or use a bubble menu later */}
        </div>

        {/* History */}
        <div className="flex items-center gap-0.5 ml-auto">
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="h-8 w-8 p-0"
            title="Undo"
            >
            <Undo className="h-4 w-4" />
            </Button>
            <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="h-8 w-8 p-0"
            title="Redo"
            >
            <Redo className="h-4 w-4" />
            </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <EditorContent editor={editor} className="h-full" />
      </div>

      <AIAssistantModal 
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onInsert={(text) => editor?.commands.insertContent(text)}
        type="content"
      />
    </div>
  );
};
