import json, uuid, re
with open('exportarIII..last.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("import { NOMBRE_BB_DD } from '../utils/constantes'", "")
text = text.replace('import { NOMBRE_BB_DD } from "../utils/constantes"', "")
text = text.replace('export const datos=', '')

text = text.replace('NOMBRE_BB_DD', '"mundosano"')
text = text.strip().rstrip(';')

try:
    data = json.loads(text)
except Exception as e:
    # Try ast just in case it has trailing commas
    import ast
    data = ast.literal_eval(text)

for table in data.get('tables', []):
    if 'values' in table:
        schema_length = len(table.get('schema', []))
        for row in table['values']:
            while len(row) < schema_length:
                row.append(str(uuid.uuid4()))

new_json_str = json.dumps(data, indent=4)
new_json_str = new_json_str.replace('"mundosano"', 'NOMBRE_BB_DD')

final_content = 'import { NOMBRE_BB_DD } from "../utils/constantes";\n\nexport const datos=' + new_json_str + ';'

with open('exportarIII..last.js', 'w', encoding='utf-8') as f:
    f.write(final_content)
print('Done!')
