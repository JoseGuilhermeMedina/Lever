"""
Script para limpar e organizar o arquivo de estoque LEVER.
Gera planilha no formato de e-commerce com as colunas:
Nome do produto | Categoria | Subcategoria | Descricao curta |
Descricao completa | Unidade de venda | Qtd por embalagem |
Marca | URL da imagem | Status
"""

import csv
import re
from collections import defaultdict

# ==============================================================================
# MAPEAMENTO DE CATEGORIAS E SUBCATEGORIAS
# ==============================================================================
SUBCATEGORY_KEYWORDS = [
    # EPI e Segurança
    (['LUVA LATEX', 'LUVA BORRACHA'], 'EPI e Segurança', 'Luvas de Borracha'),
    (['LUVA VINIL', 'LUVA PROCEDIMENTO'], 'EPI e Segurança', 'Luvas de Procedimento'),
    (['LUVA VERNIZ', 'LUVA PIGMENTADA', 'LUVA PANO'], 'EPI e Segurança', 'Luvas de Proteção'),
    (['MASCARA PFF', 'MASCARA P/RESP', 'MASCARA RESPIRAT'], 'EPI e Segurança', 'Máscaras Respiratórias'),
    (['MASCARA CIRUR', 'MASCARA DESC', 'MASCARA TNT'], 'EPI e Segurança', 'Máscaras Descartáveis'),
    (['TOUCA', 'PROPE', 'AVENTAL'], 'EPI e Segurança', 'Vestimenta Descartável'),

    # Papel e Descartáveis
    (['PAPEL HIG', 'PAPEL HIGIENICO'], 'Papel e Descartáveis', 'Papel Higiênico'),
    (['PAPEL TOALHA', 'TOALHA ABSORV', 'TOALHA INTERF'], 'Papel e Descartáveis', 'Papel Toalha'),
    (['GUARDANAPO'], 'Papel e Descartáveis', 'Guardanapo'),
    (['COPO DESC', 'COPO TERM', 'COPO ACRIL', 'COPO ISOPOR'], 'Papel e Descartáveis', 'Copos Descartáveis'),
    (['SACO P/LIXO', 'SACO LIXO'], 'Papel e Descartáveis', 'Sacos para Lixo'),
    (['FILME PVC', 'PAPEL ALUMINIO', 'BOBINA PICOT'], 'Papel e Descartáveis', 'Filmes e Embalagens'),
    (['PRATO DESC', 'BANDEJA', 'MARMITA', 'POTE'], 'Papel e Descartáveis', 'Pratos e Bandejas'),

    # Produtos de Limpeza
    (['DETERGENTE NEUTRO', 'DETERGENTE CONC', 'DETERGIN'], 'Produtos de Limpeza', 'Detergente Neutro'),
    (['DETERGENTE DESINF', 'DETCLOR', 'DETERGENTE CLOR'], 'Produtos de Limpeza', 'Detergente Desinfetante'),
    (['DESENGR', 'DESENGRAXANTE'], 'Produtos de Limpeza', 'Desengraxante'),
    (['SABAO EM PO', 'SABAO PO'], 'Produtos de Limpeza', 'Sabão em Pó'),
    (['SABAO BARRA', 'SABAO GELE', 'SABAO COCO', 'SABAO PAST'], 'Produtos de Limpeza', 'Sabão Líquido/Gel'),
    (['SAB. LIQ', 'SAB LIQ', 'SABONETE LIQ', 'SABONETE PEROL'], 'Produtos de Limpeza', 'Sabonete Líquido'),
    (['SAPONACEO', 'PASTA LIMP', 'PASTA CRIST'], 'Produtos de Limpeza', 'Saponáceo e Pasta'),
    (['LIMPA VIDRO', 'LIMPA VIDROS', 'VIDREX'], 'Produtos de Limpeza', 'Limpa Vidros'),
    (['LIMPA ALUMINIO', 'BRILHA ALUMINIO', 'ALUMIN'], 'Produtos de Limpeza', 'Limpa Alumínio'),
    (['LIMPA PORCELANATO', 'CLEAN MAX', 'LIMPA PISOS', 'PARA PISOS'], 'Produtos de Limpeza', 'Limpa Pisos'),
    (['MULTIUSO', 'LIMPADOR MULT', 'MULT USO'], 'Produtos de Limpeza', 'Limpador Multiuso'),
    (['CERA LIQ', 'CERA SUCESS', 'CERA BASE', 'IMPERMEABILIZ', 'SELADOR', 'SELADOR AC'], 'Limpeza - Pisos e Ceras', 'Ceras e Impermeabilizantes'),
    (['REMOVEDOR DE CERA', 'REMOVEDOR CERA', 'REMOTECH'], 'Limpeza - Pisos e Ceras', 'Removedores de Cera'),
    (['LIMPADOR FORTES', 'LIMPEZA PESADA', 'DECAP', 'DESINCRUSTANTE', 'MURIAX'], 'Produtos de Limpeza', 'Desincrustante e Limpeza Pesada'),

    # Higiene e Sanitização
    (['ALCOOL GEL', 'ALCOOL GEL FLIP', 'ALCOOL GEL VALV'], 'Higiene e Sanitização', 'Álcool Gel'),
    (['ALCOOL 70', 'ALCOOL LIQ', 'ALCOOL LIQUI'], 'Higiene e Sanitização', 'Álcool Líquido 70°'),
    (['AGUA SANITARIA'], 'Higiene e Sanitização', 'Água Sanitária'),
    (['HIPOCLORITO', 'CLORO LIQUIDO', 'CLORO LIQ'], 'Higiene e Sanitização', 'Hipoclorito / Cloro Ativo'),
    (['DESINFETANTE', 'DESINF '], 'Higiene e Sanitização', 'Desinfetante'),
    (['SANITIZANTE', 'SANITIZ'], 'Higiene e Sanitização', 'Sanitizante'),

    # Higiene Pessoal e Aromatizantes
    (['PURIFICADOR DE AR', 'PURIFICADOR AR', 'ODORIZADOR', 'AROMATIZANTE'], 'Higiene Pessoal', 'Aromatizantes e Purificadores'),
    (['NEUTRALIZADOR DE ODOR', 'NEUTRALIZADOR ODOR', 'MASKER'], 'Higiene Pessoal', 'Neutralizadores de Odor'),
    (['SABONETE 85', 'SABONETE 20', 'CREME DENTAL', 'CREME BARB'], 'Higiene Pessoal', 'Higiene Pessoal'),
    (['INSETICIDA', 'BAYGON', 'SBP'], 'Higiene Pessoal', 'Inseticidas'),
    (['ANTI MOFO', 'NAFTALINA', 'PEDRA SANIT'], 'Higiene Pessoal', 'Sanitários e Anti-mofo'),

    # Equipamentos de Higiene
    (['SABONETEIRA', 'PORTA SAB', 'PONTO SAB'], 'Equipamentos de Higiene', 'Saboneteiras'),
    (['PORTA HIG', 'PORTA PAPEL HIG', 'PORTA HIGIENIC'], 'Equipamentos de Higiene', 'Porta Papel Higiênico'),
    (['PORTA TOALHA', 'PORTA PAPEL TOALHA'], 'Equipamentos de Higiene', 'Porta Papel Toalha'),
    (['CONTENTOR', 'LIXEIRA'], 'Equipamentos de Higiene', 'Coletores e Contentores'),
    (['CESTO', 'CESTA LIXO'], 'Equipamentos de Higiene', 'Cestos'),

    # Utensílios de Limpeza
    (['VASSOURA'], 'Utensílios de Limpeza', 'Vassouras'),
    (['RODO', 'REFIL BORRACHA'], 'Utensílios de Limpeza', 'Rodos e Refis'),
    (['BALDE C/ESPR', 'BALDE ESPREM'], 'Utensílios de Limpeza', 'Baldes com Espremedor'),
    (['BALDE PLAST', 'BALDE C/TAMPA', 'BALDE '], 'Utensílios de Limpeza', 'Baldes'),
    (['PULVERIZADOR', 'BORRIFADOR'], 'Utensílios de Limpeza', 'Pulverizadores'),
    (['PA P/LIXO', 'PA COLET', 'PA ARTICULADA'], 'Utensílios de Limpeza', 'Pás para Lixo'),
    (['TELA PARA MICTORIO', 'TELA MICTORIO'], 'Utensílios de Limpeza', 'Telas para Mictório'),
    
    # Químicos
    (['SODA CAUSTICA', 'QUEROSENE', 'VASELINA', 'LUBRIFICANTE', 'THINNER'], 'Químicos', 'Químicos Gerais'),
    (['CLORO P/PISCINA', 'CLORO PACE', 'ALGICIDA', 'CLARIFICANTE', 'SULFATO'], 'Químicos', 'Tratamento de Piscina'),

    # Alimentos
    (['FRANGO', 'LINGUICA', 'CHARQUE', 'CARNE', 'COSTELA', 'BACON'], 'Alimentos - Frios e Proteínas', 'Carnes e Embutidos'),
    (['QUEIJO', 'PRESUNTO', 'SALAME', 'PEITO DE PERU', 'RICOTA', 'IOGURTE'], 'Alimentos - Frios e Proteínas', 'Frios e Laticínios'),
    (['POLPA', 'SUCO'], 'Alimentos - Bebidas e Mercearia', 'Sucos e Polpas'),
    (['CAFE', 'CHA', 'CAPPUCCINO'], 'Alimentos - Bebidas e Mercearia', 'Café e Chás'),
    (['REFRIGERANTE', 'AGUA MINERAL'], 'Alimentos - Bebidas e Mercearia', 'Bebidas'),
    (['ACUCAR', 'SAL REFIN', 'OLEO', 'VINAGRE', 'MOSTARDA', 'CATCHUP'], 'Alimentos - Bebidas e Mercearia', 'Mercearia Geral'),
    (['PAO', 'CROISSANT', 'BRIOCHE', 'AUSTRALIANO', 'FRANCES'], 'Alimentos - Panificados', 'Pães e Panificados'),
    (['FEIJAO', 'ARROZ', 'MACARRAO', 'ESPAGUETE', 'PENNE', 'TRIGO'], 'Alimentos - Bebidas e Mercearia', 'Grãos e Massas'),
]

