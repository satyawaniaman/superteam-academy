"use client";

import {
  Navbar,
  HeroSection,
  FeaturesSection,
  CoursesSection,
  AssessmentSection,
  TestimonialsSection,
  Footer,
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <CoursesSection />
        <AssessmentSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
