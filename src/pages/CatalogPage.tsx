import { CatalogSection } from '../components/sections/CatalogSection';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function CatalogPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Simples para o Catálogo */}
      <div className="bg-navy pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan font-bold text-sm mb-6 hover:text-white transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para a Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Nosso <span className="text-cyan italic font-serif">Catálogo</span>
          </h1>
          <p className="text-white/60 mt-4 max-w-xl text-lg font-medium">
            Explore nossa linha completa de produtos para limpeza profissional, descartáveis e equipamentos.
          </p>
        </div>
      </div>

      <CatalogSection />
    </div>
  );
}
