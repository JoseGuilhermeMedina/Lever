import { useRef } from 'react';
import { MessageCircle, Star, Truck, Building2, Package, Instagram } from 'lucide-react';
import { Button } from '../ui/button';
import { buildWhatsAppURL } from '../../lib/utils';
import { motion } from 'framer-motion';
import { useHeroParallax } from '../../hooks/useHeroParallax';
import { WHATSAPP_NUMBER } from '../../config/constants';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
} as const;

const rightVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' as const, delay: 0.4 } }
} as const;


const features = [
    { icon: Star, label: '27 Anos de Mercado', sub: 'Confiabilidade desde 1998', color: 'text-gold fill-gold' },
    { icon: Truck, label: 'Entrega em 24h', sub: 'Salvador e RMS', color: 'text-cyan' },
    { icon: Building2, label: 'Condomínios & Clínicas', sub: 'Especialistas no setor', color: 'text-white/80' },
];

const cards = [
    { icon: Package, title: 'Portfólio Completo', desc: 'Limpeza, Químicos, Descartáveis, Equipamentos e Higiene — tudo em um único fornecedor.' },
    { icon: Star, title: 'Preços Competitivos', desc: 'Negociação direta com fabricantes. Melhores condições para compras em volume.' },
    { icon: MessageCircle, title: 'Suporte Ágil', desc: 'Pedidos via WhatsApp com resposta imediata. Você fala diretamente com nossa equipe.' },
];

export function HeroSection() {
    const heroRef = useRef<HTMLElement>(null);
    useHeroParallax(heroRef);

    const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || WHATSAPP_NUMBER;
    const whatsappUrl = buildWhatsAppURL(whatsappNumber, 'Olá! Gostaria de pedir um orçamento para minha empresa.');

    return (
        <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-navy">

            {/* ── Parallax Background ── */}
            <div className="parallax-bg absolute inset-0 w-full h-[130%] -top-[15%] z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src="/Video.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-navy/85 via-navy/55 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-navy/40 via-transparent to-transparent" />
                <div className="noise-overlay" />
                <div className="vignette-overlay" />
            </div>

            {/* ── Floating blobs (Parallax Float) ── */}
            <div className="parallax-float absolute inset-0 w-full h-full pointer-events-none z-[1]">
                <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-cyan/10 blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-teal/10 blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* ── Content ── */}
            <div className="parallax-content container mx-auto px-4 md:px-6 relative z-10 pt-20 md:pt-32 pb-12 md:pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh] md:min-h-[80vh]">

                    {/* ════ LEFT PANEL ════ */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col space-y-7"
                    >
                        {/* Logo removido para evitar duplicação com o Header fixo */}

                        {/* Brand Marker + Badge */}
                        <motion.div variants={itemVariants} className="flex flex-col space-y-3">

                            {/* Assinatura da marca */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-black uppercase tracking-[0.4em] text-cyan">
                                    LEVER
                                </span>
                                <div className="h-[1px] w-16 bg-cyan/50" />
                                <span className="text-xs font-medium text-white/40 uppercase tracking-[0.2em]">
                                    Distribuidora
                                </span>
                            </div>

                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/10 backdrop-blur-sm px-4 py-1.5 text-sm font-semibold text-cyan uppercase tracking-wider w-fit">
                                <span className="flex h-2 w-2 rounded-full bg-cyan animate-pulse" />
                                Canal Exclusivo Corporativo
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={itemVariants}
                            className="fluid-hero-title font-extrabold tracking-[-0.04em] leading-[0.95]"
                        >
                            <span className="bg-gradient-to-r from-white via-white to-white/70 bg-clip-text text-transparent">
                                A Limpeza <br />
                                <span className="font-serif italic text-cyan/90">Profissional</span>
                            </span>
                            <br />
                            <span className="text-white">que sua Empresa{' '}</span>
                            <span className="bg-gradient-to-r from-cyan via-cyan to-teal bg-clip-text text-transparent font-serif italic">
                                Merece
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={itemVariants}
                            className="text-lg text-white/55 max-w-lg leading-relaxed font-medium"
                        >
                            Logística inteligente e higienização técnica
                            para empresas que exigem excelência.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="lg"
                                    className="w-full sm:w-auto bg-[#5ba344] hover:bg-[#4d8b3a] text-white font-black h-14 md:h-16 px-10 text-sm uppercase tracking-widest shadow-xl shadow-green-900/20 group transition-all duration-300"
                                >
                                    <MessageCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform fill-white" />
                                    Orçamento WhatsApp
                                </Button>
                            </a>
                            <a href="#catalogo">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="w-full sm:w-auto border-white/40 text-white bg-white/5 backdrop-blur-md hover:bg-white hover:text-navy font-black h-14 md:h-16 px-10 text-sm uppercase tracking-widest transition-all duration-300"
                                >
                                    Ver Catálogo
                                </Button>
                            </a>
                        </motion.div>

                        {/* Features rápidas */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/10"
                        >
                            {features.map((f) => (
                                <div key={f.label} className="flex items-center gap-2">
                                    <f.icon className={`w-5 h-5 shrink-0 ${f.color}`} />
                                    <div>
                                        <div className="text-sm font-bold text-white">{f.label}</div>
                                        <div className="text-xs text-white/55">{f.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Social proof */}
                        <motion.p
                            variants={itemVariants}
                            className="text-sm italic text-white/50"
                        >
                            "Mais de 50.000 entregas realizadas com pontualidade e excelência."
                            <span className="ml-2 not-italic font-semibold text-cyan">— LEVER, Salvador BA</span>
                        </motion.p>
                    </motion.div>

                    {/* ════ RIGHT PANEL (Desktop only) ════ */}
                    <motion.div
                        variants={rightVariants}
                        initial="hidden"
                        animate="visible"
                        className="hidden lg:flex flex-col items-end gap-5 parallax-badges"
                    >
                        {/* Social icons */}
                        <div className="flex gap-3">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-all"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-cyan/30 transition-all"
                                aria-label="WhatsApp"
                            >
                                <MessageCircle className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Social proof card */}
                        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 shadow-xl w-64 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-0.5 rounded-full bg-gold text-navy text-xs font-bold">✓ Verificado</span>
                            </div>
                            <div className="text-3xl font-extrabold text-white">+50.000</div>
                            <div className="text-sm text-white/70 mt-1">Entregas realizadas com sucesso</div>
                        </div>

                        {/* Feature cards */}
                        {cards.map((card) => (
                            <div
                                key={card.title}
                                className="w-72 backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-5 shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan/20 border border-cyan/30 flex items-center justify-center shrink-0">
                                        <card.icon className="w-5 h-5 text-cyan" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-sm mb-1">{card.title}</h3>
                                        <p className="text-white/60 text-xs leading-relaxed">{card.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </div>

            {/* ── Bottom gradient fade ── */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-ice to-transparent z-10 pointer-events-none" />
        </section>
    );
}
