import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react'
import React from 'react'

// Usage in markdown: :smiles[CCO]: (ethanol)
// In ProseMirror, stored as a node with attrs { smiles: "CCO" }

function SmilesView({ node }: { node: { attrs: { smiles: string } } }) {
  const [svg, setSvg] = React.useState<string | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!node.attrs.smiles) return
    fetch(`/api/ai/chem?smiles=${encodeURIComponent(node.attrs.smiles)}`)
      .then((r) => {
        setError(false)
        setSvg(null)
        return r.ok ? r.text() : Promise.reject(r.status)
      })
      .then(setSvg)
      .catch(() => setError(true))
  }, [node.attrs.smiles])

  return (
    <NodeViewWrapper as="span" className="inline-block">
      {error ? (
        <span className="bg-destructive/10 text-destructive rounded px-1.5 py-0.5 font-mono text-xs">
          Invalid SMILES: {node.attrs.smiles}
        </span>
      ) : svg ? (
        <span
          className="inline-block align-middle"
          dangerouslySetInnerHTML={{ __html: svg }}
          style={{ width: 120, height: 80 }}
        />
      ) : (
        <span className="bg-muted text-muted-foreground inline-block animate-pulse rounded px-2 py-0.5 font-mono text-xs">
          {node.attrs.smiles}
        </span>
      )}
    </NodeViewWrapper>
  )
}

export const SmilesExtension = Node.create({
  name: 'smiles',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      smiles: { default: '' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-smiles]',
        getAttrs: (el) => ({ smiles: (el as HTMLElement).dataset.smiles ?? '' }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-smiles': HTMLAttributes.smiles }),
      `:smiles[${HTMLAttributes.smiles}]:`,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(SmilesView as any)
  },
})
