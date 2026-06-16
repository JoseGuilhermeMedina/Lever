import { useState, useEffect } from 'react';
import { staticProducts as products } from '../../data/products';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Package, MessageCircle, Search, X } from 'lucide-react';
import { buildWhatsAppURL } from '../../lib/utils';
import { categories } from '../../data/categories';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../../config/constants';
import type { Product } from '../../types';

function FeaturedProductCard({ product, whatsappNumber, onZoomClick }: { product: Product, whatsappNumber: string, onZoomClick: () => void }) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasMultipleImages = product.images && product.images.length > 1;

    useEffect(() => {
        if (!hasMultipleImages) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % product.images!.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [hasMultipleImages, product.images]);

    const wppUrl = buildWhatsAppURL(
        whatsappNumber,
        product.whatsappText || `Olá, tenho interesse no produto: ${product.name}`
    );
    const categoryLabel = categories.find(c => c.id === product.category)?.label;
    const currentImageUrl = hasMultipleImages ? product.images![currentImageIndex] : product.imageUrl;

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
            }}
        >
            <Card className="group overflow-hidden border-none glass-card product-card-hover h-full premium-shadow flex flex-col">
                <div 
                    onClick={onZoomClick}
                    className="aspect-[4/3] bg-ice relative overflow-hidden flex items-center justify-center group-hover:bg-slate-100 transition-colors cursor-zoom-in group/img"
                >
                    {currentImageUrl ? (
                        <img
                            key={currentImageUrl} // Forces react to re-render img for animation
                            src={currentImageUrl}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className={`w-full h-full transition-all duration-700 animate-in fade-in zoom-in duration-500 ${product.cssClass || 'object-contain p-6 group-hover:scale-105'}`}
                        />
                    ) : (
                        <Package className="w-12 h-12 text-slate-300" />
                    )}

                    {/* Overlay com Ícone de Zoom no Hover */}
                    <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none z-10">
                        <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-navy scale-90 group-hover/img:scale-100 transition-all duration-300">
                            <Search className="w-5 h-5 animate-pulse" />
                        </div>
                    </div>
                    
                    {/* Dots indicator for multiple images */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10 px-2 flex-wrap">
                            {product.images!.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-teal' : 'w-1.5 bg-silver/70'}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Fade Overlay Bottom for better dot visibility */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                    )}

                    {/* Badges Overlay */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                        {product.badges.map(badge => (
                            <Badge key={badge} className="bg-gold text-navy font-bold pointer-events-none hover:bg-gold hover:text-navy drop-shadow-sm">
                                {badge}
                            </Badge>
                        ))}
                    </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-semibold text-teal mb-2 uppercase tracking-wider">{categoryLabel}</div>
                    <h3 className="fluid-card-title font-bold text-navy mb-2 leading-tight min-h-[3rem]" title={product.name}>
                        {product.name}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                        {product.description}
                    </p>

                    <div className="mt-auto">
                        {product.specs && product.specs.length > 0 && (
                            <div className="mb-6 flex flex-wrap gap-2">
                                {product.specs.map(spec => (
                                    <span key={spec.label} className="text-xs px-2 py-1 bg-ice text-slate-600 rounded font-medium border border-silver">
                                        {spec.value}
                                    </span>
                                ))}
                            </div>
                        )}

                        <a href={wppUrl} target="_blank" rel="noopener noreferrer">
                            <Button className="w-full bg-cyan hover:bg-teal text-white font-bold group">
                                <MessageCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                                Pedir no WhatsApp
                            </Button>
                        </a>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

export function FeaturedProducts() {
    const featured = products.filter(p => p.isFeatured).slice(0, 6);
    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_NUMBER;

    // Estados e lógica para o Zoom Cinemático do Produto
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    // Bloquear o scroll do body e html quando o modal estiver aberto
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [selectedProduct]);

    return (
        <section id="produtos" className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div className="max-w-2xl">
                        <Badge variant="outline" className="bg-gold/20 text-navy border-gold/50 mb-4 px-3 py-1">Curva A</Badge>
                        {/* fluid-section-title substitui: text-3xl md:text-4xl */}
                        <h2 className="fluid-section-title font-bold text-navy tracking-tight mb-4">
                            Produtos em Destaque
                        </h2>
                        {/* fluid-body substitui: text-lg */}
                        <p className="fluid-body text-slate-600">
                            Os itens mais solicitados pelas empresas parceiras. Abastecimento rápido e com o melhor custo-benefício.
                        </p>
                    </div>
                    <Link to="/catalogo" className="shrink-0">
                        <Button variant="ghost" className="text-teal hover:text-cyan font-bold p-0">
                            Ver Catálogo Completo &rarr;
                        </Button>
                    </Link>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.15 }
                        }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {featured.map((product) => (
                        <FeaturedProductCard 
                            key={product.id} 
                            product={product} 
                            whatsappNumber={whatsappNumber} 
                            onZoomClick={() => setSelectedProduct(product)}
                        />
                    ))}
                </motion.div>
            </div>

            {/* Modal Lightbox com Zoom Cinemático */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Fundo escuro com desfoque cinemático */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-navy/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-6"
                            data-lenis-prevent
                        >
                            {/* Card do Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[2.5rem] max-w-4xl w-full relative shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85dvh]"
                            >
                                {/* Botão de Fechar */}
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all active:scale-95 z-20"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Lado Esquerdo: Área de Zoom da Imagem */}
                                <div className="flex-1 bg-[#f8fafc] p-6 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[280px] sm:min-h-[350px] md:min-h-[450px]">
                                    <div
                                        className="relative overflow-hidden cursor-zoom-in aspect-square w-full max-w-[340px] bg-white rounded-2xl flex items-center justify-center shadow-inner border border-gray-100/50"
                                        onMouseEnter={() => setIsZoomed(true)}
                                        onMouseLeave={() => {
                                            setIsZoomed(false);
                                            setZoomPos({ x: 50, y: 50 });
                                        }}
                                        onMouseMove={handleMouseMove}
                                    >
                                        <img
                                            src={selectedProduct.imageUrl || selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-200 ease-out select-none pointer-events-none"
                                            style={{
                                                transform: isZoomed ? `scale(2.2)` : `scale(1)`,
                                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://placehold.co/400x400/f8fafc/153243?text=${encodeURIComponent(selectedProduct.name)}`;
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Lado Direito: Informações */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[400px] md:max-h-[80dvh]">
                                    <div>
                                        {/* Categoria */}
                                        <span className="text-[10px] font-bold text-teal uppercase tracking-widest block mb-2">
                                            {categories.find(c => c.id === selectedProduct.category)?.label}
                                        </span>
                                        
                                        {/* Título */}
                                        <h3 className="text-navy font-bold text-xl md:text-2xl tracking-tight leading-tight mb-4">
                                            {selectedProduct.name}
                                        </h3>

                                        {/* Badges */}
                                        {selectedProduct.badges && selectedProduct.badges.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {selectedProduct.badges.map(badge => (
                                                    <span
                                                        key={badge}
                                                        className="bg-gold text-navy font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Informação importante */}
                                        {selectedProduct.importantInfo && (
                                            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 mb-6 text-xs leading-relaxed font-medium whitespace-pre-line shadow-sm">
                                                <span className="font-bold text-amber-800 block mb-1">📢 INFORMAÇÃO IMPORTANTE:</span>
                                                {selectedProduct.importantInfo}
                                            </div>
                                        )}

                                        {/* Descrição */}
                                        <p className="text-slate-600 text-sm leading-relaxed mb-6 whitespace-pre-line">
                                            {selectedProduct.description}
                                        </p>

                                        {/* Especificações */}
                                        {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="text-[10px] font-bold text-navy uppercase tracking-widest">Especificações</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.specs.map(spec => (
                                                        <div
                                                            key={spec.label}
                                                            className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-xl"
                                                        >
                                                            <span className="font-semibold text-navy">{spec.label}: </span>
                                                            {spec.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rodapé e CTA */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                                        <span className="text-xs font-bold text-slate-400">
                                            {selectedProduct.brand || 'LEVER'}
                                        </span>
                                        
                                        <a
                                            href={`https://wa.me/557191068208?text=Olá, gostaria de solicitar um orçamento para o produto: ${encodeURIComponent(selectedProduct.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-navy hover:bg-cyan text-white text-xs font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md shadow-navy/10 active:scale-95"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Solicitar Orçamento</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </section>
    );
}
