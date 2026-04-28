import { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, MessageCircle, Package, FlaskConical, CupSoda, Waves, HeartPulse, Hand, ChevronRight as ChevronRightIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGE_PRODUCT } from '../../config/constants';

// CONFIGURAÇÕES
const SHEET_URL = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQglC3c2knojWwl-_7cu6voauNoXdk6YWr-4hyDcj6l4rMGXj51MkBZzaGQ9cOTxmnAg1zYUeI1jc8_/pub?output=csv`;
const PRODUCTS_PER_PAGE = 12;

const CATEGORY_MAP: Record<string, { label: string, icon: any }> = {
    'Papel e Descartáveis': { label: 'Papel e Descartáveis', icon: CupSoda },
    'Produtos de Limpeza': { label: 'Higiene Geral', icon: FlaskConical },
    'Químicos': { label: 'Produtos Químicos', icon: FlaskConical },
    'Higiene Pessoal': { label: 'Higiene Pessoal', icon: Hand },
    'EPI e Segurança': { label: 'Segurança / EPI', icon: HeartPulse },
    'Higiene e Sanitização': { label: 'Sanitização', icon: HeartPulse },
    'Limpeza - Pisos e Ceras': { label: 'Cuidados com Pisos', icon: Waves },
    'Equipamentos de Higiene': { label: 'Dispenser e Higiene', icon: Package },
    'Utensílios de Limpeza': { label: 'Utensílios', icon: Package },
    'Material de Escritório': { label: 'Escritório', icon: Package },
};

interface Product {
    id: string;
    name: string;
    category: string;
    subcategory: string;
    shortDesc: string;
    fullDesc: string;
    unit: string;
    qty: string;
    code: string;
    image: string;
    tags: string[];
    badge: string;
    status: string;
}

// Funções Utilitárias
const parseCSV = (csvText: string): any[] => {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
    const result: any[] = [];
    const headers = lines[0].split(regex).map(h => h.replace(/^"|"$/g, '').trim());

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const currentline = lines[i].split(regex).map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim());

        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
            obj[header] = currentline[index];
        });
        result.push(obj);
    }
    return result;
};

export function CatalogSection() {
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [selectedSubcategory, setSelectedSubcategory] = useState('Todas');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const getSmartImage = (name: string, category: string, subcategory: string, currentUrl: string) => {
            if (currentUrl && currentUrl !== '[URL]' && currentUrl.startsWith('http')) {
                return currentUrl;
            }

            const search = `${name} ${subcategory} ${category}`.toLowerCase();

            // 1. PRIORIDADE MÁXIMA: Itens Específicos (Evita erros de categoria genérica)
            if (search.includes('relógio') || search.includes('relogio')) {
                return '/images/products/clock.png';
            }
            if (search.includes('escada')) {
                return '/images/products/tools.png';
            }
            if (search.includes('faca') || search.includes('garfo') || search.includes('colher') || search.includes('talher') || search.includes('canudo') || search.includes('margarina') || search.includes('deline')) {
                return '/images/products/cutlery.png';
            }
            if (search.includes('cestinha') || search.includes('cesto de carga') || search.includes('organizador')) {
                return '/images/products/caddy.png';
            }
            if (search.includes('copo')) {
                return '/images/products/cups.png';
            }

            // 2. Equipamentos e Dispensers
            if (search.includes('saboneteira') || search.includes('dispenser') || search.includes('porta papel') || search.includes('toalheiro') || search.includes('reservatorio') || search.includes('poupador')) {
                return '/images/products/dispenser.png';
            }

            // 3. Lixeiras e Contentores
            if (search.includes('lixeira') || search.includes('contentor') || search.includes('cesto') || search.includes('coletor')) {
                return '/images/products/trash_bins.png';
            }

            // 4. Ferramentas de Limpeza
            if (search.includes('vassoura') || search.includes('rodo') || search.includes('mop') || search.includes('pá ') || search.includes('escova') || search.includes('fibra') || search.includes('esfregão')) {
                return '/images/products/tools.png';
            }

            // 5. EPIs e Segurança
            if (search.includes('luva') || search.includes('mascara') || search.includes('touca') || search.includes('prope') || search.includes('avental') || search.includes('epi') || search.includes('bota') || search.includes('capa p/chuva')) {
                return '/images/products/epi.png';
            }

            // 6. Sacos e Bobinas
            if (search.includes('saco') || search.includes('lixo') || search.includes('bobina')) {
                return '/images/products/trash_bag.png';
            }

            // 7. Papéis (Fallback específico para papel)
            if (search.includes('papel') || search.includes('higienico') || search.includes('toalha') || search.includes('guardanapo') || search.includes('lençol')) {
                return '/images/products/paper.png';
            }

            // 8. Piscina e Químicos
            if (search.includes('piscina') || search.includes('cloro') || search.includes('algicida') || search.includes('clarificante') || search.includes('estabilizador') || search.includes('fita teste')) {
                return '/images/products/pool.png';
            }

            // 9. Escritório
            if (search.includes('escritório') || search.includes('caneta') || search.includes('pasta') || search.includes('envelope') || search.includes('sulfite') || search.includes('resma') || search.includes('arquivo morto') || search.includes('grampo')) {
                return '/images/products/office.png';
            }

            // 10. Sabão em Pó / Barra (Premium 3D Render)
            if (search.includes('sabao em po') || search.includes('sabão em pó') || search.includes('sache') || search.includes('sachê')) {
                return '/images/products/soap_powder.jpg';
            }

            // 11. Pulverizadores e Sprays
            if (search.includes('spray') || search.includes('purificador') || search.includes('pulverizador') || search.includes('aromatizante') || search.includes('odorizador')) {
                return '/images/products/spray.png';
            }

            // 12. Embalagens em Galão
            if (search.includes('galão') || search.includes('barrica') || search.includes('05lt') || search.includes('5lt') || search.includes('20l') || search.includes('15lt') || search.includes('balde')) {
                return '/images/products/gallon.png';
            }

            // Fallback: Frasco industrial (padrão 1L/500ml)
            if (category.includes('Limpeza') || category.includes('Químicos')) {
                return '/images/products/bottle.png';
            }

            // Caso seja algo muito diferente (disposable fallback)
            if (category.includes('Descartáveis')) {
                return '/images/products/disposable.png';
            }

            return '/images/products/bottle.png';
        };

        const fetchData = async () => {
            try {
                const response = await fetch(SHEET_URL);
                if (!response.ok) throw new Error('Falha ao carregar catálogo');
                const text = await response.text();
                const data = parseCSV(text);

                const cleanedData: Product[] = data
                    .filter((p: any) => p.Status === 'Ativo' || p.Status === 'ativo')
                    .map((p: any) => ({
                        id: p.ID || Math.random().toString(),
                        name: p['Nome do produto'] || 'Produto sem nome',
                        category: p.Categoria || 'Geral',
                        subcategory: p.Subcategoria || '',
                        shortDesc: p['Descrição curta'] || '',
                        fullDesc: p['Descrição completa'] || '',
                        unit: p['Unidade de venda'] || 'UN',
                        qty: p['Qtd por embalagem'] || '1',
                        code: p.ID || '---',
                        image: getSmartImage(
                            p['Nome do produto'] || '', 
                            p.Categoria || '', 
                            p.Subcategoria || '', 
                            p['URL da imagem'] || ''
                        ),
                        tags: [],
                        badge: '',
                        status: p.Status
                    }));

                setAllProducts(cleanedData);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Não foi possível carregar os produtos no momento.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const categoriesList = useMemo(() => {
        const groups: Record<string, Set<string>> = {};
        allProducts.forEach(p => {
            if (!groups[p.category]) groups[p.category] = new Set();
            if (p.subcategory) groups[p.category].add(p.subcategory);
        });

        const orderedCategories = Object.keys(groups).sort((a, b) => {
            const orderA = Object.keys(CATEGORY_MAP).indexOf(a);
            const orderB = Object.keys(CATEGORY_MAP).indexOf(b);
            return (orderA !== -1 ? orderA : 99) - (orderB !== -1 ? orderB : 99);
        });

        return orderedCategories.map(cat => ({
            name: cat,
            subcategories: Array.from(groups[cat]).sort()
        }));
    }, [allProducts]);

    const mainCategories = useMemo(() => {
        return categoriesList.map(cat => ({
            id: cat.name,
            label: CATEGORY_MAP[cat.name]?.label || cat.name,
            icon: CATEGORY_MAP[cat.name]?.icon || Package
        }));
    }, [categoriesList]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(p => {
            const matchesSearch = !searchTerm ||
                [p.name, p.shortDesc, p.subcategory, ...p.tags].some(f =>
                    f?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
            const matchesSub = selectedSubcategory === 'Todas' || p.subcategory === selectedSubcategory;

            return matchesSearch && matchesCategory && matchesSub;
        });
    }, [allProducts, searchTerm, selectedCategory, selectedSubcategory]);

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
    }, [filteredProducts, currentPage]);

    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

    const handleCategorySelect = (cat: string, sub: string = 'Todas') => {
        setSelectedCategory(cat);
        setSelectedSubcategory(sub);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: sectionRef.current?.offsetTop ? sectionRef.current.offsetTop - 100 : 0, behavior: 'smooth' });
    };

    const openWhatsApp = (productName: string) => {
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE_PRODUCT + productName)}`;
        window.open(url, '_blank');
    };

    if (error) {
        return (
            <section id="catalogo" className="py-24 bg-white text-center">
                <div className="container mx-auto px-4">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button onClick={() => window.location.reload()} className="bg-[#004760] text-white px-6 py-2 rounded-md">Tentar novamente</button>
                </div>
            </section>
        );
    }

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <section ref={sectionRef} id="catalogo" className="py-12 bg-white relative">
            <div className="container mx-auto px-4">

                {/* Top Icon Menu */}
                <div className="flex justify-center border-b border-gray-100 mb-12 overflow-x-auto no-scrollbar scroll-smooth">
                    <div className="flex gap-8 md:gap-12 pb-6 px-4">
                        <button
                            onClick={() => handleCategorySelect('Todos')}
                            className={`flex flex-col items-center gap-3 transition-all min-w-[100px] group ${selectedCategory === 'Todos' ? 'text-[#004760]' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all ${selectedCategory === 'Todos' ? 'bg-[#f0f7f9]' : 'group-hover:bg-gray-50'}`}>
                                <Search className={`w-8 h-8 md:w-10 md:h-10 ${selectedCategory === 'Todos' ? 'text-[#004760]' : 'text-gray-300'}`} strokeWidth={1} />
                            </div>
                            <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-center max-w-[80px]">
                                Todos
                            </span>
                        </button>
                        {mainCategories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => handleCategorySelect(cat.id)}
                                className={`flex flex-col items-center gap-3 transition-all min-w-[100px] group ${selectedCategory === cat.id ? 'text-[#004760]' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <div className={`w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-full transition-all ${selectedCategory === cat.id ? 'bg-[#f0f7f9]' : 'group-hover:bg-gray-50'}`}>
                                    <cat.icon className={`w-8 h-8 md:w-10 md:h-10 ${selectedCategory === cat.id ? 'text-[#004760]' : 'text-gray-300'}`} strokeWidth={1} />
                                </div>
                                <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-center max-w-[80px]">
                                    {cat.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

                    {/* Sidebar Desktop */}
                    <aside className="hidden lg:block w-72 flex-shrink-0">
                        <div className="sticky top-24 space-y-10">
                            
                            <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-[#004760] transition-colors mb-4 group">
                                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                                Voltar para Início
                            </Link>

                            <div>
                                <h3 className="text-[#004760] font-black text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                                    Pesquisar Produtos
                                </h3>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="PESQUISAR PRODUTOS..."
                                        className="w-full border-b-2 border-gray-100 py-3 text-sm focus:border-[#004760] outline-none transition-colors placeholder:text-gray-300 uppercase font-medium pr-8"
                                        value={searchTerm}
                                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                    />
                                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-[#004760] font-black text-sm uppercase tracking-wider mb-6">Categorias</h3>
                                <nav className="space-y-4">
                                    <button
                                        onClick={() => handleCategorySelect('Todos')}
                                        className={`block w-full text-left text-[11px] font-black uppercase tracking-widest transition-colors ${selectedCategory === 'Todos' ? 'text-[#004760]' : 'text-gray-500 hover:text-[#004760]'}`}
                                    >
                                        Todos os Produtos
                                    </button>
                                    {categoriesList.map((cat) => (
                                        <div key={cat.name} className="space-y-2">
                                            <button
                                                onClick={() => handleCategorySelect(cat.name)}
                                                className={`block w-full text-left text-[11px] font-black uppercase tracking-widest border-b border-gray-50 pb-1 transition-colors ${selectedCategory === cat.name ? 'text-[#004760]' : 'text-gray-800 hover:text-[#004760]'}`}
                                            >
                                                {cat.name}
                                            </button>
                                            <div className="pl-2 space-y-1.5 pt-1">
                                                {cat.subcategories.map(sub => (
                                                    <button
                                                        key={sub}
                                                        onClick={() => handleCategorySelect(cat.name, sub)}
                                                        className={`block w-full text-left text-[10px] font-bold uppercase tracking-wider transition-colors ${selectedCategory === cat.name && selectedSubcategory === sub ? 'text-[#004760]' : 'text-gray-400 hover:text-gray-600'}`}
                                                    >
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </aside>

                    {/* Mobile Category Trigger & Search */}
                    <div className="lg:hidden space-y-6 mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                            <ArrowLeft className="w-3 h-3" />
                            Início
                        </Link>
                        
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="PESQUISAR NO CATÁLOGO..."
                                className="w-full bg-gray-50 border-none py-4 px-6 rounded-2xl text-sm focus:ring-2 focus:ring-[#004760]/10 outline-none transition-all placeholder:text-gray-400 uppercase font-bold"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="w-full flex items-center justify-center gap-3 bg-[#004760] text-white font-black py-4 rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-[#004760]/20 active:scale-[0.98] transition-all"
                        >
                            <Package className="w-5 h-5" />
                            Filtrar Categorias
                        </button>
                    </div>

                    {/* Sidebar Drawer para Mobile */}
                    <AnimatePresence>
                        {isSidebarOpen && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] lg:hidden"
                                />
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: 0 }}
                                    exit={{ x: '-100%' }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[70] lg:hidden p-8 shadow-2xl overflow-y-auto"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <div className="space-y-1">
                                            <h3 className="text-[#004760] font-black text-xs uppercase tracking-[0.2em]">Filtros</h3>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold">Selecione uma categoria</p>
                                        </div>
                                        <button onClick={() => setIsSidebarOpen(false)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:text-red-500 transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <nav className="space-y-8 pb-20">
                                        <button
                                            onClick={() => { handleCategorySelect('Todos'); setIsSidebarOpen(false); }}
                                            className={`block w-full text-left text-xs font-black uppercase tracking-widest transition-colors ${selectedCategory === 'Todos' ? 'text-[#004760]' : 'text-gray-400'}`}
                                        >
                                            Todos os Produtos
                                        </button>
                                        {categoriesList.map((cat) => (
                                            <div key={cat.name} className="space-y-4">
                                                <button
                                                    onClick={() => { handleCategorySelect(cat.name); setIsSidebarOpen(false); }}
                                                    className={`block w-full text-left text-xs font-black uppercase tracking-widest border-b border-gray-50 pb-2 transition-colors ${selectedCategory === cat.name ? 'text-[#004760]' : 'text-gray-800'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                                <div className="pl-4 border-l-2 border-gray-50 space-y-3">
                                                    {cat.subcategories.map(sub => (
                                                        <button
                                                            key={sub}
                                                            onClick={() => { handleCategorySelect(cat.name, sub); setIsSidebarOpen(false); }}
                                                            className={`block w-full text-left text-[11px] font-bold uppercase tracking-wider transition-colors ${selectedCategory === cat.name && selectedSubcategory === sub ? 'text-[#004760]' : 'text-gray-400'}`}
                                                        >
                                                            {sub}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </nav>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <main className="flex-1">

                        {/* Breadcrumbs & Banner */}
                        <div className="flex flex-col gap-6 mb-10">
                            {/* Breadcrumbs */}
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#004760]">
                                <Link to="/" className="text-gray-300 hover:text-[#004760] transition-colors">Início</Link>
                                <ChevronRightIcon className="w-3 h-3 text-gray-300" />
                                <span>{selectedCategory}</span>
                                {selectedSubcategory !== 'Todas' && (
                                    <>
                                        <ChevronRightIcon className="w-3 h-3 text-gray-300" />
                                        <span>{selectedSubcategory}</span>
                                    </>
                                )}
                            </div>

                            {/* Banner de Aviso Legal em Destaque */}
                            <div className="bg-blue-50/80 border border-blue-100 p-4 rounded-lg flex items-start gap-4 shadow-sm">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black uppercase tracking-wider text-blue-900">Aviso sobre imagens do catálogo</h4>
                                    <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
                                        As imagens exibidas são **meramente ilustrativas**. Para conferir o visual real, lote atual ou embalagem específica, entre em contato via WhatsApp.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12">
                            {loading ? (
                                Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map(p => (
                                    <ProductCard
                                        key={p.id}
                                        product={p}
                                        onInfo={() => setSelectedProduct(p)}
                                        onQuote={() => openWhatsApp(p.name)}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full py-20 text-center text-gray-400">
                                    <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-bold uppercase">Nenhum produto encontrado.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!loading && totalPages > 1 && (
                            <div className="mt-16 flex justify-center gap-2">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`w-8 h-8 flex items-center justify-center text-[11px] font-bold rounded-full transition-all ${currentPage === p ? 'bg-[#004760] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setSelectedProduct(null)}
                        onQuote={() => openWhatsApp(selectedProduct.name)}
                    />
                )}
            </AnimatePresence>

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </section>
    );
}

function SkeletonCard() {
    return (
        <div className="flex flex-col items-center">
            <div className="aspect-square w-full bg-gray-50 rounded-lg animate-pulse mb-6" />
            <div className="h-4 w-3/4 bg-gray-50 animate-pulse mb-3" />
            <div className="h-10 w-full bg-gray-50 animate-pulse rounded" />
        </div>
    );
}

function ProductCard({ product, onInfo, onQuote }: { product: Product, onInfo: () => void, onQuote: () => void }) {
    const [imgError, setImgError] = useState(false);

    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full group cursor-pointer"
            onClick={onInfo}
        >
            <div className="aspect-square relative flex items-center justify-center mb-6 bg-transparent overflow-hidden">
                {product.image && !imgError ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        onError={() => setImgError(true)}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <Package className="w-16 h-16 text-gray-100" />
                )}
                
                {/* Etiqueta persistente no card */}
                <div className="absolute top-0 right-0 p-2">
                    <span className="text-[8px] font-black uppercase tracking-wider text-white bg-black/40 backdrop-blur-sm px-2 py-1 rounded-sm">
                        Ilustrativa
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-center text-center px-4 py-6 flex-grow bg-white border-x border-b border-gray-50/50 rounded-b-3xl">
                <span className="text-[9px] font-black tracking-[0.2em] text-[#004760]/40 uppercase mb-3">
                    {product.subcategory}
                </span>
                <h4 className="text-[11px] md:text-xs font-black text-[#004760] leading-relaxed uppercase tracking-tight mb-6 line-clamp-2 h-8">
                    {product.name}
                </h4>
                
                <button
                    onClick={(e) => { e.stopPropagation(); onQuote(); }}
                    className="w-full relative overflow-hidden group/btn bg-[#5eb14b] text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:bg-[#4d943d] hover:shadow-xl hover:shadow-[#5eb14b]/20 active:scale-[0.98]"
                >
                    <div className="relative z-10 flex items-center justify-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Fazer Orçamento</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </button>
            </div>
        </motion.div>
    );
}

function ProductModal({ product, onClose, onQuote }: { product: Product, onClose: () => void, onQuote: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative bg-white w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl z-[101]"
            >
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black z-10 transition-colors">
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
                    <div className="w-full md:w-1/2 bg-white p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
                        {product.image ? (
                            <img src={product.image} alt={product.name} className="max-w-full max-h-[400px] object-contain" />
                        ) : (
                            <Package className="w-24 h-24 text-gray-100" />
                        )}
                        <p className="mt-4 text-[9px] font-bold text-gray-300 uppercase tracking-widest italic">
                            * Imagem meramente ilustrativa
                        </p>
                    </div>

                    <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar">
                        <div className="mb-8">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#004760] mb-2 block">
                                {product.category}
                            </span>
                            <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase">
                                {product.name}
                            </h2>
                        </div>

                        <div className="space-y-8">
                            <div className="text-gray-600 text-[14px] leading-relaxed font-medium">
                                {product.fullDesc || product.shortDesc}
                            </div>

                            <div className="grid grid-cols-2 gap-y-6 pt-6 border-t border-gray-50">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-wider mb-1">Unidade</h4>
                                    <p className="text-gray-900 font-bold">{product.unit || 'UN'}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-wider mb-1">Embalagem</h4>
                                    <p className="text-gray-900 font-bold">{product.qty || '1 un.'}</p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-wider mb-1">Código Ref.</h4>
                                    <p className="text-gray-900 font-mono font-bold">{product.code || '---'}</p>
                                </div>
                            </div>

                            <div className="bg-amber-50 border-2 border-amber-100 p-6 rounded-md shadow-sm">
                                <div className="flex items-center gap-3 mb-3 text-amber-800">
                                    <MessageCircle className="w-5 h-5 fill-amber-800/20" />
                                    <h4 className="text-[12px] font-black uppercase tracking-[0.1em]">Visualização Real</h4>
                                </div>
                                <p className="text-[13px] text-amber-900/80 font-medium leading-relaxed">
                                    Esta imagem é uma representação do produto. Para fotos reais do item, especificações ou detalhes do bico/embalagem, converse com nosso time pelo WhatsApp.
                                </p>
                            </div>

                            <button
                                onClick={onQuote}
                                className="w-full bg-[#5ba344] hover:bg-[#4d8b3a] text-white py-5 rounded-sm flex items-center justify-center gap-3 transition-all text-sm font-black uppercase tracking-[0.2em]"
                            >
                                <MessageCircle className="w-5 h-5 fill-white" />
                                Pedir Cotação
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
