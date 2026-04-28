import React from 'react';
import { Award, Truck, Package, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCounterUp } from '../../hooks/useCounterUp';

const STATS = [
    { value: '+27', label: 'Anos de Mercado', icon: Award, delay: 0 },
    { value: '24h', label: 'Entrega Express', icon: Truck, delay: 150 },
    { value: '+500', label: 'Itens no Catálogo', icon: Package, delay: 300 },
    { value: 'R$ 300', label: 'Pedido Mínimo', icon: ShoppingCart, delay: 450 },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' as const }
    },
};

function StatItem({ stat }: { stat: typeof STATS[number] }) {
    const { ref, displayValue } = useCounterUp(stat.value, 2000, stat.delay);
    const Icon = stat.icon;

    return (
        <motion.div
            variants={itemVariants}
            className="
                relative group overflow-hidden flex-1 min-w-0
                bg-white/[0.03] backdrop-blur-2xl border border-white/10
                rounded-[2rem] py-10 px-6 flex flex-col items-center justify-center
                hover:bg-white/[0.06] hover:border-white/20 transition-all duration-700
            "
        >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan/10 blur-[80px] group-hover:bg-cyan/20 transition-all duration-700" />

            <div className="relative z-10 flex flex-col items-center">
                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-cyan/60 mb-5 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-4 h-4" />
                </div>

                <h3
                    ref={ref as React.RefObject<HTMLHeadingElement>}
                    className="text-4xl md:text-5xl lg:text-6xl font-serif italic text-white tracking-tighter tabular-nums mb-2"
                >
                    {displayValue}
                </h3>

                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] text-center whitespace-nowrap">
                    {stat.label}
                </p>
            </div>

            {/* Bottom line hover */}
            <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-transparent via-cyan/40 to-transparent group-hover:w-full transition-all duration-1000 ease-in-out" />
        </motion.div>
    );
}

export function StatsBar() {
    return (
        <section id="stats" className="bg-navy py-16 md:py-20 relative overflow-hidden">
            {/* Ambient */}
            <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-teal/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    className="flex flex-row gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {STATS.map((stat, idx) => (
                        <StatItem key={idx} stat={stat} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
