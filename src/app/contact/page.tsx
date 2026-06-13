import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Contact from '@/components/sections/Contact'

export const metadata: Metadata = {
  title: 'Contact — Rifat Ahmed',
  description: 'Book a free discovery call or send a message. Let\'s map your automation opportunities and build systems that scale your business.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="pt-20">
        <Contact />
      </main>
      <Footer />
    </>
  )
}
