import React, {  useEffect } from 'react';
import { Hero } from '../sections/home/Hero';
import { Features } from '../sections/home/Features';
import { Categories } from '../sections/home/Categories';
import { Courses } from '../sections/home/Courses';
import { HowItWorks } from '../sections/home/HowItWorks';
import { Testimonials } from '../sections/home/Testimonials';
import { CTA } from '../sections/home/CTA';
import { useOutletContext } from 'react-router-dom';

  
const Home = () => {
const { setId } = useOutletContext();
    useEffect(() => {
        setId(2); 
    },[]);
    return (
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
}


export default Home;