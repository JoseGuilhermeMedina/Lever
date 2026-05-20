import os
from PIL import Image

def optimize_images(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                path = os.path.join(root, file)
                size = os.path.getsize(path)
                if size > 300 * 1024:  # Maior que 300KB
                    try:
                        print(f"Otimizando: {path} ({(size/1024/1024):.2f} MB)")
                        with Image.open(path) as img:
                            # Redimensiona se for grande
                            if img.width > 1200 or img.height > 1200:
                                img.thumbnail((1200, 1200), Image.Resampling.LANCZOS)
                            
                            # Se for PNG muito pesado, para uso web sem fundo a compressão pode ajudar
                            if file.lower().endswith('.png'):
                                # Converte para RGBA se não for
                                img = img.convert("RGBA")
                                img.save(path, 'PNG', optimize=True)
                            else:
                                if img.mode in ("RGBA", "P"):
                                    img = img.convert("RGB")
                                img.save(path, 'JPEG', quality=80, optimize=True)
                        new_size = os.path.getsize(path)
                        print(f"  -> Novo tamanho: {(new_size/1024/1024):.2f} MB")
                    except Exception as e:
                        print(f"Erro em {path}: {e}")

if __name__ == '__main__':
    print("Iniciando otimização de imagens...")
    optimize_images(r"c:\Users\guilh\Documents\codigos\lever\segunda tentativa\public")
    print("Otimização concluída!")
