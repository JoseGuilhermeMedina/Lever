import zipfile
import re
import xml.etree.ElementTree as ET

def extract_docx_text(docx_path):
    # Namespace do Word XML
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    
    paragraphs = []
    try:
        with zipfile.ZipFile(docx_path) as docx:
            # Lê o conteúdo principal do documento
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            
            # Percorre todos os parágrafos (<w:p>)
            for p in root.findall('.//w:p', ns):
                texts = []
                # Percorre todos os textos (<w:t>) dentro do parágrafo
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        texts.append(t.text)
                if texts:
                    paragraphs.append("".join(texts))
                else:
                    paragraphs.append("") # Linha em branco
    except Exception as e:
        print(f"Erro ao ler DOCX: {e}")
        return []
        
    return paragraphs

def main():
    docx_path = "produtos e descrições.docx"
    paragraphs = extract_docx_text(docx_path)
    
    print(f"Total de parágrafos extraídos: {len(paragraphs)}")
    print("\n--- Primeiros 50 parágrafos extraídos ---")
    for i, p in enumerate(paragraphs[:50]):
        print(f"{i+1}: {repr(p)}")
        
    # Salva em um arquivo TXT para visualização se for longo
    with open("saida_docx.txt", "w", encoding="utf-8") as f:
        for p in paragraphs:
            f.write(p + "\n")
            
    print("\nArquivo 'saida_docx.txt' gerado com todo o texto extraído.")

if __name__ == "__main__":
    main()
