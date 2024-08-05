import Benefits from '@/components/landing-page/Benefits'
import CallToAction from '@/components/landing-page/CallToAction'
import Features from '@/components/landing-page/Features'
import Footer from '@/components/landing-page/Footer'
import Header from '@/components/landing-page/Header'
import Hero from '@/components/landing-page/Hero'
import HowItWorks from '@/components/landing-page/HowItWorks'
import NewsletterModal from '@/components/landing-page/NewsletterModal'
import Testimonials from '@/components/landing-page/Testimonials'
import { fetchElections } from '@/lib/actions/election.actions'
import React from 'react'

const page = async () => {
  return (
    <div>
    <Header />
    <Hero />
    <Features />
    <HowItWorks />
    <Testimonials />
    <Benefits />
    <CallToAction />
    <Footer />
    <NewsletterModal />
    </div>
  )
}

export default page