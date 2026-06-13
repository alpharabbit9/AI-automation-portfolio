import type { Metadata } from 'next'
import Link from 'next/link'
import { Plus, Pencil, GripVertical, CheckCircle, XCircle } from 'lucide-react'
import { services } from '@/lib/data'

export const metadata: Metadata = { title: 'Services' }

export default function AdminServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Services</h1>
          <p className="text-sm text-[#B3B3B3] mt-1">{services.length} services configured</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </Link>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-[#111111] overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/[0.06]">
          <div className="col-span-1" />
          <div className="col-span-5 text-xs font-medium text-[#B3B3B3]">Service</div>
          <div className="col-span-2 text-xs font-medium text-[#B3B3B3]">Status</div>
          <div className="col-span-2 text-xs font-medium text-[#B3B3B3]">Featured</div>
          <div className="col-span-2 text-xs font-medium text-[#B3B3B3] text-right">Actions</div>
        </div>
        {services.map(service => (
          <div key={service.id} className="grid grid-cols-12 gap-4 items-center px-4 py-3.5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-all group">
            <div className="col-span-1 text-[#B3B3B3]/40 cursor-grab">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="col-span-5">
              <div className="text-sm font-medium text-white">{service.title}</div>
              <div className="text-xs text-[#B3B3B3] mt-0.5 line-clamp-1">{service.description}</div>
            </div>
            <div className="col-span-2">
              {service.is_active ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Active
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-[#B3B3B3]">
                  <XCircle className="w-3.5 h-3.5" /> Inactive
                </span>
              )}
            </div>
            <div className="col-span-2">
              {service.is_featured ? (
                <span className="text-xs text-[#00E5FF]">Yes</span>
              ) : (
                <span className="text-xs text-[#B3B3B3]">No</span>
              )}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1.5 text-[#B3B3B3] hover:text-white transition-colors">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
