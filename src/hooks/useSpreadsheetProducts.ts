import { useState, useEffect } from 'react';
import type { Product, CategoryID, Badge } from '../types';

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQglC3c2knojWwl-_7cu6voauNoXdk6YWr-4hyDcj6l4rMGXj51MkBZzaGQ9cOTxmnAg1zYUeI1jc8_/pub?output=csv';

export function useSpreadsheetProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(SPREADSHEET_URL);

                if (!response.ok) throw new Error('Falha ao carregar catálogo da planilha');

                const csvData = await response.text();
                
                // Se o Google Sheets retornar uma página web em vez de CSV, bloqueamos.
                if (csvData.trim().toLowerCase().startsWith('<!doctype html>')) {
                    throw new Error('A planilha está configurada como "Página da web". Por favor, publique como "CSV".');
                }

                const parsedProducts = parseCSV(csvData);
                
                if (parsedProducts.length === 0) {
                    throw new Error('A planilha foi lida, mas nenhum produto foi encontrado. Verifique as colunas.');
                }

                setProducts(parsedProducts);
            } catch (err: any) {
                console.error('Erro ao buscar produtos:', err);
                setError(err.message || 'Não foi possível carregar o catálogo em tempo real.');
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    return { products, loading, error };
}

function parseCSV(csvText: string): Product[] {
    const lines = csvText.split(/\r?\n/);
    if (lines.length < 2) return [];

    // O arquivo Catalogo_Pai.csv usa ';' como separador
    const header = lines[0];
    const separator = header.includes(';') ? ';' : ',';
    
    const headers = header.split(separator).map(h => h.trim().replace(/^"|"$/g, ''));
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = parseCSVLine(line, separator);
        const row: Record<string, string> = {};
        
        headers.forEach((h, i) => {
            row[h] = values[i] || '';
        });

        const sku = row['ID'] || row['SKU'] || '';
        const name = row['Nome do produto'] || '';
        const categoryLabel = row['Categoria'] || 'Outros';
        const brand = row['Marca'] || '';
        const group = row['Categoria'] || 'Outros';
        const subgroup = row['Subcategoria'] || 'Geral';
        const unit = row['Unidade de venda'] || '';
        const status = row['Status'] || 'Ativo';
        const imageUrl = row['URL da Imagem'] || row['URL da imagem'] || '';

        // Mapeia a label da planilha para os IDs de categoria do sistema
        const categoryMap: Record<string, CategoryID> = {
            'Produtos de Limpeza': 'limpeza',
            'Equipamentos': 'equipamentos',
            'Químicos': 'quimicos',
            'Descartáveis': 'descartaveis',
            'Papel e Descartáveis': 'descartaveis',
            'Higiene Pessoal': 'higiene',
            'Higiene e Sanitização': 'limpeza',
            'Utensílios de Limpeza': 'equipamentos',
            'Equipamentos de Higiene': 'equipamentos',
            'EPI e Segurança': 'industrial',
            'Limpeza - Pisos e Ceras': 'limpeza'
        };

        const categoryId = categoryMap[categoryLabel] || 'limpeza';

        const badges: Badge[] = [];
        if (status === 'Ativo' && !row['Estoque']?.startsWith('0')) {
             // Pode adicionar badges baseados em regras
        }

        return {
            id: sku,
            name: name,
            category: categoryId,
            brand: brand,
            group: group,
            subgroup: subgroup,
            description: '', // Caso não tenha coluna de descrição, podemos deixar vazio ou usar o nome
            badges: badges,
            isFeatured: false,
            isActive: true,
            specs: unit ? [{ label: 'Unidade', value: unit }] : [],
            imageUrl: imageUrl && imageUrl !== '[URL]' ? imageUrl : undefined
        };
    });
}

// Helper para lidar com aspas no CSV
function parseCSVLine(line: string, separator: string): string[] {
    const result = [];
    let curValue = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === separator && !inQuotes) {
            result.push(curValue.trim().replace(/^"|"$/g, ''));
            curValue = "";
        } else {
            curValue += char;
        }
    }
    result.push(curValue.trim().replace(/^"|"$/g, ''));
    return result;
}