CATEGORY_FALLBACK = [
    ({'09', '160', '190', '200', '210', '20003', '20008', '20029090', '20058000'}, 'Alimentos - Bebidas e Mercearia', 'Mercearia Geral'),
    ({'220', '270', '280', '290', '340', '380', '34022000', '3401190003', '38089401', '38099141', '38249049'}, 'Produtos de Limpeza', 'Limpeza Geral'),
    ({'300', '390'}, 'Papel e Descartáveis', 'Descartáveis'),
    ({'330'}, 'Higiene Pessoal', 'Higiene Geral'),
    ({'35061010', '35061090', '38249029', '32151900'}, 'Material de Escritório', 'Escritório'),
]


def extract_brand(raw_name):
    """
    Extrai a marca do nome do produto.
    O padrão mais comum é: NOME DO PRODUTO - MARCA
    Ex: 'DETERGENTE NEUTRO 05LT - ATOL' -> 'Atol'
    """
    if not raw_name:
        return ''
    
    # Padrão principal: após o último " - " no nome original
    parts = raw_name.split(' - ')
    if len(parts) >= 2:
        brand = parts[-1].strip()
        # Validação: a marca deve ter entre 2 e 30 caracteres e não conter números sozinhos
        if 2 <= len(brand) <= 30 and not re.match(r'^\d+$', brand):
            # Remove sufixos comuns que não são marca
            brand = re.sub(r'\b(MMV|KG|LT|UN|ML|GR|G)\b', '', brand, flags=re.IGNORECASE).strip()
            if len(brand) >= 2:
                return brand.title()
    
    return ''


