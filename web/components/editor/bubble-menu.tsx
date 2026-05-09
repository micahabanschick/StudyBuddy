'use client'

import * as React from 'react'
import { BubbleMenu as TiptapBubbleMenu, type Editor } from '@tiptap/react'
import { Bold, Code, Italic, Link2, Sigma } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function EditorBubbleMenu({ editor }: { editor: Editor }) {
  const [linkUrl, setLinkUrl] = React.useState('')
  const [linkOpen, setLinkOpen] = React.useState(false)

  const setLink = () => {
    if (!linkUrl) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }
    setLinkOpen(false)
    setLinkUrl('')
  }

  return (
    <TiptapBubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="bg-popover text-popover-foreground flex items-center gap-0.5 rounded-lg border p-1 shadow-lg"
    >
      <BubbleButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        aria-label="Bold"
      >
        <Bold className="size-3.5" />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        aria-label="Italic"
      >
        <Italic className="size-3.5" />
      </BubbleButton>
      <BubbleButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')}
        aria-label="Inline code"
      >
        <Code className="size-3.5" />
      </BubbleButton>
      <BubbleButton
        onClick={() => (editor.chain().focus() as any).toggleMath().run?.()}
        active={editor.isActive('math')}
        aria-label="Math"
      >
        <Sigma className="size-3.5" />
      </BubbleButton>

      <Popover open={linkOpen} onOpenChange={setLinkOpen}>
        <PopoverTrigger asChild>
          <BubbleButton active={editor.isActive('link')} aria-label="Link">
            <Link2 className="size-3.5" />
          </BubbleButton>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" side="top">
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') setLink() }}
              className="h-7 text-sm"
              autoFocus
            />
            <Button size="sm" className="h-7 px-2 text-xs" onClick={setLink}>
              Set
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </TiptapBubbleMenu>
  )
}

function BubbleButton({
  active,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      {...props}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {children}
    </button>
  )
}
