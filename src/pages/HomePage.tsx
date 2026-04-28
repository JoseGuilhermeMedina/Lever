import { HeroSection } from '../components/sections/HeroSection';
import { StatsBar } from '../components/sections/StatsBar';
import { PartnersSection } from '../components/sections/PartnersSection';
import { CategoriesSection } from '../components/sections/CategoriesSection';
import { FeaturedProducts } from '../components/sections/FeaturedProducts';
import { BrandsGrid } from '../components/sections/BrandsGrid';
import { AboutSection } from '../components/sections/AboutSection';
import { DifferentialsSection } from '../components/sections/DifferentialsSection';
import { FAQSection } from '../components/sections/FAQSection';
import { ContactSection } from '../components/sections/ContactSection';
import { SectionDivider } from '../components/ui/SectionDivider';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <div className="relative">
        <SectionDivider color="#153243" type="layered" position="top" />
        <PartnersSection />
        <SectionDivider color="#ffffff" type="soft" position="bottom" />
      </div>
      <CategoriesSection />
      <div className="relative overflow-hidden">
        <SectionDivider color="#f8fafc" type="soft" position="top" />
        <FeaturedProducts />
        <SectionDivider color="#153243" type="layered" position="bottom" />
      </div>
      <BrandsGrid />
      <AboutSection />
      <div className="relative">
        <SectionDivider color="#153243" type="soft" position="top" />
        <DifferentialsSection />
        <SectionDivider color="#ffffff" type="soft" position="bottom" flip />
      </div>
      <FAQSection />
      <ContactSection />
    </>
  );
}
