import React from 'react';
import { Hero } from '../sections/home/Hero';
import { Features } from '../sections/home/Features';
import { Categories } from '../sections/home/Categories';
import { Courses } from '../sections/home/Courses';
import { HowItWorks } from '../sections/home/HowItWorks';
import { Testimonials } from '../sections/home/Testimonials';
import { CTA } from '../sections/home/CTA';

const Home = () => (
  <main className="min-h-screen bg-white">
    <Hero />
    <Features />
    <Categories />
    <Courses />
    <HowItWorks />
    <Testimonials />
    <CTA />
  </main>
);

export default Home;