const fs = require('fs');
const path = require('path');

// Caminhos absolutos
const baseDir = path.resolve(__dirname, '..');
const produtosDir = path.join(baseDir, 'public', 'produtos');
const outputFile = path.join(baseDir, 'src', 'data', 'products.ts');

if (!fs.existsSync(produtosDir)) {
    console.error(`Erro: Diretorio nao encontrado: ${produtosDir}`);
    process.exit(1);
}

// Ler todas as imagens
const files = fs.readdirSync(produtosDir)
    .filter(file => /\.(jpeg|jpg|webp|png)$/i.test(file));

console.log(`Encontradas ${files.length} imagens de produtos.`);

// Função para formatar o nome do produto de forma amigável
function cleanName(filename) {
    // Remove extensão
    let name = filename.replace(/\.[^/.]+$/, "");
    
    // Substitui múltiplos espaços por um só
    name = name.replace(/\s+/g, ' ').trim();
    
    return name;
}

// Função para identificar a marca
function detectBrand(name) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('bralimpia')) return 'Bralimpia';
    if (nameLower.includes('bettanin') || nameLower.includes('superpro') || nameLower.includes('super pro')) return 'SuperPro';
    if (nameLower.includes('fortcom') || nameLower.includes('dropy') || nameLower.includes('infinity')) return 'Fortcom';
    if (nameLower.includes('guarany')) return 'Guarany';
    if (nameLower.includes('levuse') || nameLower.includes('lev&uze') || nameLower.includes('lev & uze') || nameLower.includes('lev uze')) return 'Levuse';
    if (nameLower.includes('nobre')) return 'Nobre';
    if (nameLower.includes('oriental')) return 'Oriental';
    if (nameLower.includes('ipel')) return 'Ipel';
    if (nameLower.includes('pratt') || nameLower.includes('prat ')) return 'Pratt';
    if (nameLower.includes('mercotech')) return 'Mercotech';
    if (nameLower.includes('volk')) return 'Volk';
    if (nameLower.includes('rodos 2000') || nameLower.includes('rodo 2000')) return 'Rodos 2000';
    
    return ''; // Sem marca parceira explícita
}

