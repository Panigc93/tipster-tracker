/**
 * 🚀 TIPSTER TRACKER - EXCEL EXPORT BACKEND
 * 
 * Express server que recibe datos del frontend, genera Excel con xlsx,
 * aplica estilos con Python (openpyxl), y retorna el archivo completo.
 * 
 * ENDPOINTS:
 * - POST /api/export-excel
 *   Body: { picks: Pick[], follows: UserFollow[], tipsters: Tipster[] }
 *   Response: Excel file download
 * 
 * FLUJO:
 * 1. Recibir datos JSON del frontend
 * 2. Generar estructura Excel con xlsx (Node.js)
 * 3. Poblar datos en las hojas
 * 4. Ejecutar Python para aplicar estilos
 * 5. Retornar archivo completo para descarga
 */

const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.PORT || 3001;

// 📝 Configuración
const TEMP_DIR = path.join(__dirname, 'temp');
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR);
}

// 🔧 Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Permitir JSON grandes

// 🏥 Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'excel-export-backend' });
});

// 📊 ENDPOINT PRINCIPAL: Exportar Excel
app.post('/api/export-excel', async (req, res) => {
    console.log('📥 [REQUEST] Recibida petición de export');

    const { picks = [], follows = [], tipsters = [] } = req.body;

    console.log(`📊 [DATA] Picks: ${picks.length}, Follows: ${follows.length}, Tipsters: ${tipsters.length}`);

    // Generar nombre de archivo único
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `tipster-tracker-export-${timestamp}-${Date.now()}.xlsx`;
    const filepath = path.join(TEMP_DIR, filename);

    try {
        // PASO 1: Generar Excel con estructura básica
        console.log('🔨 [STEP 1] Generando estructura Excel...');
        const workbook = generateExcelStructure(picks, follows, tipsters);

        // PASO 2: Escribir archivo temporal
        console.log('💾 [STEP 2] Escribiendo archivo temporal...');
        XLSX.writeFile(workbook, filepath);

        // PASO 3: Aplicar estilos con Python
        console.log('🎨 [STEP 3] Aplicando estilos con Python...');
        await applyPythonStyles(filepath);

        // PASO 4: Enviar archivo
        console.log('✅ [STEP 4] Enviando archivo al cliente...');
        res.download(filepath, `tipster-tracker-export-${timestamp}.xlsx`, (err) => {
            // Limpiar archivo temporal después de enviar
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
                console.log('🗑️  [CLEANUP] Archivo temporal eliminado');
            }

            if (err) {
                console.error('❌ [ERROR] Error enviando archivo:', err);
            } else {
                console.log('✅ [SUCCESS] Export completado correctamente');
            }
        });

    } catch (error) {
        console.error('❌ [ERROR] Error en export:', error);
        res.status(500).json({
            error: 'Error generando Excel',
            details: error.message
        });

        // Limpiar en caso de error
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
});

/**
 * 🔨 Generar estructura Excel con datos
 * 
 * Crea el workbook con 5 hojas (exactas del EXCEL-V12-FINAL.xlsx):
 * 1. Realizadas (follows del usuario)
 * 2. Lanzadas Tipster (picks originales)
 * 3. Mis_Picks_Dashboard (stats de mis follows por tipster)
 * 4. Tipster_Picks_Dashboard (stats de picks originales por tipster)
 * 5. Base datos (listas para dropdowns)
 */
function generateExcelStructure(picks, follows, tipsters) {
    const wb = XLSX.utils.book_new();

    // 1. HOJA: Realizadas (follows del usuario)
    console.log('📝 [SHEET 1] Generando Realizadas...');
    const realizadasSheet = generateRealizadasSheet(follows, picks, tipsters);
    XLSX.utils.book_append_sheet(wb, realizadasSheet, 'Realizadas');

    // 2. HOJA: Lanzadas Tipster (picks originales)
    console.log('📝 [SHEET 2] Generando Lanzadas Tipster...');
    const lanzadasSheet = generateLanzadasSheet(picks, tipsters);
    XLSX.utils.book_append_sheet(wb, lanzadasSheet, 'Lanzadas Tipster');

    // 3. HOJA: Mis_Picks_Dashboard (stats de follows)
    console.log('📝 [SHEET 3] Generando Mis_Picks_Dashboard...');
    const misPicksDash = generateMisPicksDashboard(follows, picks, tipsters);
    XLSX.utils.book_append_sheet(wb, misPicksDash, 'Mis_Picks_Dashboard');

    // 4. HOJA: Tipster_Picks_Dashboard (stats de picks)
    console.log('📝 [SHEET 4] Generando Tipster_Picks_Dashboard...');
    const tipsterPicksDash = generateTipsterPicksDashboard(picks, tipsters);
    XLSX.utils.book_append_sheet(wb, tipsterPicksDash, 'Tipster_Picks_Dashboard');

    // 5. HOJA: Base datos (listas para dropdowns)
    console.log('📝 [SHEET 5] Generando Base datos...');
    const baseDatosSheet = generateBaseDatosSheet();
    XLSX.utils.book_append_sheet(wb, baseDatosSheet, 'Base datos');

    console.log('✅ [STRUCTURE] Excel creado con 5 hojas y datos poblados');

    return wb;
}

