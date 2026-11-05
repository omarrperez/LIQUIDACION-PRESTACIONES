/**
 * Motor de Cálculo Jurídico y Financiero de Liquidaciones de Prestaciones Sociales
 * de conformidad con la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT) de Venezuela (Gaceta Oficial N° 6.076 Extraordinario de 7 de mayo de 2012).
 * 
 * Artículos Fundamentales Aplicados:
 * - Art. 141: Régimen de Prestaciones Sociales (derecho adquirido, indemnización por antigüedad).
 * - Art. 142: Garantía de Prestaciones y Cálculo Definitivo:
 *     a) 15 días de salario integral por cada trimestre iniciado.
 *     b) 2 días de salario adicionales por cada año cumplido después del 1er año (hasta 30 días).
 *     c) Al término, 30 días de salario integral por cada año de servicio o fracción superior a 6 meses.
 *     d) Pago del monto mayor entre la garantía acumulada (a+b) y el cálculo retroactivo del literal c.
 *     e) Si la relación termina antes del primer trimestre, 5 días por mes trabajado o fracción mayor a 14 días.
 *     f) Pago oportuno dentro de los 5 días siguientes al egreso; mora genera intereses a tasa activa fijada por el BCV.
 * - Art. 143: Depósito y cálculo mensual de intereses sobre prestaciones sociales a tasa fijada por el BCV.
 * - Art. 131 y 132: Beneficios / Utilidades legales (mínimo 30 días, máximo 120 días).
 * - Art. 190 y 192: Vacaciones (15 días + 1 por año adicional) y Bono Vacacional (15 días + 1 por año adicional).
 * - Arts. 104 y 122: Salario Normal y Salario Integral con alícuotas legales.
 */

import { LiquidationState, CalculatedValues, MonthRow } from '../types';

