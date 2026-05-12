'use client'

import * as React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Mathematics } from '@tiptap/extension-mathematics'
import { Image } from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Link } from '@tiptap/extension-link'
import { Placeholder } from '@tiptap/extension-placeholder'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Markdown } from 'tiptap-markdown'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { EditorBubbleMenu } from '@/components/editor/bubble-menu'
import { AiPanel } from '@/components/editor/ai-panel'
import { BacklinkExtension } from '@/components/editor/extensions/backlink-extension'
import { SmilesExtension } from '@/components/editor/extensions/smiles-node'
import { updateNoteContent, updateNoteTitle } from '@/lib/server/actions/notes'
import { cn } from '@/lib/utils'

// tiptap-markdown drops image tokens when the Image extension has no explicit
// markdown handler registered in extension storage. We extend Image here to
// add a serializer (so getMarkdown() round-trips back to ![alt](url)), then
// preprocess incoming markdown via injectImageHtml so Tiptap's own parseDOM
// rule on <img> captures the image nodes reliably regardless of tiptap-markdown version.
const ImageExtension = Image.extend({
  addStorage() {
    return {
      markdown: {
        serialize(state: any, node: any) {
          const alt = (node.attrs.alt ?? '').replace(/\[/g, '\\[').replace(/\]/g, '\\]')
          state.write(`![${alt}](${node.attrs.src})`)
        },
      },
    }
  },
}).configure({ inline: true, allowBase64: false })

function injectImageHtml(md: string): string {
  return md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => `<img src="${src}" alt="${alt.replace(/"/g, '&quot;')}">`,
  )
}

type Props = {
  noteId: string
  courseId: string
  topicId?: string | null
  initialTitle: string
  initialContent: string
}

const AUTOSAVE_DELAY = 800

// Matches $$display math$$ first (group 1), then $inline math$ (group 2).
// Order matters: $$...$$ must come before $...$ or the shorter pattern wins.
const MATH_REGEX = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/gi

export function NoteEditor({ noteId, courseId, topicId, initialTitle, initialContent }: Props) {
  const [title, setTitle] = React.useState(initialTitle)
  const [saving, setSaving] = React.useState(false)
  const [aiOpen, setAiOpen] = React.useState(false)
  const [selectedText, setSelectedText] = React.useState('')
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'not-prose' } } }),
      ImageExtension,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics.configure({
        // Match $$display$$ (group 1) OR $inline$ (group 2).
        // The extension uses the first truthy capture group as content.
        regex: MATH_REGEX,
        // shouldRender lets us pass displayMode based on which group matched.
        shouldRender: (state, pos, node) => {
          if (!node.isText || !node.text) return false
          const $pos = state.doc.resolve(pos)
          return $pos.parent.type.name !== 'codeBlock'
        },
        katexOptions: {
          throwOnError: false,
          // displayMode is handled per-match in the CSS via data attribute below
          displayMode: false,
          trust: true,
        },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder:
          'Start writing… ($math$ for equations, :smiles[CCO]: for chemistry, [[ for backlinks)',
      }),
      CharacterCount,
      Markdown.configure({ html: true, transformPastedText: true }),
      BacklinkExtension.extend({
        addStorage() {
          return { courseId }
        },
      }),
      SmilesExtension,
    ],
    content: injectImageHtml(initialContent || ''),
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[60vh]',
      },
    },
    onUpdate: ({ editor }) => {
      clearTimeout(saveTimer.current ?? undefined)
      saveTimer.current = setTimeout(() => {
        setSaving(true)
        const md = editor.storage.markdown.getMarkdown() as string
        updateNoteContent(noteId, md)
          .catch(() => toast.error('Failed to save'))
          .finally(() => setSaving(false))
      }, AUTOSAVE_DELAY)
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection
      setSelectedText(from === to ? '' : editor.state.doc.textBetween(from, to))
    },
  })

  const handleTitleBlur = async () => {
    if (title !== initialTitle) {
      await updateNoteTitle(noteId, title, courseId).catch(() =>
        toast.error('Failed to save title'),
      )
    }
  }

  React.useEffect(() => () => clearTimeout(saveTimer.current), [])

  const wordCount = editor?.storage.characterCount?.words?.() ?? 0

  return (
    <div className="flex h-full min-h-0">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 border-b px-8 py-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
            }}
            placeholder="Untitled note"
            className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tracking-tight outline-none placeholder:text-muted-foreground/50"
          />
          <Button
            variant={aiOpen ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAiOpen((v) => !v)}
            className="shrink-0 gap-1.5"
          >
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">AI</span>
          </Button>
        </div>

        <div className="relative flex-1 overflow-y-auto">
          {editor && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className="h-full" />
        </div>

        <div className="flex items-center justify-between border-t px-8 py-1.5">
          <span className="text-muted-foreground text-xs">{wordCount} words</span>
          <span
            className={cn(
              'text-xs transition-opacity',
              saving ? 'text-muted-foreground opacity-100' : 'opacity-0',
            )}
          >
            Saving…
          </span>
        </div>
      </div>

      <AiPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        noteId={noteId}
        courseId={courseId}
        topicId={topicId}
        noteTitle={title}
        selectedText={selectedText}
      />
    </div>
  )
}