/**
 * 📊 Generar hoja "Lanzadas Tipster"
 * 
 * ESTRUCTURA EXACTA del EXCEL-V12-FINAL.xlsx:
 * - Filas 1-2: Estadísticas globales (Python las rellenará)
 * - Filas 3-5: Instrucciones/plantilla (Python las rellenará)
 * - Fila 6: Headers
 * - Fila 7+: Datos de picks
 * 
 * COLUMNAS (A-S, 19 columnas):
 * A: LIVE-PRE | B: TIPSTER | C: STAKE | D: CUOTA | E: W/L/V |
 * F: Resultado unidades | G: CANTIDAD | H: Resultado euros |
 * I: FECHA PICK | J: HORA PICK | K: FECHA PARTIDO | L: HORA PARTIDO |
 * M: APUESTA | N-O: (vacías) | P: COMBINADA | Q: DEPORTE |
 * R: Plataforma envio pick | S: BOOKIE recomendado
 */
function generateLanzadasSheet(picks, tipsters) {
    // Crear mapa de tipsters para lookup rápido
    const tipstersMap = {};
    for (const t of tipsters) {
        tipstersMap[t.id] = t.name;
    }

    // ESTRUCTURA: 19 columnas (A-S)
    const data = [];

    // FILA 1 (índice 0): Labels de estadísticas
    data.push([
        '',           // A (vacía, contiene fórmula winrate en fila 2)
        '✅',         // B: Ganadas
        '❌',         // C: Perdidas
        '🔵',         // D: Voids
        'UDS.',       // E: Unidades
        'Beneficio',  // F: Beneficio
        'Yield Global', // G: Yield
        'Bank Actual',  // H: Bank actual
        'Bank Inicial', // I: Bank inicial
        'Apostado',     // J: Total apostado
        '', '', '', '', '', '', '', '', '' // K-S vacías
    ]);

    // FILA 2 (índice 1): Fórmulas (xlsx library acepta objetos con propiedad 'f')
    data.push([
        { f: 'B2/(B2+C2)' },              // A: Winrate
        { f: 'COUNTIF(E7:E1853,"w")' },   // B: Count ganadas
        { f: 'COUNTIF(E7:E1853,"l")' },   // C: Count perdidas
        { f: 'COUNTIF(E7:E1853,"V")' },   // D: Count voids
        { f: 'SUM($F$7:$F$1853)' },       // E: Sum unidades
        { f: 'SUM(H7:H1853)' },           // F: Sum beneficio euros
        { f: 'F2/J2' },                   // G: Yield
        { f: 'I2+F2' },                   // H: Bank actual
        10000,                            // I: Bank inicial (valor fijo)
        { f: 'SUM($G$7:$G$1853)' },       // J: Total apostado
        '', '', '', '', '', '', '', '', '' // K-S vacías
    ]);

    // FILA 3 (índice 2): Instrucciones (texto en A y F, resto vacío)
    const row3 = new Array(19).fill('');
    row3[0] = 'PLANTILLA EII';           // A3: Texto merged A3:E5
    row3[5] = 'Rellenar con los picks que lanza el tipster'; // F3: Texto merged F3:S5
    data.push(row3);

    // FILAS 4-5 (índices 3-4): Vacías (forman parte de merged cells)
    data.push(new Array(19).fill(''));
    data.push(new Array(19).fill(''));

    // FILA 6 (índice 5): Headers EXACTOS
    data.push([
        'LIVE-PRE',                // A
        'TIPSTER',                 // B
        'STAKE',                   // C
        'CUOTA',                   // D
        'W/L/V',                   // E
        'Resultado unidades',      // F (Python calculará)
        'CANTIDAD',                // G (Python calculará)
        'Resultado euros',         // H (Python calculará)
        'FECHA PICK',              // I
        'HORA PICK',               // J
        'FECHA PARTIDO',           // K
        'HORA PARTIDO',            // L
        'APUESTA',                 // M
        '',                        // N (vacía)
        '',                        // O (vacía)
        'COMBINADA',               // P
        'DEPORTE',                 // Q
        'Plataforma envio pick',   // R
        'BOOKIE recomendado'       // S
    ]);

    // Filas 7+ (índice 6+): Datos de picks
    for (let i = 0; i < picks.length; i++) {
        const pick = picks[i];
        const tipsterName = tipstersMap[pick.tipsterId] || pick.tipsterId;
        const rowNum = i + 7; // Excel row number (starts at 7)

        // Determinar si es combinada
        const isCombinada = (pick.pickType || '').toLowerCase().includes('combin') ? 'SÍ' : 'NO';

        // Mapear resultado a formato Excel: Ganada→W, Perdida→L, Void→V, Pendiente→vacío
        let resultExcel = '';
        const resultLower = (pick.result || '').toLowerCase();
        if (resultLower === 'ganada' || resultLower === 'won' || resultLower === 'win') {
            resultExcel = 'W';
        } else if (resultLower === 'perdida' || resultLower === 'lost' || resultLower === 'lose') {
            resultExcel = 'L';
        } else if (resultLower === 'void' || resultLower === 'v') {
            resultExcel = 'V';
        }
        // Si es 'pendiente' o cualquier otro valor, queda vacío

        data.push([
            pick.pickType || '',       // A: LIVE-PRE (o COMBINADO)
            tipsterName,               // B: TIPSTER
            pick.stake || '',          // C: STAKE (unidades)
            pick.odds || '',           // D: CUOTA
            resultExcel,               // E: W/L/V
            // F: Resultado unidades (fórmula)
            { f: `IF(E${rowNum}="L",-C${rowNum},IF(E${rowNum}="W",C${rowNum}*(D${rowNum}-1),IF(E${rowNum}="HW",(C${rowNum}/2)*(D${rowNum}-1),IF(E${rowNum}="HL",-C${rowNum}/2,0))))` },
            // G: CANTIDAD (fórmula con VLOOKUP al dashboard)
            { f: `IFERROR(($I$2/VLOOKUP(B${rowNum},Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C${rowNum},"")` },
            // H: Resultado euros (fórmula)
            { f: `IF(E${rowNum}="w",G${rowNum}*D${rowNum}-G${rowNum},IF(E${rowNum}="L",-G${rowNum},0))` },
            pick.date || '',           // I: FECHA PICK
            pick.time || '',           // J: HORA PICK
            pick.date || '',           // K: FECHA PARTIDO (mismo que pick por ahora)
            pick.time || '',           // L: HORA PARTIDO (mismo que pick por ahora)
            pick.betType || '',        // M: APUESTA (tipo de apuesta)
            '',                        // N: (vacía)
            '',                        // O: (vacía)
            isCombinada,               // P: COMBINADA (SÍ/NO)
            pick.sport || '',          // Q: DEPORTE
            'App',                     // R: Plataforma envio pick (fijo "App")
            pick.bookmaker || ''       // S: BOOKIE recomendado
        ]);
    }

    console.log(`   ✓ Lanzadas: ${picks.length} picks (desde fila 7)`);

    return XLSX.utils.aoa_to_sheet(data);
}/**
 * 📊 Generar hoja "Realizadas"
 * 
 * ESTRUCTURA:
 * - Filas 1-2: Estadísticas globales (Python las rellenará)
 * - Filas 3-5: Instrucciones/plantilla (Python las rellenará)
 * - Fila 6: Headers
 * - Fila 7+: Datos de follows
 * 
 * Columnas: A:LIVE/PRE | B:TIPSTER | C:Stake | D:Cuota | E:Resultado | 
 *           F:Beneficio | G:UDS Apostadas | H:Beneficio Real | I:Bank Inicial |
 *           J:Apostado | K:Fecha | L:Hora | M:Partido | N:Apuesta | O:Bookie |
 *           P:Liga | Q:Deporte | R:Comentarios | S:Match/Diverge | T:Profit Tipster
 */
