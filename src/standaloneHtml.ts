/**
 * Generador del archivo HTML autónomo e independiente para Liquidaciones LOTTT Venezuela
 * - 100% Sin Servidor, Sin Cookies, Sin Rastreadores
 * - Funciona abriendo directamente el archivo .html en Google Chrome, Microsoft Edge, Mozilla Firefox y Opera
 * - Incluye Base de Datos IndexedDB, Historial, Formato Agribienes C.A., PDF en 1 página y Word (.doc)
 */

export function generateStandaloneHtml(): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Liquidación de Prestaciones Sociales LOTTT - Venezuela</title>
<style>
* { box-sizing: border-box; }
body {
  margin: 0 0 50px;
  background: #dfe3e6;
  font: 12px Cambria, Georgia, serif;
  color: #000;
}
.bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: #1b5e20;
  color: #fff;
  padding: 6px 12px;
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 5px rgba(0,0,0,0.25);
}
.bar b {
  margin-right: auto;
  font-size: 13px;
  letter-spacing: 0.3px;
}
.bar button, .bar label.btn-lbl {
  font: bold 11.5px Calibri, Arial, sans-serif;
  padding: 5px 10px;
  border: 1px solid rgba(255,255,255,0.3);
  background: #2e7d32;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.15s;
}
.bar button:hover, .bar label.btn-lbl:hover {
  background: #388e3c;
  border-color: #fff;
}
.btn-gold {
  background: #f59e0b !important;
  color: #0f172a !important;
  border-color: #d97706 !important;
  font-weight: bold !important;
}
.btn-gold:hover {
  background: #fbbf24 !important;
}
.btn-red {
  background: #b91c1c !important;
  color: #fff !important;
  border-color: #ef4444 !important;
}
.btn-red:hover {
  background: #dc2626 !important;
}
.tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #f1f5f9;
  border-top: 1.5px solid #cbd5e1;
  display: flex;
  z-index: 50;
  overflow-x: auto;
}
.tabs button {
  font: 12px Calibri, Arial, sans-serif;
  border: 0;
  border-right: 1px solid #cbd5e1;
  padding: 8px 18px;
  background: #e2e8f0;
  color: #334155;
  cursor: pointer;
  white-space: nowrap;
}
.tabs button.on {
  background: #fff;
  color: #1b5e20;
  font-weight: bold;
  border-top: 3px solid #1b5e20;
}
.sheet {
  display: none;
  padding: 12px;
}
.sheet.on {
  display: block;
}
.flex {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  justify-content: center;
  flex-wrap: wrap;
}
.doc {
  background: #fff;
  width: 860px;
  padding: 14px 18px;
  box-shadow: 0 1px 6px rgba(0,0,0,0.2);
  border: 1.5px solid #000;
  font-family: Arial, Calibri, sans-serif;
  color: #000;
}
.top-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
}
.logo-box {
  display: flex;
  align-items: center;
  gap: 8px;
}
.date-box {
  width: 290px;
  border: 1.5px solid #000;
  text-align: center;
}
.date-box .dh {
  background: #d9d9d9;
  font-weight: bold;
  font-size: 10px;
  padding: 2px;
  border-bottom: 1px solid #000;
}
.date-box .db {
  padding: 3px;
  font-weight: bold;
  font-size: 11px;
  background: #fff;
}
.banner {
  background: #404040;
  color: #fff;
  font-weight: bold;
  text-align: center;
  font-size: 11px;
  padding: 4px;
  border: 1px solid #000;
  margin-bottom: 6px;
}
.banner.bl {
  background: #1f4e8c;
}
.g {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  margin-bottom: 4px;
}
.g > div {
  border: 1px solid #000;
  margin: 0 -1px -1px 0;
  padding: 2px 4px;
  min-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 10px;
}
.g .l { justify-content: flex-start; text-align: left; }
.g .r { justify-content: flex-end; text-align: right; }
.h { background: #d9d9d9; font-weight: bold; font-size: 9.5px; }
.t { background: #808080; color: #fff; font-weight: bold; font-size: 10.5px; }
.b { font-weight: bold; }
.nb { border: 0 !important; }
.yellow-cell {
  background: #ffff00 !important;
  font-weight: bold;
}
.neto {
  background: #bfbfbf !important;
  font-weight: bold;
  font-size: 13.5px;
}
input {
  font: inherit;
  width: 100%;
  border: 0;
  background: #fffbd6;
  color: #0020c0;
  padding: 2px 3px;
  text-align: inherit;
  min-width: 0;
}
input:focus {
  outline: 2px solid #217346;
}
.panel {
  background: #fff;
  padding: 10px;
  width: 310px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  font-size: 11px;
  border: 1px solid #cbd5e1;
}
.panel h4 {
  margin: 0 0 6px;
  background: #1b5e20;
  color: #fff;
  padding: 4px 8px;
  font-size: 11.5px;
}
.panel label {
  display: grid;
  grid-template-columns: 1fr 105px;
  gap: 4px;
  margin: 3px 0;
  align-items: center;
}
.panel table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
  margin: 6px 0;
}
.panel td, .panel th {
  border: 1px solid #888;
  padding: 2px;
}
.legal {
  font-size: 8.5px;
  text-align: justify;
  margin: 8px 0;
  line-height: 1.25;
}
.sig {
  display: flex;
  justify-content: space-between;
  margin: 12px 0 6px;
  font-size: 10.5px;
  font-weight: bold;
}
.recibo-conforme-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 6px;
}
.rc-left {
  flex: 1;
  padding-right: 15px;
}
.rc-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 14px;
  font-size: 10.5px;
}
.huella-box {
  width: 105px;
  height: 95px;
  border: 1.5px solid #000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 4px;
  font-size: 9px;
  font-weight: bold;
}
.wrap {
  overflow: auto;
  max-height: 76vh;
  background: #fff;
  border: 1px solid #cbd5e1;
}
.t2 {
  border-collapse: collapse;
  font: 11px Arial, sans-serif;
  width: 100%;
}
.t2 td, .t2 th {
  border: 1px solid #aaa;
  padding: 2px 4px;
  white-space: nowrap;
  text-align: right;
  height: 22px;
}
.t2 th {
  background: #d9d9d9;
  font-size: 9.5px;
  position: sticky;
  top: 0;
  z-index: 2;
}
.t2 tr.tot td {
  background: #e2e8f0;
  font-weight: bold;
}
.ti {
  font: bold 15px Arial;
  text-align: center;
  margin-bottom: 4px;
}
.mt {
  margin: 6px 0;
  font: 11px Arial;
}
.small {
  font: 11px Arial;
  margin: 6px 0;
}
.w, .ok {
  padding: 4px 8px;
  margin: 4px 0;
  font-size: 11px;
  border-radius: 2px;
}
.w { background: #fef3c7; border-left: 4px solid #f59e0b; color: #78350f; }
.ok { background: #dcfce7; border-left: 4px solid #16a34a; color: #14532d; }
#msg {
  padding: 0 12px;
}
#msg div {
  background: #fff;
  border-left: 5px solid #16a34a;
  padding: 8px 12px;
  margin-top: 8px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
#msg .e { border-color: #dc2626; color: #991b1b; }
.xbar {
  padding: 6px 12px 0;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.xbar button {
  font: bold 11.5px Calibri, Arial, sans-serif;
  padding: 4px 10px;
  cursor: pointer;
  border: 1px solid #1f4e8c;
  background: #1f4e8c;
  color: #fff;
  border-radius: 3px;
}
.sheet-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 6px 10px;
  margin-bottom: 8px;
  border-radius: 4px;
}
/* Estilos estrictos de impresión: 1 sola página Letter para Hoja 1 y Hoja 2 */
@media print {
  @page {
    size: letter portrait;
    margin: 5mm;
  }
  .bar, .tabs, .panel, .no-print, .small button, #msg, .sheet-action-bar, .xbar {
    display: none !important;
  }
  body {
    background: #fff;
    margin: 0;
    padding: 0;
  }
  .sheet {
    display: none !important;
    padding: 0 !important;
  }
  .sheet.on {
    display: block !important;
    zoom: 0.88;
    page-break-after: avoid !important;
    break-after: avoid !important;
  }
  .doc {
    box-shadow: none !important;
    width: 100% !important;
    max-width: 100% !important;
    border: 1.5px solid #000 !important;
    break-inside: avoid !important;
    page-break-inside: avoid !important;
    margin: 0 auto !important;
    padding: 10px !important;
  }
  input {
    background: none !important;
    color: #000 !important;
  }
}
</style>
</head>
<body>

