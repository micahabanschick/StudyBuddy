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

// ─── Image extension ─────────────────────────────────────────────────────────
// tiptap-markdown (v0.9) has no image token handler in its markdown→DOM pass,
// so the standard ![alt](url) syntax is silently swallowed. The workaround:
//  1. prepareContent() replaces every image with a unique text marker BEFORE
//     tiptap-markdown sees the content.
//  2. After the editor mounts, replaceImageMarkers() swaps every marker text
//     node for a real ProseMirror image node via a direct transaction.
//  3. The custom serialize() on ImageExtension ensures getMarkdown() writes
//     the nodes back to ![alt](url) on every save.

const IMG_MARKER = 'SBUDDY_IMG_'

// Extend Image so tiptap-markdown serialises image nodes as ![alt](url).
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

interface ExtractedImage { src: string; alt: string }

/** Replace ![alt](url) with SBUDDY_IMG_N text markers; return markers + images. */
function prepareContent(md: string): { content: string; images: ExtractedImage[] } {
  const images: ExtractedImage[] = []
  const content = md.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_, alt, src) => {
      const idx = images.length
      images.push({ src, alt })
      return `${IMG_MARKER}${idx}`
    },
  )
  return { content, images }
}

/** Walk the ProseMirror doc and replace marker text nodes with image nodes. */
function replaceImageMarkers(
  editor: ReturnType<typeof useEditor>,
  images: ExtractedImage[],
) {
  if (!editor || images.length === 0) return

  const { doc, schema } = editor.state
  const imageType = schema.nodes.image
  if (!imageType) return

  // Collect replacements first (positions in original doc), then apply from
  // last → first so earlier positions are not invalidated by later shifts.
  const hits: Array<{ from: number; to: number; img: ExtractedImage }> = []

  doc.descendants((node, pos) => {
    if (!node.isText || !node.text) return
    const re = new RegExp(`${IMG_MARKER}(\\d+)`, 'g')
    let m: RegExpExecArray | null
    while ((m = re.exec(node.text)) !== null) {
      const idx = parseInt(m[1], 10)
      const img = images[idx]
      if (!img) continue
      hits.push({ from: pos + m.index, to: pos + m.index + m[0].length, img })
    }
  })

  if (hits.length === 0) return

  // Apply replacements from end to start to keep positions valid.
  const tr = editor.state.tr.setMeta('addToHistory', false)
  for (const { from, to, img } of [...hits].reverse()) {
    const node = imageType.create({ src: img.src, alt: img.alt })
    tr.replaceRangeWith(from, to, node)
  }

  editor.view.dispatch(tr)
}

// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  noteId: string
  courseId: string
  topicId?: string | null
  initialTitle: string
  initialContent: string
}

const AUTOSAVE_DELAY = 800

const MATH_REGEX = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/gi

export function NoteEditor({ noteId, courseId, topicId, initialTitle, initialContent }: Props) {
  const [title, setTitle] = React.useState(initialTitle)
  const [saving, setSaving] = React.useState(false)
  const [aiOpen, setAiOpen] = React.useState(false)
  const [selectedText, setSelectedText] = React.useState('')
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  // Prepare content once — markers replace images so tiptap-markdown can parse
  // the rest of the markdown cleanly, then images are injected after mount.
  const { content: markedContent, images } = React.useMemo(
    () => prepareContent(initialContent || ''),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // only on first mount; noteId changes unmount/remount the component
  )
  const imagesRef = React.useRef(images)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: { HTMLAttributes: { class: 'not-prose' } } }),
      ImageExtension,
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      Mathematics.configure({
        regex: MATH_REGEX,
        shouldRender: (state, pos, node) => {
          if (!node.isText || !node.text) return false
          const $pos = state.doc.resolve(pos)
          return $pos.parent.type.name !== 'codeBlock'
        },
        katexOptions: { throwOnError: false, displayMode: false, trust: true },
      }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder:
          'Start writing… ($math$ for equations, :smiles[CCO]: for chemistry, [[ for backlinks)',
      }),
      CharacterCount,
      Markdown.configure({ html: false, transformPastedText: true }),
      BacklinkExtension.extend({
        addStorage() {
          return { courseId }
        },
      }),
      SmilesExtension,
    ],
    content: markedContent,
    editorProps: {
      attributes: { class: 'focus:outline-none min-h-[60vh]' },
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

  // Once the editor is ready, swap marker text nodes for real image nodes.
  React.useEffect(() => {
    if (!editor) return
    replaceImageMarkers(editor, imagesRef.current)
  }, [editor])

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
