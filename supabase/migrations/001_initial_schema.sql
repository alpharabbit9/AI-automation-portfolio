-- Portfolio Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profile
create table public.profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null default 'Rifat Ahmed',
  title text not null default 'AI Automation Consultant & Builder',
  bio text,
  avatar_url text,
  location text default 'Remote · Worldwide',
  email text not null default 'hello@rifatahmed.dev',
  phone text,
  availability text default 'Available for new projects',
  years_experience integer default 5,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Hero Content
create table public.hero_content (
  id uuid primary key default uuid_generate_v4(),
  headline text not null default 'AI Systems That Work While You Sleep',
  subheadline text not null default 'Automation Infrastructure for Modern Businesses',
  description text not null,
  cta_primary_text text not null default 'Book a Discovery Call',
  cta_primary_href text not null default '/contact',
  cta_secondary_text text not null default 'View Case Studies',
  cta_secondary_href text not null default '/case-studies',
  stat_1_value text default '40+',
  stat_1_label text default 'Projects Delivered',
  stat_2_value text default '120K+',
  stat_2_label text default 'Hours Automated',
  stat_3_value text default '98%',
  stat_3_label text default 'Client Retention',
  stat_4_value text default '4',
  stat_4_label text default 'Countries Served',
  updated_at timestamptz default now()
);

-- Services
create table public.services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  icon text not null default 'Bot',
  features text[] default '{}',
  sort_order integer default 0,
  is_featured boolean default false,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Projects
create table public.projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text not null,
  long_description text,
  category text,
  tags text[] default '{}',
  image_url text,
  images text[] default '{}',
  status text default 'completed' check (status in ('completed', 'in_progress', 'featured')),
  featured boolean default false,
  client_name text,
  client_industry text,
  result_metric_1_value text,
  result_metric_1_label text,
  result_metric_2_value text,
  result_metric_2_label text,
  result_metric_3_value text,
  result_metric_3_label text,
  tech_stack text[] default '{}',
  duration text,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Case Studies
create table public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references public.projects(id) on delete set null,
  title text not null,
  slug text not null unique,
  client_name text not null,
  client_industry text not null,
  client_size text,
  challenge text not null,
  solution text not null,
  implementation text,
  results text not null,
  testimonial_quote text,
  testimonial_author text,
  testimonial_role text,
  cover_image_url text,
  tags text[] default '{}',
  tech_stack text[] default '{}',
  duration text,
  metrics jsonb default '[]',
  featured boolean default false,
  sort_order integer default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Testimonials
create table public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  author_name text not null,
  author_role text not null,
  author_company text not null,
  author_avatar_url text,
  quote text not null,
  rating integer default 5 check (rating between 1 and 5),
  project_id uuid references public.projects(id) on delete set null,
  featured boolean default false,
  sort_order integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Contact Submissions
create table public.contact_submissions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  budget text,
  service_interest text,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz default now()
);

-- Social Links
create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  platform text not null,
  url text not null,
  label text,
  sort_order integer default 0,
  is_active boolean default true
);

-- Site Settings
create table public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text,
  type text default 'string' check (type in ('string', 'boolean', 'number', 'json')),
  label text not null,
  description text,
  updated_at timestamptz default now()
);

-- CTA Sections
create table public.cta_sections (
  id uuid primary key default uuid_generate_v4(),
  position text not null unique,
  headline text not null,
  description text,
  button_text text not null,
  button_href text not null default '/contact',
  secondary_text text,
  is_active boolean default true,
  updated_at timestamptz default now()
);

-- Row Level Security
alter table public.profile enable row level security;
alter table public.hero_content enable row level security;
alter table public.services enable row level security;
alter table public.projects enable row level security;
alter table public.case_studies enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.social_links enable row level security;
alter table public.site_settings enable row level security;
alter table public.cta_sections enable row level security;

-- Public read policies (non-sensitive tables)
create policy "Public read profile" on public.profile for select using (true);
create policy "Public read hero" on public.hero_content for select using (true);
create policy "Public read services" on public.services for select using (is_active = true);
create policy "Public read projects" on public.projects for select using (is_active = true);
create policy "Public read case studies" on public.case_studies for select using (is_published = true);
create policy "Public read testimonials" on public.testimonials for select using (is_active = true);
create policy "Public read social links" on public.social_links for select using (is_active = true);
create policy "Public read site settings" on public.site_settings for select using (true);
create policy "Public read cta sections" on public.cta_sections for select using (is_active = true);

-- Authenticated write policies (admin)
create policy "Authenticated write profile" on public.profile for all using (auth.role() = 'authenticated');
create policy "Authenticated write hero" on public.hero_content for all using (auth.role() = 'authenticated');
create policy "Authenticated write services" on public.services for all using (auth.role() = 'authenticated');
create policy "Authenticated write projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Authenticated write case studies" on public.case_studies for all using (auth.role() = 'authenticated');
create policy "Authenticated write testimonials" on public.testimonials for all using (auth.role() = 'authenticated');
create policy "Authenticated read submissions" on public.contact_submissions for all using (auth.role() = 'authenticated');
create policy "Public insert submissions" on public.contact_submissions for insert with check (true);
create policy "Authenticated write social" on public.social_links for all using (auth.role() = 'authenticated');
create policy "Authenticated write settings" on public.site_settings for all using (auth.role() = 'authenticated');
create policy "Authenticated write cta" on public.cta_sections for all using (auth.role() = 'authenticated');

-- Storage bucket for project images
insert into storage.buckets (id, name, public) values ('portfolio', 'portfolio', true);

create policy "Public read portfolio storage" on storage.objects for select using (bucket_id = 'portfolio');
create policy "Authenticated upload portfolio" on storage.objects for insert with check (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "Authenticated update portfolio" on storage.objects for update using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
create policy "Authenticated delete portfolio" on storage.objects for delete using (bucket_id = 'portfolio' and auth.role() = 'authenticated');
