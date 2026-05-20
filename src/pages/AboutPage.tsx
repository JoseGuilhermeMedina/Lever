import { useEffect } from 'react';
import { StatsBar } from '../components/sections/StatsBar';
import { PartnersSection } from '../components/sections/PartnersSection';
import { BrandsGrid } from '../components/sections/BrandsGrid';
import { AboutSection } from '../components/sections/AboutSection';
import { DifferentialsSection } from '../components/sections/DifferentialsSection';
import { FAQSection } from '../components/sections/FAQSection';
import { ContactSection } from '../components/sections/ContactSection';
import { SectionDivider } from '../components/ui/SectionDivider';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

export function AboutPage() {
  useEffect(() => {
    if (window.location.hash) {
      const element = document.querySelector(window.location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Banner de Abertura Cinematográfico ── */}
      <div className="relative bg-navy pt-32 pb-20 overflow-hidden">
        {/* Elementos de background decorativos */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
          <div className="noise-overlay opacity-[0.05]" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            {/* Assinatura da marca */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan">
                LEVER
              </span>
              <div className="h-[1px] w-12 bg-cyan/50" />
              <span className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">
                Institucional
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Sobre a <span className="text-cyan italic font-serif">Lever</span>
            </h1>
            <p className="text-white/70 text-lg md:text-xl font-medium leading-relaxed mb-8 max-w-2xl">
              Nossa história é pautada pelo compromisso de fornecer soluções completas de higiene e limpeza profissional para Salvador e Região Metropolitana.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/">
                <Button className="bg-cyan hover:bg-teal text-white font-bold rounded-lg px-6 py-3 transition-all duration-300 flex items-center gap-2 group">
                  Ver Nosso Catálogo
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Efeito de transição de cor na base */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>

      {/* ── Métricas e Performance ── */}
      <StatsBar />

      {/* ── História e Missão ── */}
      <AboutSection />

      {/* ── Marcas Parceiras de Confiança ── */}
      <div className="relative">
        <SectionDivider color="#153243" type="layered" position="top" />
        <PartnersSection />
        <SectionDivider color="#ffffff" type="soft" position="bottom" />
      </div>

      {/* ── Diferenciais Técnicos e Operacionais ── */}
      <div className="relative">
        <SectionDivider color="#153243" type="soft" position="top" />
        <DifferentialsSection />
        <SectionDivider color="#ffffff" type="soft" position="bottom" flip />
      </div>

      {/* ── Grade de Marcas Que Distribuímos ── */}
      <div className="py-8 bg-ice">
        <BrandsGrid />
      </div>

      {/* ── Perguntas Frequentes (FAQ) ── */}
      <FAQSection />

      {/* ── Seção de Contato Completa ── */}
      <ContactSection />
    </div>
  );
}
