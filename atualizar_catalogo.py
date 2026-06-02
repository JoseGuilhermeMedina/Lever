import json
import re
import csv
import os

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
    csv_file_path = "produtos_para_subcategoria.csv"
    ts_file_path = os.path.join("src", "data", "products.ts")
    
    if not os.path.exists(csv_file_path):
        print(f"Erro: O arquivo '{csv_file_path}' não foi encontrado.")
        return
        
    # Carrega o CSV de forma resiliente
    content, encoding = load_csv(csv_file_path)
    print(f"CSV lido com sucesso usando a codificação: {encoding}")
    
    # Auto-detecta o delimitador do CSV
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
    
    # Faz o parse das linhas
    reader = csv.reader(lines, delimiter=delimiter)
    header_row = next(reader)
    
    # Mapeia os índices das colunas de forma insensível a maiúsculas/minúsculas e acentos
    col_indices = {}
    for i, col in enumerate(header_row):
        col_clean = col.lower().strip()
        if "id" in col_clean:
            col_indices["id"] = i
        elif "nome" in col_clean or "produto" in col_clean:
            col_indices["name"] = i
        elif "subcategoria 1" in col_clean or "subcategoria1" in col_clean:
            col_indices["sub1"] = i
        elif "subcategoria 2" in col_clean or "subcategoria2" in col_clean:
            col_indices["sub2"] = i
            
    print(f"Mapeamento de colunas detectado no CSV: {col_indices}")
    
    if "id" not in col_indices or "name" not in col_indices:
        print("Erro: Chaves fundamentais 'ID' ou 'Nome do Produto' não foram mapeadas na planilha.")
        return
        
    # Dicionário de atualizações da planilha
    updates = {}
    for r_idx, row in enumerate(reader):
        if not row:
            continue
        
        # Trata linhas menores do que o necessário
        required_len = max(col_indices.values()) + 1
        if len(row) < required_len:
            # Completa a linha com vazios
            row = row + [""] * (required_len - len(row))
            
        p_id = row[col_indices["id"]].strip()
        p_name = row[col_indices["name"]].strip()
        
        if not p_id:
            continue
            
        sub1 = row[col_indices["sub1"]].strip() if "sub1" in col_indices else ""
        sub2 = row[col_indices["sub2"]].strip() if "sub2" in col_indices else ""
        
        subs = []
        if sub1:
            subs.append(sub1)
        if sub2:
            subs.append(sub2)
            
        updates[p_id] = {
            "name": p_name,
            "subcategories": subs
        }
        
    print(f"Carregados {len(updates)} produtos do CSV para processamento.")
    
    # Lê o products.ts original
    with open(ts_file_path, "r", encoding="utf-8") as f:
        ts_content = f.read()
        
    # Extrai o array JSON
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", ts_content)
    if not match:
        print("Erro: Não foi possível encontrar o array staticProducts no arquivo TS.")
        return
        
    json_data_str = match.group(1)
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    products = json.loads(json_data_str)
    
    # Atualiza os produtos
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
                
            # Atualiza subcategoria
            new_subs = up_data["subcategories"]
            
            if len(new_subs) == 0:
                p["subcategory"] = ""
            elif len(new_subs) == 1:
                p["subcategory"] = new_subs[0]
            else:
                p["subcategory"] = new_subs
                
            updated_count += 1
            
    print(f"Atualizados no catálogo: {updated_count} produtos.")
    print(f"Alterações de nome de produtos: {name_changed_count}")
    
    # Formata em JSON
    json_formatted = json.dumps(products, indent=4, ensure_ascii=False)
    
    # Escreve o arquivo TS final
    ts_final_content = (
        "// Arquivo gerado automaticamente pelo script utilitario de atualizacao de catalogo\n"
        f"// Total de produtos catalogados: {len(products)}\n\n"
        "import type { Product } from '../types';\n\n"
        f"export const staticProducts: Product[] = {json_formatted};\n"
    )
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(ts_final_content)
        
    print(f"Catálogo '{ts_file_path}' atualizado com total sucesso!")

if __name__ == "__main__":
    update_catalog()
