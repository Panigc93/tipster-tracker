import * as XLSX from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import type { Pick, UserFollow, Tipster } from '@/shared/types';

/**
 * Genera un archivo Excel vacío con la estructura del template de picks
 * Compatible con el template existente del usuario
 */
export const generateEmptyTemplate = (): void => {
  const workbook: WorkBook = XLSX.utils.book_new();

  // Sheet 1: Realizadas (PRIMERA HOJA)
  const realizadasSheet = createRealizadasSheet();
  XLSX.utils.book_append_sheet(workbook, realizadasSheet, 'Realizadas');

  // Sheet 2: Lanzadas Tipster
  const lanzadasSheet = createLanzadasTipsterSheet();
  XLSX.utils.book_append_sheet(workbook, lanzadasSheet, 'Lanzadas Tipster');

  // Sheet 3: Mis_Picks_Dashboard
  const misDashboard = createMisPicksDashboardSheet();
  XLSX.utils.book_append_sheet(workbook, misDashboard, 'Mis_Picks_Dashboard');

  // Sheet 4: Tipster_Picks_Dashboard
  const tipsterDashboard = createTipsterPicksDashboardSheet();
  XLSX.utils.book_append_sheet(workbook, tipsterDashboard, 'Tipster_Picks_Dashboard');

  // Sheet 5: Base datos
  const baseDatos = createBaseDatosSheet();
  XLSX.utils.book_append_sheet(workbook, baseDatos, 'Base datos');

  // Sheet 6: Instrucciones (NUEVA)
  const instrucciones = createInstruccionesSheet();
  XLSX.utils.book_append_sheet(workbook, instrucciones, '📖 INSTRUCCIONES');

  // Generar archivo
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `tipster-tracker-template-${timestamp}.xlsx`;
  XLSX.writeFile(workbook, filename);
};

/**
 * Crea el sheet "Lanzadas Tipster" con estructura vacía
 */
