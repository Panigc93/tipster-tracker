#!/usr/bin/env node
/**
 * 🧪 TEST: Verificar que xlsx escribe fórmulas correctamente
 * 
 * Crea un Excel simple con fórmulas y verifica que se escriban.
 */

const XLSX = require('xlsx');
const path = require('path');

console.log('🧪 TEST: Verificando escritura de fórmulas con xlsx');
console.log('='.repeat(60));

// Crear workbook
const wb = XLSX.utils.book_new();

// Crear datos con diferentes formatos de fórmulas
const data = [
    ['Nombre', 'Valor 1', 'Valor 2', 'Suma', 'Promedio'],
    ['Item A', 10, 20, { f: 'B2+C2' }, { f: 'AVERAGE(B2:C2)' }],
    ['Item B', 15, 25, { f: 'B3+C3' }, { f: 'AVERAGE(B3:C3)' }],
    ['TOTAL', { f: 'SUM(B2:B3)' }, { f: 'SUM(C2:C3)' }, { f: 'SUM(D2:D3)' }, { f: 'AVERAGE(E2:E3)' }]
];

// Convertir a worksheet
const ws = XLSX.utils.aoa_to_sheet(data);

// Agregar al workbook
XLSX.utils.book_append_sheet(wb, ws, 'Test');

// Guardar
const filepath = path.join(__dirname, 'test-formulas.xlsx');
XLSX.writeFile(wb, filepath);

console.log('✅ Archivo creado:', filepath);
console.log('');
console.log('📝 Contenido esperado:');
console.log('  D2: =B2+C2  (debe ser fórmula, no valor)');
console.log('  E2: =AVERAGE(B2:C2)');
console.log('  B4: =SUM(B2:B3)');
console.log('');
console.log('🔍 Abre el archivo en Excel/LibreOffice y verifica:');
console.log('  1. Las celdas D2, E2, D3, E3 deben mostrar resultados calculados');
console.log('  2. Al hacer click en D2, la barra de fórmulas debe mostrar "=B2+C2"');
console.log('  3. Si cambias B2 o C2, D2 debe actualizarse automáticamente');
console.log('');
console.log('Si ves valores estáticos en lugar de fórmulas, entonces hay un problema con xlsx.');
