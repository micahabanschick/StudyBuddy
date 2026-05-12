import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import { Suggestion, type SuggestionOptions } from '@tiptap/suggestion'
import React from 'react'

// Inline node stored as: [[noteId|noteTitle]]
// Renders as a clickable pill

function BacklinkView({ node }: { node: { attrs: { id: string; label: string } } }) {
  return (
    <NodeViewWrapper as="span">
      <span className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex cursor-pointer items-center rounded px-1.5 py-0.5 text-xs font-medium transition-colors">
        [[{node.attrs.label}]]
      </span>
    </NodeViewWrapper>
  )
}

export const BacklinkExtension = Node.create({
  name: 'backlink',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: '' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-backlink]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-backlink': '' }), `[[${HTMLAttributes.label}]]`]
  },

  addNodeView() {
    return ReactNodeViewRenderer(BacklinkView as any)
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        char: '[[',
        command: ({ editor, range, props }: any) => {
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: 'backlink',
              attrs: { id: (props as { id: string; label: string }).id, label: (props as { id: string; label: string }).label },
            })
            .insertContent(' ')
            .run()
        },
        items: async ({ query, editor }: any) => {
          if (!query || query.length < 1) return []
          // Get courseId from editor storage (set by NoteEditor)
          const courseId = editor.storage.backlink?.courseId
          if (!courseId) return []
          try {
            const res = await fetch(
              `/api/notes/search?courseId=${courseId}&q=${encodeURIComponent(query)}`,
            )
            if (!res.ok) return []
            return (await res.json()) as Array<{ id: string; title: string }>
          } catch {
            return []
          }
        },
        render: () => {
          let popup: HTMLElement | null = null

          return {
            onStart: (props: any) => {
              popup = document.createElement('div')
              popup.className =
                'fixed z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 shadow-md'
              document.body.appendChild(popup)
              renderSuggestions(popup, props)
            },
            onUpdate: (props: any) => {
              if (popup) renderSuggestions(popup, props)
            },
            onKeyDown: ({ event }: any) => {
              if (event.key === 'Escape') {
                popup?.remove()
                popup = null
                return true
              }
              return false
            },
            onExit: () => {
              popup?.remove()
              popup = null
            },
          }
        },
      } as any),
    ]
  },

  addStorage() {
    return { courseId: null as string | null }
  },
})

function renderSuggestions(
  popup: HTMLElement,
  props: { items: Array<{ id: string; title: string }>; command: (item: { id: string; label: string }) => void; clientRect?: (() => DOMRect | null) | null },
) {
  const rect = props.clientRect?.()
  if (rect) {
    popup.style.top = `${rect.bottom + 8 + window.scrollY}px`
    popup.style.left = `${rect.left + window.scrollX}px`
  }

  popup.innerHTML = ''
  if (!props.items.length) {
    popup.innerHTML =
      '<p class="text-muted-foreground px-2 py-1.5 text-sm">No notes found</p>'
    return
  }
  props.items.forEach((item) => {
    const btn = document.createElement('button')
    btn.className =
      'flex w-full items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground'
    btn.textContent = item.title
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault()
      props.command({ id: item.id, label: item.title })
    })
    popup.appendChild(btn)
  })
}