function generateRealizadasSheet(follows, picks, tipsters) {
    // Crear mapas para lookup
    const tipstersMap = {};
    for (const t of tipsters) {
        tipstersMap[t.id] = t.name;
    }

    const picksMap = {};
    for (const p of picks) {
        picksMap[p.id] = p;
    }

    // ESTRUCTURA: 20 columnas (A-T) EXACTA del EXCEL-V12-FINAL.xlsx
    const data = [];

    // FILA 1 (índice 0): Labels de estadísticas (igual que Lanzadas pero con 1 columna más)
    data.push([
        '',           // A (vacía, contiene fórmula winrate en fila 2)
        '✅',         // B: Ganadas
        '❌',         // C: Perdidas
        '🔵',         // D: Voids
        'UDS.',       // E: Unidades
        'Beneficio',  // F: Beneficio
        'Yield Global', // G: Yield
        'Bank Actual',  // H: Bank actual
        'Bank Inicial', // I: Bank inicial
        'Apostado',     // J: Total apostado
        '', '', '', '', '', '', '', '', '', '' // K-T vacías
    ]);

    // FILA 2 (índice 1): Fórmulas (ajustadas para Realizadas hasta fila 2001)
    data.push([
        { f: 'B2/(B2+C2)' },              // A: Winrate
        { f: 'COUNTIF(E7:E2001,"w")' },   // B: Count ganadas
        { f: 'COUNTIF(E7:E2001,"l")' },   // C: Count perdidas
        { f: 'COUNTIF(E7:E2001,"V")' },   // D: Count voids
        { f: 'SUM($F$7:$F$2001)' },       // E: Sum unidades
        { f: 'SUM(H7:H2001)' },           // F: Sum beneficio euros
        { f: 'F2/J2' },                   // G: Yield
        { f: 'I2+F2' },                   // H: Bank actual
        10000,                            // I: Bank inicial (valor fijo)
        { f: 'SUM($G$7:$G$2001)' },       // J: Total apostado
        '', '', '', '', '', '', '', '', '', '' // K-T vacías
    ]);

    // FILA 3 (índice 2): Instrucciones (texto en A y F, resto vacío)
    const row3 = new Array(20).fill('');
    row3[0] = 'PLANTILLA EII';           // A3: Texto merged A3:E5
    row3[5] = 'Rellenar con los picks que lanza el tipster'; // F3: Texto merged F3:T5
    data.push(row3);

    // FILAS 4-5 (índices 3-4): Vacías (forman parte de merged cells)
    data.push(new Array(20).fill(''));
    data.push(new Array(20).fill(''));

    // FILA 6 (índice 5): Headers EXACTOS
    data.push([
        'LIVE-PRE',                // A
        'TIPSTER',                 // B
        'STAKE',                   // C
        'CUOTA',                   // D
        'W/L/V',                   // E
        'Resultado unidades',      // F (Python calculará)
        'CANTIDAD',                // G (Python calculará)
        'Resultado euros',         // H (Python calculará)
        'FECHA PICK',              // I
        'HORA PICK',               // J
        'FECHA PARTIDO',           // K
        'HORA PARTIDO',            // L
        'APUESTA',                 // M
        '',                        // N (vacía)
        '',                        // O (vacía)
        'Comentarios',             // P
        'COMBINADA',               // Q
        'DEPORTE',                 // R
        'Plataforma envio pick',   // S
        'BOOKIE'                   // T
    ]);

    // Filas 7+ (índice 6+): Datos de follows
    for (let i = 0; i < follows.length; i++) {
        const follow = follows[i];
        const pick = picksMap[follow.pickId] || {};
        const tipsterName = tipstersMap[follow.tipsterId] || follow.tipsterId;
        const rowNum = i + 7; // Excel row number (starts at 7)

        // Determinar si es combinada
        const isCombinada = (pick.pickType || '').toLowerCase().includes('combin') ? 'SÍ' : 'NO';

        // Mapear resultado del usuario a formato Excel: Ganada→W, Perdida→L, Void→V, Pendiente→vacío
        let userResultExcel = '';
        const userResultLower = (follow.userResult || '').toLowerCase();
        if (userResultLower === 'ganada' || userResultLower === 'won' || userResultLower === 'win') {
            userResultExcel = 'W';
        } else if (userResultLower === 'perdida' || userResultLower === 'lost' || userResultLower === 'lose') {
            userResultExcel = 'L';
        } else if (userResultLower === 'void' || userResultLower === 'v') {
            userResultExcel = 'V';
        }
        // Si es 'pendiente' o cualquier otro valor, queda vacío

        data.push([
            pick.pickType || '',       // A: LIVE-PRE
            tipsterName,               // B: TIPSTER
            follow.userStake || '',    // C: STAKE (usuario)
            follow.userOdds || '',     // D: CUOTA (usuario)
            userResultExcel,           // E: W/L/V (usuario)
            // F: Resultado unidades (fórmula - misma que Lanzadas)
            { f: `IF(E${rowNum}="L",-C${rowNum},IF(E${rowNum}="W",C${rowNum}*(D${rowNum}-1),IF(E${rowNum}="HW",(C${rowNum}/2)*(D${rowNum}-1),IF(E${rowNum}="HL",-C${rowNum}/2,0))))` },
            // G: CANTIDAD (fórmula con VLOOKUP al dashboard)
            { f: `IFERROR(($I$2/VLOOKUP(B${rowNum},Tipster_Picks_Dashboard!$A$3:$W$76,2,FALSE))*C${rowNum},"")` },
            // H: Resultado euros (fórmula)
            { f: `IF(E${rowNum}="w",G${rowNum}*D${rowNum}-G${rowNum},IF(E${rowNum}="L",-G${rowNum},0))` },
            follow.dateFollowed || '', // I: FECHA PICK
            follow.timeFollowed || '', // J: HORA PICK
            pick.date || '',           // K: FECHA PARTIDO
            pick.time || '',           // L: HORA PARTIDO
            follow.userBetType || '',  // M: APUESTA (tipo apuesta usuario)
            '',                        // N: (vacía)
            '',                        // O: (vacía)
            follow.comments || '',     // P: Comentarios
            isCombinada,               // Q: COMBINADA (SÍ/NO)
            pick.sport || '',          // R: DEPORTE
            'App',                     // S: Plataforma envio pick (fijo "App")
            follow.userBookmaker || '' // T: BOOKIE (usuario)
        ]);
    }

    console.log(`   ✓ Realizadas: ${follows.length} follows (desde fila 7)`);

    return XLSX.utils.aoa_to_sheet(data);
}

