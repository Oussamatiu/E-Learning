import React, { use, useEffect } from 'react';
import HeroSection from './becomeInstructor/HeroSection';
import BenefitsSection from './becomeInstructor/BenefitsSection';
import RequirementsSection from './becomeInstructor/RequirementsSection';
import CTASection from './becomeInstructor/CTASection';
import SecureLoginSection from './becomeInstructor/SecureLoginSection';
import CourseProtectionSection from './becomeInstructor/CourseProtectionSection';
import HowItWorksSection from './becomeInstructor/HowItWorksSection';
import FinalCTASection from './becomeInstructor/FinalCTASection';
import { useOutletContext } from 'react-router-dom';

const BecomeInstructor = () => {
    const { setId } = useOutletContext();
    useEffect(() => {
        setId(3); 
    },[]);
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <BenefitsSection />
      <RequirementsSection />
      <CTASection />
      <SecureLoginSection />
      <CourseProtectionSection />
      <HowItWorksSection />
      <FinalCTASection />
    </div>
  );
};

export default BecomeInstructor;
