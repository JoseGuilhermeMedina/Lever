import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Package, MessageCircle, X } from 'lucide-react';
import { BrandsGrid } from './BrandsGrid';
import { staticProducts } from '../../data/staticProducts';
import { categories } from '../../data/categories';
import type { Product } from '../../types';

// Mapeamento de imagens específicas por marca
// TODO: Substituir os caminhos [INSERIR_IMAGEM_X_AQUI.jpg] pelas imagens reais quando disponíveis
const brandItemsImages: Record<string, string | string[]> = {
    'Bralimpia': '/images/bralimpia.png',
    'SuperPro': '/images/bettanin.png', // SuperPro representa Bettanin
    'Fortcom': '/images/[INSERIR_IMAGEM_FORTCOM_AQUI.jpg]',
    'Guarany': '/images/produtos em destaque/PULVERIZADORES 300ml e 500ml - GUARANY.jpeg',
    'Levuse': '/images/produtos em destaque/PURIFICADOR DE AR 400ML- LEV&UZE.jpeg',
    'Oriental': [
        '/images/oriental_1.png',
        '/images/oriental_2.png',
        '/images/oriental_3.png'
    ],
    'Ipel': '/images/ipel.png',
};

export function CatalogSection() {
    const products = staticProducts;
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'all' || 
                                   product.category === selectedCategory;
            const matchesSearch = !searchQuery || 
                                 product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesCategory && matchesSearch && product.isActive;
        });
    }, [products, selectedCategory, searchQuery]);

    const groupedProducts = useMemo(() => {
        const groups: Record<string, Product[]> = {};
        filteredProducts.forEach(product => {
            const categoryObj = categories.find(c => c.id === product.category);
            const groupName = product.subgroup || categoryObj?.label || 'Linha de Produtos';
            if (!groups[groupName]) groups[groupName] = [];
            groups[groupName].push(product);
        });
        return groups;
    }, [filteredProducts]);



    return (
        <div id="catalogo" className="bg-ice">
            <BrandsGrid 
                selectedBrand={selectedBrand} 
                onBrandSelect={setSelectedBrand} 
            />

            {/* Banner da Marca Específica */}
            <AnimatePresence mode="wait">
                {selectedBrand && brandItemsImages[selectedBrand] && (
                    <motion.div
                        key={`banner-${selectedBrand}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="overflow-hidden"
                    >
                        <div className="container mx-auto px-4 pt-12">
                            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                                <div className="p-4 bg-navy text-center">
                                    <h3 className="font-bold text-white tracking-wider uppercase" style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}>
                                        Destaques da Marca - {selectedBrand === 'SuperPro' ? 'Bettanin' : selectedBrand}
                                    </h3>
                                </div>
                                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 bg-[#f8fafc] p-6 md:p-8">
                                    {Array.isArray(brandItemsImages[selectedBrand]) ? (
                                        (brandItemsImages[selectedBrand] as string[]).map((imgUrl, index) => (
                                            <div key={index} className="flex-1 flex justify-center w-full h-full">
                                                <img 
                                                    src={imgUrl} 
                                                    alt={`Itens específicos da marca ${selectedBrand === 'SuperPro' ? 'Bettanin' : selectedBrand} - Parte ${index + 1}`}
                                                    className="max-w-full h-auto object-contain rounded-lg shadow-sm"
                                                    style={{ maxHeight: '25vh' }}
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = `https://placehold.co/800x400/f8fafc/153243?text=Imagem+${selectedBrand === 'SuperPro' ? 'Bettanin' : selectedBrand}+Pendente`;
                                                    }}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <img 
                                            src={brandItemsImages[selectedBrand] as string} 
                                            alt={`Itens específicos da marca ${selectedBrand === 'SuperPro' ? 'Bettanin' : selectedBrand}`}
                                            className="max-w-full h-auto object-contain rounded-lg shadow-sm"
                                            style={{ maxHeight: '45vh' }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://placehold.co/1200x400/f8fafc/153243?text=Imagem+${selectedBrand === 'SuperPro' ? 'Bettanin' : selectedBrand}+Pendente\n\nSubstitua+o+caminho+no+código`;
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