/**
 * 📊 Generar hoja "Mis_Picks_Dashboard"
 * 
 * Dashboard con FÓRMULAS que calculan dinámicamente desde "Realizadas".
 * 
 * ESTRUCTURA (21 columnas A-U):
 * Fila 1: "NECESARIO RELLENAR TIPSTER" en A1
 * Fila 2: Headers (A:TIPSTER, B:Juega a Unidades, C:Benficio UDS, D:Beneficio, 
 *         E:Apostado, F:YIELD, G:Tips totales, H:Tips W, I:Tips L, J:Tips V, 
 *         K:% Tips Aciertados, L:% Aciertos Live, M:% Aciertos PRE,
 *         N-T: Deportes con % de aciertos)
 * Fila 3+: Una fila por tipster con FÓRMULAS (no valores precalculados)
 * 
 * ⚠️ IMPORTANTE: Solo escribir nombres de tipsters + fórmulas.
 * Las fórmulas calculan automáticamente desde Realizadas!
 */
function generateMisPicksDashboard(follows, picks, tipsters) {
    // Extraer lista única de tipsters que aparecen en follows
    const tipsterNames = new Set();
    for (const follow of follows) {
        const tipster = tipsters.find(t => t.id === follow.tipsterId);
        if (tipster) {
            tipsterNames.add(tipster.name);
        }
    }

    const uniqueTipsters = Array.from(tipsterNames).sort();

    // Generar datos
    const data = [];

    // Lista de deportes (DEBE coincidir EXACTAMENTE con Base datos)
    const deportes = [
        'Badminton', 'Baloncesto', 'Balonmano', 'Beisbol', 'Boxeo',
        'Ciclismo', 'Esports', 'Fútbol', 'Fútbol Americano', 'Golf',
        'Hockey', 'MMA', 'Tenis', 'Tenis Mesa', 'Voleibol'
    ];

    // FILA 1: Instrucción (ahora 29 columnas: A-M stats + N-AB deportes = 29)
    const row1 = new Array(29).fill('');
    row1[0] = 'NECESARIO RELLENAR TIPSTER';
    data.push(row1);

    // FILA 2: Headers (13 stats + 15 deportes + 1 vacía = 29 columnas)
    const headers = [
        'TIPSTER',              // A
        'Juega a Unidades',     // B
        'Benficio UDS',         // C
        'Beneficio',            // D
        'Apostado',             // E
        'YIELD',                // F
        'Tips totales',         // G
        'Tips W',               // H
        'Tips L',               // I
        'Tips V',               // J
        '% Tips Aciertados',    // K
        '% Aciertos Live',      // L
        '% Aciertos PRE',       // M
        ...deportes,            // N-AB: 15 deportes
        ''                      // AC: columna vacía
    ];
    data.push(headers);

    // FILAS 3+: Una fila por tipster con FÓRMULAS
    for (let i = 0; i < uniqueTipsters.length; i++) {
        const tipsterName = uniqueTipsters[i];
        const rowNum = i + 3; // Excel row number (starts at 3)

        data.push([
            tipsterName,        // A: TIPSTER (nombre)
            100,                // B: Juega a Unidades (valor fijo)
            // C: Beneficio UDS - FÓRMULA: suma columna F de Realizadas donde B=tipster
            { f: `SUMIF(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$F$7:$F$2003)` },
            // D: Beneficio (euros) - FÓRMULA: suma columna H de Realizadas
            { f: `SUMIF(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$H$7:$H$2003)` },
            // E: Apostado - FÓRMULA: suma columna G de Realizadas
            { f: `SUMIF(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$G$7:$G$2003)` },
            // F: YIELD - FÓRMULA: Beneficio / Apostado
            { f: `IFERROR(D${rowNum}/E${rowNum},"")` },
            // G: Tips totales - FÓRMULA: cuenta picks de este tipster con resultado no vacío
            { f: `COUNTIFS(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$E$7:$E$2003,"<>")` },
            // H: Tips W - FÓRMULA: cuenta "W"
            { f: `COUNTIFS(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$E$7:$E$2003,"W")` },
            // I: Tips L - FÓRMULA: cuenta "L"
            { f: `COUNTIFS(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$E$7:$E$2003,"L")` },
            // J: Tips V - FÓRMULA: cuenta "V"
            { f: `COUNTIFS(Realizadas!$B$7:$B$2003,A${rowNum},Realizadas!$E$7:$E$2003,"V")` },
            // K: % Tips Aciertados - FÓRMULA: H/G
            { f: `IFERROR(H${rowNum}/G${rowNum},"")` },
            // L: % Aciertos Live - FÓRMULA: (LIVE + W) / H
            { f: `IFERROR((COUNTIFS(Realizadas!$B$7:$B$2006,A${rowNum},Realizadas!$A$7:$A$2006,"LIVE",Realizadas!$E$7:$E$2006,"W"))/H${rowNum},0)` },
            // M: % Aciertos PRE - FÓRMULA: (PRE + W) / H
            { f: `IFERROR((COUNTIFS(Realizadas!B7:B2006,A${rowNum},Realizadas!A7:A2006,"PRE",Realizadas!$E$7:$E$2006,"W"))/H${rowNum},0)` }
        ]);

        // N-AB: Añadir fórmulas para los 15 deportes dinámicamente
        // Columnas N=14, O=15, P=16, ..., AB=27 (índices en el array)
        const sportFormulas = [];
        const startCol = 14; // Columna N (índice 13 en base-0, pero push ya tiene 13 elementos)

        for (let sportIdx = 0; sportIdx < deportes.length; sportIdx++) {
            const excelCol = String.fromCharCode(78 + sportIdx); // N=78 en ASCII
            let colRef;

            // Excel columnas: N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB
            if (sportIdx < 13) {
                // N-Z (índices 0-12)
                colRef = String.fromCharCode(78 + sportIdx);
            } else {
                // AA, AB (índices 13-14)
                colRef = 'A' + String.fromCharCode(65 + (sportIdx - 13));
            }

            sportFormulas.push(
                { f: `IFERROR(((COUNTIFS(Realizadas!$B$7:$B$2003,$A${rowNum},Realizadas!$E$7:$E$2003,"W",Realizadas!$R$7:$R$2003,${colRef}$2))/$H${rowNum}),0)` }
            );
        }

        // Añadir las fórmulas de deportes + columna vacía al final
        data[data.length - 1].push(...sportFormulas, '');
    }

    console.log(`   ✓ Mis_Picks_Dashboard: ${uniqueTipsters.length} tipsters con fórmulas dinámicas`);

    return XLSX.utils.aoa_to_sheet(data);
}

