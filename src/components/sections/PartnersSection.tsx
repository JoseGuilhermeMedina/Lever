import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const partners = [
    { name: 'Condomínios', type: 'Residenciais', symbol: '🏢', image: '/segments/segment_condominio_1774481665709.webp' },
    { name: 'Clínicas', type: 'e Hospitais', symbol: '🏥', image: '/segments/segment_clinica_1774481696949.webp' },
    { name: 'Hotéis', type: 'e Pousadas', symbol: '🏨', image: '/segments/segment_hotel_1774481741588.webp' },
    { name: 'Escolas', type: 'e Universidades', symbol: '🎓', image: '/segments/segment_escola_1774481781787.webp' },
    { name: 'Supermercados', type: 'Varejo e Atacado', symbol: '🛒', image: '/segments/segment_supermercado_1774481832065.webp' },
    { name: 'Escritórios', type: 'Corporativos', symbol: '💼', image: '/segments/segment_escritorio_1774481875077.webp' },
    { name: 'Restaurantes', type: 'e Food Service', symbol: '🍽️', image: '/segments/segment_restaurante_1774481822118.webp' },
];

// Multiplicado por 4 para garantir o loop infinito suave durante drag rápido
const loopedPartners = [...partners, ...partners, ...partners, ...partners];

export function PartnersSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const isHovered = useRef(false);

    useEffect(() => {
        let animationFrameId: number;
        
        const scroll = () => {
            if (scrollRef.current && !isHovered.current && !isDragging.current) {
                scrollRef.current.scrollLeft += 1.5; // Velocidade do auto-scroll
                
                // Lógica para loop infinito: como multiplicamos por 4, voltar a metade funciona perfeito
                const maxScroll = scrollRef.current.scrollWidth / 2;
                if (scrollRef.current.scrollLeft >= maxScroll) {
                    scrollRef.current.scrollLeft -= maxScroll;
                }
            }
            animationFrameId = requestAnimationFrame(scroll);
        };
        
        animationFrameId = requestAnimationFrame(scroll);
        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX - (scrollRef.current?.offsetLeft || 0);
        scrollLeft.current = scrollRef.current?.scrollLeft || 0;
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grabbing';
            scrollRef.current.style.userSelect = 'none';
        }
    };

    const handleMouseLeave = () => {
        isDragging.current = false;
        isHovered.current = false;
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
            scrollRef.current.style.userSelect = 'auto';
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (scrollRef.current) {
            scrollRef.current.style.cursor = 'grab';
            scrollRef.current.style.userSelect = 'auto';
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        e.preventDefault();
        const x = e.pageX - (scrollRef.current.offsetLeft || 0);
        const walk = (x - startX.current) * 1.5; // Multiplicador de velocidade do drag
        scrollRef.current.scrollLeft = scrollLeft.current - walk;
        
        // Loop backward/forward during drag
        const maxScroll = scrollRef.current.scrollWidth / 2;
        if (scrollRef.current.scrollLeft <= 0) {
            scrollRef.current.scrollLeft += maxScroll;
            scrollLeft.current += maxScroll; // Ajusta a origem para não pular
        } else if (scrollRef.current.scrollLeft >= maxScroll) {
            scrollRef.current.scrollLeft -= maxScroll;
            scrollLeft.current -= maxScroll; // Ajusta a origem
        }
    };
    return (
        <section
            id="parceiros"
            className="py-24 bg-white overflow-hidden"
            aria-label="Segmentos atendidos"
        >
            <div className="container mx-auto px-4 md:px-6 mb-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="text-cyan font-bold tracking-[0.2em] text-xs uppercase block mb-4"
                        >
                            Soluções Especializadas
                        </motion.span>
                        <h2 className="fluid-section-title font-extrabold text-navy leading-tight">
                            Atendemos todos os <br />
                            <span className="font-serif italic text-cyan">Segmentos Críticos.</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Marquee infinito */}
            <div className="relative group">
                {/* Scroll Shadows */}
                <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none z-20" />
                <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none z-20" />

                <div
                    ref={scrollRef}
                    className="flex gap-6 pb-8 px-6 overflow-x-hidden cursor-grab"
                    onMouseEnter={() => { isHovered.current = true; }}
                    onMouseLeave={handleMouseLeave}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                >
                    {loopedPartners.map((partner, idx) => (
                        <div
                            key={`${partner.name}-${idx}`}
                            className="flex-shrink-0 w-[240px] md:w-[300px] aspect-[4/5] rounded-[2rem] bg-ice border border-silver relative overflow-hidden group/card hover:border-cyan/50 transition-colors cursor-pointer shadow-sm hover:shadow-xl"
                        >
                            {/* Background Visual */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src={partner.image}
                                    alt={partner.name}
                                    className="w-full h-full object-cover grayscale-[0.5] group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                            </div>

                            {/* Glass Overlay */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                                <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur-md flex items-center justify-center text-2xl shadow-sm">
                                    {partner.symbol}
                                </div>

                                <div>
                                    <h3 className="text-xl font-extrabold text-white mb-1 group-hover/card:text-cyan transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                        {partner.name}
                                    </h3>
                                    <p className="text-white/80 font-medium group-hover/card:text-white transition-colors italic font-serif text-sm drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                                        {partner.type}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>



            <div className="container mx-auto px-4 text-center mt-8">
                <p className="text-slate-400 text-sm font-medium">
                    Eficiência em escala para Salvador e toda Região Metropolitana.
                </p>
            </div>
        </section>
    );
}
