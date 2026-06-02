import json
import re
import os
import unicodedata
import difflib

def normalize_string(s):
    """Normalize string: remove acentos, minúsculo, apenas caracteres alfanuméricos."""
    s = s.lower().strip()
    # Remove acentos e normaliza para formato decomposto
    s = "".join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    # Substitui caracteres não alfanuméricos por espaço
    s = re.sub(r'[^a-z0-9]', ' ', s)
    # Remove espaços múltiplos
    s = " ".join(s.split())
    return s

def fix_image_paths():
    ts_file_path = os.path.join("src", "data", "products.ts")
    public_produtos_dir = os.path.join("public", "produtos")
    
    if not os.path.exists(ts_file_path):
        print(f"Erro: O arquivo '{ts_file_path}' não existe.")
        return
        
    if not os.path.exists(public_produtos_dir):
        print(f"Erro: O diretório '{public_produtos_dir}' não existe.")
        return
        
    # Lista arquivos físicos
    physical_files = os.listdir(public_produtos_dir)
    print(f"Total de imagens físicas encontradas: {len(physical_files)}")
    
    # Cria mapeamentos normlizados
    normalized_physical_files = {}
    for f in physical_files:
        norm_name = normalize_string(os.path.splitext(f)[0])
        if norm_name:
            # Associa a string normalizada ao nome físico real do arquivo
            normalized_physical_files[norm_name] = f
            
    # Lê os produtos
    with open(ts_file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    match = re.search(r"export\s+const\s+staticProducts:\s+Product\[\]\s*=\s*(\[[\s\S]*\]);?", content)
    if not match:
        print("Erro: Array staticProducts não encontrado no arquivo TS.")
        return
        
    json_data_str = match.group(1)
    if json_data_str.endswith(';'):
        json_data_str = json_data_str[:-1]
        
    products = json.loads(json_data_str)
    
    corrected_count = 0
    not_found_list = []
    
    for p in products:
        p_id = p.get("id")
        p_name = p.get("name")
        image_path = p.get("image") or p.get("imageUrl")
        
        if not image_path:
            continue
            
        file_name = os.path.basename(image_path)
        
        # 1. Verifica se já existe de forma exata (case-sensitive)
        if file_name in physical_files:
            continue
            
        # 2. Tenta busca case-insensitive direta
        found = False
        for f in physical_files:
            if f.lower() == file_name.lower():
                p["image"] = f"/produtos/{f}"
                p["imageUrl"] = f"/produtos/{f}"
                corrected_count += 1
                found = True
                break
        if found:
            continue
            
        # 3. Tenta busca normalizada (sem acentos e caracteres especiais)
        norm_file_name = normalize_string(os.path.splitext(file_name)[0])
        if norm_file_name in normalized_physical_files:
            real_file = normalized_physical_files[norm_file_name]
            p["image"] = f"/produtos/{real_file}"
            p["imageUrl"] = f"/produtos/{real_file}"
            corrected_count += 1
            continue
            
        # 4. Tenta buscar por proximidade usando o nome do produto ou nome do arquivo
        norm_p_name = normalize_string(p_name)
        
        # Encontra o arquivo físico mais próximo usando difflib
        best_match = None
        highest_ratio = 0.0
        
        for norm_f, real_f in normalized_physical_files.items():
            # Testa similaridade com o nome do produto ou com o nome do arquivo
            ratio1 = difflib.SequenceMatcher(None, norm_p_name, norm_f).ratio()
            ratio2 = difflib.SequenceMatcher(None, norm_file_name, norm_f).ratio()
            ratio = max(ratio1, ratio2)
            
            if ratio > highest_ratio:
                highest_ratio = ratio
                best_match = real_f
                
        # Define um limite alto de similaridade (80%) para evitar associações erradas
        if highest_ratio >= 0.75 and best_match:
            p["image"] = f"/produtos/{best_match}"
            p["imageUrl"] = f"/produtos/{best_match}"
            print(f"Corrigido por similaridade ({highest_ratio:.2f}): '[{p_id}] {p_name}' -> '{best_match}'")
            corrected_count += 1
        else:
            not_found_list.append((p_id, p_name, image_path, best_match, highest_ratio))
            
    print(f"\nTotal de caminhos corrigidos automaticamente: {corrected_count}")
    
    if not_found_list:
        print(f"\nProdutos cujas imagens não foram encontradas ({len(not_found_list)}):")
        for pid, name, path, best, ratio in not_found_list:
            match_info = f" (Mais parecido no disco: '{best}' com {ratio:.2f} de similaridade)" if best else " (Nenhum arquivo parecido)"
            print(f" - [{pid}] {name}\n   Caminho atual no código: '{path}'{match_info}")
            
    # Escreve o TS final com os caminhos corrigidos
    json_formatted = json.dumps(products, indent=4, ensure_ascii=False)
    
    ts_final_content = (
        "// Arquivo gerado automaticamente pelo script utilitario de atualizacao de catalogo\n"
        f"// Total de produtos catalogados: {len(products)}\n\n"
        "import type { Product } from '../types';\n\n"
        f"export const staticProducts: Product[] = {json_formatted};\n"
    )
    
    with open(ts_file_path, "w", encoding="utf-8") as f:
        f.write(ts_final_content)
        
    print(f"\nCatálogo atualizado com caminhos de imagem corrigidos no arquivo '{ts_file_path}'!")

if __name__ == "__main__":
    fix_image_paths()
