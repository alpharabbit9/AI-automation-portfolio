'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Pencil, Trash2, MessageSquare, Star, Eye, EyeOff } from 'lucide-react'
import AdminDataTable, { Column } from '@/components/admin/AdminDataTable'
import DeleteDialog from '@/components/admin/DeleteDialog'
import { deleteTestimonial, deleteTestimonials, toggleTestimonialActive } from './actions'
import type { Testimonial } from '@/lib/types'

const columns: Column<Testimonial>[] = [
  {
    key: 'author_name',
    header: 'Author',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-xs font-semibold text-[#00E5FF] flex-shrink-0">
          {row.author_name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-medium text-white">{row.author_name}</div>
          <div className="text-xs text-[#B3B3B3]">{row.author_role}</div>
        </div>
      </div>
    ),
  },
  {
    key: 'author_company',
    header: 'Company',
    sortable: true,
    render: (row) => <span className="text-sm text-[#B3B3B3]">{row.author_company}</span>,
  },
  {
    key: 'rating',
    header: 'Rating',
    sortable: true,
    render: (row) => (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < row.rating ? 'text-amber-400 fill-amber-400' : 'text-[#444]'}`}
          />
        ))}
      </div>
    ),
  },
  {
    key: 'is_active',
    header: 'Status',
    render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium rounded-md border ${
        row.is_active
          ? 'text-emerald-400 bg-emerald-400/8 border-emerald-400/20'
          : 'text-[#555] bg-white/[0.02] border-white/[0.06]'
      }`}>
        <span className={`w-1 h-1 rounded-full ${row.is_active ? 'bg-emerald-400' : 'bg-[#555]'}`} />
        {row.is_active ? 'Active' : 'Hidden'}
      </span>
    ),
  },
  {
    key: 'featured',
    header: 'Featured',
    render: (row) => (
      row.featured ? (
        <span className="text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 rounded">
          Yes
        </span>
      ) : <span className="text-xs text-[#555]">—</span>
    ),
  },
]

interface Props { testimonials: Testimonial[] }

export default function TestimonialsTable({ testimonials }: Props) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteTestimonial(deleteId)
    router.refresh()
  }

  const handleToggle = async (id: string, current: boolean) => {
    setToggling(id)
    try {
      await toggleTestimonialActive(id, !current)
      router.refresh()
    } finally {
      setToggling(null)
    }
  }

  return (
    <>
      <AdminDataTable<Testimonial>
        data={testimonials}
        columns={columns}
        searchPlaceholder="Search testimonials…"
        searchKeys={['author_name', 'author_company', 'quote']}
        onBulkDelete={async (ids) => { await deleteTestimonials(ids); router.refresh() }}
        emptyIcon={<MessageSquare className="w-10 h-10" />}
        emptyTitle="No testimonials yet"
        emptyDescription="Add client testimonials to build social proof."
        rowActions={(row) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggle(row.id, row.is_active)}
              disabled={toggling === row.id}
              title={row.is_active ? 'Hide' : 'Show'}
              className="p-1.5 text-[#B3B3B3] hover:text-emerald-400 transition-colors rounded-lg hover:bg-emerald-400/10 disabled:opacity-50"
            >
              {row.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <Link
              href={`/admin/testimonials/${row.id}/edit`}
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
        title="Delete testimonial?"
        description="This will permanently remove the testimonial."
        onConfirm={handleDelete}
      />
    </>
  )
}
