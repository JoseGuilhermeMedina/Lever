import { categories } from '../../data/categories';
import { Card, CardContent } from '../ui/card';
import { useCategoryFilter } from '../../hooks/useCategoryFilter';
import { motion } from 'framer-motion';

export function CategoriesSection() {
    const { setSelectedCategory } = useCategoryFilter();

    const handleCategoryClick = (categoryId: any) => {
        setSelectedCategory(categoryId);
        const el = document.getElementById('catalogo');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section id="categorias" className="py-16 md:py-24 bg-ice">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    {/* fluid-section-title substitui: text-3xl md:text-4xl */}
                    <h2 className="fluid-section-title font-bold text-navy tracking-tight mb-4">
                        Soluções Completas para o seu Negócio
                    </h2>
                    {/* fluid-body substitui: text-lg */}
                    <p className="fluid-body text-slate-600">
                        Navegue por nossas principais categorias e encontre tudo o que precisa em um só fornecedor.
                    </p>
                </div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6"
                >
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                key={cat.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                                }}
                            >
                                <Card
                                    onClick={() => handleCategoryClick(cat.id)}
                                    className="cursor-pointer group hover:-translate-y-2 transition-all duration-500 glass-card overflow-hidden h-full category-card-premium border-none"
                                >
                                    <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                                        <div className="w-14 h-14 rounded-full bg-ice flex items-center justify-center group-hover:bg-cyan/10 transition-colors">
                                            <Icon className="w-7 h-7 text-teal group-hover:text-cyan transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-navy text-sm md:text-base">
                                            {cat.label}
                                        </h3>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
