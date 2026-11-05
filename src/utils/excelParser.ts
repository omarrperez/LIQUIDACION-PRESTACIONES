/**
 * Parser de archivos Excel (.xlsx) y archivos JSON de Liquidación
 * Extrae y mapea hojas de cálculo de nómina y prestaciones de RRHH
 */

import { LiquidationState } from '../types';
import { clone, D0, datedif } from './lotttEngine';

const cn = (s: string): number => {
  let n = 0;
  for (const ch of s) n = n * 26 + ch.charCodeAt(0) - 64;
  return n;
};

const cl = (n: number): string => {
  let s = '';
  while (n > 0) {
    s = String.fromCharCode(65 + (n - 1) % 26) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
};

const sp = (a: string): [string, number] => {
  const m = /^([A-Z]+)(\d+)$/.exec(a);
  return m ? [m[1], +m[2]] : ['', 0];
};

const isoD = (v: any): string => {
  if (typeof v === 'number') {
    return new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 864e5).toISOString().slice(0, 10);
  }
  const m = /(\d+)\/(\d+)\/(\d{4})/.exec(String(v));
  return m ? `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}` : '';
};

export async function unzip(buf: ArrayBuffer): Promise<Record<string, () => Promise<string>>> {
  const u = new Uint8Array(buf);
  const dv = new DataView(buf);
  const td = new TextDecoder();
  let e = u.length - 22;

  while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
  if (e < 0) throw new Error('El archivo no es un .xlsx válido o está corrupto.');

  const n = dv.getUint16(e + 10, true);
  let p = dv.getUint32(e + 16, true);
  const F: Record<string, () => Promise<string>> = {};

  for (let i = 0; i < n; i++) {
    const m = dv.getUint16(p + 10, true);
    const cs = dv.getUint32(p + 20, true);
    const nl = dv.getUint16(p + 28, true);
    const xl = dv.getUint16(p + 30, true);
    const cm = dv.getUint16(p + 32, true);
    const off = dv.getUint32(p + 42, true);
    const nm = td.decode(u.subarray(p + 46, p + 46 + nl));
    p += 46 + nl + xl + cm;

    const s0 = off + 30 + dv.getUint16(off + 26, true) + dv.getUint16(off + 28, true);
    const d = u.subarray(s0, s0 + cs);

    F[nm] = async () => {
      if (m === 0) return td.decode(d);
      return td.decode(
        await new Response(
          new Blob([d]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
        ).arrayBuffer()
      );
    };
  }

  return F;
}

export async function readXlsx(buf: ArrayBuffer): Promise<Record<string, Record<string, any>>> {
  const F = await unzip(buf);
  const P = (s: string) => new DOMParser().parseFromString(s, 'text/xml');
  const T = (x: Element) => [...x.getElementsByTagName('t')].map(t => t.textContent).join('');

  const ss = F['xl/sharedStrings.xml']
    ? [...P(await F['xl/sharedStrings.xml']()).getElementsByTagName('si')].map(T)
    : [];

  const rm: Record<string, string> = {};
  if (F['xl/_rels/workbook.xml.rels']) {
    [...P(await F['xl/_rels/workbook.xml.rels']()).getElementsByTagName('Relationship')].forEach(r => {
      const id = r.getAttribute('Id');
      const target = r.getAttribute('Target');
      if (id && target) rm[id] = target;
    });
  }

  const out: Record<string, Record<string, any>> = {};
  const wbXml = await F['xl/workbook.xml']();

  for (const s of P(wbXml).getElementsByTagName('sheet')) {
    const rId = s.getAttribute('r:id');
    if (!rId || !rm[rId]) continue;

    const tg = rm[rId].replace(/^\/?(xl\/)?/, 'xl/');
    if (!F[tg]) continue;

    const x = P(await F[tg]());
    const cells: Record<string, any> = {};

    for (const c of x.getElementsByTagName('c')) {
      const ty = c.getAttribute('t');
      const ve = c.getElementsByTagName('v')[0];
      let v: any = null;

      if (ty === 'inlineStr') {
        v = T(c);
      } else if (ve) {
        v = ve.textContent;
        if (ty === 's') v = ss[+v];
        else if (ty !== 'str' && ty !== 'e' && ty !== 'b') v = +v;
      }

      if (v !== null) cells[c.getAttribute('r') || ''] = v;
    }

    out[s.getAttribute('name') || 'Sheet'] = cells;
  }

  return out;
}

export function impXlsx(W: Record<string, Record<string, any>>): { state: LiquidationState; missing: string[] } {
  const by = (re: RegExp) => {
    for (const n in W) {
      if (Object.values(W[n]).some(v => typeof v === 'string' && re.test(v))) {
        return W[n];
      }
    }
  };

  const L = by(/RECIBO DE LIQUIDACI/i);
  const C = by(/C[ÁA]LCULO DE LAS PRESTACIONES/i);
  const U = by(/DEVENGADO PARA UTILIDADES/i);

  if (!L && !C && !U) {
    throw new Error('No se reconocieron las hojas de liquidación (LIQUIDACION, Prestaciones o UTILIDADES) en el archivo Excel.');
  }

  const fnd = (sh: Record<string, any> | undefined, re: RegExp) => {
    if (!sh) return undefined;
    for (const k in sh) {
      if (typeof sh[k] === 'string' && re.test(sh[k].trim())) return k;
    }
    return undefined;
  };

  const bl = (sh: Record<string, any> | undefined, re: RegExp) => {
    if (!sh) return undefined;
    const k = fnd(sh, re);
    if (k) {
      const [c, r] = sp(k);
      return sh[c + (r + 1)];
    }
    return undefined;
  };

  const rt = (sh: Record<string, any> | undefined, re: RegExp) => {
    if (!sh) return undefined;
    const k = fnd(sh, re);
    if (k) {
      const [c, r] = sp(k);
      for (let i = 1; i < 9; i++) {
        const v = sh[cl(cn(c) + i) + r];
        if (v !== undefined && String(v).trim() !== '') return v;
      }
    }
    return undefined;
  };

  const N: LiquidationState = clone(D0);
  const W0: string[] = [];

  const g = (k: keyof LiquidationState, v: any, l: string) => {
    if (v !== undefined && String(v).trim() !== '') {
      (N as any)[k] = String(v).trim();
    } else {
      W0.push(l);
    }
  };

  N.crit = 0;
  N.litc = 1;
  N.utMode = 0;
  N.mf = null;

  if (L) {
    g('nombre', bl(L, /^NOMBRE Y APELLIDO/i), 'nombre');
    g('cargo', bl(L, /^CARGO$/i), 'cargo');
    g('ci', bl(L, /^C\.I\.$/i), 'cédula');
    g('motivo', bl(L, /^MOTIVO DEL EGRESO/i), 'motivo');

    const i = bl(L, /^FECHA DE INGRESO/i);
    const e = bl(L, /^FECHA DE EGRESO/i);

    if (i !== undefined && isoD(i)) N.ing = isoD(i);
    else W0.push('fecha de ingreso');

    if (e !== undefined && isoD(e)) N.egr = isoD(e);
    else W0.push('fecha de egreso');

    const sn = bl(L, /^SALARIO NORMAL MENSUAL/i);
    const tb = bl(L, /^Tasa BCV/i);
    const sb = bl(L, /^SALARIO BASICO MENSUAL/i);
    const rf = fnd(L, /^RIF/i);
    const lg = bl(L, /^LUGAR Y FECHA/i);

    if (typeof sn === 'number') N.dNormal = sn;
    else W0.push('salario normal mensual');

    if (typeof tb === 'number') N.tasa = tb;
    else W0.push('tasa BCV');

    if (typeof sb === 'number' && N.tasa) N.baseUsd = +(sb / N.tasa).toFixed(2);
    if (rf && L[rf]) N.rif = L[rf];
    if (lg) N.lugar = lg;

    const rw = (re: RegExp) => {
      const k = fnd(L, re);
      return k ? sp(k)[1] : 0;
    };

    const d1 = rw(/^Sueldo del/i);
    const d2 = rw(/^Cesta Tickets/i);
    const d3 = rw(/^Otras Asig/i);
    const q = (c: string, r: number) => +L[c + r] || 0;

    if (d1) N.l29 = q('L', d1);
    if (d2) {
      N.l30 = q('L', d2);
      if (N.l30 && N.tasa) N.cestaUsd = +(q('N', d2) / (N.l30 * N.tasa) * 30).toFixed(2);
    }
    if (d3) {
      N.l31 = q('L', d3);
      if (N.l31 && N.tasa) N.otrasUsd = q('N', d3) / (N.l31 * N.tasa);
    }

    [
      ['faov', /^Aporte Reg/i],
      ['inces', /^Retenci[óo]n INCES/i],
      ['islr', /^Retenci[óo]n ISLR/i]
    ].forEach(([k, re]) => {
      const r = rw(re as RegExp);
      if (r && L['L' + r] > 0) (N as any)[k as string] = +L['L' + r];
    });
  } else if (C) {
    g('nombre', rt(C, /^NOMBRE DEL TRABAJADOR/i), 'nombre');
    g('ci', rt(C, /^CEDULA/i), 'cédula');
    g('cargo', rt(C, /^CARGO/i), 'cargo');
    const k = fnd(C, /^FECHA DE INGRESO/i);
    if (k) {
      const r = sp(k)[1];
      const p = (x: any) => String(x).padStart(2, '0');
      N.ing = `${C['G' + r]}-${p(C['F' + r])}-${p(C['E' + r])}`;
    }
    W0.push('hoja LIQUIDACION (salario normal, tasa BCV, fecha de egreso)');
  }

  if (C) {
    if (typeof C.A1 === 'string') N.emp = C.A1.trim();
    const rs: number[] = [];
    for (const k in C) {
      const [c, r] = sp(k);
      if (c === 'A' && typeof C[k] === 'number' && C[k] >= 1990 && C[k] <= 2100) rs.push(r);
    }
    rs.sort((a, b) => a - b);

    if (rs.length) {
      N.rows = rs.map(r => {
        const q = (c: string) => +C[c + r] || 0;
        return {
          a: C['A' + r],
          b: String(C['B' + r] || '').trim().replace(/^FEBREO$/i, 'FEBRERO'),
          c: q('C'),
          e: q('E'),
          f: q('F'),
          k: q('K'),
          l: q('L'),
          p: q('P'),
          r: q('R'),
          u: q('U')
        };
      });
    } else {
      W0.push('tabla mensual de prestaciones');
    }
  } else {
    W0.push('hoja de cálculo de prestaciones');
  }

  if (U) {
    const hs = Object.keys(U)
      .filter(k => U[k] === 'ITEM')
      .map(k => sp(k)[1])
      .sort((a, b) => a - b);

    if (hs.length) {
      const rd = (h: number) => {
        const r = h + 1;
        const m: number[] = [];
        for (let c = 7; c <= 18; c++) m.push(+U[cl(c) + r] || 0);
        return {
          m,
          u: +U['U' + r] || 0,
          x: U['X' + r] !== undefined ? +U['X' + r] : 0.0002,
          ac: +U['AC' + r] || 0
        };
      };

      const t1 = rd(hs[0]);
      const t2 = hs[1] ? rd(hs[1]) : null;

      if (t2) {
        t1.m[9] = t1.m[10] = 0;
        N.ut.a = t1;
        N.ut.b = t2;
      } else {
        N.ut.b = t1;
        N.ut.a = clone(t1);
        N.ut.a.m = t1.m.map(() => 0);
        N.utMode = 2;
      }

      const wk = fnd(U, /^TASA BCV$/i);
      if (wk) {
        const [c, r] = sp(wk);
        const d = U[c + (r + 1)];
        const w = U[cl(cn(c) + 1) + (r + 1)];
        if (d !== undefined && isoD(d)) N.ut.vd = isoD(d);
        if (typeof w === 'number') N.ut.w9 = w;
      }
      N.ut.aa9 = +U.AA9 || 0;
    } else {
      W0.push('tabla de utilidades');
    }
  } else {
    W0.push('hoja de utilidades');
  }

  const i0 = new Date(N.ing + 'T00:00');
  const e0 = new Date(N.egr + 'T00:00');
  const m = e0 >= i0 ? datedif(i0, e0)[1] : 0;

  if (L && m > 0) {
    const f = (re: RegExp) => Object.keys(L).find(k => typeof L[k] === 'string' && re.test(L[k]));
    const a = f(/Vacaciones Fraccionadas/i);
    const b = f(/Bono vacacional Fraccionado/i);
    if (a) {
      const x = +L['L' + sp(a)[1]];
      if (x > 0) N.vacD = +(x * 12 / m).toFixed(2);
    }
    if (b) {
      const x = +L['L' + sp(b)[1]];
      if (x > 0) N.bvD = +(x * 12 / m).toFixed(2);
    }
  }

  return { state: N, missing: [...new Set(W0)] };
}