/**
 * 📊 Generar hoja "Tipster_Picks_Dashboard"
 * 
 * Dashboard con FÓRMULAS que calculan dinámicamente desde "Lanzadas Tipster".
 * Misma estructura que Mis_Picks_Dashboard pero calcula desde picks originales.
 * 
 * ⚠️ IMPORTANTE: Solo escribir nombres de tipsters + fórmulas.
 * Las fórmulas calculan automáticamente desde 'Lanzadas Tipster'!
 */
function generateTipsterPicksDashboard(picks, tipsters) {
    // Extraer lista única de tipsters que tienen picks
    const tipsterNames = new Set();
    for (const pick of picks) {
        const tipster = tipsters.find(t => t.id === pick.tipsterId);
        if (tipster) {
            tipsterNames.add(tipster.name);
        }
    }

    const uniqueTipsters = Array.from(tipsterNames).sort();

    // Generar datos
    const data = [];

    // Lista de deportes (DEBE coincidir EXACTAMENTE con Base datos y Mis_Picks_Dashboard)
    const deportes = [
        'Badminton', 'Baloncesto', 'Balonmano', 'Beisbol', 'Boxeo',
        'Ciclismo', 'Esports', 'Fútbol', 'Fútbol Americano', 'Golf',
        'Hockey', 'MMA', 'Tenis', 'Tenis Mesa', 'Voleibol'
    ];

    // FILA 1 (29 columnas)
    const row1 = new Array(29).fill('');
    row1[0] = 'NECESARIO RELLENAR TIPSTER';
    data.push(row1);

    // FILA 2: Headers (13 stats + 15 deportes + 1 vacía = 29)
    const headers = [
        'TIPSTER',              // A
        'Juega a Unidades',     // B
        'Benficio UDS',         // C
        'Beneficio',            // D
        'Apostado',             // E
        'YIELD',                // F
        'Tips totales',         // G
        'Tips W',               // H
        'Tips L',               // I
        'Tips V',               // J
        '% Tips Aciertados',    // K
        '% Aciertos Live',      // L
        '% Aciertos PRE',       // M
        ...deportes,            // N-AB: 15 deportes
        ''                      // AC: columna vacía
    ];
    data.push(headers);

    // FILAS 3+: Una fila por tipster con FÓRMULAS que calculan desde 'Lanzadas Tipster'
    for (let i = 0; i < uniqueTipsters.length; i++) {
        const tipsterName = uniqueTipsters[i];
        const rowNum = i + 3;

        data.push([
            tipsterName,        // A: TIPSTER
            100,                // B: Juega a Unidades
            // C: Beneficio UDS - desde 'Lanzadas Tipster' columna F
            { f: `SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$F$7:$F$1855)` },
            // D: Beneficio (euros) - desde columna H
            { f: `SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$H$7:$H$1855)` },
            // E: Apostado - desde columna G
            { f: `SUMIF('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$G$7:$G$1855)` },
            // F: YIELD
            { f: `IFERROR(D${rowNum}/E${rowNum},"")` },
            // G: Tips totales
            { f: `COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$E$7:$E$1855,"<>")` },
            // H: Tips W
            { f: `COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$E$7:$E$1855,"W")` },
            // I: Tips L
            { f: `COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$E$7:$E$1855,"L")` },
            // J: Tips V
            { f: `COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,A${rowNum},'Lanzadas Tipster'!$E$7:$E$1855,"V")` },
            // K: % Tips Aciertados
            { f: `IFERROR(H${rowNum}/G${rowNum},"")` },
            // L: % Aciertos Live
            { f: `IFERROR((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1851,A${rowNum},'Lanzadas Tipster'!$A$7:$A$1851,"LIVE",'Lanzadas Tipster'!$E$7:$E$1851,"W"))/H${rowNum},0)` },
            // M: % Aciertos PRE
            { f: `IFERROR((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1851,A${rowNum},'Lanzadas Tipster'!$A$7:$A$1851,"PRE",'Lanzadas Tipster'!$E$7:$E$1851,"W"))/H${rowNum},0)` }
        ]);

        // N-AB: Añadir fórmulas para los 15 deportes dinámicamente
        // IMPORTANTE: En 'Lanzadas Tipster' el deporte está en columna Q (no R)
        const sportFormulas = [];

        for (let sportIdx = 0; sportIdx < deportes.length; sportIdx++) {
            let colRef;

            // Excel columnas: N, O, P, Q, R, S, T, U, V, W, X, Y, Z, AA, AB
            if (sportIdx < 13) {
                // N-Z (índices 0-12)
                colRef = String.fromCodePoint(78 + sportIdx);
            } else {
                // AA, AB (índices 13-14)
                colRef = 'A' + String.fromCodePoint(65 + (sportIdx - 13));
            }

            sportFormulas.push(
                { f: `IFERROR(((COUNTIFS('Lanzadas Tipster'!$B$7:$B$1855,$A${rowNum},'Lanzadas Tipster'!$E$7:$E$1855,"W",'Lanzadas Tipster'!$Q$7:$Q$1855,${colRef}$2))/$H${rowNum}),0)` }
            );
        }

        // Añadir las fórmulas de deportes + columna vacía al final
        data[data.length - 1].push(...sportFormulas, '');
    }

    console.log(`   ✓ Tipster_Picks_Dashboard: ${uniqueTipsters.length} tipsters con fórmulas dinámicas`);

    return XLSX.utils.aoa_to_sheet(data);
}

