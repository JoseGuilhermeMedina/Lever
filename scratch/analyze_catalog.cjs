const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const productsFile = path.join(baseDir, 'src', 'data', 'products.ts');
const subcategoriesFile = path.join(baseDir, 'src', 'data', 'staticProducts.ts');

if (!fs.existsSync(productsFile) || !fs.existsSync(subcategoriesFile)) {
    console.error("Erro: Arquivos necessarios nao encontrados.");
    process.exit(1);
}

// Ler e parsear produtos (como o products.ts é export const staticProducts = [...], podemos extrair o array)
const productsContent = fs.readFileSync(productsFile, 'utf-8');
const productsMatch = productsContent.match(/export const staticProducts: Product\[] = (\[[\s\S]*?\]);/);
if (!productsMatch) {
    console.error("Erro ao ler produtos.");
    process.exit(1);
}
const products = JSON.parse(productsMatch[1]);

// Ler e parsear subcategorias do staticProducts.ts
const subsContent = fs.readFileSync(subcategoriesFile, 'utf-8');
const subsMatch = subsContent.match(/export const staticProducts: Product\[] = (\[[\s\S]*?\]);/);
if (!subsMatch) {
    console.error("Erro ao ler subcategorias.");
    process.exit(1);
}
// Remover imports ou referências a ícones como "icon: Droplets" etc. para parsear como JSON limpo
let subsJsonText = subsMatch[1]
    .replace(/icon:\s*\w+,?/g, "")
    .replace(/,\s*}/g, "}")
    .replace(/,\s*]/g, "]");

// Uma forma mais segura de obter as subcategorias é fazer eval ou regex simples.
// Vamos usar regex para capturar as subcategorias de forma robusta e segura.
const subs = [];
const subRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',\s*category:\s*'([^']+)'/g;
let match;
while ((match = subRegex.exec(subsContent)) !== null) {
    subs.push({
        id: match[1],
        name: match[2],
        category: match[3]
    });
}

// Analisar contagem por subcategoria
const subCounts = {};
subs.forEach(s => {
    subCounts[s.id] = {
        name: s.name,
        category: s.category,
        count: 0
    };
});

let noSubCount = 0;
const rawSubcounts = {};

products.forEach(p => {
    if (subCounts[p.subcategory]) {
        subCounts[p.subcategory].count++;
    } else {
        noSubCount++;
        rawSubcounts[p.subcategory] = (rawSubcounts[p.subcategory] || 0) + 1;
    }
});

console.log("=== ANÁLISE DE DENSIDADE DO CATÁLOGO ===");
console.log(`Total de Produtos: ${products.length}`);
console.log(`Total de Subcategorias: ${subs.length}`);
console.log("-----------------------------------------");

console.log("\nSUB-CATEGORIAS VAZIAS:");
let emptyCount = 0;
subs.forEach(s => {
    const data = subCounts[s.id];
    if (data.count === 0) {
        console.log(`- [${s.category.toUpperCase()}] ${s.name} (${s.id})`);
        emptyCount++;
    }
});
console.log(`Total de subcategorias vazias: ${emptyCount}`);

console.log("\nSUB-CATEGORIAS COM POUCOS PRODUTOS (1 a 3 itens):");
let fewCount = 0;
subs.forEach(s => {
    const data = subCounts[s.id];
    if (data.count > 0 && data.count <= 3) {
        console.log(`- [${s.category.toUpperCase()}] ${s.name} (${s.id}): ${data.count} produto(s)`);
        fewCount++;
    }
});

console.log("\nSUB-CATEGORIAS MAIS DENSAS (Mais de 10 itens):");
subs.forEach(s => {
    const data = subCounts[s.id];
    if (data.count > 10) {
        console.log(`- [${s.category.toUpperCase()}] ${s.name} (${s.id}): ${data.count} produto(s)`);
    }
});

console.log("\nDISTRIBUIÇÃO COMPLETA DE PRODUTOS POR SUBCATEGORIA:");
subs.forEach(s => {
    const data = subCounts[s.id];
    console.log(`- ${s.name} (${s.id}): ${data.count} itens`);
});
