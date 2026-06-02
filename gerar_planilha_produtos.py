import json
import re
import csv
import os

def export_products_to_csv():
    ts_file_path = os.path.join("src", "data", "products.ts")
    csv_file_path = "produtos_para_subcategoria.csv"
    
    print(f"Lendo dados de {ts_file_path}...")
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Remove o cabeçalho TypeScript e deixa apenas o conteúdo JSON
    # Procura pelo início do array [ e o fim ]
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", content)
    if not match:
        print("Erro: Não foi possível encontrar a declaração do array staticProducts no arquivo TS.")
        return
        
    json_data_str = match.group(1)
    
    # Caso haja vírgulas extras ou pontos-e-vírgula no final
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    try:
        products = json.loads(json_data_str)
    except Exception as e:
        print(f"Erro ao parsear JSON: {e}")
        # Tenta uma limpeza mais agressiva se falhar
        return
        
    print(f"Total de produtos encontrados: {len(products)}")
    
    # Colunas da planilha
    headers = [
        "ID",
        "Nome do Produto",
        "Categoria Atual",
        "Subcategoria Atual",
        "Nova Subcategoria (Preencher aqui)"
    ]
    
    # Gravando em formato CSV compatível com Excel em português (delimitador ';' e codificação utf-8-sig)
    print(f"Escrevendo arquivo CSV em {csv_file_path}...")
    with open(csv_file_path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.writer(f, delimiter=";")
        writer.writerow(headers)
        
        for p in products:
            writer.writerow([
                p.get("id", ""),
                p.get("name", ""),
                p.get("category", ""),
                p.get("subcategory", ""),
                "" # Nova subcategoria vazia para o cliente preencher
            ])
            
    print("Planilha gerada com sucesso! Você pode abrir o arquivo 'produtos_para_subcategoria.csv' no Excel.")

if __name__ == "__main__":
    export_products_to_csv()
