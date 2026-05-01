import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Package, MessageCircle, X } from 'lucide-react';
import { BrandsGrid } from './BrandsGrid';
import { useSpreadsheetProducts } from '../../hooks/useSpreadsheetProducts';
import { categories } from '../../data/categories';
import type { Product } from '../../types';

export function CatalogSection() {
    const { products, loading, error } = useSpreadsheetProducts();
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesBrand = !selectedBrand || product.brand === selectedBrand;
            const matchesCategory = selectedCategory === 'all' || 
                                   product.category === selectedCategory;
            const matchesSearch = !searchQuery || 
                                 product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesBrand && matchesCategory && matchesSearch && product.isActive;
        });
    }, [products, selectedBrand, selectedCategory, searchQuery]);

    const groupedProducts = useMemo(() => {
        const groups: Record<string, Product[]> = {};
        filteredProducts.forEach(product => {
            const subgroup = product.subgroup || 'Geral';
            if (!groups[subgroup]) groups[subgroup] = [];
            groups[subgroup].push(product);
        });
        return groups;
    }, [filteredProducts]);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-navy font-medium">Carregando catálogo completo...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-ice">
                <div className="flex flex-col items-center gap-4 text-center px-4 max-w-md">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2 shadow-sm border border-red-100">
                        <X className="w-10 h-10" />
                    </div>
                    <h3 className="text-navy font-bold text-2xl tracking-tight">Ops! Problema de Conexão</h3>
                    <p className="text-gray-500 leading-relaxed">{error}</p>
                    <p className="text-xs text-gray-400 mt-4 bg-white p-4 rounded-xl border border-gray-200">
                        Se a planilha foi publicada recentemente, aguarde alguns minutos ou verifique se ela foi exportada como "CSV" no menu Arquivo &gt; Compartilhar &gt; Publicar na Web.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div id="catalogo" className="bg-ice">
            <BrandsGrid 
                selectedBrand={selectedBrand} 
                onBrandSelect={setSelectedBrand} 
            />

            <section className="py-12 md:py-20">
                <div className="container mx-auto px-4">
                    {/* Barra de Pesquisa e Filtros Mobile */}
                    <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input 
                                type="text"
                                placeholder="O que você está procurando?"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-cyan focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="md:hidden flex items-center gap-2 px-6 py-4 bg-navy text-white rounded-2xl w-full justify-center"
                        >
                            <Filter className="w-5 h-5" /> Categorias
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto flex gap-8">
                        {/* Sidebar Desktop */}
                        <aside className="hidden md:block w-72 shrink-0">
                            <div className="sticky top-32 space-y-8">
                                <div>
                                    <h4 className="text-navy font-bold uppercase tracking-widest text-xs mb-6">Categorias</h4>
                                    <div className="space-y-1">
                                        <button 
                                            onClick={() => setSelectedCategory('all')}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-cyan text-white font-bold shadow-lg shadow-cyan/20' : 'text-gray-600 hover:bg-white'}`}
                                        >
                                            Ver Tudo
                                            <ChevronRight className={`w-4 h-4 ${selectedCategory === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                                        </button>
                                        {categories.map(cat => (
                                            <button 
                                                key={cat.id}
                                                onClick={() => setSelectedCategory(cat.id)}
                                                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-cyan text-white font-bold shadow-lg shadow-cyan/20' : 'text-gray-600 hover:bg-white'}`}
                                            >
                                                {cat.label}
                                                <ChevronRight className={`w-4 h-4 ${selectedCategory === cat.id ? 'opacity-100' : 'opacity-0'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedBrand && (
                                    <div className="p-6 bg-cyan/5 border border-cyan/10 rounded-2xl">
                                        <p className="text-xs font-bold text-cyan uppercase tracking-tighter mb-2">Filtro Ativo</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-navy font-bold">{selectedBrand}</span>
                                            <button onClick={() => setSelectedBrand(null)} className="text-cyan hover:text-navy">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </aside>

                        {/* Lista de Produtos */}
                        <main className="flex-grow">
                            <AnimatePresence mode="wait">
                                {filteredProducts.length > 0 ? (
                                    <motion.div
                                        key={`${selectedBrand}-${selectedCategory}-${searchQuery}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="space-y-12"
                                    >
                                        {Object.entries(groupedProducts).map(([subgroup, items]) => (
                                            <div key={subgroup}>
                                                <div className="flex items-center gap-4 mb-6">
                                                    <h5 className="text-navy font-bold uppercase tracking-wider text-xs whitespace-nowrap">
                                                        {subgroup}
                                                    </h5>
                                                    <div className="h-[1px] w-full bg-gray-200" />
                                                </div>

                                                <div className="grid grid-cols-1 gap-2">
                                                    {items.map((item, idx) => (
                                                        <motion.div 
                                                            key={item.id}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: idx * 0.02 }}
                                                            className="group bg-white p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between border border-transparent hover:border-cyan/20 hover:shadow-xl hover:shadow-navy/5 transition-all duration-300"
                                                        >
                                                            <div className="flex-grow">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-navy font-bold group-hover:text-cyan transition-colors">
                                                                        {item.name}
                                                                    </span>
                                                                    {item.badges.map(badge => (
                                                                        <span key={badge} className="text-[10px] font-bold bg-gold/10 text-gold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                                                                            {badge}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                                <p className="text-gray-500 text-xs line-clamp-1 max-w-xl">
                                                                    {item.description}
                                                                </p>
                                                            </div>

                                                            <div className="mt-4 md:mt-0 flex items-center gap-4">
                                                                {item.specs?.[0] && (
                                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded">
                                                                        {item.specs[0].value}
                                                                    </span>
                                                                )}
                                                                <a 
                                                                    href={`https://wa.me/557191068208?text=Olá, gostaria de solicitar um orçamento para: ${item.name}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-navy text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-cyan transition-all flex items-center gap-2 shadow-lg shadow-navy/10"
                                                                >
                                                                    <MessageCircle className="w-3 h-3" /> Orçamento
                                                                </a>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">Nenhum produto encontrado com estes filtros.</p>
                                        <button 
                                            onClick={() => {
                                                setSelectedBrand(null);
                                                setSelectedCategory('all');
                                                setSearchQuery('');
                                            }}
                                            className="mt-4 text-cyan font-bold hover:underline"
                                        >
                                            Limpar todos os filtros
                                        </button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </main>
                    </div>
                </div>
            </section>

            {/* Sidebar Mobile (Drawer) */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[60] md:hidden"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] p-8 md:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h4 className="text-navy font-bold uppercase tracking-widest text-sm">Categorias</h4>
                                <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X className="w-6 h-6 text-navy" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => { setSelectedCategory('all'); setIsSidebarOpen(false); }}
                                    className={`w-full text-left p-4 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-cyan text-white font-bold' : 'text-gray-600 active:bg-gray-50'}`}
                                >
                                    Ver Tudo
                                </button>
                                {categories.map(cat => (
                                    <button 
                                        key={cat.id}
                                        onClick={() => { setSelectedCategory(cat.id); setIsSidebarOpen(false); }}
                                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedCategory === cat.id ? 'bg-cyan text-white font-bold' : 'text-gray-600 active:bg-gray-50'}`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