/**
 * 📊 Generar hoja "Base datos"
 * 
 * Hoja con listas de valores para los dropdowns.
 * 
 * ESTRUCTURA (9 columnas):
 * Columna A (BOOKIES): 13 bookmakers
 * Columna C (Plataformas): 3 plataformas
 * Columna E (DEPORTE): 15 deportes
 * Columna G (LIVE-PRE): 2 opciones
 * Columna I (COMBINADA): 3 opciones
 */
function generateBaseDatosSheet() {
    const data = [];

    // FILA 1: Headers
    data.push([
        'BOOKIES',                          // A
        '',                                 // B (vacía)
        'Plataformas de Pick/Tipsters',     // C
        '',                                 // D (vacía)
        'DEPORTE',                          // E
        '',                                 // F (vacía)
        'LIVE-PRE',                         // G
        '',                                 // H (vacía)
        'COMBINADA'                         // I
    ]);

    // Listas de datos
    const bookies = [
        '888', '1xBet', 'Bet365', 'Betfail', 'Betfair', 'Betsson',
        'Bwin', 'Codere', 'Luckia', 'Marathonbet', 'Sportium',
        'Winamax', 'William Hill'
    ];

    const plataformas = ['Blogabet', 'Telegram', 'TipsterLand'];

    const deportes = [
        'Badminton', 'Baloncesto', 'Balonmano', 'Beisbol', 'Boxeo',
        'Ciclismo', 'Esports', 'Fútbol', 'Fútbol Americano', 'Golf',
        'Hockey', 'MMA', 'Tenis', 'Tenis Mesa', 'Voleibol'
    ];

    const livePre = ['PRE', 'LIVE'];

    const combinada = ['Si', 'No', 'Sí'];

    // FILAS 2+: Poblar datos
    const maxRows = Math.max(bookies.length, plataformas.length, deportes.length, livePre.length, combinada.length);

    for (let i = 0; i < maxRows; i++) {
        data.push([
            bookies[i] || '',           // A
            '',                         // B
            plataformas[i] || '',       // C
            '',                         // D
            deportes[i] || '',          // E
            '',                         // F
            livePre[i] || '',           // G
            '',                         // H
            combinada[i] || ''          // I
        ]);
    }

    console.log(`   ✓ Base datos: ${maxRows} filas de datos`);

    return XLSX.utils.aoa_to_sheet(data);
}