def clean_product_name(raw_name, brand):
    """
    Remove a marca do nome do produto para exibição limpa.
    Ex: 'DETERGENTE NEUTRO 05LT - ATOL' -> 'Detergente Neutro 05Lt'
    """
    if not raw_name:
        return ''
    
    name = raw_name
    if brand:
        # Remove o sufixo " - MARCA" do nome
        suffix = f" - {brand.upper()}"
        if name.upper().endswith(suffix):
            name = name[:-len(suffix)].strip()
        else:
            # Tenta remover do jeito que está no nome original
            parts = name.split(' - ')
            if len(parts) >= 2:
                name = ' - '.join(parts[:-1]).strip()
    
    return to_title_case(name)


def infer_category_and_sub(name, code):
    """Infere categoria e subcategoria pelo nome e código."""
    name_upper = str(name).upper()
    code_str = str(code)
    
    # Primeiro tenta por palavras-chave no nome (mais específico)
    for keywords, category, subcategory in SUBCATEGORY_KEYWORDS:
        for kw in keywords:
            if kw.upper() in name_upper:
                return category, subcategory
    
    # Fallback por prefixo de código
    for prefixes, category, subcategory in CATEGORY_FALLBACK:
        for prefix in prefixes:
            if code_str.startswith(prefix):
                return category, subcategory
    
    return 'Outros', 'Outros'


