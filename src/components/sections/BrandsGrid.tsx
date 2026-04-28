import { motion } from 'framer-motion';

const brands = [
    { name: 'Ipel', logo: '/logos/ipel_logo.png' },
    { name: 'Guarany', logo: '/logos/logo_guarany.png' },
    { name: 'Mercotech', logo: '/logos/logo_mercotech.png' },
    { name: 'Oriental', logo: '/logos/logo_oriental.png' },
    { name: 'Rodos 2000', logo: '/logos/logo_rodos2000.png' },
    { name: 'Bralimpia', logo: '/logos/logo-bralimpia.png' },
    { name: 'Fortcom', logo: '/logos/logo-fortcom-wp-admin.png' },
    { name: 'Volk', logo: '/logos/logo-volk.png' },
    { name: 'Levuse', logo: '/logos/logo_levuse.png' },
    { name: 'Nobre', logo: '/logos/nobre03.png' },
    { name: 'Pratt', logo: '/logos/pratt_logo.png' },
    { name: 'SuperPro', logo: '/logos/superpro_logo.png' },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

export function BrandsGrid() {
    return (
        <section className="bg-navy py-16 md:py-24 border-t border-white/5 relative z-10">
            {/* Elemento decorativo de background */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full max-h-96 bg-cyan/5 blur-[120px] rounded-full pointer-events-none"
                aria-hidden="true"
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-cyan font-bold tracking-[0.4em] uppercase mb-4"
                        style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)' }}
                    >
                        Nossas Marcas <span className="text-white">Parceiras</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 font-medium"
                        style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: 1.5 }}
                    >
                        Trabalhamos com os melhores fabricantes do mercado.
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6"
                >
                    {brands.map((brand) => (
                        <motion.div
                            key={brand.name}
                            variants={itemVariants}
                            tabIndex={0}
                            aria-label={`Marca parceira: ${brand.name}`}
                            className="group relative flex items-center justify-center p-6 bg-[#3a89b5] rounded-2xl shadow-md hover:brightness-110 transition-all duration-300 focus-visible:outline-2 focus-visible:outline-cyan focus-visible:outline-offset-2 aspect-[3/2] cursor-pointer overflow-hidden"
                            style={{ willChange: 'transform' }}
                        >
                            <img 
                                src={brand.logo} 
                                alt={brand.name} 
                                className="max-h-full max-w-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
                                loading="lazy"
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <style>{`
                @media (prefers-reduced-motion: reduce) {
                    * {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
