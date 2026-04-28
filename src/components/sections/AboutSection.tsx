import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutSection() {
    const points = [
        "Atendimento Agilizado e Personalizado",
        "Estoque Estratégico com Alto Volume",
        "Garantia de Pontualidade"
    ];

    return (
        <section id="sobre" className="py-16 md:py-24 bg-navy text-ice overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-sm font-semibold text-gold uppercase tracking-wider">
                            Excelência Corporativa desde 1998
                        </div>
                        {/* fluid-section-title-lg substitui: text-3xl md:text-5xl */}
                        <h2 className="fluid-section-title-lg font-extrabold tracking-tight leading-tight">
                            Quase 30 anos cuidando da limpeza que <span className="text-cyan">importa</span>
                        </h2>

                        {/* fluid-body substitui: text-lg */}
                        <div className="space-y-4 fluid-body text-slate-300 leading-relaxed">
                            <p>
                                Fundada em 12 de maio de 1998, a LEVER atua como distribuidora especializada em produtos de higiene e limpeza profissional para Salvador e Região Metropolitana.
                            </p>
                            <p>
                                Nosso propósito é simplificar o abastecimento de condomínios, clínicas e empresas com entrega rápida, melhores preços e um atendimento seriamente comprometido.
                            </p>
                        </div>

                        <motion.ul
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: { staggerChildren: 0.15, delayChildren: 0.4 }
                                }
                            }}
                            className="space-y-3 pt-4"
                        >
                            {points.map((point, idx) => (
                                <motion.li
                                    key={idx}
                                    variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 }
                                    }}
                                    className="flex items-center gap-3 font-semibold text-white"
                                >
                                    <CheckCircle2 className="w-6 h-6 text-cyan shrink-0" />
                                    {point}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden relative shadow-2xl">
                            <img
                                src="https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=800"
                                alt="Distribuidora Lever de produtos de limpeza"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-navy/20 mix-blend-multiply" />
                        </div>

                        {/* Decal / Highlight Card */}
                        <div className="absolute -bottom-6 -left-6 md:-left-10 bg-white p-6 rounded-xl shadow-xl max-w-xs border-l-4 border-gold">
                            <p className="text-navy font-extrabold text-2xl mb-1">+50.000</p>
                            <p className="text-slate-600 font-semibold text-sm">Entregas realizadas com sucesso</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