def generate_short_desc(name, medida, qty):
    """Gera uma descrição curta baseada no nome do produto."""
    name_lower = name.lower()
    
    # Mapeia palavras para descrições curtas
    if 'detergente' in name_lower:
        return 'Limpeza industrial'
    elif 'desinfetante' in name_lower or 'desinf' in name_lower:
        return 'Desinfetante profissional'
    elif 'alcool gel' in name_lower:
        return 'Antisséptico e higienizador'
    elif 'alcool' in name_lower:
        return 'Desinfecção de superfícies'
    elif 'agua sanitaria' in name_lower:
        return 'Alvejante e desinfetante'
    elif 'hipoclorito' in name_lower or 'cloro' in name_lower:
        return 'Hipoclorito / Cloro ativo'
    elif 'papel hig' in name_lower:
        return '100% celulose, alta absorção'
    elif 'papel toalha' in name_lower or 'toalha' in name_lower:
        return 'Alta absorção para dispensers'
    elif 'saco p/lixo' in name_lower or 'saco lixo' in name_lower:
        return 'Resistente, para coleta seletiva'
    elif 'copo desc' in name_lower:
        return 'Polipropileno, uso único'
    elif 'luva latex' in name_lower:
        return 'Proteção química e mecânica'
    elif 'luva vinil' in name_lower:
        return 'Sem pó, caixa c/ 100'
    elif 'sabonete' in name_lower or 'sab. liq' in name_lower or 'sab liq' in name_lower:
        return 'Fragrância suave, pH neutro'
    elif 'vassoura' in name_lower:
        return 'Uso interno, cerdas macias'
    elif 'rodo' in name_lower:
        return f'Alta durabilidade'
    elif 'balde' in name_lower and 'espr' in name_lower:
        return 'Sistema duplo, alta capacidade'
    elif 'saboneteira' in name_lower:
        return 'Dispensador de parede'
    elif 'purificador' in name_lower or 'aromatizante' in name_lower:
        return 'Ambiente fresco por horas'
    elif 'inseticida' in name_lower:
        return 'Aerossol de ação rápida'
    elif 'mascara' in name_lower:
        return 'Proteção respiratória'
    elif 'cera' in name_lower:
        return 'Auto brilho para pisos'
    elif 'limpador mult' in name_lower or 'multiuso' in name_lower:
        return 'Uso geral em superfícies'
    
    # Genérico por medida
    if medida and medida.upper() in ('KG', 'LT'):
        return f'Produto a granel, medido em {medida.upper()}'
    return 'Produto profissional'