function createLanzadasTipsterSheet(): WorkSheet {
  // Estructura de filas según template
  const data: Array<Array<string | number>> = [
    // Fila 1: Headers de stats
    ['', '✅', '❌', '🔵', 'UDS.', 'Beneficio', 'Yield Global', 'Bank Actual', 'Bank Inicial', 'Apostado'],
    
    // Fila 2: Fórmulas de stats (se añadirán después)
    ['#DIV/0!', 0, 0, 0, 0, 0, '#DIV/0!', 10000, 10000, 0],
    
    // Fila 3: Plantilla/Instrucciones
    ['      PLANTILLA EII', '', '', '', '', 'rellenar con los picks que lanza el tipster'],
    
    // Fila 4-5: Vacías
    [],
    [],
    
    // Fila 6: Headers de columnas de entrada (19 columnas A-S)
    [
      'LIVE-PRE',          // A
      'TIPSTER',           // B
      'STAKE',             // C
      'CUOTA',             // D
      'W/L/V',             // E
      'Resultado unidades',// F
      'CANTIDAD',          // G
      'Resultado euros',   // H
      'FECHA PICK',        // I
      'HORA PICK',         // J
      'FECHA PARTIDO',     // K
      'HORA PARTIDO',      // L
      'APUESTA',           // M (fusionada con N-O)
      '',                  // N (parte de la fusión)
      '',                  // O (parte de la fusión)
      'COMBINADA',         // P
      'DEPORTE',           // Q
      'Plataforma envio pick', // R
      'BOOKIE recomendado',    // S
    ],
  ];

  // Crear sheet desde array
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Añadir fórmulas a la fila 2 (índice 1)
  // Nota: xlsx library usa 'f' minúscula para fórmulas
  
  // A2: Winrate (Ganados / Total resueltos)
  ws['A2'] = { t: 'n', f: 'B2/(B2+C2)', v: 0 };
  
  // B2: Picks ganados (COUNTIF W en columna E)
  ws['B2'] = { t: 'n', f: 'COUNTIF(E7:E1853,"w")', v: 0 };
  
  // C2: Picks perdidos (COUNTIF L en columna E)
  ws['C2'] = { t: 'n', f: 'COUNTIF(E7:E1853,"l")', v: 0 };
  
  // D2: Picks void (COUNTIF V en columna E)
  ws['D2'] = { t: 'n', f: 'COUNTIF(E7:E1853,"V")', v: 0 };
  
  // E2: Total UDS (suma columna F "Resultado unidades")
  ws['E2'] = { t: 'n', f: 'SUM($F$7:$F$1853)', v: 0 };
  
  // F2: Beneficio total (suma columna H "Resultado euros")
  ws['F2'] = { t: 'n', f: 'SUM(H7:H1853)', v: 0 };
  
  // G2: Yield (Beneficio / Apostado) = F2/J2
  ws['G2'] = { t: 'n', f: 'F2/J2', v: 0 };
  
  // H2: Bank Actual (Bank Inicial + Beneficio) = I2+F2
  ws['H2'] = { t: 'n', f: 'I2+F2', v: 0 };
  
  // I2: Bank Inicial (valor fijo)
  ws['I2'] = { t: 'n', v: 10000 };
  
  // J2: Total Apostado (suma columna G "CANTIDAD")
  ws['J2'] = { t: 'n', f: 'SUM($G$7:$G$1853)', v: 0 };

  // Ajustar anchos de columna (opcional)
  // Fusionar celdas M6:O6 para APUESTA
  ws['!merges'] = [{ s: { r: 5, c: 12 }, e: { r: 5, c: 14 } }]; // Fila 6 (índice 5), columnas M-O (índices 12-14)

  // Añadir estilo de fondo azul a la celda fusionada M6:O6 (APUESTA)
  if (!ws['M6'].s) ws['M6'].s = {};
  ws['M6'].s = {
    fill: {
      fgColor: { rgb: '4472C4' }, // Azul Excel estándar
    },
    font: {
      color: { rgb: 'FFFFFF' }, // Texto blanco
      bold: true,
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  };

  ws['!cols'] = [
    { wch: 12 }, // A: LIVE-PRE
    { wch: 15 }, // B: TIPSTER
    { wch: 8 },  // C: STAKE
    { wch: 8 },  // D: CUOTA
    { wch: 8 },  // E: W/L/V
    { wch: 12 }, // F: Resultado unidades
    { wch: 10 }, // G: CANTIDAD
    { wch: 12 }, // H: Resultado euros
    { wch: 12 }, // I: FECHA PICK
    { wch: 10 }, // J: HORA PICK
    { wch: 12 }, // K: FECHA PARTIDO
    { wch: 10 }, // L: HORA PARTIDO
    { wch: 40 }, // M: APUESTA (fusionada con N-O, más ancha)
    { wch: 5 },  // N (parte de fusión)
    { wch: 5 },  // O (parte de fusión)
    { wch: 12 }, // P: COMBINADA
    { wch: 15 }, // Q: DEPORTE
    { wch: 20 }, // R: Plataforma envio pick
    { wch: 18 }, // S: BOOKIE recomendado
  ];

  // ========================================
  // FÓRMULAS EN FILAS DE DATOS (7-10 como plantilla)
  // ========================================
  // El usuario puede copiar estas fórmulas hacia abajo según necesite
  
  const dataRows = [7, 8, 9, 10];
  
  for (const row of dataRows) {
    // F: Resultado unidades
    // Fórmula: =IF(E7="L",-C7,IF(E7="W",C7*(D7-1),IF(E7="HW",(C7/2)*(D7-1),IF(E7="HL",-C7/2,0))))
    ws[`F${row}`] = {
      t: 'n',
      f: `IF(E${row}="L",-C${row},IF(E${row}="W",C${row}*(D${row}-1),IF(E${row}="HW",(C${row}/2)*(D${row}-1),IF(E${row}="HL",-C${row}/2,0))))`,
      v: 0,
    };

    // G: CANTIDAD (con VLOOKUP)
    // Fórmula: =IFERROR(($I$2/VLOOKUP(B7,Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C7,"")
    ws[`G${row}`] = {
      t: 'n',
      f: `IFERROR(($I$2/VLOOKUP(B${row},Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C${row},"")`,
      v: 0,
    };

    // H: Resultado euros
    // Fórmula: =IF(E7="w",G7*D7-G7,IF(E7="L",-G7,0))
    ws[`H${row}`] = {
      t: 'n',
      f: `IF(E${row}="w",G${row}*D${row}-G${row},IF(E${row}="L",-G${row},0))`,
      v: 0,
    };
  }

  return ws;
}

/**
 * Crea el sheet "Realizadas" con estructura vacía
 */
function createRealizadasSheet(): WorkSheet {
  // Similar a Lanzadas Tipster pero con columna de Comentarios (20 columnas A-T)
  const data: Array<Array<string | number>> = [
    // Fila 1: Headers de stats
    ['', '✅', '❌', '🔵', 'UDS.', 'Beneficio', 'Yield Global', 'Bank Actual', 'Bank Inicial', 'Apostado'],
    
    // Fila 2: Fórmulas de stats
    ['#DIV/0!', 0, 0, 0, 0, 0, '#DIV/0!', 10000, 10000, 0],
    
    // Fila 3: Plantilla
    ['      PLANTILLA EII', '', '', '', '', 'rellenar con los picks que sigo'],
    
    // Fila 4-5: Vacías
    [],
    [],
    
    // Fila 6: Headers de columnas de entrada (20 columnas A-T)
    [
      'LIVE-PRE',          // A
      'TIPSTER',           // B
      'STAKE',             // C
      'CUOTA',             // D
      'W/L/V',             // E
      'Resultado unidades',// F
      'CANTIDAD',          // G
      'Resultado euros',   // H
      'FECHA PICK',        // I
      'HORA PICK',         // J
      'FECHA PARTIDO',     // K
      'HORA PARTIDO',      // L
      'APUESTA',           // M (fusionada con N-O)
      '',                  // N (parte de la fusión)
      '',                  // O (parte de la fusión)
      'Comentarios',       // P (única diferencia con Lanzadas Tipster)
      'COMBINADA',         // Q
      'DEPORTE',           // R
      'Plataforma envio pick', // S
      'BOOKIE',            // T (sin "recomendado")
    ],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Fórmulas fila 2 (mismas que Lanzadas Tipster)
  
  // A2: Winrate (Ganados / Total resueltos)
  ws['A2'] = { t: 'n', f: 'B2/(B2+C2)', v: 0 };
  
  // B2: Picks ganados (COUNTIF W en columna E)
  ws['B2'] = { t: 'n', f: 'COUNTIF(E7:E2001,"w")', v: 0 };
  
  // C2: Picks perdidos (COUNTIF L en columna E)
  ws['C2'] = { t: 'n', f: 'COUNTIF(E7:E2001,"l")', v: 0 };
  
  // D2: Picks void (COUNTIF V en columna E)
  ws['D2'] = { t: 'n', f: 'COUNTIF(E7:E2001,"V")', v: 0 };
  
  // E2: Total UDS (suma columna F "Resultado unidades")
  ws['E2'] = { t: 'n', f: 'SUM($F$7:$F$2001)', v: 0 };
  
  // F2: Beneficio total (suma columna H "Resultado euros")
  ws['F2'] = { t: 'n', f: 'SUM(H7:H2001)', v: 0 };
  
  // G2: Yield (Beneficio / Apostado) = F2/J2
  ws['G2'] = { t: 'n', f: 'F2/J2', v: 0 };
  
  // H2: Bank Actual (Bank Inicial + Beneficio) = I2+F2
  ws['H2'] = { t: 'n', f: 'I2+F2', v: 0 };
  
  // I2: Bank Inicial (valor fijo)
  ws['I2'] = { t: 'n', v: 10000 };
  
  // J2: Total Apostado (suma columna G "CANTIDAD")
  ws['J2'] = { t: 'n', f: 'SUM($G$7:$G$2001)', v: 0 };

  // Fusionar celdas M6:O6 para APUESTA
  ws['!merges'] = [{ s: { r: 5, c: 12 }, e: { r: 5, c: 14 } }];

  // Añadir estilo de fondo azul a la celda fusionada M6:O6 (APUESTA)
  if (!ws['M6'].s) ws['M6'].s = {};
  ws['M6'].s = {
    fill: {
      fgColor: { rgb: '4472C4' }, // Azul Excel estándar
    },
    font: {
      color: { rgb: 'FFFFFF' }, // Texto blanco
      bold: true,
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  };

  ws['!cols'] = [
    { wch: 12 }, // A: LIVE-PRE
    { wch: 15 }, // B: TIPSTER
    { wch: 8 },  // C: STAKE
    { wch: 8 },  // D: CUOTA
    { wch: 8 },  // E: W/L/V
    { wch: 12 }, // F: Resultado unidades
    { wch: 10 }, // G: CANTIDAD
    { wch: 12 }, // H: Resultado euros
    { wch: 12 }, // I: FECHA PICK
    { wch: 10 }, // J: HORA PICK
    { wch: 12 }, // K: FECHA PARTIDO
    { wch: 10 }, // L: HORA PARTIDO
    { wch: 40 }, // M: APUESTA (fusionada con N-O)
    { wch: 5 },  // N (parte de fusión)
    { wch: 5 },  // O (parte de fusión)
    { wch: 30 }, // P: Comentarios (más ancho)
    { wch: 12 }, // Q: COMBINADA
    { wch: 15 }, // R: DEPORTE
    { wch: 20 }, // S: Plataforma envio pick
    { wch: 15 }, // T: BOOKIE
  ];

  // ========================================
  // FÓRMULAS EN FILAS DE DATOS (7-10 como plantilla)
  // ========================================
  // El usuario puede copiar estas fórmulas hacia abajo según necesite
  
  const dataRows = [7, 8, 9, 10];
  
  for (const row of dataRows) {
    // F: Resultado unidades
    // Fórmula: =IF(E7="L",-C7,IF(E7="W",C7*(D7-1),IF(E7="HW",(C7/2)*(D7-1),IF(E7="HL",-C7/2,0))))
    ws[`F${row}`] = {
      t: 'n',
      f: `IF(E${row}="L",-C${row},IF(E${row}="W",C${row}*(D${row}-1),IF(E${row}="HW",(C${row}/2)*(D${row}-1),IF(E${row}="HL",-C${row}/2,0))))`,
      v: 0,
    };

    // G: CANTIDAD (con VLOOKUP)
    // Fórmula: =IFERROR(($I$2/VLOOKUP(B7,Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C7,"")
    ws[`G${row}`] = {
      t: 'n',
      f: `IFERROR(($I$2/VLOOKUP(B${row},Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C${row},"")`,
      v: 0,
    };

    // H: Resultado euros
    // Fórmula: =IF(E7="w",G7*D7-G7,IF(E7="L",-G7,0))
    ws[`H${row}`] = {
      t: 'n',
      f: `IF(E${row}="w",G${row}*D${row}-G${row},IF(E${row}="L",-G${row},0))`,
      v: 0,
    };
  }

  return ws;
}

/**
 * Crea el sheet "Mis_Picks_Dashboard" con estructura completa
 * Esta hoja calcula estadísticas de los picks SEGUIDOS por el usuario (hoja Realizadas)
 */
function createMisPicksDashboardSheet(): WorkSheet {
  const data: any[][] = [
    // Fila 1: Títulos principales
    [
      'NECESARIO RELLENAR TIPSTER',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '% Aciertos Segun deporte',
    ],
    
    // Fila 2: Headers de columnas
    [
      'TIPSTER',
      'Juega a Unidades',
      'Benficio UDS',
      'Beneficio',
      'Apostado',
      'YIELD',
      'Tips totales',
      'Tips W',
      'Tips L',
      'Tips V',
      '% Tips Aciertados',
      '% Aciertos Live',
      '% Aciertos PRE',
      'Badminton',
      'Baloncesto',
      'Balonmano',
      'Beisbol',
      'Boxeo',
      'Ciclismo',
      'Esports',
      'Fútbol',
      'Fútbol Americano',
      'Golf',
      'Hockey',
      'MMA',
      'Tenis',
      'Tenis Mesa',
      'Voleibol',
    ],
    
    // Fila 3: Ejemplo con "Manolo" y fórmulas
    ['Manolo', 100], // A3, B3 - se añadirán fórmulas después
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // ========================================
  // FÓRMULAS EN FILA 3 (Ejemplo con Manolo)
  // ========================================
  // Todas las fórmulas referencian la hoja "Realizadas" (picks seguidos por el usuario)
  
  // C3: =SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$F$7:$F$2003)
  ws.C3 = { t: 'n', f: 'SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$F$7:$F$2003)', v: 0 };
  
  // D3: =SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$H$7:$H$2003)
  ws.D3 = { t: 'n', f: 'SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$H$7:$H$2003)', v: 0 };
  
  // E3: =SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$G$7:$G$2003)
  ws.E3 = { t: 'n', f: 'SUMIF(Realizadas!$B$7:$B$2003,A3,Realizadas!$G$7:$G$2003)', v: 0 };
  
  // F3: =IFERROR(D3/E3,"")
  ws.F3 = { t: 'n', f: 'IFERROR(D3/E3,"")', v: 0 };
  
  // G3: =COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"<>")
  ws.G3 = { t: 'n', f: 'COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"<>")', v: 0 };
  
  // H3: =COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"W")
  ws.H3 = { t: 'n', f: 'COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"W")', v: 0 };
  
  // I3: =COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"L")
  ws.I3 = { t: 'n', f: 'COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"L")', v: 0 };
  
  // J3: =COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"V")
  ws.J3 = { t: 'n', f: 'COUNTIFS(Realizadas!$B$7:$B$2003,A3,Realizadas!$E$7:$E$2003,"V")', v: 0 };
  
  // K3: =IFERROR(H3/G3,"")
  ws.K3 = { t: 'n', f: 'IFERROR(H3/G3,"")', v: 0 };
  
  // L3: =IFERROR((COUNTIFS(Realizadas!$B$7:$B$2006,A3,Realizadas!$A$7:$A$2006,"LIVE",Realizadas!$E$7:$E$2006,"W"))/H3,0)
  ws.L3 = { t: 'n', f: 'IFERROR((COUNTIFS(Realizadas!$B$7:$B$2006,A3,Realizadas!$A$7:$A$2006,"LIVE",Realizadas!$E$7:$E$2006,"W"))/H3,0)', v: 0 };
  
  // M3: =IFERROR((COUNTIFS(Realizadas!B7:B2006,A3,Realizadas!A7:A2006,"PRE",Realizadas!$E$7:$E$2006,"W"))/H3,0)
  ws.M3 = { t: 'n', f: 'IFERROR((COUNTIFS(Realizadas!B7:B2006,A3,Realizadas!A7:A2006,"PRE",Realizadas!$E$7:$E$2006,"W"))/H3,0)', v: 0 };
  
  // N3-AC3: Porcentajes por deporte (16 deportes de Base datos)
  // =IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,N$2))/$H3),0)
  ws.N3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,N$2))/$H3),0)', v: 0 };
  ws.O3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,O$2))/$H3),0)', v: 0 };
  ws.P3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,P$2))/$H3),0)', v: 0 };
  ws.Q3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,Q$2))/$H3),0)', v: 0 };
  ws.R3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,R$2))/$H3),0)', v: 0 };
  ws.S3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,S$2))/$H3),0)', v: 0 };
  ws.T3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,T$2))/$H3),0)', v: 0 };
  ws.U3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,U$2))/$H3),0)', v: 0 };
  ws.V3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,V$2))/$H3),0)', v: 0 };
  ws.W3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,W$2))/$H3),0)', v: 0 };
  ws.X3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,X$2))/$H3),0)', v: 0 };
  ws.Y3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,Y$2))/$H3),0)', v: 0 };
  ws.Z3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,Z$2))/$H3),0)', v: 0 };
  ws.AA3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,AA$2))/$H3),0)', v: 0 };
  ws.AB3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,AB$2))/$H3),0)', v: 0 };
  ws.AC3 = { t: 'n', f: 'IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A3,Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,AC$2))/$H3),0)', v: 0 };

  // Anchos de columna
  ws['!cols'] = [
    { wch: 20 }, // A: TIPSTER
    { wch: 15 }, // B: Juega a Unidades
    { wch: 12 }, // C: Benficio UDS
    { wch: 10 }, // D: Beneficio
    { wch: 10 }, // E: Apostado
    { wch: 8 },  // F: YIELD
    { wch: 12 }, // G: Tips totales
    { wch: 8 },  // H: Tips W
    { wch: 8 },  // I: Tips L
    { wch: 8 },  // J: Tips V
    { wch: 16 }, // K: % Tips Aciertados
    { wch: 14 }, // L: % Aciertos Live
    { wch: 14 }, // M: % Aciertos PRE
    { wch: 10 }, // N: Badminton
    { wch: 12 }, // O: Baloncesto
    { wch: 12 }, // P: Balonmano
    { wch: 10 }, // Q: Beisbol
    { wch: 8 },  // R: Boxeo
    { wch: 10 }, // S: Ciclismo
    { wch: 10 }, // T: Esports
    { wch: 10 }, // U: Fútbol
    { wch: 14 }, // V: Fútbol Americano
    { wch: 8 },  // W: Golf
    { wch: 10 }, // X: Hockey
    { wch: 8 },  // Y: MMA
    { wch: 10 }, // Z: Tenis
    { wch: 12 }, // AA: Tenis Mesa
    { wch: 10 }, // AB: Voleibol
  ];

  return ws;
}

