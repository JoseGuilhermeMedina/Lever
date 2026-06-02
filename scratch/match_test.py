import os
import re
import unicodedata
import zipfile
import xml.etree.ElementTree as ET

def normalize_string(s):
    s = s.lower().strip()
    s = "".join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9]', ' ', s)
    return " ".join(s.split())

def extract_docx_text(docx_path):
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            root = ET.fromstring(xml_content)
            for p in root.findall('.//w:p', ns):
                texts = []
                for t in p.findall('.//w:t', ns):
                    if t.text:
                        texts.append(t.text)
                paragraphs.append("".join(texts) if texts else "")
    except Exception as e:
        print(f"Erro: {e}")
        return []
    return paragraphs

def parse_docx_content(docx_path):
    paragraphs = extract_docx_text(docx_path)
    products = []
    current_product = None
    current_section = None
    
    name_pattern = re.compile(r'^Nome do produto:\s*(.*)', re.IGNORECASE)
    important_pattern = re.compile(r'^(Informação importante|Informaço importante):\s*(.*)', re.IGNORECASE)
    description_pattern = re.compile(r'^(Descrição|Descriço):\s*(.*)', re.IGNORECASE)
    
    for line in paragraphs:
        line_str = line.strip()
        if not line_str:
            if current_product and current_section:
                if current_section == 'important':
                    current_product['important_raw'].append("")
                elif current_section == 'description':
                    current_product['description_raw'].append("")
            continue
            
        name_match = name_pattern.match(line_str)
        if name_match:
            if current_product:
                products.append(current_product)
            current_product = {
                "raw_name": name_match.group(1).strip(),
                "important_raw": [],
                "description_raw": []
            }
            current_section = None
            continue
            
        if not current_product:
            continue
            
        important_match = important_pattern.match(line_str)
        if important_match:
            current_section = 'important'
            text = important_match.group(2).strip()
            if text:
                current_product['important_raw'].append(text)
            continue
            
        description_match = description_pattern.match(line_str)
        if description_match:
            current_section = 'description'
            text = description_match.group(2).strip()
            if text:
                current_product['description_raw'].append(text)
            continue
            
        if current_section == 'important':
            current_product['important_raw'].append(line_str)
        elif current_section == 'description':
            current_product['description_raw'].append(line_str)
            
    if current_product:
        products.append(current_product)
        
    for p in products:
        p['important'] = clean_multiline_text(p['important_raw'])
        p['description'] = clean_multiline_text(p['description_raw'])
        
    return products

def clean_multiline_text(lines):
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
    result = []
    last_was_empty = False
    for l in lines:
        if not l:
            if not last_was_empty:
                result.append("")
                last_was_empty = True
        else:
            result.append(l)
            last_was_empty = False
    return "\n".join(result)

def test_match():
    docx_products = parse_docx_content("produtos e descrições.docx")
    
    # Imagens físicas
    public_produtos_dir = os.path.join("public", "produtos")
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    image_files = [f for f in os.listdir(public_produtos_dir) if os.path.splitext(f)[1].lower() in allowed_extensions]
    
    image_map = {normalize_string(os.path.splitext(f)[0]): f for f in image_files}
    
    print("Testando Casamento:")
    matched = 0
    for p in docx_products:
        norm_name = normalize_string(p["raw_name"])
        if norm_name in image_map:
            matched += 1
            print(f"[OK] Casou: '{p['raw_name']}' -> '{image_map[norm_name]}'")
        else:
            # Tenta busca flexível por substring
            found = False
            for k, f in image_map.items():
                if norm_name in k or k in norm_name:
                    matched += 1
                    print(f"[FLEX] Casou flexivel: '{p['raw_name']}' -> '{f}'")
                    found = True
                    break
            if not found:
                print(f"[ERROR] Nao casou: '{p['raw_name']}'")
                
    print(f"\nTotal: {matched}/{len(docx_products)} casaram.")

if __name__ == "__main__":
    test_match()
