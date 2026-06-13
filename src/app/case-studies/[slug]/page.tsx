import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Quote, ArrowRight } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { caseStudies, siteConfig } from '@/lib/data'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return caseStudies
    .filter(s => s.is_published)
    .map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const study = caseStudies.find(s => s.slug === slug)
  if (!study) return { title: 'Not Found' }

  const description = study.results.slice(0, 155) + (study.results.length > 155 ? '…' : '')

  return {
    title: study.title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/case-studies/${slug}`,
    },
    openGraph: {
      title: study.title,
      description,
      url: `${siteConfig.url}/case-studies/${slug}`,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: study.title,
      description,
      creator: '@RifatAhmed033',
    },
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  const study = caseStudies.find(s => s.slug === slug && s.is_published)

  if (!study) notFound()

  const related = caseStudies
    .filter(s => s.id !== study.id && s.is_published)
    .slice(0, 2)

  const caseStudySchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: study.title,
    description: study.results.slice(0, 155),
    author: {
      '@type': 'Person',
      name: 'Rifat Ahmed',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: 'Rifat Ahmed',
      url: siteConfig.url,
    },
    url: `${siteConfig.url}/case-studies/${slug}`,
    datePublished: study.created_at,
    dateModified: study.updated_at,
    about: study.client_industry,
    keywords: study.tags.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudySchema) }}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Back */}
          <div className="pt-8 mb-12">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-[#B3B3B3] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              All case studies
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Main Content */}
            <article className="lg:col-span-2 space-y-12">
              {/* Header */}
              <header>
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <h1 className="text-3xl lg:text-5xl font-semibold tracking-tight text-white leading-tight mb-6">
                  {study.title}
                </h1>

                {/* Key Metrics Hero */}
                <dl className="grid grid-cols-3 gap-6 p-6 rounded-2xl border border-white/[0.08] bg-[#111111]">
                  {study.metrics.map(m => (
                    <div key={m.label} className="text-center">
                      <dd className="text-3xl font-semibold tracking-tight text-white mb-1">{m.value}</dd>
                      <dt className="text-xs text-[#B3B3B3] font-medium">{m.label}</dt>
                      {m.description && <dd className="text-[10px] text-[#B3B3B3]/60 mt-0.5">{m.description}</dd>}
                    </div>
                  ))}
                </dl>
              </header>

              {/* Challenge */}
              <section>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-4">The Challenge</h2>
                <p className="text-white/90 leading-relaxed text-[0.9375rem]">{study.challenge}</p>
              </section>

              {/* Solution */}
              <section>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-4">The Solution</h2>
                <p className="text-white/90 leading-relaxed text-[0.9375rem]">{study.solution}</p>
              </section>

              {/* Implementation */}
              {study.implementation && (
                <section>
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-4">Implementation</h2>
                  <p className="text-white/90 leading-relaxed text-[0.9375rem]">{study.implementation}</p>
                </section>
              )}

              {/* Results */}
              <section>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-4">Results</h2>
                <p className="text-white/90 leading-relaxed text-[0.9375rem]">{study.results}</p>
              </section>

              {/* Testimonial */}
              {study.testimonial_quote && (
                <figure className="rounded-2xl border border-[#00E5FF]/10 bg-[#111111] p-8">
                  <Quote className="w-8 h-8 text-[#00E5FF]/30 mb-4 fill-[#00E5FF]/10" aria-hidden="true" />
                  <blockquote className="text-lg text-white leading-relaxed mb-6">
                    &ldquo;{study.testimonial_quote}&rdquo;
                  </blockquote>
                  {study.testimonial_author && (
                    <figcaption className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-white/[0.08] flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <span className="text-xs font-medium text-[#B3B3B3]">
                          {study.testimonial_author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <cite className="text-sm font-medium text-white not-italic">{study.testimonial_author}</cite>
                        {study.testimonial_role && (
                          <p className="text-xs text-[#B3B3B3]">{study.testimonial_role}</p>
                        )}
                      </div>
                    </figcaption>
                  )}
                </figure>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Project Details */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6">
                <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-5">Project Details</h2>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-[#B3B3B3] mb-1">Industry</dt>
                    <dd className="text-sm font-medium text-white">{study.client_industry}</dd>
                  </div>
                  {study.client_size && (
                    <div>
                      <dt className="text-xs text-[#B3B3B3] mb-1">Company Size</dt>
                      <dd className="text-sm font-medium text-white">{study.client_size}</dd>
                    </div>
                  )}
                  {study.duration && (
                    <div>
                      <dt className="text-xs text-[#B3B3B3] mb-1">Duration</dt>
                      <dd className="text-sm font-medium text-white">{study.duration}</dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Tech Stack */}
              {study.tech_stack.length > 0 && (
                <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6">
                  <h2 className="text-xs font-semibold tracking-widest uppercase text-[#B3B3B3] mb-5">Tech Stack</h2>
                  <ul className="flex flex-wrap gap-2">
                    {study.tech_stack.map(tech => (
                      <li key={tech}>
                        <span className="px-2.5 py-1 text-xs font-medium text-[#B3B3B3] bg-white/[0.04] border border-white/[0.06] rounded-lg">
                          {tech}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl border border-white/[0.08] bg-[#111111] p-6">
                <h2 className="text-sm font-semibold text-white mb-2">Want similar results?</h2>
                <p className="text-sm text-[#B3B3B3] mb-5">Let&apos;s talk about what automation can do for your business.</p>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 py-3 text-sm font-semibold text-[#0A0A0A] bg-white rounded-xl hover:bg-white/90 transition-all"
                >
                  Book a Call
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </aside>
          </div>

          {/* Related Studies */}
          {related.length > 0 && (
            <section className="mt-20 pt-16 border-t border-white/[0.06]" aria-labelledby="related-heading">
              <h2 id="related-heading" className="text-2xl font-semibold text-white mb-8">More Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {related.map(s => (
                  <Link key={s.id} href={`/case-studies/${s.slug}`}>
                    <div className="group rounded-2xl border border-white/[0.08] bg-[#111111] p-6 hover:border-white/[0.14] hover:bg-[#161616] transition-all duration-300">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {s.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="tag text-[9px]">{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-sm font-semibold text-white mb-4 line-clamp-2">{s.title}</h3>
                      <div className="flex gap-6">
                        {s.metrics.slice(0, 2).map(m => (
                          <div key={m.label} className="flex flex-col gap-0.5">
                            <span className="text-xl font-semibold text-white">{m.value}</span>
                            <span className="text-[10px] text-[#B3B3B3]">{m.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
