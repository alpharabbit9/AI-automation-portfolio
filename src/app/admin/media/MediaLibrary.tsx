'use client'

import { useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Upload, Image as ImageIcon, Copy, Trash2, Loader2,
  CheckCircle, AlertCircle, Grid3x3, List, X
} from 'lucide-react'

interface MediaFile {
  name: string
  id: string
  updated_at: string
  created_at: string
  last_accessed_at: string
  metadata: {
    size: number
    mimetype: string
    cacheControl: string
  }
  publicUrl: string
}

const BUCKET = 'portfolio-media'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function MediaLibrary() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [copied, setCopied] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(async () => {
    if (loaded) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.storage.from(BUCKET).list('', {
        limit: 200,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (error) throw error
      const withUrls = (data ?? [])
        .filter((f) => f.id)
        .map((f) => {
          const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(f.name)
          return { ...f, publicUrl: urlData.publicUrl } as MediaFile
        })
      setFiles(withUrls)
      setLoaded(true)
    } catch (err) {
      console.error('Failed to load media:', err)
    } finally {
      setLoading(false)
    }
  }, [loaded])

  // Load on first render
  if (!loaded && !loading) loadFiles()

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setUploading(true)
    setUploadProgress([])
    const supabase = createClient()
    const newFiles: MediaFile[] = []

    for (const file of Array.from(fileList)) {
      const ext = file.name.split('.').pop()
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      setUploadProgress((prev) => [...prev, `Uploading ${file.name}…`])

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(uniqueName, file, { cacheControl: '3600', upsert: false })

      if (!error) {
        const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uniqueName)
        newFiles.push({
          name: uniqueName,
          id: uniqueName,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
          metadata: { size: file.size, mimetype: file.type, cacheControl: '3600' },
          publicUrl: urlData.publicUrl,
        })
        setUploadProgress((prev) => prev.map((p) => (p.includes(file.name) ? `✓ ${file.name}` : p)))
      } else {
        setUploadProgress((prev) =>
          prev.map((p) => (p.includes(file.name) ? `✗ ${file.name}: ${error.message}` : p))
        )
      }
    }

    setFiles((prev) => [...newFiles, ...prev])
    setUploading(false)
    setTimeout(() => setUploadProgress([]), 3000)
  }

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleDelete = async (name: string) => {
    setDeleting(name)
    const supabase = createClient()
    await supabase.storage.from(BUCKET).remove([name])
    setFiles((prev) => prev.filter((f) => f.name !== name))
    setDeleting(null)
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files) }}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
          dragOver
            ? 'border-[#00E5FF]/60 bg-[#00E5FF]/5'
            : 'border-white/[0.08] bg-[#111111] hover:border-white/[0.16] hover:bg-white/[0.02]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleUpload(e.target.files)}
        />
        {uploading ? (
          <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
        ) : (
          <Upload className={`w-8 h-8 transition-colors ${dragOver ? 'text-[#00E5FF]' : 'text-[#555]'}`} />
        )}
        <div className="text-center">
          <p className="text-sm font-medium text-white">
            {uploading ? 'Uploading…' : 'Drop images here or click to upload'}
          </p>
          <p className="text-xs text-[#555] mt-1">PNG, JPG, WEBP, GIF supported</p>
        </div>
      </div>

      {/* Upload progress */}
      {uploadProgress.length > 0 && (
        <div className="space-y-1.5 p-4 rounded-xl bg-[#111111] border border-white/[0.06]">
          {uploadProgress.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              {p.startsWith('✓') ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : p.startsWith('✗') ? (
                <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
              ) : (
                <Loader2 className="w-3.5 h-3.5 text-[#00E5FF] animate-spin flex-shrink-0" />
              )}
              <span className={p.startsWith('✓') ? 'text-emerald-400' : p.startsWith('✗') ? 'text-red-400' : 'text-[#B3B3B3]'}>
                {p.replace(/^[✓✗] /, '')}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#555]">{files.length} file{files.length !== 1 ? 's' : ''}</p>
        <div className="flex items-center gap-1 p-1 bg-[#111111] border border-white/[0.06] rounded-lg">
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-white/[0.08] text-white' : 'text-[#555] hover:text-[#B3B3B3]'}`}
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded-md transition-colors ${view === 'list' ? 'bg-white/[0.08] text-white' : 'text-[#555] hover:text-[#B3B3B3]'}`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-white/[0.04] animate-pulse" />
          ))}
        </div>
      )}

      {/* Grid view */}
      {!loading && view === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {files.map((file) => (
            <div
              key={file.name}
              className="group relative aspect-square rounded-xl overflow-hidden border border-white/[0.06] bg-[#111111]"
            >
              <img
                src={file.publicUrl}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const el = e.target as HTMLImageElement
                  el.style.display = 'none'
                  el.parentElement!.classList.add('flex', 'items-center', 'justify-center')
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                <p className="text-[10px] text-white/80 line-clamp-1 flex-1 mr-1">{file.name}</p>
                <div className="flex gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCopy(file.publicUrl) }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  >
                    {copied === file.publicUrl ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.name) }}
                    disabled={deleting === file.name}
                    className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors disabled:opacity-50"
                  >
                    {deleting === file.name ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {files.length === 0 && !loading && (
            <div className="col-span-full flex flex-col items-center py-12 text-center">
              <ImageIcon className="w-10 h-10 text-[#555] mb-3" />
              <p className="text-sm text-[#B3B3B3]">No images uploaded yet</p>
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {!loading && view === 'list' && (
        <div className="space-y-1">
          {files.map((file) => (
            <div
              key={file.name}
              className="flex items-center gap-4 p-3 rounded-xl border border-white/[0.06] bg-[#111111] hover:border-white/[0.1] transition-all group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0">
                <img src={file.publicUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#B3B3B3] truncate">{file.name}</p>
                <p className="text-xs text-[#555]">
                  {file.metadata?.size ? formatBytes(file.metadata.size) : '—'} ·{' '}
                  {new Date(file.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleCopy(file.publicUrl)}
                  className="p-1.5 text-[#555] hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
                >
                  {copied === file.publicUrl ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(file.name)}
                  disabled={deleting === file.name}
                  className="p-1.5 text-[#555] hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 disabled:opacity-50"
                >
                  {deleting === file.name ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          ))}
          {files.length === 0 && (
            <div className="flex flex-col items-center py-12 text-center rounded-xl border border-white/[0.06] bg-[#111111]">
              <ImageIcon className="w-10 h-10 text-[#555] mb-3" />
              <p className="text-sm text-[#B3B3B3]">No images uploaded yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
