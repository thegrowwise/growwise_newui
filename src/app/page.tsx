import Hero from '@/components/sections/Hero';
import PopularCourses from '@/components/sections/PopularCourses';
import Features from '@/components/sections/Features';
import About from '@/components/sections/About';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#ebebeb]" style={{ fontFamily: '"Nunito", "Inter", system-ui, sans-serif' }}>
      <Hero />
      <PopularCourses />
      <Features />
      <About />
      <Testimonials />
      <Contact />
    </div>
  );
}
