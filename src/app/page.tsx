import Hero from '@/components/sections/Hero';
import PopularCourses from '@/components/sections/PopularCourses';
import TrustedByFamilies from '@/components/sections/TrustedByFamilies';
// Removed Features section per request
import About from '@/components/sections/About';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <Hero />
      <PopularCourses />
      <TrustedByFamilies />
      <About />
      <Testimonials />
      <Contact />
    </div>
  );
}
