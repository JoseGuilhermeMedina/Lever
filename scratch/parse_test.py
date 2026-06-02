import re

def parse_docx_content():
    with open("saida_docx.txt", "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    products = []
    current_product = None
    current_section = None # 'important', 'description'
    
    # Regexes para identificar início das seções
    name_pattern = re.compile(r'^Nome do produto:\s*(.*)', re.IGNORECASE)
    important_pattern = re.compile(r'^(Informação importante|Informaço importante):\s*(.*)', re.IGNORECASE)
    description_pattern = re.compile(r'^(Descrição|Descriço):\s*(.*)', re.IGNORECASE)
    
    for line in lines:
        line_str = line.strip()
        
        # Ignora linhas em branco no início ou separa blocos
        if not line_str:
            if current_product and current_section:
                # Adiciona quebra de linha nas seções acumuladas se necessário
                if current_section == 'important':
                    current_product['important_raw'].append("")
                elif current_section == 'description':
                    current_product['description_raw'].append("")
            continue
            
        # Detecta início de um produto
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
            
        # Detecta seção "Informação importante"
        important_match = important_pattern.match(line_str)
        if important_match:
            current_section = 'important'
            text = important_match.group(2).strip()
            if text:
                current_product['important_raw'].append(text)
            continue
            
        # Detecta seção "Descrição"
        description_match = description_pattern.match(line_str)
        if description_match:
            current_section = 'description'
            text = description_match.group(2).strip()
            if text:
                current_product['description_raw'].append(text)
            continue
            
        # Acumula texto na seção ativa
        if current_section == 'important':
            current_product['important_raw'].append(line_str)
        elif current_section == 'description':
            current_product['description_raw'].append(line_str)
            
    # Adiciona o último produto
    if current_product:
        products.append(current_product)
        
    # Limpa linhas vazias extras e junta os blocos de texto
    for p in products:
        # Junta a informação importante
        important_lines = [l for l in p['important_raw']]
        # Limpa linhas em branco consecutivas e nas pontas
        p['important'] = clean_multiline_text(important_lines)
        
        # Junta a descrição
        description_lines = [l for l in p['description_raw']]
        p['description'] = clean_multiline_text(description_lines)
        
    return products

def clean_multiline_text(lines):
    # Remove linhas vazias iniciais e finais
    while lines and not lines[0]:
        lines.pop(0)
    while lines and not lines[-1]:
        lines.pop()
        
    # Agrupa e reconstrói as quebras de linha preservando a estrutura
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

def main():
    parsed = parse_docx_content()
    print(f"Total de produtos parseados: {len(parsed)}")
    
    # Imprime os 3 primeiros para teste
    for i, p in enumerate(parsed[:3]):
        print(f"\n[{i+1}] PRODUTO: {repr(p['raw_name'])}")
        print(f"  INFO IMPORTANTE:\n{p['important']}")
        print(f"  DESCRIÇÃO:\n{p['description']}")
        print("-" * 50)

if __name__ == "__main__":
    main()
