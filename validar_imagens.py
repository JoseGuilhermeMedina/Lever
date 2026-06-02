import json
import re
import os

def check_images_consistency():
    ts_file_path = os.path.join("src", "data", "products.ts")
    public_produtos_dir = os.path.join("public", "produtos")
    
    if not os.path.exists(ts_file_path):
        print(f"Erro: O arquivo '{ts_file_path}' não existe.")
        return
        
    if not os.path.exists(public_produtos_dir):
        print(f"Erro: O diretório '{public_produtos_dir}' não existe.")
        return
        
    # Lista todos os arquivos físicos na pasta public/produtos (em minúsculas para busca fácil)
    physical_files = os.listdir(public_produtos_dir)
    physical_files_lower = {f.lower(): f for f in physical_files}
    
    print(f"Total de imagens físicas encontradas em '{public_produtos_dir}': {len(physical_files)}")
    
    # Carrega os produtos do TS
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", content)
    if not match:
        print("Erro: Não foi possível ler o array staticProducts no arquivo TS.")
        return
        
    json_data_str = match.group(1)
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    products = json.loads(json_data_str)
    
    # Contadores e listas de erros
    missing_image_field = []
    file_not_found = []
    
    for p in products:
        p_id = p.get("id")
        p_name = p.get("name")
        image_path = p.get("image") or p.get("imageUrl")
        
        if not image_path:
            missing_image_field.append((p_id, p_name))
            continue
            
        # Extrai o nome do arquivo da URL (ex: /produtos/Adoçante.jpeg -> Adoçante.jpeg)
        file_name = os.path.basename(image_path)
        
        # Verifica se o arquivo existe fisicamente
        if file_name.lower() not in physical_files_lower:
            # Tenta encontrar arquivos semelhantes (sem extensão ou com extensão diferente)
            base_name, _ = os.path.splitext(file_name.lower())
            suggestions = []
            for f_low in physical_files_lower:
                f_base, _ = os.path.splitext(f_low)
                if f_base == base_name:
                    suggestions.append(physical_files_lower[f_low])
                    
            file_not_found.append({
                "id": p_id,
                "name": p_name,
                "declared_path": image_path,
                "file_name": file_name,
                "suggestions": suggestions
            })
            
    print("\n" + "="*50)
    print("RELATÓRIO DE CONSISTÊNCIA DE IMAGENS")
    print("="*50)
    print(f"Total de produtos analisados: {len(products)}")
    
    print(f"\n1. Produtos sem o campo de imagem declarado: {len(missing_image_field)}")
    for pid, name in missing_image_field[:15]:
        print(f"   - [{pid}] {name}")
    if len(missing_image_field) > 15:
        print(f"   ... e outros {len(missing_image_field) - 15} produtos.")
        
    print(f"\n2. Produtos com arquivo de imagem não encontrado fisicamente: {len(file_not_found)}")
    for item in file_not_found[:15]:
        sug_str = f" (Sugestão encontrada: '{item['suggestions'][0]}')" if item["suggestions"] else " (Nenhuma sugestão com o mesmo nome na pasta)"
        print(f"   - [{item['id']}] {item['name']}\n     Caminho no código: '{item['declared_path']}'{sug_str}")
    if len(file_not_found) > 15:
        print(f"   ... e outros {len(file_not_found) - 15} produtos.")
        
    print("="*50)
    
    # Retorna uma lista de dados de erro para o agente interagir se necessário
    return len(missing_image_field), len(file_not_found), file_not_found

if __name__ == "__main__":
    check_images_consistency()
