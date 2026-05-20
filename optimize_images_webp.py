import os
import re
from PIL import Image

def optimize_to_webp(directory):
    converted_files = {}
    print("Iniciando varredura de imagens...")
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')) and not file.lower().endswith('.webp'):
                old_path = os.path.join(root, file)
                # Ignore temporários ou arquivos em locais indesejados
                if "node_modules" in old_path or ".git" in old_path:
                    continue
                
                size = os.path.getsize(old_path)
                try:
                    # Determinando novo caminho
                    base_name, ext = os.path.splitext(file)
                    new_filename = base_name + ".webp"
                    new_path = os.path.join(root, new_filename)
                    
                    print(f"Processando: {file} ({(size/1024):.1f} KB)")
                    
                    with Image.open(old_path) as img:
                        # Redimensiona se for maior que 1200px
                        if img.width > 1200 or img.height > 1200:
                            img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                        
                        # Salva como WebP mantendo canal alfa se necessário
                        if img.mode in ("RGBA", "P"):
                            img.save(new_path, 'WEBP', quality=80)
                        else:
                            img = img.convert("RGB")
                            img.save(new_path, 'WEBP', quality=80)
                    
                    new_size = os.path.getsize(new_path)
                    reduction = (1 - (new_size / size)) * 100
                    print(f"  -> Convertido para WebP: {new_filename} ({(new_size/1024):.1f} KB) [-{reduction:.1f}%]")
                    
                    # Guarda mapeamento para atualizar no código depois
                    # Usamos caminhos relativos à pasta public para dar match perfeito
                    rel_old = os.path.relpath(old_path, directory).replace("\\", "/")
                    rel_new = os.path.relpath(new_path, directory).replace("\\", "/")
                    converted_files[rel_old] = rel_new
                    
                    # Remove o original pesado para limpar o git
                    os.remove(old_path)
                    
                except Exception as e:
                    print(f"  [ERRO] Falha ao processar {file}: {e}")
                    
    return converted_files

def update_codebase_references(src_directory, mapping):
    print("\nAtualizando referências no código-fonte...")
    
    # Adicionamos mapeamentos sem a barra inicial e com a barra inicial para ser super robusto
    full_mapping = {}
    for old, new in mapping.items():
        # Ex: "logo-lever.png" -> "logo-lever.webp"
        full_mapping[old] = new
        full_mapping["/" + old] = "/" + new
        
        # Também mapeamos apenas extensões se houver caminhos dinâmicos
        # Mas mapear os caminhos exatos é mais seguro para não quebrar urls externas (como Pexels)
    
    # Extensões válidas de arquivos para alterar
    code_extensions = ('.tsx', '.ts', '.css', '.html', '.js')
    
    count = 0
    for root, dirs, files in os.walk(src_directory):
        for file in files:
            if file.lower().endswith(code_extensions):
                file_path = os.path.join(root, file)
                
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                original_content = content
                
                # Substitui referências exatas de arquivos mapeados
                for old_ref, new_ref in full_mapping.items():
                    if old_ref in content:
                        print(f"  Substituindo '{old_ref}' -> '{new_ref}' em {file}")
                        content = content.replace(old_ref, new_ref)
                
                # Salva se alterado
                if content != original_content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(content)
                    count += 1
                    
    print(f"Referências atualizadas em {count} arquivos de código!")

if __name__ == '__main__':
    project_root = r"c:\Users\guilh\Documents\codigos\lever\segunda tentativa"
    public_dir = os.path.join(project_root, "public")
    src_dir = os.path.join(project_root, "src")
    
    # 1. Converte imagens e apaga originais
    mapping = optimize_to_webp(public_dir)
    
    # 2. Atualiza os links no código .tsx, .css etc.
    if mapping:
        update_codebase_references(src_dir, mapping)
        print("\nProcesso de otimização de imagens WebP finalizado com sucesso!")
    else:
        print("\nNenhuma imagem precisou ser convertida.")
