export interface Profile {
  id: string
  name: string
  title: string
  bio: string
  avatar_url: string | null
  location: string
  email: string
  phone: string | null
  availability: string
  years_experience: number
  created_at: string
  updated_at: string
}

export interface HeroContent {
  id: string
  headline: string
  subheadline: string
  description: string
  cta_primary_text: string
  cta_primary_href: string
  cta_secondary_text: string
  cta_secondary_href: string
  stat_1_value: string
  stat_1_label: string
  stat_2_value: string
  stat_2_label: string
  stat_3_value: string
  stat_3_label: string
  stat_4_value: string
  stat_4_label: string
  updated_at: string
}

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  features: string[]
  sort_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export type ProjectStatus = 'completed' | 'in_progress' | 'featured'

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  long_description: string | null
  category: string
  tags: string[]
  image_url: string | null
  images: string[]
  status: ProjectStatus
  featured: boolean
  client_name: string | null
  client_industry: string | null
  result_metric_1_value: string | null
  result_metric_1_label: string | null
  result_metric_2_value: string | null
  result_metric_2_label: string | null
  result_metric_3_value: string | null
  result_metric_3_label: string | null
  tech_stack: string[]
  duration: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type CaseStudyBlock =
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'lead'; text: string }
  | { type: 'list'; items: string[]; style?: 'bullet' | 'check' }
  | { type: 'image'; url: string; caption?: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'callout'; tone?: 'accent' | 'muted'; title?: string; text: string }
  | { type: 'beforeAfter'; before: string[]; after: string[] }
  | { type: 'divider' }

export interface CaseStudy {
  id: string
  project_id: string | null
  title: string
  slug: string
  client_name: string
  client_industry: string
  client_size: string | null
  challenge: string
  solution: string
  implementation: string | null
  results: string
  testimonial_quote: string | null
  testimonial_author: string | null
  testimonial_role: string | null
  cover_image_url: string | null
  pdf_url: string | null
  live_url: string | null
  tags: string[]
  tech_stack: string[]
  duration: string | null
  metrics: CaseStudyMetric[]
  content_blocks?: CaseStudyBlock[]
  featured: boolean
  sort_order: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CaseStudyMetric {
  value: string
  label: string
  description?: string
}

export interface Testimonial {
  id: string
  author_name: string
  author_role: string
  author_company: string
  author_avatar_url: string | null
  quote: string
  rating: number
  project_id: string | null
  featured: boolean
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  label: string | null
  sort_order: number
  is_active: boolean
}

export interface CTASection {
  id: string
  position: string
  headline: string
  description: string
  button_text: string
  button_href: string
  secondary_text: string | null
  is_active: boolean
  updated_at: string
}

export interface SiteSettings {
  id: string
  key: string
  value: string
  type: 'string' | 'boolean' | 'number' | 'json'
  label: string
  description: string | null
  updated_at: string
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  company: string | null
  message: string
  budget: string | null
  service_interest: string | null
  status: 'new' | 'read' | 'replied' | 'archived'
  created_at: string
}

export interface NavItem {
  label: string
  href: string
  external?: boolean
}