export const MES = [
  'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
  'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

export const D0: LiquidationState = {
  emp: "AGRI BIENES, C.A.",
  rif: "RIF: J-31471703-0",
  lugar: "Puerto Cabello, 02/11/2026",
  nombre: "WUAYNEL DELPINO",
  ci: "V-14.848.682",
  cargo: "CHEQUEADOR",
  motivo: "RENUNCIA",
  ing: "2026-05-18",
  egr: "2026-11-02",
  tasa: 889.57,
  baseUsd: 60,
  dNormal: 104459.97758522729,
  diasBV: 15,
  diasUt: 120,
  vacD: 15,
  bvD: 16,
  mf: null,
  l29: 2,
  l30: 2,
  l31: 2,
  cestaUsd: 40,
  otrasUsd: 6.66666666666667,
  p36: 0,
  faov: 0.01,
  inces: 0.005,
  islr: 0.0002,
  ivssBase: 650,
  ivssPct: 0.04,
  rpeBase: 1300,
  rpePct: 0.005,
  sem: 1,
  q7: 0,
  intTail: 0,
  faovUt: 0,
  escOtras: 0,
  xin: {},
  xo: {},
  crit: 0,
  utMode: 0,
  litc: 1,
  rows: [
    { a: 2020, b: "NOVIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.3108, u: 0 },
    { a: 2020, b: "DICIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.3108, u: 0 },
    { a: 2021, b: "ENERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.318, u: 0 },
    { a: 2021, b: "FEBRERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4067, u: 0 },
    { a: 2021, b: "JUNIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4734, u: 0 },
    { a: 2021, b: "JULIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4736, u: 0 },
    { a: 2021, b: "AGOSTO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4736, u: 0 },
    { a: 2021, b: "SEPTIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4736, u: 0 },
    { a: 2021, b: "OCTUBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4643, u: 0 },
    { a: 2021, b: "NOVIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4643, u: 0 },
    { a: 2021, b: "DICIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4643, u: 0 },
    { a: 2022, b: "ENERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4718, u: 0 },
    { a: 2022, b: "FEBRERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.47, u: 0 },
    { a: 2022, b: "MARZO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4609, u: 0 },
    { a: 2022, b: "ABRIL", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4598, u: 0 },
    { a: 2022, b: "MAYO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4707, u: 0 },
    { a: 2022, b: "JUNIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4669, u: 0 },
    { a: 2022, b: "JULIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4672, u: 0 },
    { a: 2022, b: "AGOSTO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2022, b: "SEPTIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2022, b: "OCTUBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2022, b: "NOVIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2022, b: "DICIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2023, b: "ENERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2023, b: "FEBRERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4682, u: 0 },
    { a: 2023, b: "MARZO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4662, u: 0 },
    { a: 2023, b: "ABRIL", c: 0, e: 0, f: 1, k: 0, l: 0, p: 0, r: 0.4679, u: 0 },
    { a: 2023, b: "MAYO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4481, u: 0 },
    { a: 2023, b: "JUNIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4481, u: 0 },
    { a: 2023, b: "JULIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4589, u: 0 },
    { a: 2023, b: "AGOSTO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0, u: 0 },
    { a: 2023, b: "SEPTIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0, u: 0 },
    { a: 2023, b: "OCTUBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0, u: 0 },
    { a: 2024, b: "ENERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4614, u: 0 },
    { a: 2024, b: "FEBRERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.473, u: 0 },
    { a: 2024, b: "MARZO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4749, u: 0 },
    { a: 2024, b: "ABRIL", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4749, u: 0 },
    { a: 2024, b: "MAYO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.476, u: 0 },
    { a: 2024, b: "JUNIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4763, u: 0 },
    { a: 2024, b: "JULIO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.476, u: 0 },
    { a: 2024, b: "AGOSTO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4763, u: 0 },
    { a: 2024, b: "SEPTIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4762, u: 0 },
    { a: 2024, b: "OCTUBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4762, u: 0 },
    { a: 2024, b: "NOVIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4762, u: 0 },
    { a: 2024, b: "DICIEMBRE", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4762, u: 0 },
    { a: 2025, b: "ENERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4769, u: 0 },
    { a: 2025, b: "FEBRERO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4769, u: 0 },
    { a: 2025, b: "MARZO", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4768, u: 0 },
    { a: 2025, b: "ABRIL", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4768, u: 0 },
    { a: 2026, b: "", c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4746, u: 0 },
    { a: 2026, b: "MAYO", c: 13793.122199999998, e: 0, f: 0, k: 0, l: 0, p: 0, r: 0.4752, u: 0 },
    { a: 2026, b: "JUNIO", c: 72895.48772727272, e: 0, f: 1, k: 0, l: 0, p: 0, r: 0.4756, u: 0 },
    { a: 2026, b: "JULIO", c: 79472.30157954546, e: 0, f: 2, k: 0, l: 0, p: 0, r: 0.4752, u: 0 },
    { a: 2026, b: "AGOSTO", c: 96599.86162499999, e: 0, f: 3, k: 15, l: 0, p: 0, r: 0.4746, u: 0 },
    { a: 2026, b: "SEPTIEMBRE", c: 94990.0043181818, e: 0, f: 4, k: 0, l: 0, p: 0, r: 0.4746, u: 0 },
    { a: 2026, b: "OCTUBRE", c: 104459.97758522729, e: 0, f: 5, k: 15, l: 0, p: 0, r: 0.4746, u: 0 }
  ],
  ut: {
    w9: 886.22,
    vd: "2026-10-23",
    aa9: 10439164.258852182,
    a: {
      m: [0, 0, 0, 0, 13793.122199999998, 72895.48772727272, 79472.30157954546, 96599.86162499999, 94990.0043181818, 0, 0, 0],
      u: 0,
      x: 0.0002,
      ac: 60
    },
    b: {
      m: [0, 0, 0, 0, 13793.122199999998, 72895.48772727272, 79472.30157954546, 96599.86162499999, 94990.0043181818, 104459.97758522729, 0, 0],
      u: 0,
      x: 0.0002,
      ac: 60
    }
  }
};

export const clone = <T>(o: T): T => JSON.parse(JSON.stringify(o));

// Formato de números con estándar bancario y contable venezolano (1.234,56)
export const nf = (x: number | string | null | undefined, a = 2, b = 2): string => {
  if (x == null || x === '') return '';
  const n = typeof x === 'number' ? x : parseFloat(String(x));
  if (isNaN(n)) return '';
  return n.toLocaleString('es-VE', { minimumFractionDigits: a, maximumFractionDigits: b });
};

// Formato de fecha YYYY-MM-DD -> DD/MM/YYYY
export const fd = (i: string | null | undefined): string => {
  if (!i) return '';
  return i.split('-').reverse().join('/');
};

// Parser de números con comas o puntos
export const pn = (s: string | number | null | undefined): number => {
  if (typeof s === 'number') return s;
  let str = String(s || '').trim().replace(/\s/g, '');
  if (!str) return 0;
  if (str.includes(',')) str = str.replace(/\./g, '').replace(',', '.');
  const x = parseFloat(str);
  return isNaN(x) ? 0 : x;
};

// Formateo para inputs de edición
export const fi = (x: number | string | null | undefined, t = 'n'): string => {
  if (x == null || x === '') return '';
  const num = typeof x === 'number' ? x : parseFloat(String(x));
  if (isNaN(num)) return '';
  return t === 'p' ? String(+(num * 100).toFixed(4)).replace('.', ',') : String(+num.toFixed(6)).replace('.', ',');
};

// Cálculo de diferencia de fechas (Años, Meses, Días)
export function datedif(a: Date, b: Date): [number, number, number] {
  let y = b.getFullYear() - a.getFullYear();
  let m = b.getMonth() - a.getMonth();
  let d = b.getDate() - a.getDate();
  if (d < 0) {
    m--;
    d += new Date(b.getFullYear(), b.getMonth(), 0).getDate();
  }
  if (m < 0) {
    y--;
    m += 12;
  }
  return [y, m, d];
}

// Plan de cálculo de días según Art. 142 LOTTT
export function plan(S: LiquidationState): { K: number[]; L: number[] } {
  const ing = new Date(S.ing + 'T00:00');
  const egr = new Date(S.egr + 'T00:00');
  const dd = egr >= ing ? datedif(ing, egr) : [0, 0, 0];
  const im = ing.getFullYear() * 12 + ing.getMonth();
  const em = egr.getFullYear() * 12 + egr.getMonth();
  const tm = dd[0] * 12 + dd[1];
  const K: number[] = S.rows.map(() => 0);
  const L: number[] = K.slice();
  let last = -1;

  S.rows.forEach((r, i) => {
    const m = MES.indexOf(String(r.b).trim().toUpperCase());
    if (m < 0) return;
    const x = (+r.a) * 12 + m;
    const mi = x - im;
    if (x <= em) last = i;
    if (mi > 0 && mi <= tm) {
      if (mi % 3 === 0) K[i] = 15;
      if (mi % 12 === 0 && mi / 12 >= 2) L[i] = Math.min(2 * (mi / 12 - 1), 30);
    }
  });

  if (S.crit === 0 && tm >= 3 && (tm % 3 !== 0 || dd[2] > 0) && last >= 0) {
    K[last] += 15;
  }

  return { K, L };
}

// Cálculo principal del estado
export function calc(S: LiquidationState): CalculatedValues {
  const V: CalculatedValues = {};
  const t = S.tasa;
  const fu = S.diasUt / 360;
  const fb = S.diasBV / 360;
  const ing = new Date(S.ing + 'T00:00');
  const egr = new Date(S.egr + 'T00:00');
  const dd = egr >= ing ? datedif(ing, egr) : [0, 0, 0];

  Object.assign(V, {
    P12: dd[0],
    Q12: dd[1],
    R12: dd[2],
    M12: `${dd[0]} Años, ${dd[1]} Meses y ${dd[2]} días`
  });

  // HOJA LIQUIDACION
  V.B15 = S.baseUsd * t;
  const E = S.dNormal / 30;
  V.E15 = E;
  V.H15 = fb * E;
  V.J15 = fu * E;
  V.L15 = E + V.H15 + V.J15;

  // HOJA PRESTACIONES (hoja del trabajador)
  let M = 0, O = 0, Q = 0, Vc = 0, sK = 0, sL = 0, sN = 0, sP = 0, sT = 0, sU = 0;

  S.rows.forEach((r, i) => {
    const n = 13 + i;
    const d = r.c / 30;
    const g = fu * d;
    const h = fb * d;
    const j = d + g + h;
    const kl = r.k + r.l;
    const N = j * kl;
    M += kl;
    O += N;
    Q += N - r.p;
    const T = Q * r.r / 12;
    Vc += T - r.u;

    Object.assign(V, {
      ['pD' + n]: d,
      ['pG' + n]: g,
      ['pH' + n]: h,
      ['pI' + n]: n >= 15 ? j * 30 : '',
      ['pJ' + n]: j,
      ['pM' + n]: M,
      ['pN' + n]: N,
      ['pO' + n]: O,
      ['pQ' + n]: Q,
      ['pT' + n]: T,
      ['pV' + n]: Vc
    });

    sK += r.k;
    sL += r.l;
    sN += N;
    sP += r.p;
    sT += T;
    sU += r.u;
  });

  Object.assign(V, {
    K69: sK,
    L69: sL,
    M69: sK + sL,
    N69: sN,
    P69: sP,
    Q69: sN - sP,
    T69: sT,
    U69: sU,
    V69: sT - sU,
    Q71: (sN - sP) * 0.75,
    B71: S.rows.slice(-6).reduce((a, r) => a + r.c, 0)
  });

  // HOJA UTILIDADES
  const w = S.ut.w9;
  const u = (x: { m: number[]; u: number; x: number; ac: number }, t1: number) => {
    const m = x.m.slice();
    if (t1) {
      m[9] = x.ac * w;
      m[10] = x.ac / 30 * 18 * w;
    }
    const s = m.reduce((a, b) => a + b, 0);
    const T = s * fu;
    const v = T * 0.005;
    const f = T * 0.01;
    const y = T * x.x;
    const z = x.u + v + f + y;
    const a = T - z;
    return { S: s, T, V: v, W: f, Y: y, Z: z, AA: a, AB: a / w, U: x.u, P: m[9], Q: m[10] };
  };

  const A = u(S.ut.a, 1);
  const B = u(S.ut.b, 0);
  for (const k in A) V['a.' + k] = (A as any)[k];
  for (const k in B) V['b.' + k] = (B as any)[k];

  Object.assign(V, {
    R16: B.S,
    R17: A.S,
    R18: B.S - A.S,
    V18: B.V - A.V,
    AA8: A.AA / w,
    AA11: S.ut.aa9 - A.AA,
    T3: fu
  });

  // HOJA LIQUIDACION - cálculo de conceptos
  const rl = [...S.rows].reverse().find(r => r.r > 0);
  const tail = S.intTail && rl ? (sN - sP) * rl.r / 12 * (egr.getDate() / 30) : 0;
  const fr = (dd[1] > 6 || (dd[1] === 6 && dd[2] > 0)) ? 1 : 0;
  const litDays = 30 * (dd[0] + fr);
  const litAmt = S.litc ? litDays * V.L15 : 0;
  const useC = litAmt > sN;
  const mf = S.mf == null ? dd[1] : S.mf;
  const L27 = S.vacD / 12 * mf;
  const L28 = S.bvD / 12 * mf;

  Object.assign(V, {
    K18: useC ? litDays : sK + sL,
    L18: useC ? litAmt : sN,
    L24: useC ? litDays : sK + sL,
    N24: useC ? litAmt : sN,
    N25: V.V69 + tail,
    N26: S.utMode === 1 ? B.T - A.T : S.utMode === 2 ? B.T - S.ut.b.u : V.R18,
    garantia: sN,
    litDays,
    litAmt,
    useC,
    L27,
    L28,
    N27: L27 * E,
    N28: L28 * E,
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
    c4: `Art. 196. LOTTT - Vacaciones Fraccionadas periodo ${ay}/${ay + 1}`,
    c5: `Art. 196. LOTTT - Bono vacacional Fraccionado ${ay}/${ay + 1}`,
    c6: `Sueldo del 01 al ${fd(S.egr)}`,
    c7: `Cesta Tickets del 01 al ${fd(S.egr)}`,
    nombre: S.nombre,
    ci: S.ci,
    cargo: S.cargo,
    empresa: S.emp,
    ingf: fd(S.ing),
    egrf: fd(S.egr),
    ing_d: '' + ing.getDate(),
    ing_m: '' + (ing.getMonth() + 1),
    ing_y: '' + ing.getFullYear(),
    tab: (S.nombre || 'TRABAJADOR').toUpperCase(),
    tasaLbl: 'Tasa BCV al ' + fd(S.egr),
    legal: `Por todo lo antes expuesto y despues de haber leído y verificado a satisfacción lo especificado en el presente documento, declaro que nada queda a deberme ${S.emp} ni sus empresas filiales, subsidiarias y relacionadas, por ningun concepto vinculado o derivado de mi relación de trabajo, ni conceptos relacionados con bonificación de alimentación o cesta ticket, por el tiempo aqui señalado y por cualquier otro periodo anterior al mismo; estoy conforme con las deducciones hechas, las cuales he autorizado. En consecuencia, ${S.emp} y sus empresas filiales y relacionadas quedan liberadas de toda responsabilidad directa o indirectamente vinculada con las disposiciones legales y/o contractuales que sobre el trabajo, higiene y seguridad laboral y social existen, sin reserva de acción alguna que ejercitar en su contra. Acepto el pago correspondiente en moneda de curso legal a través de transferencia bancaria.`
  });

  return V;
}

// Cálculo de control estricto LOTTT
export function lottt(S: LiquidationState): LiquidationState {
  const X = clone(S);
  const ing = new Date(S.ing + 'T00:00');
  const egr = new Date(S.egr + 'T00:00');
  const y = egr >= ing ? datedif(ing, egr)[0] : 0;

  X.vacD = X.bvD = Math.min(15 + y, 30);
  X.litc = 1;
  X.crit = 0;
  X.utMode = 2;
  X.intTail = 1;
  X.faovUt = 1;

  if (S.escOtras) {
    const add = S.otrasUsd * 30 * S.tasa;
    const im = ing.getFullYear() * 12 + ing.getMonth();
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
  X.rows.forEach((r, i) => {
    r.k = p.K[i];
    r.l = p.L[i];
  });

  const mi = egr.getMonth();
  if (!(X.ut.b.m[mi] > 0)) {
    X.ut.b.m[mi] = X.dNormal / 30 * egr.getDate();
  }

  return X;
}

// Auditoría legal de conformidad con la LOTTT
export function audit(S: LiquidationState, V: CalculatedValues): { type: 'ok' | 'w'; text: string }[] {
  const A: { type: 'ok' | 'w'; text: string }[] = [];
  const E = V.E15;
  const y = V.P12;
  const ex = Math.min(15 + y, 30);
  const p = plan(S);
  const pk = p.K.reduce((a, b) => a + b, 0) + p.L.reduce((a, b) => a + b, 0);
  const cg = V.K69 + V.L69;
  const w = (t: string) => A.push({ type: 'w', text: t });

  A.push({
    type: 'ok',
    text: `Garantía Art. 142 a/b: <b>${nf(V.garantia)}</b> Bs (${cg} días). Literal c: <b>${nf(V.litAmt)}</b> Bs (${V.litDays} días). Se paga el mayor (Art. 142 d LOTTT).`
  });

  if (pk !== cg) {
    w(`Días de garantía cargados: ${cg}; según Art. 142 a/b (trimestre ${S.crit ? 'cumplido' : 'iniciado'}): ${pk}. Use "Calcular días" en la hoja del trabajador.`);
  }

  if (S.vacD !== ex) {
    w(`Vacaciones: en el año de servicio ${y + 1} corresponden ${ex} días (Art. 190); hay ${S.vacD}.`);
  }

  if (S.bvD !== ex) {
    w(`Bono vacacional: corresponden ${ex} días (Art. 192: 15 + 1 por año adicional); hay ${S.bvD}.`);
  }

  if (S.l31 > 0 && S.otrasUsd * S.tasa > 0.2 * E) {
    w(`"Otras asignaciones" (${nf(S.otrasUsd * S.tasa)} Bs/día) = ${nf(S.otrasUsd * S.tasa / E * 100, 0, 0)}% del salario diario normal. Si son pagos regulares por el servicio, son salario normal e integral (Arts. 104 y 122) y la base estaría subestimada.`);
  }

  const d1 = V['b.T'] - V['a.T'];
  if (S.utMode === 0 && Math.abs(V.R18 - d1) > 1) {
    w(`Dif. de utilidades sobre devengado: ${nf(V.R18)}. Sobre utilidades sería ${nf(d1)}; si no hubo anticipo se debe ${nf(V['b.T'])}. Elija el criterio.`);
  }

  const ing = new Date(S.ing + 'T00:00');
  const egr = new Date(S.egr + 'T00:00');
  const im = ing.getFullYear() * 12 + ing.getMonth();
  const em = egr.getFullYear() * 12 + egr.getMonth();
  let z = 0;

  S.rows.forEach(r => {
    const m = MES.indexOf(String(r.b).trim().toUpperCase());
    if (m >= 0) {
      const x = r.a * 12 + m;
      if (x >= im && x < em && !(r.c > 0)) z++;
    }
  });

  if (z) {
    w(`${z} mes(es) del período de servicio sin sueldo cargado.`);
  }

  const dl = new Date(egr.getTime() + 5 * 864e5);
  const f = fd(dl.toISOString().slice(0, 10));
  A.push({
    type: new Date() > dl ? 'w' : 'ok',
    text: new Date() > dl
      ? `Plazo legal de pago (Art. 142 f) venció el ${f}: genera intereses de mora a tasa activa fijada por el BCV.`
      : `Plazo de pago legal (Art. 142 f): hasta el ${f}.`
  });

  return A;
}
