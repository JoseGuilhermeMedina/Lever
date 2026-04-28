import { Truck, BadgeCheck, Headphones, Package, Building2, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { motion } from 'framer-motion';

const differentials = [
    {
        icon: Truck,
        title: 'Entrega em 24h',
        description: 'Atendemos Salvador e RMS com rapidez. Via transportadora para demais cidades (FOB).',
    },
    {
        icon: BadgeCheck,
        title: 'Melhores Preços',
        description: 'Negociação direta com fabricantes para garantir as melhores condições.',
    },
    {
        icon: Headphones,
        title: 'Atendimento Ágil',
        description: 'Pedidos via WhatsApp ou e-mail com resolução rápida de qualquer solicitação.',
    },
    {
        icon: Package,
        title: 'Portfólio Completo',
        description: 'Limpeza, Químicos, Equipamentos e Descartáveis — tudo em um só fornecedor.',
    },
    {
        icon: Building2,
        title: 'Atendimento Especializado',
        description: 'Especialistas em condomínios, clínicas e empresas com alta demanda de consumo.',
    },
    {
        icon: Clock,
        title: 'Pontualidade',
        description: 'Cumprimos prazos rígidos. Sua operação não pode parar por falta de insumos.',
    }
];

/* Variantes de animação — banco: scroll-entrada 0.6-0.8s ease-out, stagger 0.1s */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: 'easeOut' as const },
    },
};

const headingVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: 'easeOut' as const },
    },
};

export function DifferentialsSection() {
    return (
        <section id="diferenciais" className="py-16 md:py-24 bg-white relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">

                {/* Cabeçalho da seção com fade-up */}
                <motion.div
                    className="text-center max-w-2xl mx-auto mb-16"
                    variants={headingVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                >
                    {/* fluid-section-title substitui: text-3xl md:text-4xl */}
                    <h2 className="fluid-section-title font-bold text-navy tracking-tight mb-4">
                        Por que escolher a LEVER?
                    </h2>
                    {/* fluid-body substitui: text-lg */}
                    <p className="fluid-body text-slate-600">
                        Muito mais que produtos. Entregamos a confiabilidade que o seu setor de suprimentos exige.
                    </p>
                </motion.div>

                {/* Grid de cards com stagger */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                >
                    {differentials.map((item, idx) => (
                        <motion.div key={idx} variants={cardVariants}>
                            <Card className={`
                                border-none shadow-sm hover:shadow-xl transition-all duration-500 h-full product-card-hover group
                                ${idx % 2 === 0 ? 'bg-navy text-white' : 'bg-ice text-navy'}
                            `}>
                                <CardContent className="p-10 flex flex-col items-start text-left">
                                    <div className={`
                                        w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110
                                        ${idx % 2 === 0 ? 'bg-cyan/20 border border-cyan/30' : 'bg-teal/10 border border-teal/20'}
                                    `}>
                                        <item.icon className={`w-8 h-8 ${idx % 2 === 0 ? 'text-cyan' : 'text-teal'}`} />
                                    </div>
                                    <h3 className={`fluid-card-title font-extrabold mb-4 ${idx % 2 === 0 ? 'text-white' : 'text-navy'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`leading-relaxed font-medium ${idx % 2 === 0 ? 'text-white/70' : 'text-slate-600'}`}>
                                        {item.description}
                                    </p>

                                    <div className={`mt-8 w-12 h-1 rounded-full ${idx % 2 === 0 ? 'bg-cyan' : 'bg-teal'} opacity-40 group-hover:w-24 transition-all duration-500`} />
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