/**
 * Crea el sheet "Tipster_Picks_Dashboard" con estructura completa
 * Esta hoja calcula estadísticas de los picks LANZADOS por el tipster (hoja Lanzadas Tipster)
 */
function createTipsterPicksDashboardSheet(): WorkSheet {
  const data: any[][] = [
    // Fila 1: Títulos principales
    [
      'NECESARIO RELLENAR TIPSTER',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '% Aciertos Segun deporte',
    ],
    
    // Fila 2: Headers de columnas
    [
      'TIPSTER',
      'Juega a Unidades',
      'Benficio UDS',
      'Beneficio',
      'Apostado',
      'YIELD',
      'Tips totales',
      'Tips W',
      'Tips L',
      'Tips V',
      '% Tips Aciertados',
      '% Aciertos Live',
      '% Aciertos PRE',
      'Badminton',
      'Baloncesto',
      'Balonmano',
      'Beisbol',
      'Boxeo',
      'Ciclismo',
      'Esports',
      'Fútbol',
      'Fútbol Americano',
      'Golf',
      'Hockey',
      'MMA',
      'Tenis',
      'Tenis Mesa',
      'Voleibol',
    ],
    
    // Fila 3: Ejemplo con "Manolo" y fórmulas
    ['Manolo', 100], // A3, B3 - se añadirán fórmulas después
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // ========================================
  // FÓRMULAS EN FILA 3 (Ejemplo con Manolo)
  // ========================================
  // Todas las fórmulas referencian la hoja "Lanzadas Tipster" (picks lanzados por el tipster)
  
  // C3: =SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$F$7:$F$1855)
  ws.C3 = { t: 'n', f: "SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$F$7:$F$1855)", v: 0 };
  
  // D3: =SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$H$7:$H$1855)
  ws.D3 = { t: 'n', f: "SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$H$7:$H$1855)", v: 0 };
  
  // E3: =SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$G$7:$G$1855)
  ws.E3 = { t: 'n', f: "SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$G$7:$G$1855)", v: 0 };
  
  // F3: =IFERROR(D3/E3,"")
  ws.F3 = { t: 'n', f: 'IFERROR(D3/E3,"")', v: 0 };
  
  // G3: =COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,"<>")
  ws.G3 = { t: 'n', f: "COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,\"<>\")", v: 0 };
  
  // H3: =COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,"W")
  ws.H3 = { t: 'n', f: "COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\")", v: 0 };
  
  // I3: =COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,"L")
  ws.I3 = { t: 'n', f: "COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,\"L\")", v: 0 };
  
  // J3: =COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,"V")
  ws.J3 = { t: 'n', f: "COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$E$7:$E$1855,\"V\")", v: 0 };
  
  // K3: =IFERROR(H3/G3,"")
  ws.K3 = { t: 'n', f: 'IFERROR(H3/G3,"")', v: 0 };
  
  // L3: =IFERROR((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$A$7:$A$1855,"LIVE",'Lanzadas Tipster'!$E$7:$E$1855,"W"))/H3,0)
  ws.L3 = { t: 'n', f: "IFERROR((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A3,'Lanzadas Tipster'!$A$7:$A$1855,\"LIVE\",'Lanzadas Tipster'!$E$7:$E$1855,\"W\"))/H3,0)", v: 0 };
  
  // M3: =IFERROR((COUNTIFS('Lanzadas Tipster'!B7:B1855,A3,'Lanzadas Tipster'!A7:A1855,"PRE",'Lanzadas Tipster'!$E$7:$E$1855,"W"))/H3,0)
  ws.M3 = { t: 'n', f: "IFERROR((COUNTIFS('Lanzadas Tipster'!B7:B1855,A3,'Lanzadas Tipster'!A7:A1855,\"PRE\",'Lanzadas Tipster'!$E$7:$E$1855,\"W\"))/H3,0)", v: 0 };
  
  // N3-AC3: Porcentajes por deporte (16 deportes de Base datos)
  // =IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,"W",'Lanzadas Tipster'!$Q$7:$Q$1855,N$2))/$H3),0)
  ws.N3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,N$2))/$H3),0)", v: 0 };
  ws.O3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,O$2))/$H3),0)", v: 0 };
  ws.P3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,P$2))/$H3),0)", v: 0 };
  ws.Q3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,Q$2))/$H3),0)", v: 0 };
  ws.R3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,R$2))/$H3),0)", v: 0 };
  ws.S3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,S$2))/$H3),0)", v: 0 };
  ws.T3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,T$2))/$H3),0)", v: 0 };
  ws.U3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,U$2))/$H3),0)", v: 0 };
  ws.V3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,V$2))/$H3),0)", v: 0 };
  ws.W3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,W$2))/$H3),0)", v: 0 };
  ws.X3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,X$2))/$H3),0)", v: 0 };
  ws.Y3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,Y$2))/$H3),0)", v: 0 };
  ws.Z3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,Z$2))/$H3),0)", v: 0 };
  ws.AA3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,AA$2))/$H3),0)", v: 0 };
  ws.AB3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,AB$2))/$H3),0)", v: 0 };
  ws.AC3 = { t: 'n', f: "IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A3,'Lanzadas Tipster'!$E$7:$E$1855,\"W\",'Lanzadas Tipster'!$Q$7:$Q$1855,AC$2))/$H3),0)", v: 0 };

  // Anchos de columna (29 columnas A-AC, 16 deportes N-AC)
  ws['!cols'] = [
    { wch: 20 }, // A: TIPSTER
    { wch: 15 }, // B: Juega a Unidades
    { wch: 12 }, // C: Benficio UDS
    { wch: 10 }, // D: Beneficio
    { wch: 10 }, // E: Apostado
    { wch: 8 },  // F: YIELD
    { wch: 12 }, // G: Tips totales
    { wch: 8 },  // H: Tips W
    { wch: 8 },  // I: Tips L
    { wch: 8 },  // J: Tips V
    { wch: 16 }, // K: % Tips Aciertados
    { wch: 14 }, // L: % Aciertos Live
    { wch: 14 }, // M: % Aciertos PRE
    { wch: 10 }, // N: Badminton
    { wch: 12 }, // O: Baloncesto
    { wch: 12 }, // P: Balonmano
    { wch: 10 }, // Q: Beisbol
    { wch: 8 },  // R: Boxeo
    { wch: 10 }, // S: Ciclismo
    { wch: 10 }, // T: Esports
    { wch: 10 }, // U: Fútbol
    { wch: 14 }, // V: Fútbol Americano
    { wch: 8 },  // W: Golf
    { wch: 10 }, // X: Hockey
    { wch: 8 },  // Y: MMA
    { wch: 10 }, // Z: Tenis
    { wch: 12 }, // AA: Tenis Mesa
    { wch: 10 }, // AB: Voleibol
  ];

  return ws;
}

