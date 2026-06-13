'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, FileText, Globe, GlobeLock } from 'lucide-react'
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { deleteCaseStudy, deleteCaseStudies, toggleCaseStudyPublished } from './actions'
import type { CaseStudy } from '@/lib/types'

const columns: Column<CaseStudy>[] = [
  {
    key: 'title',
    header: 'Case Study',
    sortable: true,
    render: (row) => (
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-white line-clamp-1">{row.title}</span>
          {row.featured && (
            <span className="flex-shrink-0 text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="text-xs text-[#B3B3B3]">{row.client_industry} · {row.duration ?? '—'}</div>
      </div>
    ),
  },
  {
    key: 'client_name',
    header: 'Client',
    sortable: true,
    render: (row) => <span className="text-sm text-[#B3B3B3]">{row.client_name}</span>,
  },
  {
    key: 'is_published',
    header: 'Status',
    render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md border ${
        row.is_published
          ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20'
          : 'text-amber-400 bg-amber-400/8 border-amber-400/20'
      }`}>
        <span className={`w-1 h-1 rounded-full ${row.is_published ? 'bg-emerald-400' : 'bg-amber-400'}`} />
        {row.is_published ? 'Published' : 'Draft'}
      </span>
    ),
  },
  {
    key: 'metrics',
    header: 'Metrics',
    render: (row) => (
      <span className="text-xs text-[#B3B3B3]">{row.metrics.length} defined</span>
    ),
  },
  {
    key: 'updated_at',
    header: 'Updated',
    sortable: true,
    render: (row) => (
      <span className="text-xs text-[#B3B3B3]">
        {new Date(row.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
      </span>
    ),
  },
]

interface Props { studies: CaseStudy[] }

export default function CaseStudiesTable({ studies }: Props) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteCaseStudy(deleteId)
    router.refresh()
  }

  const handleTogglePublished = async (id: string, current: boolean) => {
    setToggling(id)
    try {
      await toggleCaseStudyPublished(id, !current)
      router.refresh()
    } finally {
      setToggling(null)
    }
  }

  return (
    <>
      <AdminDataTable<CaseStudy>
        data={studies}
        columns={columns}
        searchPlaceholder="Search case studies…"
        searchKeys={['title', 'client_name', 'client_industry']}
        onBulkDelete={async (ids) => { await deleteCaseStudies(ids); router.refresh() }}
        emptyIcon={<FileText className="w-10 h-10" />}
        emptyTitle="No case studies yet"
        emptyDescription="Add your first client success story."
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleTogglePublished(row.id, row.is_published)}
              disabled={toggling === row.id}
              title={row.is_published ? 'Unpublish' : 'Publish'}
              className="p-1.5 text-[#B3B3B3] hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10 disabled:opacity-50"
            >
              {row.is_published ? <GlobeLock className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
            </button>
            <Link
              href={`/case-studies/${row.slug}`}
              target="_blank"
              className="p-1.5 text-[#B3B3B3] hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/admin/case-studies/${row.id}/edit`}
              className="p-1.5 text-[#B3B3B3] hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setDeleteId(row.id)}
              className="p-1.5 text-[#B3B3B3] hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      />
      <DeleteDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete case study?"
        description="This will permanently remove the case study and all its data."
        onConfirm={handleDelete}
      />
    </>
  )
}