// Função para categorizar os produtos
function categorizeProduct(name) {
    const nameLower = name.toLowerCase();
    
    // ----------------------------------------------------
    // COPA
    // ----------------------------------------------------
    if (nameLower.includes('mexedor')) {
        return { category: 'copa', subcategory: 'copa-4' }; // Mexedor
    }
    if (nameLower.includes('café') || nameLower.includes('cafe')) {
        return { category: 'copa', subcategory: 'copa-1' }; // Café
    }
    if (nameLower.includes('açúcar') || nameLower.includes('açucar') || nameLower.includes('uniao sache') || nameLower.includes('união sachê')) {
        return { category: 'copa', subcategory: 'copa-2' }; // Açúcar cristal e Sachê
    }
    if (nameLower.includes('adoçante') || nameLower.includes('adocante') || nameLower.includes('zero cal')) {
        return { category: 'copa', subcategory: 'copa-3' }; // Adoçante
    }
    if (nameLower.includes('pano de copa') || nameLower.includes('pano de prato') || (nameLower.includes('pano') && nameLower.includes('copa'))) {
        return { category: 'copa', subcategory: 'copa-5' }; // Pano de copa
    }
    if (nameLower.includes('fósforo') || nameLower.includes('fosforo')) {
        return { category: 'copa', subcategory: 'copa-6' }; // Fósforo
    }
    if (nameLower.includes('porta copo') || nameLower.includes('dispenser poupador') || (nameLower.includes('porta') && nameLower.includes('copos'))) {
        return { category: 'copa', subcategory: 'copa-8' }; // Porta copo para água/café
    }
    if (nameLower.includes('filtro de papel') || nameLower.includes('filtro papel') || (nameLower.includes('filtro') && nameLower.includes('melitta'))) {
        return { category: 'copa', subcategory: 'copa-9' }; // Filtro de papel 102 e 103
    }
    if (nameLower.includes('lixeira de copo') || nameLower.includes('tubo coletor lixo de parede') || nameLower.includes('organizador água')) {
        return { category: 'copa', subcategory: 'copa-10' }; // Lixeira de copo para café/ água
    }
    if (nameLower.includes('sabonete albany')) {
        return { category: 'limpeza', subcategory: 'limpeza-2' }; // Sabonete (Higiene Pessoal)
    }

    // ----------------------------------------------------
    // DESCARTÁVEIS
    // ----------------------------------------------------
    if (nameLower.includes('copo desc') || nameLower.includes('copo 80ml') || nameLower.includes('copos descartáveis') || nameLower.includes('copo de plastico')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-1' }; // Copos
    }
    if (nameLower.includes('papel hig') || nameLower.includes('papel higiênico') || nameLower.includes('papel higienico') || nameLower.includes('higienico industrial') || nameLower.includes('higienico neutro')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-2' }; // Papel Higiênico
    }
    if (nameLower.includes('papel toalha') || nameLower.includes('toalha interfolha') || nameLower.includes('cai cai 9x20') || nameLower.includes('papel toalha interfolhado')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-3' }; // Papel Toalha
    }
    if (nameLower.includes('infectante') || nameLower.includes('hospitalar') || nameLower.includes('infectantes')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-4' }; // Direciona para Sacos para lixo
    }
    if (nameLower.includes('saco para lixo') || nameLower.includes('sacos para lixo') || nameLower.includes('saco p/ lixo') || nameLower.includes('saco p/lixo') || nameLower.includes('saco lixo')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-4' }; // Sacos para lixo
    }
    if (nameLower.includes('prato') || nameLower.includes('talher') || nameLower.includes('talheres') || nameLower.includes('garfo') || nameLower.includes('faca') || nameLower.includes('colher')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-6' }; // Pratos e Talheres
    }
    if (nameLower.includes('filme pvc') || nameLower.includes('lisafilm')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-7' }; // Filme PVC
    }
    if (nameLower.includes('bobina picotada') || nameLower.includes('bobina saco') || nameLower.includes('bobina plastica') || nameLower.includes('bobina s/ saco')) {
        return { category: 'descartaveis', subcategory: 'descartaveis-8' }; // Bobina Picotada
    }

    // ----------------------------------------------------
    // LIMPEZA E HIGIENE
    // ----------------------------------------------------
    if (nameLower.includes('luva')) {
        return { category: 'limpeza', subcategory: 'limpeza-2' }; // Higiene Pessoal / EPIs
    }
    if (nameLower.includes('dispenser')) {
        return { category: 'limpeza', subcategory: 'limpeza-3' }; // Equipamentos
    }
    if (nameLower.includes('pá ') || nameLower.includes('pá coletora') || nameLower.includes('pá para lixo') || nameLower.includes('pá comum')) {
        return { category: 'limpeza', subcategory: 'limpeza-3' }; // Equipamentos
    }
    if (nameLower.includes('mop') || nameLower.includes('esfregão') || nameLower.includes('esfregao') || nameLower.includes('refis de mop') || nameLower.includes('refil mop')) {
        return { category: 'limpeza', subcategory: 'limpeza-11' }; // Mop's
    }
    if (nameLower.includes('balde') || nameLower.includes('espremedor') || nameLower.includes('doblô') || nameLower.includes('doblo') || nameLower.includes('zig zag')) {
        return { category: 'limpeza', subcategory: 'limpeza-5' }; // Baldes
    }
    if (nameLower.includes('vassoura') || nameLower.includes('vassourão') || nameLower.includes('vassourao') || nameLower.includes('rastelo') || nameLower.includes('goulart naylita')) {
        return { category: 'limpeza', subcategory: 'limpeza-15' }; // Vassouras
    }
    if (nameLower.includes('rodo') || nameLower.includes('refil de borracha') || nameLower.includes('refil rodo')) {
        return { category: 'limpeza', subcategory: 'limpeza-14' }; // Rodos
    }
    if (nameLower.includes('flanela') || nameLower.includes('pano microfibra') || nameLower.includes('pano multiuso') || nameLower.includes('pano mult') || nameLower.includes('flanelas') || nameLower.includes('pano picot')) {
        // Se for pano multiuso descartável
        if (nameLower.includes('multiuso') || nameLower.includes('picot') || nameLower.includes('perfex') || nameLower.includes('pano mult picot')) {
            return { category: 'copa', subcategory: 'copa-7' }; // Pano multiuso (Copa)
        }
        return { category: 'limpeza', subcategory: 'limpeza-12' }; // Panos e Flanelas
    }
    if (nameLower.includes('lixeira') || nameLower.includes('contentor') || nameLower.includes('cesto') || nameLower.includes('reciclagem') || nameLower.includes('coleta seletiva')) {
        return { category: 'limpeza', subcategory: 'limpeza-10' }; // Lixeiras e Contentores
    }
    if (nameLower.includes('escova') || nameLower.includes('esfregona') || nameLower.includes('piaçava') || nameLower.includes('valentina') || nameLower.includes('lavatina')) {
        return { category: 'limpeza', subcategory: 'limpeza-8' }; // Escovas
    }
    if (nameLower.includes('fibra') || nameLower.includes('disco') || nameLower.includes('suporte minilock') || nameLower.includes('suporte plástico azul')) {
        return { category: 'limpeza', subcategory: 'limpeza-9' }; // Fibras e Discos
    }
    if (nameLower.includes('cabo') || nameLower.includes('extensor') || nameLower.includes('extensível')) {
        return { category: 'limpeza', subcategory: 'limpeza-6' }; // Cabos e Extensores
    }
    if (nameLower.includes('aromatizador') || nameLower.includes('aromatizante') || nameLower.includes('odorizador') || nameLower.includes('neutralizador') || nameLower.includes('bom ar') || nameLower.includes('essência') || nameLower.includes('cheirinho') || nameLower.includes('purificador') || nameLower.includes('eucalipto')) {
        return { category: 'limpeza', subcategory: 'limpeza-4' }; // Aromatizadores e Neutralizadores
    }
    if (nameLower.includes('álcool gel') || nameLower.includes('alcool gel') || nameLower.includes('sabonete líquido') || nameLower.includes('sabonete liq') || nameLower.includes('luva plástica') || nameLower.includes('máscara tnt') || nameLower.includes('touca tnt') || nameLower.includes('propé') || nameLower.includes('prope') || nameLower.includes('óculos vision') || nameLower.includes('saboneteira') || nameLower.includes('sabonete')) {
        return { category: 'limpeza', subcategory: 'limpeza-2' }; // Higiene Pessoal
    }
    if (nameLower.includes('cera') || nameLower.includes('removedor') || nameLower.includes('muriax')) {
        return { category: 'limpeza', subcategory: 'limpeza-1' }; // Direciona para Itens de Casa (Limpeza Geral)
    }
    
    // Padrão Geral / Equipamentos / Acessórios -> Agrupa em Equipamentos
    if (nameLower.includes('carrinho de limpeza') || nameLower.includes('bolsa de vinil') || nameLower.includes('organizador') || nameLower.includes('placa sinalizadora') || nameLower.includes('mão mecânica') || nameLower.includes('pulverizador') || nameLower.includes('pulverizadores')) {
        return { category: 'limpeza', subcategory: 'limpeza-3' }; // Direciona para Equipamentos
    }

    // Padrão Geral Limpeza (Itens de Casa / Limpeza Geral)
    return { category: 'limpeza', subcategory: 'limpeza-1' }; // Itens de Casa / Limpeza Geral
}

