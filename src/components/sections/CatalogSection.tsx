import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronRight, Package, MessageCircle, X } from 'lucide-react';
import { BrandsGrid } from './BrandsGrid';
import { staticProducts as subcategoriesData } from '../../data/staticProducts';
import { staticProducts as productsData } from '../../data/products';
import { categories } from '../../data/categories';
import type { Product } from '../../types';

export function CatalogSection() {
    const products = productsData;
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | 'all'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Estados e lógica para o Zoom Cinemático do Produto
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZoomed, setIsZoomed] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };


    // Filtro principal de produtos
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = selectedCategory === 'all' || 
                                   product.category === selectedCategory;
            const matchesSubcategory = selectedSubcategory === 'all' || 
                                      (Array.isArray(product.subcategory) 
                                          ? product.subcategory.includes(selectedSubcategory)
                                          : product.subcategory === selectedSubcategory);
            const matchesBrand = !selectedBrand || 
                                 (product.brand ? (
                                     product.brand.toLowerCase().trim() === selectedBrand.toLowerCase().trim() ||
                                     product.brand.toLowerCase().includes(selectedBrand.toLowerCase()) ||
                                     selectedBrand.toLowerCase().includes(product.brand.toLowerCase())
                                 ) : false);
            const matchesSearch = !searchQuery || 
                                 product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 product.description.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchesCategory && matchesSubcategory && matchesBrand && matchesSearch && product.isActive;
        });
    }, [products, selectedCategory, selectedSubcategory, selectedBrand, searchQuery]);

    // Limpa a subcategoria selecionada quando a categoria pai for alterada
    const handleCategorySelect = (categoryId: string | 'all') => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory('all');
    };

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
                            className="md:hidden flex items-center gap-2 px-6 py-4 bg-navy text-white rounded-2xl w-full justify-center shadow-md shadow-navy/10 active:scale-98 transition-all"
                        >
                            <Filter className="w-5 h-5" /> Categorias e Filtros
                        </button>
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
                        {/* Sidebar Desktop */}
                        <aside className="hidden md:block w-72 shrink-0">
                            <div className="sticky top-32 space-y-8 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                                <div>
                                    <h4 className="text-navy font-bold uppercase tracking-widest text-xs mb-6">Categorias</h4>
                                    <div className="space-y-2">
                                        <button 
                                            onClick={() => handleCategorySelect('all')}
                                            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-cyan text-white font-bold shadow-lg shadow-cyan/20' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <span className="text-sm">Ver Tudo</span>
                                            <ChevronRight className={`w-4 h-4 ${selectedCategory === 'all' ? 'opacity-100' : 'opacity-0'}`} />
                                        </button>
                                        
                                        {categories.map(cat => {
                                            const isCatSelected = selectedCategory === cat.id;
                                            const catSubs = subcategoriesData.filter(sub => sub.category === cat.id);
                                            
                                            return (
                                                <div key={cat.id} className="space-y-1">
                                                    <button 
                                                        onClick={() => handleCategorySelect(cat.id)}
                                                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                                                            isCatSelected 
                                                            ? 'bg-cyan text-white font-bold shadow-lg shadow-cyan/20' 
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {cat.icon && <cat.icon className="w-4 h-4 shrink-0" />}
                                                            <span className="text-sm">{cat.label}</span>
                                                        </div>
                                                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isCatSelected ? 'rotate-90' : ''}`} />
                                                    </button>
                                                    
                                                    {/* Subcategorias Aninhadas */}
                                                    {isCatSelected && catSubs.length > 0 && (
                                                        <div className="ml-4 pl-3 border-l-2 border-cyan/20 space-y-1 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                                                            <button
                                                                onClick={() => setSelectedSubcategory('all')}
                                                                className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-all ${
                                                                    selectedSubcategory === 'all'
                                                                    ? 'text-cyan font-bold bg-cyan/5'
                                                                    : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                Ver tudo em {cat.label}
                                                            </button>
                                                            {catSubs.map(sub => (
                                                                <button
                                                                    key={sub.id}
                                                                    onClick={() => setSelectedSubcategory(sub.id)}
                                                                    className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-all ${
                                                                        selectedSubcategory === sub.id
                                                                        ? 'text-cyan font-bold bg-cyan/5 border-l-2 border-cyan pl-2'
                                                                        : 'text-gray-500 hover:text-navy hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {sub.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Lista de Produtos (Grid de Cards) */}
                        <main className="flex-grow">
                            <AnimatePresence mode="wait">
                                {filteredProducts.length > 0 ? (
                                    <motion.div
                                        key={`${selectedBrand}-${selectedCategory}-${selectedSubcategory}-${searchQuery}`}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Informações da filtragem atual */}
                                        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 text-xs font-semibold text-gray-400">
                                            <div>
                                                Exibindo {filteredProducts.length} {filteredProducts.length === 1 ? 'produto' : 'produtos'}
                                                {selectedCategory !== 'all' && ` em ${categories.find(c => c.id === selectedCategory)?.label}`}
                                                {selectedSubcategory !== 'all' && ` > ${subcategoriesData.find(s => s.id === selectedSubcategory)?.name}`}
                                                {selectedBrand && ` de ${selectedBrand}`}
                                            </div>
                                            {(selectedCategory !== 'all' || selectedSubcategory !== 'all' || selectedBrand || searchQuery) && (
                                                <button 
                                                    onClick={() => {
                                                        setSelectedCategory('all');
                                                        setSelectedSubcategory('all');
                                                        setSelectedBrand(null);
                                                        setSearchQuery('');
                                                    }}
                                                    className="text-cyan hover:underline font-bold"
                                                >
                                                    Limpar todos os filtros
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                            {filteredProducts.map((item, idx) => (
                                                <motion.div 
                                                    key={item.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: Math.min(idx * 0.02, 0.3) }}
                                                    className="group bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-cyan/20 transition-all duration-300 overflow-hidden flex flex-col justify-between"
                                                >
                                                    {/* Imagem do Produto */}
                                                    <div 
                                                        onClick={() => setSelectedProduct(item)}
                                                        className="relative bg-[#f8fafc] p-6 aspect-square flex items-center justify-center overflow-hidden border-b border-gray-50 cursor-zoom-in group/img"
                                                    >
                                                        {/* Badge da Marca se houver */}
                                                        {item.brand && (
                                                            <span className="absolute top-4 left-4 bg-navy/80 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm z-10">
                                                                {item.brand}
                                                            </span>
                                                        )}
                                                        
                                                        {/* Badges de Destaques ou Promoções */}
                                                        <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-10">
                                                            {item.badges?.map(badge => (
                                                                <span 
                                                                    key={badge} 
                                                                    className="bg-cyan/10 text-cyan border border-cyan/20 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full text-center"
                                                                >
                                                                    {badge}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        {/* Foto do Produto */}
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name}
                                                            loading="lazy"
                                                            className="max-h-[80%] max-w-[80%] object-contain group-hover:scale-105 transition-transform duration-500"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = `https://placehold.co/400x400/f8fafc/153243?text=${encodeURIComponent(item.name)}`;
                                                            }}
                                                        />

                                                        {/* Overlay com Ícone de Zoom no Hover */}
                                                        <div className="absolute inset-0 bg-navy/5 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                                            <div className="bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg text-navy scale-90 group-hover/img:scale-100 transition-all duration-300">
                                                                <Search className="w-5 h-5 animate-pulse" />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Informações */}
                                                    <div className="p-5 flex-grow flex flex-col justify-between">
                                                        <div>
                                                            {/* Categoria sutil */}
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                                                                {categories.find(c => c.id === item.category)?.label}
                                                            </span>
                                                            <h4 className="text-navy font-bold text-sm tracking-tight line-clamp-2 min-h-[2.5rem] group-hover:text-cyan transition-colors duration-300" title={item.name}>
                                                                {item.name}
                                                            </h4>
                                                            <p className="text-gray-400 text-xs mt-2 line-clamp-2 leading-relaxed">
                                                                {item.description}
                                                            </p>
                                                        </div>

                                                        {/* Rodapé do Card */}
                                                        <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between gap-4">
                                                            {item.specs?.[0] ? (
                                                                <span className="text-[10px] font-bold text-navy bg-navy/5 px-2.5 py-1 rounded-md border border-navy/5">
                                                                    {item.specs[0].value}
                                                                </span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-md">
                                                                    LEVER
                                                                </span>
                                                            )}
                                                            
                                                            <a 
                                                                href={`https://wa.me/557191068208?text=Olá, gostaria de solicitar um orçamento para o produto: ${encodeURIComponent(item.name)}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-navy hover:bg-cyan text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md shadow-navy/10 active:scale-95 group/btn"
                                                            >
                                                                <MessageCircle className="w-3.5 h-3.5 group-hover/btn:animate-pulse" />
                                                                <span>Orçamento</span>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="text-center py-32 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">Nenhum produto encontrado com estes filtros.</p>
                                        <button 
                                            onClick={() => {
                                                setSelectedCategory('all');
                                                setSelectedSubcategory('all');
                                                setSelectedBrand(null);
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
                            className="fixed right-0 top-0 bottom-0 w-80 bg-white z-[70] p-8 md:hidden flex flex-col justify-between"
                        >
                            <div className="flex-grow overflow-y-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <h4 className="text-navy font-bold uppercase tracking-widest text-sm">Categorias e Filtros</h4>
                                    <button onClick={() => setIsSidebarOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                        <X className="w-6 h-6 text-navy" />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <button 
                                        onClick={() => { handleCategorySelect('all'); setIsSidebarOpen(false); }}
                                        className={`w-full text-left p-4 rounded-xl transition-all ${selectedCategory === 'all' ? 'bg-cyan text-white font-bold' : 'text-gray-600 active:bg-gray-50'}`}
                                    >
                                        Ver Tudo
                                    </button>
                                    {categories.map(cat => {
                                        const isCatSelected = selectedCategory === cat.id;
                                        const catSubs = subcategoriesData.filter(sub => sub.category === cat.id);
                                        
                                        return (
                                            <div key={cat.id} className="space-y-1">
                                                <button 
                                                    onClick={() => handleCategorySelect(cat.id)}
                                                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                                                        isCatSelected 
                                                        ? 'bg-cyan text-white font-bold' 
                                                        : 'text-gray-600 active:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {cat.icon && <cat.icon className="w-5 h-5 shrink-0" />}
                                                        <span>{cat.label}</span>
                                                    </div>
                                                    <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isCatSelected ? 'rotate-90' : ''}`} />
                                                </button>
                                                
                                                {isCatSelected && catSubs.length > 0 && (
                                                    <div className="ml-4 pl-3 border-l border-cyan/20 space-y-1 mt-1">
                                                        <button
                                                            onClick={() => { setSelectedSubcategory('all'); setIsSidebarOpen(false); }}
                                                            className={`w-full text-left py-2 px-3 rounded-lg text-xs ${
                                                                selectedSubcategory === 'all' ? 'text-cyan font-bold bg-cyan/5' : 'text-gray-500'
                                                            }`}
                                                        >
                                                            Ver tudo em {cat.label}
                                                        </button>
                                                        {catSubs.map(sub => (
                                                            <button
                                                                key={sub.id}
                                                                onClick={() => { setSelectedSubcategory(sub.id); setIsSidebarOpen(false); }}
                                                                className={`w-full text-left py-2 px-3 rounded-lg text-xs ${
                                                                    selectedSubcategory === sub.id ? 'text-cyan font-bold bg-cyan/5 border-l-2 border-cyan pl-2' : 'text-gray-500'
                                                                }`}
                                                            >
                                                                {sub.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Modal Lightbox com Zoom Cinemático */}
            <AnimatePresence>
                {selectedProduct && (
                    <>
                        {/* Fundo escuro com desfoque cinemático */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProduct(null)}
                            className="fixed inset-0 bg-navy/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4 md:p-6"
                        >
                            {/* Card do Modal */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                transition={{ type: "spring", damping: 25, stiffness: 350 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-[2.5rem] max-w-4xl w-full relative shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row max-h-[90dvh] md:max-h-[85dvh]"
                            >
                                {/* Botão de Fechar */}
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="absolute top-6 right-6 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-all active:scale-95 z-20"
                                >
                                    <X className="w-6 h-6" />
                                </button>

                                {/* Lado Esquerdo: Área de Zoom da Imagem */}
                                <div className="flex-1 bg-[#f8fafc] p-6 md:p-8 flex items-center justify-center relative overflow-hidden min-h-[280px] sm:min-h-[350px] md:min-h-[450px]">
                                    <div
                                        className="relative overflow-hidden cursor-zoom-in aspect-square w-full max-w-[340px] bg-white rounded-2xl flex items-center justify-center shadow-inner border border-gray-100/50"
                                        onMouseEnter={() => setIsZoomed(true)}
                                        onMouseLeave={() => {
                                            setIsZoomed(false);
                                            setZoomPos({ x: 50, y: 50 });
                                        }}
                                        onMouseMove={handleMouseMove}
                                    >
                                        <img
                                            src={selectedProduct.image || selectedProduct.imageUrl}
                                            alt={selectedProduct.name}
                                            className="max-h-[85%] max-w-[85%] object-contain transition-transform duration-200 ease-out select-none pointer-events-none"
                                            style={{
                                                transform: isZoomed ? `scale(2.2)` : `scale(1)`,
                                                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                            }}
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = `https://placehold.co/400x400/f8fafc/153243?text=${encodeURIComponent(selectedProduct.name)}`;
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Lado Direito: Informações */}
                                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[350px] md:max-h-[none]">
                                    <div>
                                        {/* Categoria */}
                                        <span className="text-[10px] font-bold text-cyan uppercase tracking-widest block mb-2">
                                            {categories.find(c => c.id === selectedProduct.category)?.label}
                                        </span>
                                        
                                        {/* Título */}
                                        <h3 className="text-navy font-bold text-xl md:text-2xl tracking-tight leading-tight mb-4">
                                            {selectedProduct.name}
                                        </h3>

                                        {/* Badges */}
                                        {selectedProduct.badges && selectedProduct.badges.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {selectedProduct.badges.map(badge => (
                                                    <span
                                                        key={badge}
                                                        className="bg-cyan/10 text-cyan border border-cyan/20 font-bold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full"
                                                    >
                                                        {badge}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Descrição */}
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                            {selectedProduct.description}
                                        </p>

                                        {/* Especificações */}
                                        {selectedProduct.specs && selectedProduct.specs.length > 0 && (
                                            <div className="space-y-2">
                                                <h5 className="text-[10px] font-bold text-navy uppercase tracking-widest">Especificações</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedProduct.specs.map(spec => (
                                                        <div
                                                            key={spec.label}
                                                            className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-xl"
                                                        >
                                                            <span className="font-semibold text-navy">{spec.label}: </span>
                                                            {spec.value}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Rodapé e CTA */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
                                        <span className="text-xs font-bold text-gray-400">
                                            {selectedProduct.brand || 'LEVER'}
                                        </span>
                                        
                                        <a
                                            href={`https://wa.me/557191068208?text=Olá, gostaria de solicitar um orçamento para o produto: ${encodeURIComponent(selectedProduct.name)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-navy hover:bg-cyan text-white text-xs font-bold px-5 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md shadow-navy/10 active:scale-95"
                                        >
                                            <MessageCircle className="w-4 h-4" />
                                            <span>Solicitar Orçamento</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
