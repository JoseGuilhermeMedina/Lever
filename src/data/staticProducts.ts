import type { Product } from '../types';

export const staticProducts: Product[] = [
    // --- Limpeza e Higiene ---
    { id: 'limpeza-1', name: 'Itens de Casa', category: 'limpeza', description: 'Linha completa de itens essenciais para limpeza de casa.', isActive: true, isFeatured: true, badges: ['Mais Vendido'], specs: [] },
    { id: 'limpeza-2', name: 'Higiene Pessoal', category: 'limpeza', description: 'Produtos para higiene pessoal e cuidados essenciais.', isActive: true, isFeatured: true, badges: [], specs: [] },
    { id: 'limpeza-3', name: 'Equipamentos', category: 'limpeza', description: 'Equipamentos gerais para limpeza.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-4', name: 'Aromatizadores e Neutralizadores', category: 'limpeza', description: 'Aromatizadores e neutralizadores de odores diversos.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-5', name: 'Baldes', category: 'limpeza', description: 'Diversos tipos e tamanhos de baldes.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-6', name: 'Cabos e Extensores', category: 'limpeza', description: 'Cabos e extensores para rodos, vassouras e mops.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-7', name: 'Equipamentos e Acessórios', category: 'limpeza', description: 'Acessórios diversos para rotina de limpeza profissional.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-8', name: 'Escovas', category: 'limpeza', description: 'Variedade de escovas de limpeza.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-9', name: 'Fibras e Discos', category: 'limpeza', description: 'Fibras e discos para tratamento de superfícies.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-10', name: 'Lixeiras e Contentores', category: 'limpeza', description: 'Soluções de lixeiras, cestos e contentores.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-11', name: 'Mop´s', category: 'limpeza', description: 'Linha de Mops profissionais e residenciais (pó, água, spray).', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-12', name: 'Panos e Flanelas', category: 'limpeza', description: 'Panos e flanelas de limpeza e microfibras.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-13', name: 'Tratamento de Pisos', category: 'limpeza', description: 'Produtos químicos, ceras e removedores para tratamento de pisos.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-14', name: 'Rodos', category: 'limpeza', description: 'Rodos puxa-água de diferentes tamanhos.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'limpeza-15', name: 'Vassouras', category: 'limpeza', description: 'Vassouras diversas para áreas internas e externas.', isActive: true, isFeatured: false, badges: [], specs: [] },

    // --- Descartáveis ---
    { id: 'descartaveis-1', name: 'Copos', category: 'descartaveis', description: 'Copos descartáveis de água e café.', isActive: true, isFeatured: true, badges: [], specs: [] },
    { id: 'descartaveis-2', name: 'Papel Higiênico', category: 'descartaveis', description: 'Papel higiênico em rolo e interfolha.', isActive: true, isFeatured: true, badges: [], specs: [] },
    { id: 'descartaveis-3', name: 'Papel Toalha', category: 'descartaveis', description: 'Papel toalha interfolhado e bobina.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'descartaveis-4', name: 'Sacos para lixo', category: 'descartaveis', description: 'Sacos para lixo de diversas litragens (comum e reforçado).', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'descartaveis-5', name: 'Sacos Infectantes', category: 'descartaveis', description: 'Sacos brancos para lixo hospitalar e infectante.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'descartaveis-6', name: 'Pratos e Talheres', category: 'descartaveis', description: 'Pratos, garfos, facas e colheres descartáveis.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'descartaveis-7', name: 'Filme PVC', category: 'descartaveis', description: 'Rolos de filme PVC para embalo e proteção.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'descartaveis-8', name: 'Bobina Picotada', category: 'descartaveis', description: 'Bobinas plásticas picotadas transparentes.', isActive: true, isFeatured: false, badges: [], specs: [] },

    // --- Copa ---
    { id: 'copa-1', name: 'Café', category: 'copa', description: 'Pós de café tradicionais, extra fortes e grãos.', isActive: true, isFeatured: true, badges: [], specs: [] },
    { id: 'copa-2', name: 'Açúcar cristal e Sachê', category: 'copa', description: 'Açúcar em pacote ou sachês individuais.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-3', name: 'Adoçante', category: 'copa', description: 'Adoçantes líquidos e em sachê.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-4', name: 'Mexedor', category: 'copa', description: 'Mexedores plásticos e de madeira para café.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-5', name: 'Pano de copa', category: 'copa', description: 'Panos de prato e copa tradicionais.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-6', name: 'Fósforo', category: 'copa', description: 'Caixas de fósforos.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-7', name: 'Pano multiuso', category: 'copa', description: 'Panos descartáveis multiuso em rolo (tipo Perfex).', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-8', name: 'Porta copo para água/café', category: 'copa', description: 'Suportes para copos na parede ou mesa.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-9', name: 'Filtro de papel 102 e 103', category: 'copa', description: 'Filtros de papel para coar café nº 102 e 103.', isActive: true, isFeatured: false, badges: [], specs: [] },
    { id: 'copa-10', name: 'Lixeira de copo para café/ água', category: 'copa', description: 'Lixeiras tubulares dispenser para copos usados.', isActive: true, isFeatured: false, badges: [], specs: [] },

    // --- Promoções ---
    { id: 'promocoes-1', name: 'Consulte nossos Itens Promocionais', category: 'promocoes', description: 'Entre em contato para saber das ofertas da semana!', isActive: true, isFeatured: true, badges: ['Oferta'], specs: [] },
];