// Processar a lista
const products = files.map((file, index) => {
    const rawName = cleanName(file);
    const brand = detectBrand(rawName);
    const { category, subcategory } = categorizeProduct(rawName);
    
    // Tratamento de badges de forma automatizada
    const badges = [];
    const nameLower = rawName.toLowerCase();
    if (nameLower.includes('reforçado') || nameLower.includes('reforçada') || nameLower.includes('super')) {
        badges.push('Reforçado');
    }
    if (nameLower.includes('kit') || nameLower.includes('caixa')) {
        badges.push('Atacado');
    }
    if (nameLower.includes('concentrado') || nameLower.includes('ativo')) {
        badges.push('Concentrado');
    }
    if (index < 12) {
        badges.push('Destaque');
    }

    // Extrair algumas especificações simples baseadas em litragens, mililitros ou tamanhos
    const specs = [];
    const sizeMatch = rawName.match(/(\d+)\s*(?:lt|l|ml|kg|g|cm|mt|un)\b/i);
    if (sizeMatch) {
        specs.push({
            name: 'Especificação',
            value: sizeMatch[0].toUpperCase()
        });
    }

    return {
        id: `p-${index + 1}`,
        name: rawName,
        image: `/produtos/${file}`,
        imageUrl: `/produtos/${file}`,
        category,
        subcategory,
        brand,
        description: `Produto de alta qualidade para sua empresa ou residência. Fornecido pela LEVER.`,
        isActive: true,
        isFeatured: index < 12,
        badges,
        specs
    };
});

// Criar o conteúdo do arquivo TypeScript
let codeContent = `// Arquivo gerado automaticamente pelo script utilitario de listagem de imagens
// Total de produtos catalogados: ${products.length}

import type { Product } from '../types';

export const staticProducts: Product[] = ${JSON.stringify(products, null, 4)};
`;

fs.writeFileSync(outputFile, codeContent, 'utf-8');
console.log(`[OK] Base de dados gerada com sucesso em: ${outputFile}`);
console.log(`Total de produtos importados: ${products.length}`);
console.log(`Produtos com marca identificada: ${products.filter(p => p.brand).length}`);
