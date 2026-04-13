import React from 'react';
import HeroSection from './becomeInstructor/HeroSection';
import BenefitsSection from './becomeInstructor/BenefitsSection';
import RequirementsSection from './becomeInstructor/RequirementsSection';
import CTASection from './becomeInstructor/CTASection';
import SecureLoginSection from './becomeInstructor/SecureLoginSection';
import CourseProtectionSection from './becomeInstructor/CourseProtectionSection';
import HowItWorksSection from './becomeInstructor/HowItWorksSection';
import FinalCTASection from './becomeInstructor/FinalCTASection';

const BecomeInstructor = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
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
                  