<!-- BARRA PRINCIPAL -->
<div class="bar no-print">
  <b>Liquidación de Prestaciones Sociales LOTTT · Venezuela</b>
  
  <button onclick="saveCurrentToDB()" class="btn-gold" title="Guardar expediente en la base de datos">
    💾 Guardar en BD
  </button>
  
  <button onclick="$('#fx').click()" title="Cargar hoja Excel de RRHH">
    📊 Cargar Excel (RRHH)
  </button>
  <input type="file" id="fx" accept=".xlsx" hidden>
  
  <button onclick="downloadActivePdf()" class="btn-red" title="Descargar la hoja actual en PDF listo para imprimir en 1 página">
    📥 Descargar a PDF
  </button>
  
  <button onclick="imprimir()" title="Imprimir hoja actual">
    🖨️ Imprimir
  </button>
  
  <button onclick="nuevo()" title="Iniciar liquidación en blanco">
    📄 En blanco
  </button>
  
  <button onclick="ejemplo()" title="Cargar ejemplo modelo">
    ✨ Ejemplo
  </button>
  
  <button id="bpriv" onclick="togglePrivacy()" title="Modo privacidad: enmascarar cédula y salarios">
    👁️ Modo Privacidad
  </button>
</div>

<div id="msg" class="no-print"></div>
<div id="app"></div>
<div class="tabs no-print" id="tabs"></div>

<script>
// =========================================================================
// MOTOR BASE DE DATOS LOCAL INMUTABLE (IndexedDB - Cero Cookies)
// =========================================================================
const DB_NAME = 'LOTTT_VENEZUELA_DB';
const DB_VERSION = 1;
const STORE_NAME = 'liquidaciones';

function getDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbSave(item) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbGetAll() {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function dbDelete(id) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// =========================================================================
// CONSTANTES Y MODELO DE LIQUIDACIÓN
// =========================================================================
const $ = s => document.querySelector(s);
const clone = o => JSON.parse(JSON.stringify(o));
const MES = ['ENERO','FEBRERO','MARZO','ABRIL','MAYO','JUNIO','JULIO','AGOSTO','SEPTIEMBRE','OCTUBRE','NOVIEMBRE','DICIEMBRE'];

const D0 = {
  "emp": "AGRI BIENES, C.A.",
  "rif": "RIF: J-31471703-0",
  "lugar": "Puerto Cabello, 02/11/2026",
  "nombre": "WUAYNEL DELPINO",
  "ci": "V-14.848.682",
  "cargo": "CHEQUEADOR",
  "motivo": "RENUNCIA",
  "ing": "2026-05-18",
  "egr": "2026-11-02",
  "tasa": 889.57,
  "baseUsd": 60,
  "dNormal": 104459.97758522729,
  "diasBV": 15,
  "diasUt": 120,
  "vacD": 15,
  "bvD": 16,
  "mf": null,
  "l29": 2,
  "l30": 2,
  "l31": 2,
  "cestaUsd": 40,
  "otrasUsd": 6.66666666666667,
  "p36": 0,
  "faov": 0.01,
  "inces": 0.005,
  "islr": 0.0002,
  "ivssBase": 650,
  "ivssPct": 0.04,
  "rpeBase": 1300,
  "rpePct": 0.005,
  "sem": 1,
  "q7": 0,
  "intTail": 0,
  "faovUt": 0,
  "escOtras": 0,
  "xin": {},
  "xo": {},
  "crit": 0,
  "utMode": 0,
  "litc": 1,
  "rows": [
    {"a": 2026, "b": "MAYO", "c": 13793.12, "e": 0, "f": 0, "k": 0, "l": 0, "p": 0, "r": 0.4752, "u": 0},
    {"a": 2026, "b": "JUNIO", "c": 72895.49, "e": 0, "f": 1, "k": 0, "l": 0, "p": 0, "r": 0.4756, "u": 0},
    {"a": 2026, "b": "JULIO", "c": 79472.30, "e": 0, "f": 2, "k": 0, "l": 0, "p": 0, "r": 0.4752, "u": 0},
    {"a": 2026, "b": "AGOSTO", "c": 96599.86, "e": 0, "f": 3, "k": 15, "l": 0, "p": 0, "r": 0.4746, "u": 0},
    {"a": 2026, "b": "SEPTIEMBRE", "c": 94990.00, "e": 0, "f": 4, "k": 0, "l": 0, "p": 0, "r": 0.4746, "u": 0},
    {"a": 2026, "b": "OCTUBRE", "c": 104459.98, "e": 0, "f": 5, "k": 15, "l": 0, "p": 0, "r": 0.4746, "u": 0}
  ],
  "ut": {
    "w9": 886.22,
    "vd": "2026-10-23",
    "aa9": 10439164.26,
    "a": {"m": [0,0,0,0,13793.12,72895.49,79472.30,96599.86,94990.00,0,0,0], "u": 0, "x": 0.0002, "ac": 60},
    "b": {"m": [0,0,0,0,13793.12,72895.49,79472.30,96599.86,94990.00,104459.98,0,0], "u": 0, "x": 0.0002, "ac": 60}
  }
};

let S;
try { S = JSON.parse(localStorage.getItem('liq1')); } catch (x) {}
S = S || clone(D0);
S.crit = S.crit || 0;
S.utMode = S.utMode || 0;
S.litc = S.litc ?? 1;
S.xin = S.xin || {};
S.xo = S.xo || {};

let privacyMode = false;
let currentTab = 0;

function togglePrivacy() {
  privacyMode = !privacyMode;
  $('#bpriv').textContent = privacyMode ? '👁️ Privacidad: ON' : '👁️ Modo Privacidad';
  $('#bpriv').classList.toggle('btn-gold', privacyMode);
  refresh();
}

function mask(v, isCI = false, isAmt = false) {
  if (!privacyMode) return typeof v === 'number' ? nf(v) : (v ?? '');
  if (isCI) return String(v).replace(/(\\d{2})\\d+(\\d{2})/, '$1.***.$2');
  if (isAmt) return '••••••••';
  return v ?? '';
}

const nf = (x, a = 2, b = 2) => (+x).toLocaleString('es-VE', { minimumFractionDigits: a, maximumFractionDigits: b });
const fd = i => i ? i.split('-').reverse().join('/') : '';
const pn = s => {
  s = String(s).trim().replace(/\\s/g, '');
  if (!s) return 0;
  if (s.includes(',')) s = s.replace(/\\./g, '').replace(',', '.');
  const x = parseFloat(s);
  return isNaN(x) ? 0 : x;
};
const fi = (x, t) => t === 'p' ? String(+(x * 100).toFixed(4)).replace('.', ',') : String(+(+x).toFixed(6)).replace('.', ',');
const get = p => p.split('.').reduce((o, k) => o[k], S);
const set = (p, v) => { const a = p.split('.'), l = a.pop(); a.reduce((o, k) => o[k], S)[l] = v; };

function datedif(a, b) {
  let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return [y, m, d];
}

// =========================================================================
// MOTOR DE CÁLCULO LOTTT VENEZUELA
// =========================================================================
function calc(S) {
  const V = {}, t = S.tasa, fu = S.diasUt / 360, fb = S.diasBV / 360;
  const ing = new Date(S.ing + 'T00:00'), egr = new Date(S.egr + 'T00:00');
  const dd = egr >= ing ? datedif(ing, egr) : [0, 0, 0];
  Object.assign(V, { P12: dd[0], Q12: dd[1], R12: dd[2], M12: \`\${dd[0]} Años, \${dd[1]} Meses y \${dd[2]} días\` });

  V.B15 = S.baseUsd * t;
  const E = S.dNormal / 30;
  V.E15 = E;
  V.H15 = fb * E;
  V.J15 = fu * E;
  V.L15 = E + V.H15 + V.J15;

  let M = 0, O = 0, Q = 0, Vc = 0, sK = 0, sL = 0, sN = 0, sP = 0, sT = 0, sU = 0;
  S.rows.forEach((r, i) => {
    const n = 13 + i, d = r.c / 30, g = fu * d, h = fb * d, j = d + g + h, kl = r.k + r.l, N = j * kl;
    M += kl; O += N; Q += N - r.p;
    const T = Q * r.r / 12; Vc += T - r.u;
    Object.assign(V, {
      ['pD' + n]: d, ['pG' + n]: g, ['pH' + n]: h, ['pI' + n]: n >= 15 ? j * 30 : '', ['pJ' + n]: j,
      ['pM' + n]: M, ['pN' + n]: N, ['pO' + n]: O, ['pQ' + n]: Q, ['pT' + n]: T, ['pV' + n]: Vc
    });
    sK += r.k; sL += r.l; sN += N; sP += r.p; sT += T; sU += r.u;
  });

  Object.assign(V, {
    K69: sK, L69: sL, M69: sK + sL, N69: sN, P69: sP, Q69: sN - sP, T69: sT, U69: sU, V69: sT - sU,
    Q71: (sN - sP) * 0.75, B71: S.rows.slice(-6).reduce((a, r) => a + r.c, 0)
  });

  const w = S.ut.w9, u = (x, t1) => {
    const m = x.m.slice();
    if (t1) { m[9] = x.ac * w; m[10] = x.ac / 30 * 18 * w; }
    const s = m.reduce((a, b) => a + b, 0), T = s * fu, v = T * 0.005, f = T * 0.01, y = T * x.x, z = x.u + v + f + y, a = T - z;
    return { S: s, T, V: v, W: f, Y: y, Z: z, AA: a, AB: a / w, U: x.u, P: m[9], Q: m[10] };
  };
  const A = u(S.ut.a, 1), B = u(S.ut.b, 0);
  for (const k in A) V['a.' + k] = A[k];
  for (const k in B) V['b.' + k] = B[k];
  Object.assign(V, { R16: B.S, R17: A.S, R18: B.S - A.S, V18: B.V - A.V, AA8: A.AA / w, AA11: S.ut.aa9 - A.AA, T3: fu });

  const rl = [...S.rows].reverse().find(r => r.r > 0);
  const tail = S.intTail && rl ? (sN - sP) * rl.r / 12 * (egr.getDate() / 30) : 0;
  const fr = (dd[1] > 6 || (dd[1] === 6 && dd[2] > 0)) ? 1 : 0;
  const litDays = 30 * (dd[0] + fr);
  const litAmt = S.litc ? litDays * V.L15 : 0;
  const useC = litAmt > sN;
  const mf = S.mf == null ? dd[1] : S.mf;
  const L27 = S.vacD / 12 * mf, L28 = S.bvD / 12 * mf;

  Object.assign(V, {
    K18: useC ? litDays : sK + sL, L18: useC ? litAmt : sN,
    L24: useC ? litDays : sK + sL, N24: useC ? litAmt : sN,
    N25: V.V69 + tail,
    N26: S.utMode == 1 ? B.T - A.T : S.utMode == 2 ? B.T - S.ut.b.u : V.R18,
    garantia: sN, litDays, litAmt, useC, L27, L28,
    N27: L27 * E, N28: L28 * E,
    N29: S.baseUsd / 30 * S.l29 * t,
    N30: S.cestaUsd / 30 * S.l30 * t,
    N31: S.otrasUsd * S.l31 * t
  });

  V.M33 = V.N24 + V.N25 + V.N26 + V.N27 + V.N28 + V.N29 + V.N30 + V.N31;
  V.N36 = (V.N29 + V.N27 + V.N28 + S.p36 + (S.faovUt ? V.N26 : 0)) * S.faov;
  V.N37 = (S.ivssBase * 12) / 52 * S.ivssPct * S.sem;
  V.N38 = (S.rpeBase * 12) / 52 * S.rpePct * S.sem;
  V.N39 = V.N26 * S.inces;
  V.N40 = (V.N30 + V.N29 + V.N27 + S.p36) * S.islr;
  V.M42 = V.N36 + V.N37 + V.N38 + V.N39 + V.N40;
  V.M44 = V.M33 - V.M42;
  V.Q44 = V.M44 / t;

  const ay = ing.getFullYear() + dd[0];
  Object.assign(V, {
    c4: \`Art. 196. LOTTT - Vacaciones Fraccionadas periodo \${ay}/\${ay + 1}\`,
    c5: \`Art. 196. LOTTT - Bono vacacional Fraccionado \${ay}/\${ay + 1}\`,
    c6: \`Sueldo del 01 al \${fd(S.egr)}\`,
    c7: \`Cesta Tickets del 01 al \${fd(S.egr)}\`,
    nombre: S.nombre, ci: S.ci, cargo: S.cargo, empresa: S.emp,
    ingf: fd(S.ing), egrf: fd(S.egr),
    ing_d: '' + ing.getDate(), ing_m: '' + (ing.getMonth() + 1), ing_y: '' + ing.getFullYear(),
    tab: (S.nombre || 'TRABAJADOR').toUpperCase(),
    tasaLbl: 'Tasa BCV al ' + fd(S.egr),
    legal: \`Por todo lo antes expuesto y despues de haber leído y verificado a satisfacción lo especificado en el presente documento, declaro que nada queda a deberme \${S.emp} ni sus empresas filiales, subsidiarias y relacionadas, por ningun concepto vinculado o derivado de mi relación de trabajo, ni conceptos relacionados con bonificación de alimentación o cesta ticket, por el tiempo aqui señalado y por cualquier otro periodo anterior al mismo; estoy conforme con las deducciones hechas, las cuales he autorizado. En consecuencia, \${S.emp} y sus empresas filiales y relacionadas quedan liberadas de toda responsabilidad directa o indirectamente vinculada con las disposiciones legales y/o contractuales que sobre el trabajo, higiene y seguridad laboral y social existen, sin reserva de acción alguna que ejercitar en su contra. Acepto el pago correspondiente en moneda de curso legal a través de transferencia bancaria.\`
  });

  return V;
}

function lottt(S) {
  const X = clone(S), ing = new Date(S.ing + 'T00:00'), egr = new Date(S.egr + 'T00:00');
  const y = egr >= ing ? datedif(ing, egr)[0] : 0;
  X.vacD = X.bvD = Math.min(15 + y, 30);
  X.litc = 1; X.crit = 0; X.utMode = 2; X.intTail = 1; X.faovUt = 1;
  if (S.escOtras) {
    const add = S.otrasUsd * 30 * S.tasa, im = ing.getFullYear() * 12 + ing.getMonth();
    X.dNormal += add;
    X.rows.forEach(r => {
      const m = MES.indexOf(String(r.b).trim().toUpperCase());
      if (r.c > 0 && !(m >= 0 && r.a * 12 + m === im)) r.c += add;
    });
    X.ut.b.m.forEach((x, i) => {
      if (x > 0 && i !== ing.getMonth()) X.ut.b.m[i] = x + add;
    });
  }
  const p = plan(X);
  X.rows.forEach((r, i) => { r.k = p.K[i]; r.l = p.L[i]; });
  const mi = egr.getMonth();
  if (!(X.ut.b.m[mi] > 0)) X.ut.b.m[mi] = X.dNormal / 30 * egr.getDate();
  return X;
}

function plan(S) {
  const ing = new Date(S.ing + 'T00:00'), egr = new Date(S.egr + 'T00:00');
  const dd = egr >= ing ? datedif(ing, egr) : [0, 0, 0];
  const im = ing.getFullYear() * 12 + ing.getMonth(), em = egr.getFullYear() * 12 + egr.getMonth(), tm = dd[0] * 12 + dd[1];
  const K = S.rows.map(() => 0), L = K.slice();
  let last = -1;
  S.rows.forEach((r, i) => {
    const m = MES.indexOf(String(r.b).trim().toUpperCase());
    if (m < 0) return;
    const x = (+r.a) * 12 + m, mi = x - im;
    if (x <= em) last = i;
    if (mi > 0 && mi <= tm) {
      if (mi % 3 === 0) K[i] = 15;
      if (mi % 12 === 0 && mi / 12 >= 2) L[i] = Math.min(2 * (mi / 12 - 1), 30);
    }
  });
  if (S.crit == 0 && tm >= 3 && (tm % 3 !== 0 || dd[2] > 0) && last >= 0) K[last] += 15;
  return { K, L };
}

// =========================================================================
// PLANTILLA DEL RECIBO SEGÚN EL FORMATO EXACTO DE AGRIBIENES C.A.
// =========================================================================
function renderReceipt(isLOTTT) {
  const V = calc(isLOTTT ? lottt(S) : S);
  const title = isLOTTT ? 'LIQUIDACIÓN REVISADA SEGÚN LA LOTTT (CÁLCULO DE CONTROL)' : 'RECIBO DE LIQUIDACIÓN';
  const bannerClass = isLOTTT ? 'banner bl' : 'banner';

  const cr = [
    [1, V.c0, V.L24, V.N24],
    [2, 'Intereses Sobre Prestaciones Sociales (Art. 143 LOTTT)', '', V.N25],
    [3, 'Diferencia de Utilidades', '', V.N26],
    [4, V.c4, V.L27, V.N27],
    [5, V.c5, V.L28, V.N28],
    [6, V.c6, S.l29, V.N29],
    [7, V.c7, S.l30, V.N30],
    [8, 'Otras Asignaciones', S.l31, V.N31]
  ];

  const dr = [
    [1, 'Aporte Reg. Prest. Vivienda y Hab. (FAOV)', (S.faov * 100).toFixed(2) + '%', V.N36],
    [2, 'Retención IVSS', '', V.N37],
    [3, 'Retención RPE', '', V.N38],
    [4, 'Retención INCES sobre Diferencia de Utilidades 2026', (S.inces * 100).toFixed(2) + '%', V.N39],
    [5, 'Retención ISLR', (S.islr * 100).toFixed(2) + '%', V.N40]
  ];

  return \`
    <div class="sheet-action-bar no-print">
      <span style="font-weight:bold;color:#1e293b">
        \${isLOTTT ? 'Hoja 2: Liquidación de Control LOTTT' : 'Hoja 1: Liquidación según Empresa (Excel)'}
      </span>
      <div style="display:flex;gap:6px">
        <button onclick="downloadSinglePagePdf('\${isLOTTT ? 'doc_s3' : 'doc_s0'}', '\${isLOTTT ? 'Liquidacion_LOTTT' : 'Liquidacion_Empresa'}')" class="btn-red" style="font-size:11px">
          📥 Descargar a PDF (1 Página)
        </button>
        <button onclick="exportWord(\${isLOTTT})" style="background:#1d4ed8;color:#fff;border-color:#3b82f6;font-size:11px">
          📄 Exportar a Word (.doc)
        </button>
      </div>
    </div>

    <div class="flex">
      <div class="doc" id="\${isLOTTT ? 'doc_s3' : 'doc_s0'}">
        
        <div class="top-header">
          <div class="logo-box">
            <svg width="34" height="34" viewBox="0 0 100 100">
              <polygon points="50,15 15,75 40,75 50,45 60,75 85,75" fill="#15803d" />
              <polygon points="50,15 40,75 50,45" fill="#ea580c" />
              <polygon points="50,15 60,75 50,45" fill="#3b82f6" />
            </svg>
            <div>
              <b style="font-size:14px;color:#1e3a1e;letter-spacing:0.5px">\${S.emp || 'AGRIBIENES C.A.'}</b><br>
              <span style="font-size:9.5px;color:#475569">\${S.rif || 'RIF: J-31471703-0'}</span>
            </div>
          </div>

          <div class="date-box">
            <div class="dh">LUGAR Y FECHA</div>
            <div class="db">\${S.lugar || 'Puerto Cabello, ' + fd(S.egr)}</div>
          </div>
        </div>

        <div class="\${bannerClass}">\${title}</div>

        <div class="g">
          <div class="h" style="grid-column:span 4">NOMBRE Y APELLIDO</div>
          <div class="h" style="grid-column:span 5">CARGO</div>
          <div class="h" style="grid-column:span 3">C.I.</div>

          <div class="b" style="grid-column:span 4">\${S.nombre}</div>
          <div class="b" style="grid-column:span 5">\${S.cargo}</div>
          <div class="b" style="grid-column:span 3">\${mask(S.ci, true)}</div>

          <div class="h" style="grid-column:span 4">MOTIVO DEL EGRESO</div>
          <div class="h" style="grid-column:span 2">FECHA DE INGRESO</div>
          <div class="h" style="grid-column:span 2">FECHA DE EGRESO</div>
          <div class="h" style="grid-column:span 4">TIEMPO DE SERVICIO</div>

          <div class="b" style="grid-column:span 4">\${S.motivo}</div>
          <div style="grid-column:span 2">\${fd(S.ing)}</div>
          <div style="grid-column:span 2">\${fd(S.egr)}</div>
          <div style="grid-column:span 4" class="b">\${V.M12}</div>
        </div>

        <!-- Tiempo de servicio y Tasa BCV lateral -->
        <div class="g" style="margin-bottom:6px">
          <div class="h" style="grid-column:span 2">SALARIO BÁSICO</div>
          <div class="h" style="grid-column:span 2">SALARIO NORMAL</div>
          <div class="h" style="grid-column:span 2">SALARIO DIARIO</div>
          <div class="h" style="grid-column:span 2">ALÍC. BONO VAC.</div>
          <div class="h" style="grid-column:span 2">ALÍC. UTILIDADES</div>
          <div class="h" style="grid-column:span 2">SALARIO INTEGRAL</div>

          <div class="r" style="grid-column:span 2">\${mask(V.B15, false, true)}</div>
          <div class="r" style="grid-column:span 2">\${mask(S.dNormal, false, true)}</div>
          <div class="r" style="grid-column:span 2">\${mask(V.E15, false, true)}</div>
          <div class="r" style="grid-column:span 2">\${mask(V.H15, false, true)}</div>
          <div class="r" style="grid-column:span 2">\${mask(V.J15, false, true)}</div>
          <div class="r b" style="grid-column:span 2">\${mask(V.L15, false, true)}</div>
        </div>

        <div class="g">
          <div class="t" style="grid-column:span 8">GARANTÍA DE PRESTACIONES SOCIALES (Art. 142 LOTTT)</div>
          <div class="t" style="grid-column:span 2">DÍAS</div>
          <div class="t" style="grid-column:span 2">BS.</div>

          <div class="l" style="grid-column:span 8">\${V.c0 || 'Prestaciones Acumuladas + Complemento Art. 142'}</div>
          <div class="r b" style="grid-column:span 2">\${nf(V.K18, 0, 2)}</div>
          <div class="r b" style="grid-column:span 2">\${mask(V.L18, false, true)}</div>
        </div>

        <div class="g">
          <div class="h b" style="grid-column:span 12;font-size:10.5px">CÁLCULO</div>
          <div class="h" style="grid-column:span 1">COD</div>
          <div class="h" style="grid-column:span 7">CONCEPTO</div>
          <div class="h" style="grid-column:span 2">DÍAS</div>
          <div class="h" style="grid-column:span 2">BS.</div>

          \${cr.map(r => \`
            <div style="grid-column:span 1">\${r[0]}</div>
            <div class="l" style="grid-column:span 7">\${r[1]}</div>
            <div class="r b" style="grid-column:span 2">\${r[2] ? (typeof r[2] === 'number' ? nf(r[2], 0, 2) : r[2]) : ''}</div>
            <div class="r" style="grid-column:span 2">\${mask(r[3], false, true)}</div>
          \`).join('')}

          <div class="nb" style="grid-column:span 6"></div>
          <div class="nb r b" style="grid-column:span 4">TOTAL ASIGNACIONES</div>
          <div class="r b" style="grid-column:span 2;background:#f1f5f9">\${mask(V.M33, false, true)}</div>
        </div>

        <div class="g">
          <div class="t" style="grid-column:span 12">DEDUCCIONES</div>
          <div class="h" style="grid-column:span 1">COD</div>
          <div class="h" style="grid-column:span 7">CONCEPTO</div>
          <div class="h" style="grid-column:span 2">% / TASA</div>
          <div class="h" style="grid-column:span 2">BS.</div>

          \${dr.map(r => \`
            <div style="grid-column:span 1">\${r[0]}</div>
            <div class="l" style="grid-column:span 7">\${r[1]}</div>
            <div class="r" style="grid-column:span 2">\${r[2]}</div>
            <div class="r" style="grid-column:span 2">\${mask(r[3], false, true)}</div>
          \`).join('')}

          <div class="nb" style="grid-column:span 6"></div>
          <div class="nb r b" style="grid-column:span 4">TOTAL DEDUCCIONES</div>
          <div class="r b" style="grid-column:span 2;background:#f1f5f9">\${mask(V.M42, false, true)}</div>
        </div>

        <div class="g" style="margin-top:6px">
          <div class="nb" style="grid-column:span 4"></div>
          <div class="neto r" style="grid-column:span 4">NETO A PAGAR Bs.</div>
          <div class="neto r" style="grid-column:span 4">\${mask(V.M44, false, true)}</div>
        </div>

        <div class="sig">
          <div>REALIZADO POR: __________________________________</div>
          <div>AUTORIZADO POR: __________________________________</div>
        </div>

        <div class="legal">\${V.legal}</div>

        <div class="recibo-conforme-box">
          <div class="rc-left">
            <div style="text-align:center;font-weight:bold;text-decoration:underline;margin-bottom:8px">
              RECIBO CONFORME
            </div>
            <div class="rc-grid">
              <div>Nombre: ________________________</div>
              <div>Firma: ________________________</div>
              <div>C.I.: __________________________</div>
              <div>Fecha: ________________________</div>
            </div>
          </div>
          <div class="huella-box">
            Huellas Dactilares
          </div>
        </div>

      </div>

      <!-- Panel de Edición Lateral -->
      <aside class="panel no-print">
        <h4>Parámetros y Ajustes</h4>
        <label>Empresa <input value="\${S.emp}" onchange="set('emp', this.value); refresh()"></label>
        <label>Tasa BCV <input value="\${fi(S.tasa)}" onchange="set('tasa', pn(this.value)); refresh()"></label>
        <label>Sueldo base (US$) <input value="\${fi(S.baseUsd)}" onchange="set('baseUsd', pn(this.value)); refresh()"></label>
        <label>Cesta ticket (US$) <input value="\${fi(S.cestaUsd)}" onchange="set('cestaUsd', pn(this.value)); refresh()"></label>
        <label>Días bono vac. <input value="\${S.diasBV}" onchange="set('diasBV', pn(this.value)); refresh()"></label>
        <label>Días utilidades <input value="\${S.diasUt}" onchange="set('diasUt', pn(this.value)); refresh()"></label>
        <label>Días vac./año <input value="\${S.vacD}" onchange="set('vacD', pn(this.value)); refresh()"></label>
        <label>Días bono vac./año <input value="\${S.bvD}" onchange="set('bvD', pn(this.value)); refresh()"></label>
        <label>1era quincena (P36) <input value="\${fi(S.p36)}" onchange="set('p36', pn(this.value)); refresh()"></label>
        <label>Neto en US$ (÷ tasa) <b>\${mask(V.Q44, false, true)}</b></label>
      </aside>
    </div>
  \`;
}

// =========================================================================
// RENDERIZADO DE LAS DEMÁS HOJAS
// =========================================================================
function renderComparativo() {
  const V1 = calc(S), V2 = calc(lottt(S));
  const R = [
    ['1', 'Prestaciones sociales (garantía, Art. 142)', V1.L24, V1.N24, V2.L24, V2.N24, 'Art. 142 a, b y d: días por trimestre y literal c) comparado; salario integral.'],
    ['2', 'Intereses sobre prestaciones', '', V1.N25, '', V2.N25, 'Art. 143: tasa BCV sobre el saldo; se incluye el tramo hasta el egreso.'],
    ['3', 'Utilidades (diferencia / pago)', '', V1.N26, '', V2.N26, 'Arts. 131-132: utilidades del período menos anticipo pagado.'],
    ['4', 'Vacaciones fraccionadas', V1.L27, V1.N27, V2.L27, V2.N27, 'Arts. 190 y 196 LOTTT.'],
    ['5', 'Bono vacacional fraccionado', V1.L28, V1.N28, V2.L28, V2.N28, 'Art. 192: 15 días el primer año (+1 por año adicional).'],
    ['6', 'Sueldo días de egreso', S.l29, V1.N29, S.l29, V2.N29, 'Sin cambio.'],
    ['7', 'Cesta ticket días de egreso', S.l30, V1.N30, S.l30, V2.N30, 'Sin cambio.'],
    ['8', 'Otras asignaciones', S.l31, V1.N31, S.l31, V2.N31, 'Sin cambio.'],
    ['', 'TOTAL ASIGNACIONES', '', V1.M33, '', V2.M33, '', true],
    ['1', 'Aporte FAOV (1%)', '', V1.N36, '', V2.N36, 'Misma base que la hoja UTILIDADES.'],
    ['2', 'Retención IVSS', '', V1.N37, '', V2.N37, 'Sin cambio.'],
    ['3', 'Retención RPE', '', V1.N38, '', V2.N38, 'Sin cambio.'],
    ['4', 'Retención INCES (0,5%)', '', V1.N39, '', V2.N39, 'Sobre el pago de utilidades.'],
    ['5', 'Retención ISLR', '', V1.N40, '', V2.N40, 'Sin cambio.'],
    ['', 'TOTAL DEDUCCIONES', '', V1.M42, '', V2.M42, '', true],
    ['', 'NETO A PAGAR', '', V1.M44, '', V2.M44, '', true]
  ];

  return \`
    <div class="sheet-action-bar no-print">
      <span style="font-weight:bold;color:#1e293b">Hoja 3: Comparativo Empresa vs. LOTTT</span>
      <button onclick="downloadSheetPdf('s4', 'Comparativo_LOTTT')" class="btn-red" style="font-size:11px">
        📥 Descargar a PDF
      </button>
    </div>
    <div class="ti">COMPARATIVO: CÁLCULO DE LA EMPRESA (EXCEL) VS. CÁLCULO SEGÚN LA LOTTT</div>
    <div class="small">Diferencia = LOTTT − Excel. Positiva: el cálculo de la ley es mayor que el de la empresa.</div>
    <div class="wrap" style="max-height:none">
      <table class="t2">
        <thead>
          <tr>
            <th>#</th>
            <th style="text-align:left">CONCEPTO</th>
            <th>DÍAS (Excel)</th>
            <th>Bs. (Excel)</th>
            <th>DÍAS (LOTTT)</th>
            <th>Bs. (LOTTT)</th>
            <th>DIFERENCIA Bs.</th>
            <th style="text-align:left">FUNDAMENTO LEGAL LOTTT</th>
          </tr>
        </thead>
        <tbody>
          \${R.map(r => \`
            <tr \${r[7] ? 'class="tot"' : ''}>
              <td>\${r[0]}</td>
              <td style="text-align:left">\${r[1]}</td>
              <td>\${r[2] ? nf(r[2], 0, 2) : ''}</td>
              <td>\${mask(r[3], false, true)}</td>
              <td>\${r[4] ? nf(r[4], 0, 2) : ''}</td>
              <td>\${mask(r[5], false, true)}</td>
              <td><b>\${mask(r[5] - r[3], false, true)}</b></td>
              <td style="text-align:left;white-space:normal">\${r[6]}</td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>
  \`;
}

function renderPrestaciones() {
  const V = calc(S);
  return \`
    <div class="sheet-action-bar no-print">
      <span style="font-weight:bold;color:#1e293b">Hoja 4: Cálculo Mensual de Prestaciones Sociales</span>
      <button onclick="downloadSheetPdf('s1', 'Prestaciones_Mensuales')" class="btn-red" style="font-size:11px">
        📥 Descargar a PDF
      </button>
    </div>
    <div class="ti">\${S.emp}</div>
    <div class="ti" style="font-size:13px">CÁLCULO DE LAS PRESTACIONES SOCIALES</div>
    <div class="mt">
      <b>NOMBRE DEL TRABAJADOR:</b> \${S.nombre} &nbsp; &nbsp; <b>FECHA DE EGRESO:</b> \${fd(S.egr)}<br>
      <b>CÉDULA:</b> \${mask(S.ci, true)} &nbsp; &nbsp; <b>TIEMPO EN LA EMPRESA:</b> \${V.M12}<br>
      <b>CARGO:</b> \${S.cargo}
    </div>
    <div class="wrap">
      <table class="t2">
        <thead>
          <tr>
            <th>AÑO</th><th>MES</th><th>SUELDO</th><th>SALARIO DIARIO</th><th>AÑOS</th><th>MESES</th>
            <th>ALÍC. UT</th><th>ALÍC. BV</th><th>SUELDO INTEGRAL</th><th>SAL. INT. DIARIO</th>
            <th>DÍAS</th><th>DÍAS ADIC.</th><th>TOTAL DÍAS</th><th>PREST. MES</th><th>PREST. ACUM.</th>
            <th>ANTICIPO</th><th>SALDO</th><th>TASA %</th><th>INTERÉS MES</th><th>INTERÉS ACUM.</th>
          </tr>
        </thead>
        <tbody>
          \${S.rows.map((r, i) => {
            const n = 13 + i;
            return \`
              <tr>
                <td>\${r.a}</td><td>\${r.b}</td><td>\${mask(r.c, false, true)}</td><td>\${mask(V['pD' + n], false, true)}</td>
                <td>\${r.e}</td><td>\${r.f}</td><td>\${mask(V['pG' + n], false, true)}</td><td>\${mask(V['pH' + n], false, true)}</td>
                <td>\${mask(V['pI' + n], false, true)}</td><td>\${mask(V['pJ' + n], false, true)}</td><td>\${r.k}</td><td>\${r.l}</td>
                <td>\${nf(V['pM' + n], 0, 2)}</td><td>\${mask(V['pN' + n], false, true)}</td><td>\${mask(V['pO' + n], false, true)}</td>
                <td>\${mask(r.p, false, true)}</td><td>\${mask(V['pQ' + n], false, true)}</td><td>\${(r.r * 100).toFixed(2)}%</td>
                <td>\${mask(V['pT' + n], false, true)}</td><td>\${mask(V['pV' + n], false, true)}</td>
              </tr>
            \`;
          }).join('')}
          <tr class="tot">
            <td colspan="10">TOTALES</td>
            <td>\${nf(V.K69, 0, 2)}</td><td>\${nf(V.L69, 0, 2)}</td><td>\${nf(V.M69, 0, 2)}</td>
            <td>\${mask(V.N69, false, true)}</td><td></td><td>\${mask(V.P69, false, true)}</td>
            <td>\${mask(V.Q69, false, true)}</td><td></td><td>\${mask(V.T69, false, true)}</td>
            <td>\${mask(V.V69, false, true)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt">
      Suma sueldos últimos 6 meses: <b>\${mask(V.B71, false, true)}</b> &nbsp; &nbsp; 
      <b>Total Disponible para Anticipo (75% Art. 144 LOTTT):</b> \${mask(V.Q71, false, true)}
    </div>
  \`;
}

function renderUtilidades() {
  const V = calc(S);
  return \`
    <div class="sheet-action-bar no-print">
      <span style="font-weight:bold;color:#1e293b">Hoja 5: Devengado para Utilidades 2026</span>
      <button onclick="downloadSheetPdf('s2', 'Utilidades_2026')" class="btn-red" style="font-size:11px">
        📥 Descargar a PDF
      </button>
    </div>
    <div class="ti">DEVENGADO PARA UTILIDADES AÑO 2026</div>
    <div class="small">
      Fracción utilidades: <b>\${nf(V.T3, 4, 4)}</b> &nbsp; &nbsp; Tasa BCV: \${S.ut.w9}
    </div>
    <div class="wrap" style="max-height:none">
      <table class="t2">
        <thead>
          <tr>
            <th>ITEM</th><th>CÉDULA</th><th>NOMBRE</th><th>EMPRESA</th><th>CARGO</th>
            <th>TOTAL DEVENGADO</th><th>UTILIDADES 2026</th><th>ANTICIPO</th><th>0,5% INCES</th><th>1% FAOV</th>
            <th>TOTAL DEDUC.</th><th>TOTAL A PAGAR</th><th>US$</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td><td>\${mask(S.ci, true)}</td><td>\${S.nombre}</td><td>\${S.emp}</td><td>\${S.cargo}</td>
            <td>\${mask(V['b.S'], false, true)}</td><td>\${mask(V['b.T'], false, true)}</td>
            <td>\${mask(S.ut.b.u, false, true)}</td><td>\${mask(V['b.V'], false, true)}</td>
            <td>\${mask(V['b.W'], false, true)}</td><td>\${mask(V['b.Z'], false, true)}</td>
            <td>\${mask(V['b.AA'], false, true)}</td><td>$\${mask(V['b.AB'], false, true)}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="small" style="margin-top:10px">
      Diferencia de Utilidades a liquidar: <b>\${mask(V.R18, false, true)} Bs.</b>
    </div>
  \`;
}

// =========================================================================
// NUEVA HOJA 6: BASE DE DATOS E HISTORIAL DE LIQUIDACIONES
// =========================================================================
let dbRecords = [];

async function refreshHistoryData() {
  try {
    dbRecords = await dbGetAll();
    dbRecords.sort((a, b) => (b.fechaGuardado || '').localeCompare(a.fechaGuardado || ''));
  } catch (e) {
    console.warn(e);
  }
}

async function renderHistorySheet() {
  await refreshHistoryData();
  const totalBs = dbRecords.reduce((acc, r) => acc + (r.netoBs || 0), 0);
  const totalUsd = dbRecords.reduce((acc, r) => acc + (r.netoUsd || 0), 0);

  return \`
    <div class="sheet-action-bar no-print">
      <span style="font-weight:bold;color:#1e293b">Hoja 6: Base de Datos e Historial de Liquidaciones Guardadas</span>
      <div style="display:flex;gap:6px">
        <button onclick="downloadSheetPdf('s_history', 'Historial_Liquidaciones')" class="btn-red" style="font-size:11px">
          📥 Descargar Historial a PDF
        </button>
        <button onclick="exportDBBackup()" class="btn-gold" style="font-size:11px">
          💾 Exportar Respaldo BD
        </button>
        <label class="btn-lbl" style="font-size:11px;background:#047857">
          📂 Importar Respaldo
          <input type="file" accept=".json" onchange="importDBBackup(event)" hidden>
        </label>
      </div>
    </div>

    <!-- Tarjetas de métricas -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;margin-bottom:12px" class="no-print">
      <div style="background:#fff;padding:10px;border-radius:4px;border-left:4px solid #16a34a;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <span style="font-size:11px;color:#64748b;display:block">Expedientes Guardados</span>
        <b style="font-size:18px;color:#0f172a">\${dbRecords.length}</b>
      </div>
      <div style="background:#fff;padding:10px;border-radius:4px;border-left:4px solid #f59e0b;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <span style="font-size:11px;color:#64748b;display:block">Total Liquidado (Bs.)</span>
        <b style="font-size:18px;color:#b45309">\${mask(totalBs, false, true)}</b>
      </div>
      <div style="background:#fff;padding:10px;border-radius:4px;border-left:4px solid #3b82f6;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
        <span style="font-size:11px;color:#64748b;display:block">Total en Divisas (USD)</span>
        <b style="font-size:18px;color:#1d4ed8">$\${mask(totalUsd, false, true)}</b>
      </div>
    </div>

    <!-- Tabla del Historial -->
    <div class="wrap" style="max-height:65vh">
      <table class="t2">
        <thead>
          <tr>
            <th>#</th>
            <th style="text-align:left">TRABAJADOR</th>
            <th>CÉDULA</th>
            <th style="text-align:left">CARGO</th>
            <th>INGRESO</th>
            <th>EGRESO</th>
            <th>MOTIVO</th>
            <th>NETO BS.</th>
            <th>NETO USD</th>
            <th>FECHA GUARDADO</th>
            <th class="no-print">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          \${dbRecords.length === 0 ? \`
            <tr><td colspan="11" style="text-align:center;padding:20px;color:#64748b">
              No hay liquidaciones guardadas todavía. Haga clic en <b>💾 Guardar en BD</b> en cualquier liquidación para archivarla.
            </td></tr>
          \` : dbRecords.map((r, i) => \`
            <tr>
              <td>\${i + 1}</td>
              <td style="text-align:left"><b>\${r.nombre}</b></td>
              <td>\${mask(r.ci, true)}</td>
              <td style="text-align:left">\${r.cargo}</td>
              <td>\${fd(r.ing)}</td>
              <td>\${fd(r.egr)}</td>
              <td>\${r.motivo}</td>
              <td><b>\${mask(r.netoBs, false, true)}</b></td>
              <td style="color:#15803d">$\${mask(r.netoUsd, false, true)}</td>
              <td style="font-size:9.5px">\${r.fechaGuardado ? r.fechaGuardado.slice(0, 10) : ''}</td>
              <td class="no-print" style="text-align:center">
                <button onclick="loadFromHistory('\${r.id}')" style="font-size:10px;padding:2px 6px;background:#2563eb;color:#fff;border:0;border-radius:2px;cursor:pointer">
                  📂 Cargar
                </button>
                <button onclick="deleteFromHistory('\${r.id}', '\${r.nombre}')" style="font-size:10px;padding:2px 6px;background:#dc2626;color:#fff;border:0;border-radius:2px;cursor:pointer;margin-left:4px">
                  🗑️
                </button>
              </td>
            </tr>
          \`).join('')}
        </tbody>
      </table>
    </div>

    <!-- Opciones avanzadas de sistemas (Ocultas para no enredar al operador) -->
    <details class="no-print" style="margin-top:14px;background:#fff;padding:8px 12px;border:1px solid #cbd5e1;border-radius:4px">
      <summary style="cursor:pointer;font-weight:bold;color:#475569;font-size:11px">
        ⚙️ Herramientas avanzadas de sistemas y JSON
      </summary>
      <div style="padding-top:8px;display:flex;gap:8px">
        <button onclick="guardarJson()" style="font-size:11px;padding:4px 10px;cursor:pointer">⬇ Guardar archivo JSON</button>
        <button onclick="$('#fi').click()" style="font-size:11px;padding:4px 10px;cursor:pointer">⬆ Abrir archivo JSON</button>
        <input type="file" id="fi" accept=".json" onchange="abrirJson(event)" hidden>
      </div>
    </details>
  \`;
}

// =========================================================================
// ACCIONES Y DESCARGAS (PDF, Word, Base de Datos)
// =========================================================================
async function saveCurrentToDB() {
  const V = calc(S);
  const id = 'liq_' + Date.now();
  const record = {
    id,
    fechaGuardado: new Date().toISOString(),
    nombre: S.nombre || 'Trabajador',
    ci: S.ci || 'Sin cédula',
    cargo: S.cargo || 'Sin cargo',
    empresa: S.emp || 'Sin empresa',
    motivo: S.motivo || 'EGRESO',
    ing: S.ing,
    egr: S.egr,
    tasa: S.tasa,
    netoBs: V.M44 || 0,
    netoUsd: V.Q44 || 0,
    stateData: clone(S)
  };

  try {
    await dbSave(record);
    showMsg('✅ Liquidación de "' + S.nombre + '" guardada permanentemente en la Base de Datos.');
    if (currentTab === 5) render();
  } catch (e) {
    showMsg('Error al guardar en base de datos: ' + e.message, true);
  }
}

async function loadFromHistory(id) {
  const all = await dbGetAll();
  const found = all.find(r => r.id === id);
  if (found && found.stateData) {
    S = clone(found.stateData);
    showMsg('Expediente de "' + S.nombre + '" cargado en el calculador.');
    showTab(0);
  }
}

async function deleteFromHistory(id, nombre) {
  if (!confirm('¿Eliminar de la base de datos el expediente de "' + nombre + '"?')) return;
  await dbDelete(id);
  showMsg('Expediente eliminado.');
  render();
}

async function exportDBBackup() {
  const all = await dbGetAll();
  const blob = new Blob([JSON.stringify({ version: 1, records: all }, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'Respaldo_BaseDatos_Liquidaciones_LOTTT.json');
}

function importDBBackup(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const data = JSON.parse(reader.result);
      if (Array.isArray(data.records)) {
        for (const r of data.records) await dbSave(r);
        showMsg('Se importaron ' + data.records.length + ' expedientes con éxito.');
        render();
      }
    } catch (e) {
      showMsg('Archivo de respaldo no válido.', true);
    }
  };
  reader.readAsText(file);
}

// Descarga universal de archivo Blob compatible con Chrome, Edge, Firefox, Opera
function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {}
  }, 45000);
}

// Descarga a PDF ajustada a 1 SOLA HOJA para Hoja 1 y Hoja 2
function downloadSinglePagePdf(docId, prefix) {
  showMsg('⏳ Abriendo cuadro de impresión / Guardar como PDF en 1 SOLA HOJA...');
  const st = document.getElementById('pgst') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pgst' }));
  st.textContent = '@page{size:letter portrait;margin:5mm}';
  const oldTitle = document.title;
  document.title = prefix + '_' + (S.nombre || 'Trabajador').replace(/\\s+/g, '_');
  window.onafterprint = () => { document.title = oldTitle; };
  setTimeout(() => {
    try {
      window.print();
    } catch (e) {
      alert('Presione Ctrl+P para guardar como PDF.');
    }
  }, 200);
}

function downloadSheetPdf(sheetId, prefix) {
  const isWide = sheetId === 's4' || sheetId === 's1' || sheetId === 's2' || sheetId === 's_history';
  const st = document.getElementById('pgst') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pgst' }));
  st.textContent = isWide ? '@page{size:letter landscape;margin:6mm}' : '@page{size:letter portrait;margin:6mm}';
  const oldTitle = document.title;
  document.title = prefix + '_' + (S.nombre || 'Liquidacion').replace(/\\s+/g, '_');
  window.onafterprint = () => { document.title = oldTitle; };
  setTimeout(() => { window.print(); }, 200);
}

function downloadActivePdf() {
  if (currentTab === 0) downloadSinglePagePdf('doc_s0', 'Liquidacion_Empresa_Excel');
  else if (currentTab === 1) downloadSinglePagePdf('doc_s3', 'Liquidacion_LOTTT');
  else if (currentTab === 2) downloadSheetPdf('s4', 'Comparativo_LOTTT');
  else if (currentTab === 3) downloadSheetPdf('s1', 'Prestaciones_Mensuales');
  else if (currentTab === 4) downloadSheetPdf('s2', 'Utilidades_2026');
  else if (currentTab === 5) downloadSheetPdf('s_history', 'Historial_Liquidaciones');
}

function imprimir() {
  downloadActivePdf();
}

// Exportación a Word (.doc) con formato oficial y firmas
function exportWord(isLOTTT) {
  const V = calc(isLOTTT ? lottt(S) : S);
  const worker = S.nombre || 'Trabajador';
  const fileName = 'Liquidacion_' + worker.replace(/\\s+/g, '_') + '_' + (isLOTTT ? 'LOTTT' : 'Empresa') + '.doc';

  const wordHtml = \`
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Liquidación - \${worker}</title>
      <style>
        @page { size: letter portrait; margin: 1.2cm; }
        body { font-family: Calibri, Arial, sans-serif; font-size: 9.5pt; color: #000; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
        td, th { border: 1pt solid #000; padding: 3px 5px; font-size: 9pt; }
        .hdr { background-color: #d9d9d9; font-weight: bold; text-align: center; }
        .banner { background-color: \${isLOTTT ? '#1f4e8c' : '#404040'}; color: #fff; font-weight: bold; text-align: center; font-size: 11pt; padding: 5px; }
        .r { text-align: right; }
        .c { text-align: center; }
        .b { font-weight: bold; }
        .yellow { background-color: #ffff00; font-weight: bold; text-align: center; }
        .neto { background-color: #bfbfbf; font-size: 11pt; font-weight: bold; }
        .nb { border: none !important; }
        .legal { font-size: 8pt; text-align: justify; margin: 8px 0; line-height: 1.25; }
        .box-huella { width: 95px; height: 90px; border: 1.5pt solid #000; text-align: center; vertical-align: bottom; font-size: 8pt; font-weight: bold; }
      </style>
    </head>
    <body>
      <table style="border:none;margin-bottom:6px">
        <tr style="border:none">
          <td style="border:none;width:55%;vertical-align:top">
            <b style="font-size:13pt;color:#1e3a1e">\${S.emp || 'AGRIBIENES C.A.'}</b><br>
            <span style="font-size:9pt;color:#333">\${S.rif || 'RIF: J-31471703-0'}</span>
          </td>
          <td style="border:none;width:45%;vertical-align:top">
            <table style="border:1.5pt solid #000">
              <tr><td class="hdr">LUGAR Y FECHA</td></tr>
              <tr><td class="c b">\${S.lugar || 'Puerto Cabello, ' + fd(S.egr)}</td></tr>
            </table>
          </td>
        </tr>
      </table>

      <div class="banner">\${isLOTTT ? 'LIQUIDACIÓN REVISADA SEGÚN LA LOTTT' : 'RECIBO DE LIQUIDACIÓN DE PRESTACIONES'}</div>

      <table>
        <tr><td class="hdr" style="width:35%">NOMBRE Y APELLIDO</td><td class="hdr" style="width:40%">CARGO</td><td class="hdr" style="width:25%">C.I.</td></tr>
        <tr><td class="c b">\${S.nombre}</td><td class="c b">\${S.cargo}</td><td class="c b">\${S.ci}</td></tr>
        <tr><td class="hdr">MOTIVO DEL EGRESO</td><td class="hdr">FECHA DE INGRESO</td><td class="hdr">FECHA DE EGRESO</td></tr>
        <tr><td class="c b">\${S.motivo}</td><td class="c">\${fd(S.ing)}</td><td class="c">\${fd(S.egr)}</td></tr>
      </table>

      <table>
        <tr><td class="hdr" colspan="3">TIEMPO DE SERVICIO</td><td class="hdr" colspan="2">TASA BCV AL \${fd(S.egr)}</td></tr>
        <tr>
          <td class="c b">AÑOS: \${V.P12}</td>
          <td class="yellow">MESES: \${V.Q12}</td>
          <td class="c b">DÍAS: \${V.R12}</td>
          <td class="c b" colspan="2">\${nf(S.tasa)} Bs/USD</td>
        </tr>
      </table>

      <table>
        <tr class="hdr">
          <td>SALARIO BÁSICO</td><td>SALARIO NORMAL</td><td>SALARIO DIARIO</td><td>ALÍC. BONO VAC.</td><td>ALÍC. UTILIDADES</td><td>SALARIO INTEGRAL</td>
        </tr>
        <tr>
          <td class="r">\${nf(V.B15)}</td><td class="r">\${nf(S.dNormal)}</td><td class="r">\${nf(V.E15)}</td><td class="r">\${nf(V.H15)}</td><td class="r">\${nf(V.J15)}</td><td class="r b">\${nf(V.L15)}</td>
        </tr>
      </table>

      <table>
        <tr class="hdr"><td style="width:70%">GARANTÍA DE PRESTACIONES SOCIALES (Art. 142 LOTTT)</td><td style="width:15%">DÍAS</td><td style="width:15%">BS.</td></tr>
        <tr><td>\${V.c0}</td><td class="c b">\${nf(V.K18, 0, 2)}</td><td class="r b">\${nf(V.L18)}</td></tr>
      </table>

      <table>
        <tr><td class="hdr b" colspan="4">CÁLCULO DE ASIGNACIONES</td></tr>
        <tr class="hdr"><td style="width:6%">COD</td><td style="width:64%">CONCEPTO</td><td style="width:15%">DÍAS</td><td style="width:15%">BS.</td></tr>
        <tr><td class="c">1</td><td>\${V.c0}</td><td class="c b">\${nf(V.L24, 0, 2)}</td><td class="r">\${nf(V.N24)}</td></tr>
        <tr><td class="c">2</td><td>Intereses Sobre Prestaciones Sociales (Art. 143 LOTTT)</td><td class="c">—</td><td class="r">\${nf(V.N25)}</td></tr>
        <tr><td class="c">3</td><td>Diferencia de Utilidades</td><td class="c">—</td><td class="r">\${nf(V.N26)}</td></tr>
        <tr><td class="c">4</td><td>\${V.c4}</td><td class="c b">\${nf(V.L27, 0, 2)}</td><td class="r">\${nf(V.N27)}</td></tr>
        <tr><td class="c">5</td><td>\${V.c5}</td><td class="c b">\${nf(V.L28, 0, 2)}</td><td class="r">\${nf(V.N28)}</td></tr>
        <tr><td class="c">6</td><td>\${V.c6}</td><td class="c b">\${S.l29}</td><td class="r">\${nf(V.N29)}</td></tr>
        <tr><td class="c">7</td><td>\${V.c7}</td><td class="c b">\${S.l30}</td><td class="r">\${nf(V.N30)}</td></tr>
        <tr><td class="c">8</td><td>Otras Asignaciones</td><td class="c b">\${S.l31}</td><td class="r">\${nf(V.N31)}</td></tr>
        <tr><td class="nb" colspan="2"></td><td class="hdr b r">TOTAL ASIGNACIONES</td><td class="r b" style="background:#f1f5f9">\${nf(V.M33)}</td></tr>
      </table>

      <table>
        <tr><td class="banner" colspan="4" style="font-size:9.5pt;padding:2px">DEDUCCIONES</td></tr>
        <tr class="hdr"><td style="width:6%">COD</td><td style="width:64%">CONCEPTO</td><td style="width:15%">% / TASA</td><td style="width:15%">BS.</td></tr>
        <tr><td class="c">1</td><td>Aporte Reg. Prest. Vivienda y Hábitat (FAOV)</td><td class="c">\${(S.faov * 100).toFixed(2)}%</td><td class="r">\${nf(V.N36)}</td></tr>
        <tr><td class="c">2</td><td>Retención IVSS</td><td class="c">—</td><td class="r">\${nf(V.N37)}</td></tr>
        <tr><td class="c">3</td><td>Retención RPE</td><td class="c">—</td><td class="r">\${nf(V.N38)}</td></tr>
        <tr><td class="c">4</td><td>Retención INCES</td><td class="c">\${(S.inces * 100).toFixed(2)}%</td><td class="r">\${nf(V.N39)}</td></tr>
        <tr><td class="c">5</td><td>Retención ISLR</td><td class="c">\${(S.islr * 100).toFixed(2)}%</td><td class="r">\${nf(V.N40)}</td></tr>
        <tr><td class="nb" colspan="2"></td><td class="hdr b r">TOTAL DEDUCCIONES</td><td class="r b" style="background:#f1f5f9">\${nf(V.M42)}</td></tr>
      </table>

      <table>
        <tr class="neto">
          <td class="nb" style="width:30%"></td>
          <td class="r b" style="width:35%">NETO A PAGAR Bs.</td>
          <td class="r b" style="width:35%;font-size:12pt">\${nf(V.M44)} Bs.</td>
        </tr>
      </table>

      <table style="border:none;margin-top:10px">
        <tr style="border:none">
          <td style="border:none;width:50%;font-weight:bold">REALIZADO POR: ________________________</td>
          <td style="border:none;width:50%;font-weight:bold;text-align:right">AUTORIZADO POR: ________________________</td>
        </tr>
      </table>

      <div class="legal">\${V.legal}</div>

      <table style="border:none;margin-top:6px">
        <tr style="border:none">
          <td style="border:none;width:75%;vertical-align:top">
            <div style="text-align:center;font-weight:bold;text-decoration:underline;margin-bottom:8px">RECIBO CONFORME</div>
            <table style="border:none;font-size:9pt;width:100%">
              <tr style="border:none"><td>Nombre: ________________________</td><td>Firma: ________________________</td></tr>
              <tr style="border:none"><td>C.I.: __________________________</td><td>Fecha: ________________________</td></tr>
            </table>
          </td>
          <td style="border:none;width:25%;text-align:center;vertical-align:middle">
            <div class="box-huella"><br><br>Huellas Dactilares</div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  \`;

  const blob = new Blob(['\\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, fileName);
}

function guardarJson() {
  const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'liquidacion_' + (S.nombre || 'trabajador').replace(/\\s+/g, '_') + '.json');
}

function abrirJson(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      S = JSON.parse(reader.result);
      render();
      showMsg('Archivo JSON cargado.');
    } catch (e) {
      showMsg('Archivo no válido: ' + e.message, true);
    }
  };
  reader.readAsText(file);
}

function nuevo() {
  if (!confirm('¿Iniciar liquidación en blanco?')) return;
  const b = clone(D0);
  const today = new Date().toISOString().slice(0, 10);
  Object.assign(b, { nombre: '', ci: '', cargo: '', motivo: 'RENUNCIA', dNormal: 0, p36: 0, l29: 0, l30: 0, l31: 0, ing: today, egr: today });
  b.rows.forEach(r => Object.assign(r, { c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, u: 0 }));
  S = b;
  render();
  showMsg('Liquidación en blanco inicializada.');
}

function ejemplo() {
  S = clone(D0);
  render();
  showMsg('Ejemplo modelo cargado.');
}

function showMsg(text, isError = false) {
  const m = $('#msg');
  m.innerHTML = '<div class="' + (isError ? 'e' : '') + '"><span>' + text + '</span><a href="#" onclick="$(\\'#msg\\').innerHTML=\\'\\';return false" style="color:#64748b;font-weight:bold;margin-left:12px">✕ cerrar</a></div>';
}

function showTab(i) {
  currentTab = i;
  document.querySelectorAll('.sheet').forEach((s, j) => s.classList.toggle('on', j === i));
  document.querySelectorAll('.tabs button').forEach((b, j) => b.classList.toggle('on', j === i));
  if (i === 5) render();
}

async function render() {
  const tabs = [
    'LIQUIDACIÓN (Excel)',
    'LIQUIDACIÓN LOTTT',
    'COMPARATIVO',
    (S.nombre || 'TRABAJADOR').toUpperCase(),
    'UTILIDADES 2026',
    '📂 BASE DE DATOS / HISTORIAL'
  ];

  $('#tabs').innerHTML = tabs.map((t, i) =>
    '<button class="' + (i === currentTab ? 'on' : '') + (i === 5 ? ' font-bold' : '') + '" onclick="showTab(' + i + ')">' + t + '</button>'
  ).join('');

  let content = '';
  content += '<div class="sheet ' + (currentTab === 0 ? 'on' : '') + '" id="s0">' + renderReceipt(false) + '</div>';
  content += '<div class="sheet ' + (currentTab === 1 ? 'on' : '') + '" id="s3">' + renderReceipt(true) + '</div>';
  content += '<div class="sheet ' + (currentTab === 2 ? 'on' : '') + '" id="s4">' + renderComparativo() + '</div>';
  content += '<div class="sheet ' + (currentTab === 3 ? 'on' : '') + '" id="s1">' + renderPrestaciones() + '</div>';
  content += '<div class="sheet ' + (currentTab === 4 ? 'on' : '') + '" id="s2">' + renderUtilidades() + '</div>';
  content += '<div class="sheet ' + (currentTab === 5 ? 'on' : '') + '" id="s_history">' + (await renderHistorySheet()) + '</div>';

  $('#app').innerHTML = content;
}

function refresh() {
  try { localStorage.setItem('liq1', JSON.stringify(S)); } catch (e) {}
  render();
}

// Carga inicial
render();
</script>
</body>
</html>`;
}