def parse_qty_and_unit(raw_name, medida):
    """
    Extrai a quantidade por embalagem e a unidade de venda do nome do produto.
    Ex: 'DETERGENTE 05LT' -> qtd=1, unit='Galão (5L)'
        'COPO DESC 200ML C/100 UN' -> qtd=100, unit='Caixa'
    """
    name_upper = str(raw_name).upper()
    
    qty = 1
    unit = 'Unidade'
    
    # Volume / peso no nome -> determina a unidade de venda
    vol_match = re.search(r'(\d+[\.,]?\d*)\s*(LT|L\b|ML|KG|GR|G\b)', name_upper)
    if vol_match:
        vol_num = float(vol_match.group(1).replace(',', '.'))
        vol_unit = vol_match.group(2)
        if vol_unit in ('LT', 'L'):
            if vol_num >= 5:
                unit = f'Galão ({int(vol_num)}L)'
            elif vol_num >= 1:
                unit = f'Frasco ({int(vol_num)}L)'
            else:
                unit = f'Frasco ({int(vol_num*1000)}ml)'
        elif vol_unit == 'ML':
            if vol_num >= 800:
                unit = f'Frasco ({int(vol_num)}ml)'
            else:
                unit = f'Frasco ({int(vol_num)}ml)'
        elif vol_unit in ('KG', 'GR', 'G'):
            unit = f'Embalagem ({vol_match.group(1)}{vol_unit.capitalize()})'
    
    # Quantidade de unidades na embalagem: padrão C/XXX ou X UNID ou XUN
    qty_match = re.search(r'[C/]+(\d+)\s*(?:UN|UNID|PÇ|PARES?)\b', name_upper)
    if qty_match:
        qty = int(qty_match.group(1))
        unit = 'Caixa'
    
    # Embalagem específica
    if re.search(r'\bCX\b', name_upper) or 'CX C/' in name_upper:
        unit = 'Caixa'
    elif 'PCT' in name_upper or 'PACOTE' in name_upper:
        unit = 'Pacote'
    elif re.search(r'\b(BB|BARRICA|BALDAO|BALDE)\b', name_upper):
        unit = 'Barrica (5L)'
    elif medida and medida.upper() == 'FD':
        unit = 'Fardo'
    elif medida and medida.upper() == 'SC':
        unit = 'Saco'
    
    return qty, unit


def to_title_case(text):
    """Converte texto para Title Case, respeitando abreviações e números."""
    if not text or not isinstance(text, str):
        return text
    keep_upper = {'kg', 'lt', 'un', 'cx', 'pc', 'bb', 'bd', 'ct', 'rl', 'gl', 'sh', 'bl', 'par', 'fd', 'sc', 'pct', 'ml'}
    words = text.lower().split()
    result = []
    for word in words:
        clean = re.sub(r'[^\w]', '', word).lower()
        if clean in keep_upper:
            result.append(word.upper())
        else:
            result.append(word.capitalize())
    return ' '.join(result)


def clean_stock(value):
    """Limpa valor de estoque: N -> 0, negativos -> 0."""
    if not value or str(value).strip().upper() == 'N':
        return 0
    try:
        num = float(str(value).replace(',', '.'))
        return max(0, int(num))
    except (ValueError, TypeError):
        return 0


def get_base_code(code):
    if not code:
        return code
    return str(code).split('/')[0].strip()


def get_variation_suffix(code):
    parts = str(code).split('/')
    if len(parts) > 1:
        return parts[1].strip()
    return None


def choose_best_name(names):
    if not names:
        return ''
    if len(names) == 1:
        return names[0]
    return max(names, key=lambda n: (len(n), n.count(' ')))