/**
 * 💰 Calcular profit de una pick
 * 
 * Fórmula:
 * - WIN: (cuota - 1) * stake
 * - LOSE: -stake
 * - VOID: 0
 */
function calculatePickProfit(pick) {
    const result = (pick.result || '').toUpperCase();
    const odds = pick.odds || 0;
    const stake = pick.stake || 0;

    if (result === 'W' || result === 'WON' || result === 'WIN') {
        return (odds - 1) * stake;
    } else if (result === 'L' || result === 'LOST' || result === 'LOSE') {
        return -stake;
    } else {
        return 0; // VOID o no resuelto
    }
}/**
 * 🎨 Aplicar estilos con Python (openpyxl)
 * 
 * Ejecuta el script Python que añade:
 * - Estilos (fuentes, colores, bordes)
 * - Dropdowns
 * - Formato condicional
 * - Anchos de columna
 */
function applyPythonStyles(filepath) {
    return new Promise((resolve, reject) => {
        const pythonScript = path.join(__dirname, 'add-excel-styles.py');
        const command = `python3 "${pythonScript}" "${filepath}"`;

        console.log(`🐍 [PYTHON] Ejecutando: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ [PYTHON ERROR]', error);
                console.error('stderr:', stderr);
                reject(error);
                return;
            }

            if (stdout) console.log('📝 [PYTHON OUTPUT]', stdout);
            if (stderr) console.warn('⚠️  [PYTHON STDERR]', stderr);

            console.log('✅ [PYTHON] Estilos aplicados correctamente');
            resolve();
        });
    });
}

// 🚀 Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════════════');
    console.log('🚀 TIPSTER TRACKER - EXCEL EXPORT BACKEND');
    console.log('═══════════════════════════════════════════════════');
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📊 Endpoint: POST /api/export-excel`);
    console.log(`🏥 Health: GET /health`);
    console.log('═══════════════════════════════════════════════════');
    console.log('');
});

// Manejo de errores global
process.on('uncaughtException', (err) => {
    console.error('❌ [FATAL] Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ [FATAL] Unhandled Rejection:', err);
    process.exit(1);
});
