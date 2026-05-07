import { useState, useEffect } from 'react';
import { staticProducts as products } from '../../data/staticProducts';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Package, MessageCircle } from 'lucide-react';
import { buildWhatsAppURL } from '../../lib/utils';
import { categories } from '../../data/categories';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER } from '../../config/constants';
import type { Product } from '../../types';

function FeaturedProductCard({ product, whatsappNumber }: { product: Product, whatsappNumber: string }) {
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
                <div className="aspect-[4/3] bg-ice relative overflow-hidden flex items-center justify-center group-hover:bg-slate-100 transition-colors">
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
                        <FeaturedProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
