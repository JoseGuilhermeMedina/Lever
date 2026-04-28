import type { Product } from '../types';

export const products: Product[] = [
    {
        id: 'purificador-ar-levuze',
        name: 'Purificador de Ar Lev&Uze',
        category: 'higiene',
        description: 'Purificador de ambiente em aerossol 400ml. Diversas fragrâncias para perfumar e revitalizar seu espaço.',
        imageUrl: '/images/produtos em destaque/PURIFICADOR DE AR 400ML- LEV&UZE.jpeg',
        badges: ['Mais Vendido', 'Lançamento'],
        isFeatured: true,
        isActive: true,
        specs: [{ label: 'Volume', value: '400ml' }],
        cssClass: 'mix-blend-multiply object-contain p-4'
    },
    {
        id: 'pulverizadores-guarany',
        name: 'Pulverizadores Guarany',
        category: 'equipamentos',
        description: 'Pulverizadores de alto desempenho, ideais para aplicação profissional de químicos.',
        imageUrl: '/images/produtos em destaque/PULVERIZADORES 300ml e 500ml - GUARANY.jpeg',
        badges: ['Uso Profissional'],
        isFeatured: true,
        isActive: true,
        specs: [{ label: 'Capacidade', value: '300ml e 500ml' }],
        cssClass: 'mix-blend-multiply object-contain p-4'
    },
    {
        id: 'linha-limpeza-institucional',
        name: 'Linha Limpeza Institucional',
        category: 'quimicos',
        description: 'Detergentes, desinfetantes e limpadores de alta performance em galões de 5 litros.',
        images: [
            '/images/produtos em destaque/WhatsApp Image 2026-04-15 at 10.34.02.png',
            '/images/produtos em destaque/WhatsApp Image 2026-04-15 at 10.52.27.png',
            '/images/produtos em destaque/WhatsApp Image 2026-04-15 at 11.10.57.png'
        ],
        imageUrl: '/images/produtos em destaque/WhatsApp Image 2026-04-15 at 10.34.02.png',
        badges: ['Linha Completa'],
        isFeatured: true,
        isActive: true,
        specs: [{ label: 'Embalagem', value: 'Galões de 5L' }],
        cssClass: 'object-contain w-full h-full p-4 lg:p-6 drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)] hover:scale-[1.05] transition-transform duration-500'
    },
    {
        id: 'dispensers-fortcom-dropy',
        name: 'Dispensers Fortcom (Linha Dropy)',
        category: 'equipamentos',
        description: 'Design premium e alta resistência. Disponíveis em branco e preto (Toalheiros, Saboneteiras, Porta Papel).',
        images: [
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.42.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.46.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.47.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.48.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.49.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.50.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.51 (1).jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.51.jpeg',
            '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.52.jpeg'
        ],
        imageUrl: '/images/produtos em destaque/WhatsApp Image 2026-04-17 at 18.22.42.jpeg',
        badges: ['Design Premium'],
        isFeatured: true,
        isActive: true,
        specs: [{ label: 'Cores', value: 'Branco e Preto' }],
        cssClass: 'mix-blend-multiply object-contain p-6 hover:scale-[1.10]'
    },
    {
        id: 'linha-bettanin-bralimpia',
        name: 'Kits e Acessórios Profissionais',
        category: 'equipamentos',
        description: 'Acessórios profissionais Bettanin e Bralímpia. Fibras, rodos, pás e sistemas mops.',
        imageUrl: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Marcas Parceiras'],
        isFeatured: true,
        isActive: true,
        specs: [{ label: 'Marcas', value: 'Bettanin / Bralimpia' }]
    },
    {
        id: 'papel-toalha-institucional',
        name: 'Papel Toalha Institucional',
        category: 'descartaveis',
        description: 'Papel toalha interfolha com alta absorção para dispensers.',
        imageUrl: 'https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Mais Vendido'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Embalagem', value: '1000 folhas' }]
    },
    {
        id: 'papel-higienico-folha-dupla',
        name: 'Papel Higiênico Folha Dupla',
        category: 'descartaveis',
        description: 'Rolo de 30m folha dupla, maciez máxima para condomínios e clínicas.',
        imageUrl: 'https://images.pexels.com/photos/3951624/pexels-photo-3951624.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Mais Vendido'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Pacote', value: '64 rolos' }]
    },
    {
        id: 'desinfetante-concentrado',
        name: 'Desinfetante Concentrado',
        category: 'quimicos',
        description: 'Alto rendimento, rende até 50 litros. Aroma floral.',
        imageUrl: 'https://images.pexels.com/photos/4099468/pexels-photo-4099468.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Concentrado'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Galão', value: '5 Litros' }]
    },
    {
        id: 'alcool-70-galao',
        name: 'Álcool 70% Galão 5L',
        category: 'limpeza',
        description: 'Álcool líquido 70% INPM para desinfecção de superfícies.',
        imageUrl: 'https://images.pexels.com/photos/3998394/pexels-photo-3998394.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Uso Industrial'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Volume', value: '5L' }]
    },
    {
        id: 'detergente-desincrustante',
        name: 'Detergente Desincrustante',
        category: 'quimicos',
        description: 'Poderoso removedor de sujidades pesadas em pisos e pedras.',
        imageUrl: 'https://images.pexels.com/photos/4108711/pexels-photo-4108711.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Concentrado'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Diluição', value: '1:100' }]
    },
    {
        id: 'luva-procedimento',
        name: 'Luva de Procedimento CX/100',
        category: 'descartaveis',
        description: 'Luvas de látex com pó. Tamanhos P, M e G.',
        imageUrl: 'https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Caixa Master'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Caixa', value: '100 unidades' }]
    },
    {
        id: 'carrinho-funcional',
        name: 'Carrinho Funcional de Limpeza',
        category: 'equipamentos',
        description: 'Estrutura reforçada para transporte de materiais e coleta de resíduos.',
        imageUrl: 'https://images.pexels.com/photos/4099469/pexels-photo-4099469.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Uso Industrial'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Material', value: 'Polipropileno' }]
    },
    {
        id: 'sabonete-erva-doce',
        name: 'Sabonete Líquido Erva Doce 5L',
        category: 'higiene',
        description: 'Sabonete líquido cremoso com pH neutro e fragrância suave.',
        imageUrl: 'https://images.pexels.com/photos/3958158/pexels-photo-3958158.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Pronto Uso'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Galão', value: '5 Litros' }]
    },
    {
        id: 'desengraxante-industrial',
        name: 'Desengraxante Industrial',
        category: 'industrial',
        description: 'Remoção de óleos, graxas e gorduras pesadas em máquinas e motores.',
        imageUrl: 'https://images.pexels.com/photos/4108711/pexels-photo-4108711.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Uso Industrial'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Aplicação', value: 'Industrial' }]
    },
    {
        id: 'mop-po-completo',
        name: 'Mop Pó Completo Professional',
        category: 'equipamentos',
        description: 'Ideal para limpeza seca e remoção de poeira em grandes áreas.',
        imageUrl: 'https://images.pexels.com/photos/6197121/pexels-photo-6197121.jpeg?auto=compress&cs=tinysrgb&w=800',
        badges: ['Pronto Uso'],
        isFeatured: false,
        isActive: true,
        specs: [{ label: 'Tamanho', value: '60cm' }]
    }
];
