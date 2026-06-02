import json
import re
import os
import unicodedata
import hashlib
import difflib
import zipfile
import xml.etree.ElementTree as ET
import urllib.parse

def normalize_string(s):
    """Normaliza string para comparação tolerante a acentos e caracteres especiais."""
    s = s.lower().strip()
    s = "".join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9]', ' ', s)
    return " ".join(s.split())

def load_static_subcategories():
    """Carrega as subcategorias do staticProducts.ts mapeando Nome Normalizado -> (ID_Sub, Categoria, Nome Legível)."""
    ts_static_path = os.path.join("src", "data", "staticProducts.ts")
    if not os.path.exists(ts_static_path):
        return {}
        
    with open(ts_static_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Captura { id: '...', name: '...', category: '...' }
    blocks = re.findall(r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"],\s*category:\s*['\"]([^'\"]+)['\"]", content)
    
    sub_map = {}
    for sub_id, sub_name, category in blocks:
        norm_name = normalize_string(sub_name)
        if norm_name:
            sub_map[norm_name] = {
                "id": sub_id,
                "category": category,
                "display_name": sub_name
            }
    return sub_map

def extract_docx_text(docx_path):
    """Extrai texto cru de um arquivo Word .docx de forma nativa sem dependências."""
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            for p in root.findall('.//w:p', ns):
                texts = []
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        texts.append(t.text)
                paragraphs.append("".join(texts) if texts else "")
    except Exception as e:
        print(f"Aviso ao ler DOCX '{docx_path}': {e}")
        return []
    return paragraphs

def parse_docx_content(docx_path):
    """Faz o parse das informações estruturadas de produtos, informações importantes e descrições do DOCX."""
    paragraphs = extract_docx_text(docx_path)
    if not paragraphs:
        return []
        
    products = []
    current_product = None
    current_section = None
    
    name_pattern = re.compile(r'^Nome do produto:\s*(.*)', re.IGNORECASE)
    important_pattern = re.compile(r'^(Informação importante|Informaço importante):\s*(.*)', re.IGNORECASE)
    description_pattern = re.compile(r'^(Descrição|Descriço):\s*(.*)', re.IGNORECASE)
    
    for line in paragraphs:
        line_str = line.strip()
        if not line_str:
            if current_product and current_section:
                if current_section == 'important':
                    current_product['important_raw'].append("")
                elif current_section == 'description':
                    current_product['description_raw'].append("")
            continue
            
        name_match = name_pattern.match(line_str)
        if name_match:
            if current_product:
                products.append(current_product)
            current_product = {
                "raw_name": name_match.group(1).strip(),
                "important_raw": [],
                "description_raw": []
            }
            current_section = None
            continue
            
        if not current_product:
            continue
            
        important_match = important_pattern.match(line_str)
        if important_match:
            current_section = 'important'
            text = important_match.group(2).strip()
            if text:
                current_product['important_raw'].append(text)
            continue
            
        description_match = description_pattern.match(line_str)
        if description_match:
            current_section = 'description'
            text = description_match.group(2).strip()
            if text:
                current_product['description_raw'].append(text)
            continue
            
        if current_section == 'important':
            current_product['important_raw'].append(line_str)
        elif current_section == 'description':
            current_product['description_raw'].append(line_str)
            
    if current_product:
        products.append(current_product)
        
    for p in products:
        p['important'] = clean_multiline_text(p['important_raw'])
        p['description'] = clean_multiline_text(p['description_raw'])
        
    return products

def clean_multiline_text(lines):
    """Remove linhas em branco adjacentes e reconstrói o texto multilinha."""
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    result = []
    last_was_empty = False
    for l in lines:
        if not l:
            if not last_was_empty:
                result.append("")
                last_was_empty = True
        else:
            result.append(l)
            last_was_empty = False
    return "\n".join(result)

def generate_stable_id(filename):
    """Gera um ID estável e curto a partir do nome do arquivo para não quebrar links."""
    hasher = hashlib.md5(filename.encode("utf-8"))
    return f"p-{hasher.hexdigest()[:6]}"

def parse_filename(filename):
    """
    Regra de quebra do nome do arquivo fornecida pelo usuário:
    - Tudo antes do primeiro '--' ou '-' (cercado por espaços) é o Nome do Produto.
    - Se houver '--', o que está depois é a Marca (até o primeiro '-' cercado por espaços seguinte se houver).
    - Tudo o que está após o '-' cercado por espaços são as Subcategorias.
    - As subcategorias adicionais podem ser divididas por qualquer hífen simples '-' com ou sem espaços.
    - Suporta palavras compostas com hífen sem espaços (ex: 'Para-brisas') no nome do produto sem quebrá-las.
    """
    name_without_ext, _ = os.path.splitext(filename)
    
    p_name = ""
    p_brand = ""
    p_subs = []
    
    if "--" in name_without_ext:
        # Tem marca (separada por --)
        parts_brand = name_without_ext.split("--", 1)
        p_name = parts_brand[0].strip()
        
        rest = parts_brand[1].strip()
        # O primeiro traço (com ou sem espaços) separa a marca das subcategorias
        parts_sub_split = re.split(r'\s+-\s+|\s+-|-\s+', rest, maxsplit=1)
        if len(parts_sub_split) >= 2:
            p_brand = parts_sub_split[0].strip()
            p_subs = [s.strip() for s in parts_sub_split[1].split("-") if s.strip()]
        else:
            p_brand = rest
    else:
        # Não tem marca, apenas nome e subcategorias
        parts_sub_split = re.split(r'\s+-\s+', name_without_ext, maxsplit=1)
        if len(parts_sub_split) >= 2:
            p_name = parts_sub_split[0].strip()
            p_subs = [s.strip() for s in parts_sub_split[1].split("-") if s.strip()]
        else:
            p_name = name_without_ext
            
    return p_name, p_brand, p_subs

def sync_catalog_by_images():
    public_produtos_dir = os.path.join("public", "produtos")
    ts_file_path = os.path.join("src", "data", "products.ts")
    docx_file_path = "produtos e descrições.docx"
    
    if not os.path.exists(public_produtos_dir):
        print(f"Erro: O diretório '{public_produtos_dir}' não existe.")
        return
        
    # 1. Carrega subcategorias estáticas do sistema
    sub_map = load_static_subcategories()
    print(f"Carregadas {len(sub_map)} subcategorias do staticProducts.ts para mapeamento.")
    
    # 2. Carrega produtos e descrições do documento DOCX (se existir)
    docx_products_map = {}
    if os.path.exists(docx_file_path):
        docx_products = parse_docx_content(docx_file_path)
        for p in docx_products:
            norm_name = normalize_string(p["raw_name"])
            docx_products_map[norm_name] = p
        print(f"Carregados {len(docx_products_map)} descrições e avisos do documento DOCX.")
        
    # 3. Carrega o products.ts existente para preservar customizações diretas
    existing_products_map = {}
    if os.path.exists(ts_file_path):
        try:
            with open(ts_file_path, "r", encoding="utf-8") as f:
                ts_content = f.read()
            match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", ts_content)
            if match:
                json_data_str = match.group(1).strip()
                if json_data_str.endswith(';'):
                    json_data_str = json_data_str[:-1]
                existing_products = json.loads(json_data_str)
                existing_products_map = {p.get("id"): p for p in existing_products if p.get("id")}
                print(f"Carregados {len(existing_products_map)} produtos existentes do products.ts para preservar customizações.")
        except Exception as e:
            print(f"Aviso ao carregar produtos existentes para preservação: {e}")
            
    # 4. Lista e ordena as imagens físicas na pasta para consistência determinística
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    image_files = []
    for f in os.listdir(public_produtos_dir):
        _, ext = os.path.splitext(f)
        if ext.lower() in allowed_extensions:
            image_files.append(f)
            
    image_files.sort()
    print(f"Encontradas {len(image_files)} imagens de produtos físicas na pasta.")
    
    products = []
    unmapped_subcategories = set()
    
    for idx, f_name in enumerate(image_files):
        # Quebra o nome do arquivo usando a regra do usuário
        p_name, p_brand, p_subs = parse_filename(f_name)
        
        # Ajusta a capitalização padrão
        p_name_capitalized = p_name[0].upper() + p_name[1:] if p_name else ""
        p_brand_capitalized = p_brand[0].upper() + p_brand[1:] if p_brand else ""
        
        # Nome do arquivo limpo sem extensão para casamento com o DOCX
        filename_clean, _ = os.path.splitext(f_name)
        norm_filename_clean = normalize_string(filename_clean)
        
        # Gera ID estável
        p_id = generate_stable_id(f_name)
        
        p_category = "limpeza" # Categoria pai padrão
        p_subcategory = ""
        
        resolved_sub_ids = []
        resolved_categories = []
        
        for s in p_subs:
            norm_s = normalize_string(s)
            
            # 1. Busca exata normalizada
            if norm_s in sub_map:
                resolved = sub_map[norm_s]
                resolved_sub_ids.append(resolved["id"])
                resolved_categories.append(resolved["category"])
            else:
                # 2. Busca aproximada tolerante
                closest = difflib.get_close_matches(norm_s, list(sub_map.keys()), n=1, cutoff=0.6)
                if closest:
                    resolved = sub_map[closest[0]]
                    resolved_sub_ids.append(resolved["id"])
                    resolved_categories.append(resolved["category"])
                else:
                    unmapped_subcategories.add(s)
                    
        # Define as subcategorias mapeadas
        if resolved_sub_ids:
            if len(resolved_sub_ids) == 1:
                p_subcategory = resolved_sub_ids[0]
            else:
                p_subcategory = resolved_sub_ids
            # Atribui a categoria principal do primeiro mapeamento resolvido
            p_category = resolved_categories[0]
            
        # 5. Resolve Descrição e Informação Importante com prioridades:
        # Prioridade A: Documento Word (produtos e descrições.docx)
        # Prioridade B: Edições manuais existentes no products.ts (se houver e não for padrão)
        # Prioridade C: Texto padrão
        
        p_desc = "Produto de alta qualidade para sua empresa ou residência. Fornecido pela LEVER."
        p_important = ""
        p_specs = []
        p_badges = ["Destaque"] if p_brand_capitalized else []
        p_is_featured = True
        p_is_active = True
        
        # Recupera dados anteriores se existirem (para specs, badges, Destaque etc.)
        old_prod = existing_products_map.get(p_id)
        if old_prod:
            p_desc = old_prod.get("description", p_desc)
            p_important = old_prod.get("importantInfo", p_important)
            p_specs = old_prod.get("specs", p_specs)
            p_badges = old_prod.get("badges", p_badges)
            p_is_featured = old_prod.get("isFeatured", p_is_featured)
            p_is_active = old_prod.get("isActive", p_is_active)
            
        # Sobrescreve com o Word (docx) se houver registro para este produto
        if norm_filename_clean in docx_products_map:
            docx_data = docx_products_map[norm_filename_clean]
            if docx_data["description"]:
                p_desc = docx_data["description"]
            if docx_data["important"]:
                p_important = docx_data["important"]
                
        # Monta o objeto final do produto (com caminhos de imagem devidamente URL-encoded)
        product_obj = {
            "id": p_id,
            "name": p_name_capitalized,
            "image": f"/produtos/{urllib.parse.quote(f_name)}",
            "imageUrl": f"/produtos/{urllib.parse.quote(f_name)}",
            "category": p_category,
            "subcategory": p_subcategory,
            "brand": p_brand_capitalized,
            "description": p_desc,
            "isActive": p_is_active,
            "isFeatured": p_is_featured,
            "badges": p_badges,
            "specs": p_specs
        }
        
        if p_important:
            product_obj["importantInfo"] = p_important
            
        products.append(product_obj)
        
    print(f"\nProdutos gerados com sucesso: {len(products)}")
    
    if unmapped_subcategories:
        print(f"\nAVISO: As seguintes {len(unmapped_subcategories)} subcategorias extraídas não foram encontradas:")
        for s in sorted(unmapped_subcategories):
            print(f"  * '{s}'")
            
    # 6. Grava de volta o catálogo de produtos products.ts
    json_formatted = json.dumps(products, indent=4, ensure_ascii=False)
    
    ts_final_content = (
        "// Arquivo gerado AUTOMATICAMENTE do zero varrendo as fotos físicas na pasta public/produtos e casando com o Word\n"
        f"// Total de produtos catalogados: {len(products)}\n\n"
        "import type { Product } from '../types';\n\n"
        f"export const staticProducts: Product[] = {json_formatted};\n"
    )
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(ts_final_content)
        
    print(f"\nCatálogo '{ts_file_path}' sincronizado e gerado com total sucesso!")

if __name__ == "__main__":
    sync_catalog_by_images()
