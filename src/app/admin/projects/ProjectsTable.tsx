'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, Eye, FolderOpen } from 'lucide-react'
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { deleteProject, deleteProjects } from './actions'
import type { Project } from '@/lib/types'

const STATUS_COLORS: Record<string, string> = {
  completed:   'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  in_progress: 'text-amber-400  bg-amber-400/10  border-amber-400/20',
  featured:    'text-[#00E5FF]  bg-[#00E5FF]/10  border-[#00E5FF]/20',
}

const columns: Column<Project>[] = [
  {
    key: 'title',
    header: 'Project',
    sortable: true,
    render: (row) => (
      <div>
        <div className="text-sm font-medium text-white">{row.title}</div>
        <div className="text-xs text-[#B3B3B3] mt-0.5">{row.category} · {row.duration ?? '—'}</div>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    sortable: true,
    render: (row) => (
      <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-md border ${STATUS_COLORS[row.status] ?? 'text-[#B3B3B3] bg-white/5 border-white/10'}`}>
        {row.status.replace('_', ' ')}
      </span>
    ),
  },
  {
    key: 'featured',
    header: 'Featured',
    render: (row) => (
      <span className={`text-xs font-medium ${row.featured ? 'text-[#00E5FF]' : 'text-[#B3B3B3]/40'}`}>
        {row.featured ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    key: 'is_active',
    header: 'Active',
    render: (row) => (
      <span className={`text-xs font-medium ${row.is_active ? 'text-emerald-400' : 'text-[#B3B3B3]/40'}`}>
        {row.is_active ? 'Active' : 'Hidden'}
      </span>
    ),
  },
  {
    key: 'created_at',
    header: 'Created',
    sortable: true,
    render: (row) => (
      <span className="text-xs text-[#B3B3B3]">
        {new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
      </span>
    ),
  },
]

interface Props { projects: Project[] }

export default function ProjectsTable({ projects }: Props) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteProject(deleteId)
    router.refresh()
  }

  const handleBulkDelete = async (ids: string[]) => {
    await deleteProjects(ids)
    router.refresh()
  }

  return (
    <>
      <AdminDataTable<Project>
        data={projects}
        columns={columns}
        searchPlaceholder="Search projects…"
        searchKeys={['title', 'category', 'client_name']}
        onBulkDelete={handleBulkDelete}
        emptyIcon={<FolderOpen className="w-10 h-10" />}
        emptyTitle="No projects yet"
        emptyDescription="Add your first portfolio project to get started."
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            <Link href={`/admin/projects/${row.id}/edit`} className="p-1.5 text-[#B3B3B3] hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]">
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
        title="Delete project?"
        description="This will permanently remove the project from your portfolio."
        onConfirm={handleDelete}
      />
    </>
  )
}
