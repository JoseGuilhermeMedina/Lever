import json
import re
import csv
import os

def load_subcategories_map():
    ts_static_path = os.path.join("src", "data", "staticProducts.ts")
    if not os.path.exists(ts_static_path):
        # Fallback manual em caso de falha de leitura
        return {}
        
    with open(ts_static_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Regex robusta para capturar id e name das subcategorias no TS
    matches = re.findall(r"id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"]", content)
    
    # Mapeia ID -> Nome Amigável (ex: 'limpeza-5' -> 'Baldes')
    return {p_id: p_name for p_id, p_name in matches}

def export_readable_csv():
    # 1. Carrega mapeamento de subcategorias
    sub_map = load_subcategories_map()
    print(f"Mapeadas {len(sub_map)} subcategorias amigáveis do sistema.")
    
    ts_file_path = os.path.join("src", "data", "products.ts")
    csv_file_path = "produtos_para_subcategoria_nova.csv"
    
    # 2. Carrega produtos
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", content)
    if not match:
        print("Erro ao ler banco de produtos.")
        return
        
    json_data_str = match.group(1)
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    products = json.loads(json_data_str)
    
    # Colunas da planilha
    headers = [
        "ID",
        "Nome do Produto",
        "Categoria",
        "Subcategoria 1 (Digite o nome)",
        "Subcategoria 2 (Digite o nome, opcional)"
    ]
    
    # 3. Grava o CSV com codificação do Excel no Windows (utf-8-sig) e delimitador ';'
    print(f"Escrevendo arquivo CSV legível em {csv_file_path}...")
    with open(csv_file_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(headers)
        
        for p in products:
            p_id = p.get("id", "")
            p_name = p.get("name", "")
            p_cat = p.get("category", "")
            
            # Pega as subcategorias atuais (que podem ser string ou array)
            raw_sub = p.get("subcategory", "")
            subs = []
            if isinstance(raw_sub, list):
                subs = raw_sub
            elif raw_sub:
                subs = [raw_sub]
                
            # Traduz os IDs de subcategoria para nomes legíveis
            sub_names = []
            for s in subs:
                sub_names.append(sub_map.get(s, s)) # Fallback para o próprio ID se não achar
                
            # Garante que temos pelo menos duas colunas
            while len(sub_names) < 2:
                sub_names.append("")
                
            writer.writerow([
                p_id,
                p_name,
                p_cat,
                sub_names[0],
                sub_names[1]
            ])
            
    print("Planilha legível gerada com sucesso!")
    
    # 4. Imprime lista de subcategorias para referência rápida
    print("\nLista de Subcategorias Válidas para você usar na planilha:")
    for cat_name, items in group_subcategories_by_cat(sub_map).items():
        print(f"\n--- {cat_name.upper()} ---")
        for item in items:
            print(f"  * {item}")

def group_subcategories_by_cat(sub_map):
    # Agrupa apenas para exibição amigável
    grouped = {
        "limpeza": [],
        "descartaveis": [],
        "copa": [],
        "promocoes": []
    }
    for sub_id, name in sub_map.items():
        prefix = sub_id.split("-")[0]
        if prefix in grouped:
            grouped[prefix].append(name)
    return grouped

if __name__ == "__main__":
    export_readable_csv()
