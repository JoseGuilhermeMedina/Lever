import os
from rembg import remove
from PIL import Image

input_dir = 'public/images/produtos em destaque'
output_dir = 'public/images/produtos em destaque/nobg'

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

for filename in os.listdir(input_dir):
    if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        input_path = os.path.join(input_dir, filename)
        output_filename = os.path.splitext(filename)[0] + '.png'
        output_path = os.path.join(output_dir, output_filename)
        
        print(f"Processando: {filename}")
        try:
            with open(input_path, 'rb') as i:
                with open(output_path, 'wb') as o:
                    input_data = i.read()
                    output_data = remove(input_data)
                    o.write(output_data)
            print(f"Sucesso: {output_filename}")
        except Exception as e:
            print(f"Erro em {filename}: {e}")

print("Concluído!")
