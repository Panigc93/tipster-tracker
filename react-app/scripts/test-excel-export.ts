/**
 * Script temporal para generar un Excel vacío de prueba
 * Ejecutar con: npx tsx scripts/test-excel-export.ts
 */

import { generateEmptyTemplate } from '../src/shared/utils/excelExport';

console.log('🚀 Generando template Excel vacío...');

try {
  generateEmptyTemplate();
  console.log('✅ Archivo generado exitosamente!');
  console.log('📁 Busca el archivo: tipster-tracker-template-YYYY-MM-DD.xlsx en la raíz del proyecto');
} catch (error) {
  console.error('❌ Error al generar archivo:', error);
  process.exit(1);
}
