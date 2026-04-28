import { motion } from 'framer-motion';

const partners = [
    { name: 'Condomínios', type: 'Residenciais', symbol: '🏢', image: '/segments/segment_condominio_1774481665709.png' },
    { name: 'Clínicas', type: 'e Hospitais', symbol: '🏥', image: '/segments/segment_clinica_1774481696949.png' },
    { name: 'Hotéis', type: 'e Pousadas', symbol: '🏨', image: '/segments/segment_hotel_1774481741588.png' },
    { name: 'Escolas', type: 'e Universidades', symbol: '🎓', image: '/segments/segment_escola_1774481781787.png' },
    { name: 'Supermercados', type: 'Varejo e Atacado', symbol: '🛒', image: '/segments/segment_supermercado_1774481832065.png' },
    { name: 'Escritórios', type: 'Corporativos', symbol: '💼', image: '/segments/segment_escritorio_1774481875077.png' },
    { name: 'Restaurantes', type: 'e Food Service', symbol: '🍽️', image: '/segments/segment_restaurante_1774481822118.png' },
];

// Duplicar para criar o efeito de loop infinito
const loopedPartners = [...partners, ...partners];

export function PartnersSection() {
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
                    className="flex gap-6 pb-8 px-6"
                    style={{
                        display: 'flex',
                        width: 'max-content',
                        animation: 'marquee-scroll 35s linear infinite',
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.animationPlayState = 'paused';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.animationPlayState = 'running';
                    }}
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

            {/* CSS para o marquee */}
            <style>{`
                @keyframes marquee-scroll {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>

            <div className="container mx-auto px-4 text-center mt-8">
                <p className="text-slate-400 text-sm font-medium">
                    Eficiência em escala para Salvador e toda Região Metropolitana.
                </p>
            </div>
        </section>
    );
}
