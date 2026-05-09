'use client'

import * as React from 'react'
import { CheckCircle, Clock, FileText, Loader2, Upload, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { isSupabaseConfigured } from '@/lib/env'
import { formatRelative } from '@/lib/utils'
import type { CourseDetail } from '@/lib/data/courses'

type DocumentStatus = 'pending' | 'ingesting' | 'ready' | 'failed'

type Doc = {
  id: string
  title: string
  status: DocumentStatus
  pageCount: number | null
  createdAt: Date
}

type Props = { courseId: string; course: CourseDetail; documents: Doc[] }

const STATUS_ICON: Record<DocumentStatus, React.ReactNode> = {
  pending: <Clock className="size-4 text-yellow-500" />,
  ingesting: <Loader2 className="size-4 animate-spin text-blue-500" />,
  ready: <CheckCircle className="size-4 text-green-500" />,
  failed: <XCircle className="size-4 text-red-500" />,
}

const STATUS_LABEL: Record<DocumentStatus, string> = {
  pending: 'Pending',
  ingesting: 'Processing…',
  ready: 'Ready',
  failed: 'Failed',
}

export function DocumentLibrary({ courseId, course, documents }: Props) {
  const [dragging, setDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const supabaseReady = isSupabaseConfigured()

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return
    if (!supabaseReady) {
      toast.error('Configure Supabase to enable PDF upload')
      return
    }

    const pdf = Array.from(files).find((f) => f.type === 'application/pdf')
    if (!pdf) {
      toast.error('Only PDF files are supported')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', pdf)
    formData.append('courseId', courseId)

    try {
      const res = await fetch('/api/library/upload', { method: 'POST', body: formData })
      if (!res.ok) throw new Error(await res.text())
      toast.success(`${pdf.name} uploaded — processing started`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Document Library</h2>
          <p className="text-muted-foreground text-sm">
            Upload PDFs and lecture slides to enable AI-powered Q&amp;A with citations.
          </p>
        </div>
        <Button
          onClick={() => (supabaseReady ? inputRef.current?.click() : toast.error('Configure Supabase to enable upload'))}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
          Upload PDF
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </header>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files) }}
        onClick={() => inputRef.current?.click()}
        className={`mb-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'
        }`}
      >
        <Upload className="text-muted-foreground mb-3 size-8" />
        <p className="text-sm font-medium">Drop a PDF here, or click to browse</p>
        <p className="text-muted-foreground mt-1 text-xs">
          {supabaseReady
            ? 'Lecture slides, textbook chapters, papers — any PDF'
            : 'Connect Supabase to enable uploads'}
        </p>
      </div>

      {/* Document list */}
      {documents.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" /> No documents yet
            </CardTitle>
            <CardDescription>
              Upload your first PDF — lecture slides, textbook chapters, or papers. Once processed,
              you can ask questions about them in the course Chat tab.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-card flex items-center gap-4 rounded-lg border px-4 py-3"
            >
              <FileText className="text-muted-foreground size-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.title}</p>
                <p className="text-muted-foreground text-xs">
                  {doc.pageCount ? `${doc.pageCount} pages · ` : ''}
                  {formatRelative(doc.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                {STATUS_ICON[doc.status]}
                <span className="text-xs">{STATUS_LABEL[doc.status]}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
