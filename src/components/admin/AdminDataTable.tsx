'use client'

import { useState, useMemo } from 'react'
import { Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Trash2, ChevronsUpDown } from 'lucide-react'

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (row: T) => React.ReactNode
  className?: string
}

interface Props<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  searchPlaceholder?: string
  searchKeys?: string[]
  rowActions?: (row: T) => React.ReactNode
  onBulkDelete?: (ids: string[]) => Promise<void>
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  itemsPerPage?: number
  filters?: React.ReactNode
}

type SortDir = 'asc' | 'desc' | null

export default function AdminDataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'Search…',
  searchKeys = [],
  rowActions,
  onBulkDelete,
  emptyIcon,
  emptyTitle = 'No records found',
  emptyDescription = 'Get started by creating your first entry.',
  itemsPerPage = 10,
  filters,
}: Props<T>) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<SortDir>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [deleting, setDeleting] = useState(false)

  const filtered = useMemo(() => {
    let rows = [...data]
    if (query.trim() && searchKeys.length) {
      const q = query.toLowerCase()
      rows = rows.filter(row =>
        searchKeys.some(k => String((row as Record<string, unknown>)[k] ?? '').toLowerCase().includes(q)),
      )
    }
    if (sortKey && sortDir) {
      rows.sort((a, b) => {
        const av = String((a as Record<string, unknown>)[sortKey] ?? '')
        const bv = String((b as Record<string, unknown>)[sortKey] ?? '')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
    }
    return rows
  }, [data, query, searchKeys, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
  const safePage = Math.min(page, totalPages)
  const pageRows = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage)

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : prev === 'desc' ? null : 'asc'))
      if (sortDir === 'desc') setSortKey(null)
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const toggleAll = () => {
    if (selected.size === pageRows.length && pageRows.length > 0) {
      setSelected(new Set())
    } else {
      setSelected(new Set(pageRows.map(r => r.id)))
    }
  }

  const toggleRow = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleBulkDelete = async () => {
    if (!onBulkDelete || selected.size === 0) return
    setDeleting(true)
    try {
      await onBulkDelete(Array.from(selected))
      setSelected(new Set())
    } finally {
      setDeleting(false)
    }
  }

  const allSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.id))
  const someSelected = selected.size > 0

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B3B3B3]/50" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={e => { setQuery(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2.5 bg-[#161616] border border-white/[0.08] rounded-xl text-sm text-white placeholder-[#B3B3B3]/40 focus:outline-none focus:border-[#00E5FF]/30 transition-all"
          />
        </div>
        {filters}
        {someSelected && onBulkDelete && (
          <button
            onClick={handleBulkDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 border border-red-400/25 rounded-xl hover:bg-red-400/10 disabled:opacity-50 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting…' : `Delete ${selected.size}`}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#111111] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-[#B3B3B3]/30 mb-4 flex justify-center">{emptyIcon}</div>
            <h3 className="text-sm font-medium text-white mb-1">{emptyTitle}</h3>
            <p className="text-xs text-[#B3B3B3]">{emptyDescription}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {onBulkDelete && (
                    <th className="w-10 px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="rounded border-white/20 bg-transparent accent-[#00E5FF]"
                      />
                    </th>
                  )}
                  {columns.map(col => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 text-left text-[11px] font-semibold text-[#B3B3B3] tracking-wider uppercase select-none ${col.className ?? ''} ${col.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                      onClick={col.sortable ? () => handleSort(col.key) : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        {col.header}
                        {col.sortable && (
                          <span className="text-[#B3B3B3]/40">
                            {sortKey === col.key ? (
                              sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronsUpDown className="w-3 h-3" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {rowActions && <th className="px-4 py-3 w-24" />}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`border-b border-white/[0.04] last:border-0 transition-colors hover:bg-white/[0.02] ${
                      selected.has(row.id) ? 'bg-[#00E5FF]/[0.03]' : ''
                    }`}
                  >
                    {onBulkDelete && (
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="rounded border-white/20 bg-transparent accent-[#00E5FF]"
                        />
                      </td>
                    )}
                    {columns.map(col => (
                      <td key={col.key} className={`px-4 py-3.5 ${col.className ?? ''}`}>
                        {col.render
                          ? col.render(row)
                          : <span className="text-[#B3B3B3]">{String((row as Record<string, unknown>)[col.key] ?? '—')}</span>
                        }
                      </td>
                    ))}
                    {rowActions && (
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {rowActions(row)}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > itemsPerPage && (
        <div className="flex items-center justify-between text-xs text-[#B3B3B3]">
          <span>
            Showing {(safePage - 1) * itemsPerPage + 1}–{Math.min(safePage * itemsPerPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              let p: number
              if (totalPages <= 5) p = i + 1
              else if (safePage <= 3) p = i + 1
              else if (safePage >= totalPages - 2) p = totalPages - 4 + i
              else p = safePage - 2 + i
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    safePage === p
                      ? 'bg-white text-[#0A0A0A]'
                      : 'border border-white/[0.08] hover:bg-white/[0.05] text-[#B3B3B3]'
                  }`}
                >
                  {p}
                </button>
              )
            })}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-white/[0.08] hover:bg-white/[0.05] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
