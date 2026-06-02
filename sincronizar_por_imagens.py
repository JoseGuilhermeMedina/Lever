import json
import re
import os
import unicodedata
import hashlib
import difflib

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
            # As subcategorias adicionais podem ser divididas por qualquer hífen simples '-'
            p_subs = [s.strip() for s in parts_sub_split[1].split("-") if s.strip()]
        else:
            p_brand = rest
    else:
        # Não tem marca, apenas nome e subcategorias
        # O primeiro traço que separa o nome das subcategorias deve ser cercado por espaços ' - '
        # para evitar colisão com palavras como 'Para-brisas' no nome do produto
        parts_sub_split = re.split(r'\s+-\s+', name_without_ext, maxsplit=1)
        if len(parts_sub_split) >= 2:
            p_name = parts_sub_split[0].strip()
            # As subcategorias adicionais podem ser divididas por qualquer hífen simples '-'
            p_subs = [s.strip() for s in parts_sub_split[1].split("-") if s.strip()]
        else:
            p_name = name_without_ext
            
    return p_name, p_brand, p_subs

def sync_catalog_by_images():
    public_produtos_dir = os.path.join("public", "produtos")
    ts_file_path = os.path.join("src", "data", "products.ts")
    
    if not os.path.exists(public_produtos_dir):
        print(f"Erro: O diretório '{public_produtos_dir}' não existe.")
        return
        
    # 1. Carrega subcategorias estáticas do sistema
    sub_map = load_static_subcategories()
    print(f"Carregadas {len(sub_map)} subcategorias do staticProducts.ts para mapeamento.")
    
    # 2. Lista e ordena as imagens físicas na pasta para consistência determinística
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
        # Quebra o nome do arquivo usando a regra exata do usuário
        p_name, p_brand, p_subs = parse_filename(f_name)
        
        # Ajusta a capitalização padrão
        p_name_capitalized = p_name[0].upper() + p_name[1:] if p_name else ""
        p_brand_capitalized = p_brand[0].upper() + p_brand[1:] if p_brand else ""
        
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
                # 2. Busca aproximada tolerante a acentos e pequenas grafias
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
            
        # Monta o objeto final do produto
        product_obj = {
            "id": p_id,
            "name": p_name_capitalized,
            "image": f"/produtos/{f_name}",
            "imageUrl": f"/produtos/{f_name}",
            "category": p_category,
            "subcategory": p_subcategory,
            "brand": p_brand_capitalized,
            "description": "Produto de alta qualidade para sua empresa ou residência. Fornecido pela LEVER.",
            "isActive": True,
            "isFeatured": True, # Ativa destaque padrão para popular a home se necessário
            "badges": ["Destaque"] if p_brand_capitalized else [],
            "specs": []
        }
        
        products.append(product_obj)
        
    print(f"\nProdutos gerados com sucesso: {len(products)}")
    
    if unmapped_subcategories:
        print(f"\nAVISO: As seguintes {len(unmapped_subcategories)} subcategorias extraídas das imagens não foram encontradas no sistema:")
        for s in sorted(unmapped_subcategories):
            print(f"  * '{s}'")
            
    # 3. Grava de volta o catálogo de produtos products.ts
    json_formatted = json.dumps(products, indent=4, ensure_ascii=False)
    
    ts_final_content = (
        "// Arquivo gerado AUTOMATICAMENTE do zero varrendo as fotos físicas na pasta public/produtos\n"
        f"// Total de produtos catalogados: {len(products)}\n\n"
        "import type { Product } from '../types';\n\n"
        f"export const staticProducts: Product[] = {json_formatted};\n"
    )
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(ts_final_content)
        
    print(f"\nCatálogo '{ts_file_path}' sincronizado com sucesso!")

if __name__ == "__main__":
    sync_catalog_by_images()