/**
 * Crea el sheet "Base datos" con datos de referencia
 */
function createBaseDatosSheet(): WorkSheet {
  const data: any[][] = [
    // Fila 1: Headers
    [
      'BOOKIES',
      '',
      'Plataformas de Pick/Tipsters',
      '',
      'DEPORTE',
      '',
      'LIVE-PRE',
      '',
      'COMBINADA',
    ],
    
    // Datos de ejemplo (se pueden cargar dinámicamente)
    ['888', '', 'Blogabet', '', 'Badminton', '', 'PRE', '', 'Si'],
    ['1xBet', '', 'Telegram', '', 'Baloncesto', '', 'LIVE', '', 'No'],
    ['Bet365', '', 'TipsterLand', '', 'Balonmano', '', '', '', 'Sí'],
    ['Betfail', '', '', '', 'Beisbol', '', '', '', ''],
    ['Betfair', '', '', '', 'Boxeo', '', '', '', ''],
    ['Betsson', '', '', '', 'Ciclismo', '', '', '', ''],
    ['Bwin', '', '', '', 'Esports', '', '', '', ''],
    ['Codere', '', '', '', 'Fútbol', '', '', '', ''],
    ['Luckia', '', '', '', 'Fútbol Americano', '', '', '', ''],
    ['Marathonbet', '', '', '', 'Golf', '', '', '', ''],
    ['Sportium', '', '', '', 'Hockey', '', '', '', ''],
    ['Winamax', '', '', '', 'MMA', '', '', '', ''],
    ['William Hill', '', '', '', 'Tenis', '', '', '', ''],
    ['', '', '', '', 'Tenis Mesa', '', '', '', ''],
    ['', '', '', '', 'Voleibol', '', '', '', ''],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  ws['!cols'] = [
    { wch: 20 }, // A: BOOKIES
    { wch: 2 },  // B: vacía
    { wch: 30 }, // C: Plataformas
    { wch: 2 },  // D: vacía
    { wch: 20 }, // E: DEPORTE
    { wch: 2 },  // F: vacía
    { wch: 12 }, // G: LIVE-PRE
    { wch: 2 },  // H: vacía
    { wch: 12 }, // I: COMBINADA
  ];

  return ws;
}

/**
 * Crea el sheet "📖 INSTRUCCIONES" con guía de uso
 */
function createInstruccionesSheet(): WorkSheet {
  const data: Array<Array<string | number>> = [
    // Título
    ['📖 CÓMO USAR ESTE EXCEL - TIPSTER TRACKER'],
    [''],
    
    // Sección 1: Agregar nuevo tipster
    ['🎯 PASO 1: AGREGAR UN NUEVO TIPSTER'],
    [''],
    ['Para que un tipster aparezca en los dropdowns, PRIMERO debes añadirlo en el dashboard correspondiente:'],
    [''],
    ['1. Ve a la hoja "Mis_Picks_Dashboard" (para picks que TÚ seguiste)'],
    ['   O ve a "Tipster_Picks_Dashboard" (para picks que lanzó el tipster)'],
    [''],
    ['2. Escribe el NOMBRE DEL TIPSTER en la columna A, en cualquier fila vacía (ej: A4, A5, A6...)'],
    ['   Ejemplo: "JOHN", "María Picks", "ProTipster", etc.'],
    [''],
    ['3. ¡LISTO! Ese tipster ahora aparecerá automáticamente en los dropdowns'],
    [''],
    ['4. Las fórmulas calcularán las estadísticas automáticamente cuando registres picks'],
    [''],
    [''],
    
    // Sección 2: Registrar picks
    ['📝 PASO 2: REGISTRAR PICKS'],
    [''],
    ['PARA PICKS QUE TÚ SEGUISTE (Realizadas):'],
    ['1. Ve a la hoja "Realizadas"'],
    ['2. En la fila 7 (o siguiente vacía), selecciona el TIPSTER del dropdown en columna B'],
    ['3. Completa el resto de datos: deporte, odds, stake, resultado, etc.'],
    ['4. Las estadísticas en "Mis_Picks_Dashboard" se actualizarán automáticamente'],
    [''],
    ['PARA PICKS QUE LANZÓ EL TIPSTER (Lanzadas Tipster):'],
    ['1. Ve a la hoja "Lanzadas Tipster"'],
    ['2. En la fila 7 (o siguiente vacía), selecciona el TIPSTER del dropdown en columna B'],
    ['3. Completa el resto de datos'],
    ['4. Las estadísticas en "Tipster_Picks_Dashboard" se actualizarán automáticamente'],
    [''],
    [''],
    
    // Sección 3: Dashboards
    ['📊 ENTENDER LOS DASHBOARDS'],
    [''],
    ['"Mis_Picks_Dashboard":'],
    ['  - Muestra TUS estadísticas al seguir picks de tipsters'],
    ['  - Fuente de datos: hoja "Realizadas"'],
    ['  - Usa este para ver tu rendimiento personal'],
    [''],
    ['"Tipster_Picks_Dashboard":'],
    ['  - Muestra las estadísticas de las picks que LANZA cada tipster'],
    ['  - Fuente de datos: hoja "Lanzadas Tipster"'],
    ['  - Usa este para comparar el rendimiento real del tipster'],
    [''],
    [''],
    
    // Sección 4: Dropdowns
    ['🔽 DROPDOWNS AUTOMÁTICOS'],
    [''],
    ['Los dropdowns en "Realizadas" y "Lanzadas Tipster" se alimentan de los dashboards:'],
    [''],
    ['  • Dropdown TIPSTER en "Realizadas" → Lista de "Mis_Picks_Dashboard" columna A'],
    ['  • Dropdown TIPSTER en "Lanzadas Tipster" → Lista de "Tipster_Picks_Dashboard" columna A'],
    ['  • Otros dropdowns → Hoja "Base datos" (deportes, bookies, etc.)'],
    [''],
    [''],
    
    // Sección 5: Tips
    ['💡 TIPS Y CONSEJOS'],
    [''],
    ['✅ Siempre añade el tipster en el dashboard ANTES de registrar picks'],
    ['✅ Puedes tener el mismo tipster en ambos dashboards (si lo sigues Y también registras sus lanzamientos)'],
    ['✅ Las fórmulas están protegidas en filas 4-100 de los dashboards'],
    ['✅ Solo edita la columna A (TIPSTER) en los dashboards, las demás columnas se calculan solas'],
    ['✅ Si ves #DIV/0! es normal cuando no hay datos aún'],
    [''],
    [''],
    
    // Sección 6: Ejemplo práctico
    ['📚 EJEMPLO PRÁCTICO'],
    [''],
    ['Quieres seguir picks de un tipster llamado "JOHN":'],
    [''],
    ['1. Ve a "Mis_Picks_Dashboard" → Escribe "JOHN" en celda A4'],
    ['2. Ve a "Realizadas" → Columna B (TIPSTER) → Ahora verás "JOHN" en el dropdown'],
    ['3. Selecciona "JOHN" y completa los datos de la pick'],
    ['4. Vuelve a "Mis_Picks_Dashboard" → Verás las estadísticas de JOHN calculadas'],
    [''],
    ['¡Así de simple!'],
    [''],
    [''],
    
    // Footer
    ['═══════════════════════════════════════════════════════════════'],
    ['Tipster Tracker v1.0 - Gestión profesional de picks y tipsters'],
    ['═══════════════════════════════════════════════════════════════'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(data);

  // Anchos de columna
  ws['!cols'] = [
    { wch: 100 }, // A: Texto instrucciones
  ];

  return ws;
}

/**
 * Exporta picks y follows a Excel con estructura completa
 * Genera nombre de archivo con fecha actual
 */
export const exportPicksToExcel = (
  picks: Pick[] = [],
  follows: UserFollow[] = [],
  tipsters: Tipster[] = []
): void => {
  console.log('📊 Exportando datos a Excel...');
  console.log(`  - Picks: ${picks.length}`);
  console.log(`  - Follows: ${follows.length}`);
  console.log(`  - Tipsters: ${tipsters.length}`);

  // Generar fecha para nombre de archivo
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `tipster-tracker-export-${dateStr}.xlsx`;

  // Por ahora generamos el template vacío
  // TODO: En siguiente iteración, poblar con datos reales
  generateEmptyTemplate();

  console.log(`✅ Archivo generado: ${filename}`);
  console.log('⚠️  Nota: Datos reales pendientes de implementar');
  console.log('   El archivo actual es un template vacío');
};

// Auto-ejecutar cuando se llama directamente con tsx
if (process.argv[1]?.endsWith('excelExport.ts')) {
  console.log('🚀 Generando template Excel...');
  generateEmptyTemplate();
  console.log('✅ Template generado');
}
