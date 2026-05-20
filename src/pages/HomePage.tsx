import { HeroSection } from '../components/sections/HeroSection';
import { CatalogSection } from '../components/sections/CatalogSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <div id="catalogo" className="relative">
        <CatalogSection />
      </div>
    </>
  );
}