def process_csv(input_file, output_pai_file, output_variacoes_file):
    """Processa o CSV de estoque e gera planilha no formato e-commerce."""
    
    # ===== LEITURA =====
    rows = []
    for enc in ('utf-8-sig', 'latin-1', 'cp1252'):
        try:
            with open(input_file, 'r', encoding=enc) as f:
                reader = csv.DictReader(f, delimiter=';')
                rows = list(reader)
            if rows:
                sample_key = list(rows[0].keys())[0]
                if 'Código' not in rows[0] and 'digo' in sample_key:
                    new_rows = []
                    for row in rows:
                        new_row = {}
                        for k, v in row.items():
                            clean_k = k.encode('latin-1').decode('utf-8', errors='replace').strip('\ufeff') if enc == 'latin-1' else k.strip('\ufeff')
                            new_row[clean_k] = v
                        new_rows.append(new_row)
                    rows = new_rows
                break
        except Exception:
            continue
    
    print(f"Linhas lidas: {len(rows)}")
    
    def get_field(row, *field_names):
        for fn in field_names:
            if fn in row:
                return row[fn] or ''
        for k in row:
            for fn in field_names:
                if fn.lower() in k.lower():
                    return row[k] or ''
        return ''
    
    # ===== AGRUPAMENTO =====
    groups = defaultdict(list)
    for row in rows:
        code = str(get_field(row, 'Código', 'Codigo')).strip()
        base = get_base_code(code)
        if base and base != 'nan':
            groups[base].append(row)
    
    print(f"Grupos (SKUs base) unicos: {len(groups)}")
    
    # ===== PROCESSAMENTO =====
    products_pai = {}
    products_var = []
    
    for base_code, items in groups.items():
        pais = [i for i in items if get_variation_suffix(get_field(i, 'Código', 'Codigo')) is None]
        variacoes = [i for i in items if get_variation_suffix(get_field(i, 'Código', 'Codigo')) is not None]
        
        # Escolher o melhor item pai
        if len(pais) >= 1:
            all_names = [get_field(i, 'Descrição', 'Descricao') for i in pais]
            raw_name = choose_best_name(all_names)
            total_stock = sum(clean_stock(get_field(i, 'Unificado')) for i in pais)
            medida = get_field(pais[0], 'Medida') or 'UN'
        else:
            all_names = [get_field(i, 'Descrição', 'Descricao') for i in variacoes]
            raw_name = choose_best_name(all_names)
            total_stock = sum(clean_stock(get_field(i, 'Unificado')) for i in variacoes)
            medida = get_field(variacoes[0], 'Medida') if variacoes else 'UN'
        
        # Extração de marca e nome limpo
        brand = extract_brand(raw_name)
        clean_name = clean_product_name(raw_name, brand)
        
        # Categoria e subcategoria
        category, subcategory = infer_category_and_sub(raw_name, base_code)
        
        # Quantidade e unidade
        qty, unit_of_sale = parse_qty_and_unit(raw_name, medida)
        
        # Descrição curta
        desc_short = generate_short_desc(raw_name.lower(), medida, qty)
        
        status = 'Ativo' if total_stock > 0 else 'Inativo'
        
        products_pai[base_code] = {
            'sku': base_code,
            'nome': clean_name,
            'nome_raw': raw_name,
            'categoria': category,
            'subcategoria': subcategory,
            'desc_curta': desc_short,
            'desc_completa': '',  # Preencher manualmente
            'unidade_venda': unit_of_sale,
            'qtd_embalagem': qty,
            'marca': brand,
            'url_imagem': '',
            'estoque': total_stock,
            'status': status,
            'tem_variacao': len(variacoes) > 0,
        }
        
        # Variações
        var_groups = defaultdict(list)
        for v in variacoes:
            suffix = get_variation_suffix(get_field(v, 'Código', 'Codigo'))
            var_groups[suffix].append(v)
        
        for suffix, var_items in var_groups.items():
            var_names = [get_field(i, 'Descrição', 'Descricao') for i in var_items]
            best_var_name = choose_best_name(var_names)
            var_brand = extract_brand(best_var_name)
            var_clean_name = clean_product_name(best_var_name, var_brand)
            total_var_stock = sum(clean_stock(get_field(i, 'Unificado')) for i in var_items)
            var_medida = get_field(var_items[0], 'Medida') or 'UN'
            var_cat, var_sub = infer_category_and_sub(best_var_name, base_code)
            var_qty, var_unit = parse_qty_and_unit(best_var_name, var_medida)
            
            products_var.append({
                'sku_variacao': f"{base_code}/{suffix}",
                'sku_pai': base_code,
                'nome': var_clean_name,
                'categoria': var_cat,
                'subcategoria': var_sub,
                'desc_curta': generate_short_desc(best_var_name.lower(), var_medida, var_qty),
                'desc_completa': '',
                'unidade_venda': var_unit,
                'qtd_embalagem': var_qty,
                'marca': var_brand,
                'url_imagem': '',
                'estoque': total_var_stock,
                'status': 'Ativo' if total_var_stock > 0 else 'Inativo',
            })
    
    # ===== ESCRITA PRODUTOS PAI =====
    pai_fieldnames = [
        'SKU', 'Nome do produto', 'Categoria', 'Subcategoria',
        'Descricao curta', 'Descricao completa', 'Unidade de venda',
        'Qtd por embalagem', 'Marca', 'URL da imagem', 'Status', 'Estoque', 'Tem Variacao'
    ]
    
    with open(output_pai_file, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=pai_fieldnames, delimiter=';')
        writer.writeheader()
        count = 0
        for base_code, p in sorted(products_pai.items()):
            writer.writerow({
                'SKU': p['sku'],
                'Nome do produto': p['nome'],
                'Categoria': p['categoria'],
                'Subcategoria': p['subcategoria'],
                'Descricao curta': p['desc_curta'],
                'Descricao completa': p['desc_completa'],
                'Unidade de venda': p['unidade_venda'],
                'Qtd por embalagem': p['qtd_embalagem'],
                'Marca': p['marca'],
                'URL da imagem': p['url_imagem'],
                'Status': p['status'],
                'Estoque': p['estoque'],
                'Tem Variacao': 'SIM' if p['tem_variacao'] else 'NAO',
            })
            count += 1
    
    print(f"[OK] Produtos Pai: {count} -> {output_pai_file}")
    
    # ===== ESCRITA VARIACOES =====
    var_fieldnames = [
        'SKU Variacao', 'SKU Pai', 'Nome do produto', 'Categoria', 'Subcategoria',
        'Descricao curta', 'Descricao completa', 'Unidade de venda',
        'Qtd por embalagem', 'Marca', 'URL da imagem', 'Status', 'Estoque'
    ]
    
    with open(output_variacoes_file, 'w', newline='', encoding='utf-8-sig') as f:
        writer = csv.DictWriter(f, fieldnames=var_fieldnames, delimiter=';')
        writer.writeheader()
        for v in products_var:
            writer.writerow({
                'SKU Variacao': v['sku_variacao'],
                'SKU Pai': v['sku_pai'],
                'Nome do produto': v['nome'],
                'Categoria': v['categoria'],
                'Subcategoria': v['subcategoria'],
                'Descricao curta': v['desc_curta'],
                'Descricao completa': v['desc_completa'],
                'Unidade de venda': v['unidade_venda'],
                'Qtd por embalagem': v['qtd_embalagem'],
                'Marca': v['marca'],
                'URL da imagem': v['url_imagem'],
                'Status': v['status'],
                'Estoque': v['estoque'],
            })
    
    print(f"[OK] Variacoes: {len(products_var)} -> {output_variacoes_file}")
    
    # ===== RELATORIO =====
    print("\n" + "="*60)
    print("RELATORIO FINAL")
    print("="*60)
    
    cats = defaultdict(int)
    with_brand = sum(1 for p in products_pai.values() if p['marca'])
    for p in products_pai.values():
        cats[p['categoria']] += 1
    
    print(f"Produtos Pai totais: {len(products_pai)}")
    print(f"Variacoes totais: {len(products_var)}")
    print(f"Com marca extraida: {with_brand} ({100*with_brand//len(products_pai)}%)")
    print(f"\nCategorias ({len(cats)} categorias):")
    for cat, c in sorted(cats.items(), key=lambda x: -x[1]):
        print(f"   {cat}: {c}")


if __name__ == '__main__':
    import os
    base_dir = r"c:\Users\guilh\Documents\codigos\lever\segunda tentativa"
    
    input_file  = os.path.join(base_dir, "Estoque LEVER.csv")
    output_pai  = os.path.join(base_dir, "Catalogo_Pai.csv")
    output_var  = os.path.join(base_dir, "Catalogo_Variacoes.csv")
    
    if not os.path.exists(input_file):
        print(f"ERRO: Arquivo nao encontrado: {input_file}")
    else:
        print(f"Processando: {input_file}")
        print("="*60)
        process_csv(input_file, output_pai, output_var)
        print("\nProcessamento concluido!")
