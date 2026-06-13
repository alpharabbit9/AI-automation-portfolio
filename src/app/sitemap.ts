import type { MetadataRoute } from 'next'
import { caseStudies } from '@/lib/data'

const BASE_URL = 'https://rifatahmed.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${BASE_URL}/case-studies`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
  ]

  const studyPages = caseStudies
    .filter(s => s.is_published)
    .map(s => ({
      url: `${BASE_URL}/case-studies/${s.slug}`,
      lastModified: new Date(s.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))

  return [...staticPages, ...studyPages]
}
