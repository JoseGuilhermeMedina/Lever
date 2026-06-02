import json
import re
import csv
import os
import unicodedata
import difflib

def normalize_string(s):
    """Normaliza string para comparação tolerante a acentos e caracteres especiais."""
    s = s.lower().strip()
    s = "".join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9]', ' ', s)
    return " ".join(s.split())

def load_subcategories_map():
    ts_static_path = os.path.join("src", "data", "staticProducts.ts")
    if not os.path.exists(ts_static_path):
        return {}
        
    with open(ts_static_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Regex robusta para capturar id e name das subcategorias
    matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]", content)
    
    # Retorna o dicionário ID -> Nome
    return {p_id: p_name for p_id, p_name in matches}

def load_csv(path):
    encodings = ["utf-8-sig", "utf-8", "cp1252", "latin1"]
    for enc in encodings:
        try:
            with open(path, "r", encoding=enc) as f:
                content = f.read()
            return content, enc
        except UnicodeDecodeError:
            continue
    raise Exception("Não foi possível decodificar o arquivo CSV com nenhum encoding conhecido.")

def update_catalog():
    csv_file_path = "produtos_para_subcategoria_nova.csv"
    ts_file_path = os.path.join("src", "data", "products.ts")
    
    if not os.path.exists(csv_file_path):
        print(f"Erro: O arquivo '{csv_file_path}' não foi encontrado.")
        return
        
    # 1. Carrega subcategorias e cria mapa normalizado
    sub_map = load_subcategories_map()
    normalized_sub_map = {}
    for sub_id, sub_name in sub_map.items():
        norm_name = normalize_string(sub_name)
        if norm_name:
            normalized_sub_map[norm_name] = sub_id
            
    print(f"Carregadas {len(sub_map)} subcategorias do sistema.")
    
    # 2. Carrega o CSV resiliente
    content, encoding = load_csv(csv_file_path)
    print(f"CSV lido com sucesso usando a codificação: {encoding}")
    
    lines = content.strip().split("\n")
    if not lines:
        print("Erro: O arquivo CSV está vazio.")
        return
        
    header = lines[0]
    if "\t" in header:
        delimiter = "\t"
    elif ";" in header:
        delimiter = ";"
    else:
        delimiter = ","
        
    print(f"Delimitador detectado: {repr(delimiter)}")
    
    reader = csv.reader(lines, delimiter=delimiter)
    header_row = next(reader)
    
    # Mapeia colunas de forma insensível e sem colisão de substrings
    col_indices = {}
    for i, col in enumerate(header_row):
        col_clean = col.lower().strip()
        if "id" in col_clean:
            col_indices["id"] = i
        elif "subcategoria 1" in col_clean or "sub1" in col_clean:
            col_indices["sub1"] = i
        elif "subcategoria 2" in col_clean or "sub2" in col_clean:
            col_indices["sub2"] = i
        elif ("nome" in col_clean or "produto" in col_clean) and "subcategoria" not in col_clean:
            col_indices["name"] = i
            
    print(f"Mapeamento de colunas corrigido: {col_indices}")
    
    if "id" not in col_indices or "name" not in col_indices:
        print("Erro: Colunas fundamentais não mapeadas.")
        return
        
    # 3. Lê atualizações da planilha
    updates = {}
    unmapped_subs = set()
    
    for r_idx, row in enumerate(reader):
        if not row:
            continue
            
        required_len = max(col_indices.values()) + 1
        if len(row) < required_len:
            row = row + [""] * (required_len - len(row))
            
        p_id = row[col_indices["id"]].strip()
        p_name = row[col_indices["name"]].strip()
        
        if not p_id:
            continue
            
        # Nomes legíveis digitados pelo usuário
        readable_sub1 = row[col_indices["sub1"]].strip() if "sub1" in col_indices else ""
        readable_sub2 = row[col_indices["sub2"]].strip() if "sub2" in col_indices else ""
        
        # Converte os nomes legíveis para os IDs técnicos
        subs_ids = []
        for raw_sub in [readable_sub1, readable_sub2]:
            if not raw_sub:
                continue
                
            norm_raw = normalize_string(raw_sub)
            
            # Busca exata normalizada
            if norm_raw in normalized_sub_map:
                subs_ids.append(normalized_sub_map[norm_raw])
            else:
                # Busca por aproximação
                closest = difflib.get_close_matches(norm_raw, list(normalized_sub_map.keys()), n=1, cutoff=0.7)
                if closest:
                    matched_id = normalized_sub_map[closest[0]]
                    subs_ids.append(matched_id)
                    print(f"Aviso de aproximação: Digitado '{raw_sub}' -> Mapeado para '{sub_map[matched_id]}'")
                else:
                    unmapped_subs.add(raw_sub)
                    print(f"Alerta: Não foi possível mapear a subcategoria '{raw_sub}' para nenhum item válido.")
                    
        updates[p_id] = {
            "name": p_name,
            "subcategories": subs_ids
        }
        
    if unmapped_subs:
        print(f"\nAVISO: As seguintes {len(unmapped_subs)} subcategorias digitadas não foram reconhecidas e foram ignoradas:")
        for s in sorted(unmapped_subs):
            print(f" - '{s}'")
            
    # 4. Lê o products.ts original
    with open(ts_file_path, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", ts_content)
    if not match:
        print("Erro: Array staticProducts não encontrado.")
        return
        
    json_data_str = match.group(1)
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    products = json.loads(json_data_str)
    
    # 5. Atualiza os produtos
    updated_count = 0
    name_changed_count = 0
    
    for p in products:
        p_id = p.get("id")
        if p_id in updates:
            up_data = updates[p_id]
            
            # Atualiza nome
            old_name = p.get("name", "")
            new_name = up_data["name"]
            if old_name != new_name:
                p["name"] = new_name
                name_changed_count += 1
                
            # Atualiza subcategorias
            new_subs = up_data["subcategories"]
            if len(new_subs) == 0:
                p["subcategory"] = ""
            elif len(new_subs) == 1:
                p["subcategory"] = new_subs[0]
            else:
                p["subcategory"] = new_subs
                
            updated_count += 1
            
    print(f"\nAtualizados no catálogo: {updated_count} produtos.")
    print(f"Alterações de nome aplicadas: {name_changed_count}")
    
    # 6. Grava de volta o arquivo
    json_formatted = json.dumps(products, indent=4, ensure_ascii=False)
    
    ts_final_content = (
        "// Arquivo gerado automaticamente pelo script utilitario de atualizacao de catalogo por nomes por extenso\n"
        f"// Total de produtos catalogados: {len(products)}\n\n"
        "import type { Product } from '../types';\n\n"
        f"export const staticProducts: Product[] = {json_formatted};\n"
    )
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(ts_final_content)
        
    print(f"\nCatálogo '{ts_file_path}' atualizado com total sucesso conforme a planilha!")

if __name__ == "__main__":
    update_catalog()
