const fs = require('fs');

try {
    let code = fs.readFileSync('exportarIII..last.js', 'utf8');
    
    code = code.replace(/import\s+\{\s*NOMBRE_BB_DD\s*\}\s*from\s+['"\\]\.\.\/utils\/constantes['"\\]/g, "const NOMBRE_BB_DD = 'mundosano';");
    code = code.replace(/export\s+const\s+datos\s*=/g, 'module.exports = ');
    
    fs.writeFileSync('temp_schema.js', code);
    
    const datos = require('./temp_schema.js');
    
    const dynamicTables = [
        "personas", "usuarios", "controles", "control_embarazo", "inmunizaciones_control", "laboratorios_realizados",
        "ubicaciones", "antecedentes", "antecedentes_apps", "antecedentes_macs", "etmis_personas", "paises", "areas", "parajes"
    ];
    
    // Inject UUID into missing values for constant tables
    const crypto = require('crypto');
    if (datos.tables) {
        for (let t of datos.tables) {
            if (dynamicTables.includes(t.name)) {
                delete t.values;
            } else {
                // Pad missing uuids for offline tables
                if (t.values && t.schema) {
                    const schemaCols = t.schema.filter(s => s.column).length;
                    t.values.forEach(row => {
                        while (row.length < schemaCols) {
                            row.push(crypto.randomUUID());
                        }
                    });
                }
            }
        }
    }
    
    const outPath = 'c:/Users/Gustavo/OneDrive/Documentos/Ionic/MundoSanoBack/src/main/resources/schema.json';
    fs.writeFileSync(outPath, JSON.stringify(datos, null, 2));
    
    console.log('Schema extracted successfully to ' + outPath);
} catch (err) {
    console.error(err);
}
