import type { Metadata } from 'next'
import MediaLibrary from './MediaLibrary'

export const metadata: Metadata = { title: 'Media Library' }

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Media Library</h1>
        <p className="text-sm text-[#B3B3B3] mt-1">Upload and manage images for your portfolio</p>
      </div>
      <MediaLibrary />
    </div>
  )
}
