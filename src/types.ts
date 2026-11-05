/**
 * Tipos y estructuras para el Sistema de Liquidaciones LOTTT Venezuela
 */

export interface MonthRow {
  a: number; // Año
  b: string; // Mes (ENERO, FEBRERO...)
  c: number; // Sueldo del mes
  e: number; // Tiempo servicio años
  f: number; // Tiempo servicio meses
  k: number; // Días prestaciones
  l: number; // Días adicionales
  p: number; // Anticipo prestaciones
  r: number; // Tasa de interés mensual BCV (decimal, ej 0.4746)
  u: number; // Anticipo intereses pagados
}

export interface UtBlock {
  m: number[]; // 12 meses devengados
  u: number;   // Anticipo utilidades pagado
  x: number;   // % ISLR o deducción
  ac: number;  // Sueldo base referencia
}

export interface UtData {
  w9: number;      // Tasa BCV utilidades
  vd: string;      // Fecha tasa utilidades (YYYY-MM-DD)
  aa9: number;     // Monto devengado referencia
  a: UtBlock;      // Estimado / devengado año
  b: UtBlock;      // Real / cierre
}

export interface LiquidationState {
  emp: string;          // Nombre empresa
  rif: string;          // RIF empresa
  lugar: string;        // Lugar y fecha reporte
  nombre: string;       // Nombre trabajador
  ci: string;           // Cédula identidad
  cargo: string;        // Cargo
  motivo: string;       // Motivo egreso (RENUNCIA, DESPIDO, etc.)
  ing: string;          // Fecha ingreso (YYYY-MM-DD)
  egr: string;          // Fecha egreso (YYYY-MM-DD)
  tasa: number;         // Tasa oficial BCV Bs/USD al egreso
  baseUsd: number;      // Sueldo base mensual en USD
  dNormal: number;      // Salario normal mensual en Bs
  diasBV: number;       // Días bono vacacional base anual
  diasUt: number;       // Días utilidades base anual
  vacD: number;         // Días vacaciones aplicables año
  bvD: number;          // Días bono vacacional aplicables año
  mf: number | null;    // Meses fracción forzados (null = automático)
  l29: number;          // Días trabajados mes de egreso (sueldo)
  l30: number;          // Días cesta ticket mes egreso
  l31: number;          // Días otras asignaciones mes egreso
  cestaUsd: number;     // Cesta ticket mensual USD
  otrasUsd: number;     // Otras asignaciones USD/día
  p36: number;          // Anticipo 1era quincena
  faov: number;         // Tasa FAOV (0.01 = 1%)
  inces: number;        // Tasa INCES (0.005 = 0.5%)
  islr: number;         // Tasa retención ISLR
  ivssBase: number;     // Base cotización IVSS
  ivssPct: number;      // % retención IVSS (0.04 = 4%)
  rpeBase: number;      // Base cotización RPE (paro forzoso)
  rpePct: number;       // % retención RPE (0.005 = 0.5%)
  sem: number;          // Semanas a cotizar en mes de egreso
  q7: number;           // Días prestaciones al trimestre
  intTail: number;      // Incluir tramo intereses fraccionales mes egreso
  faovUt: number;       // Aplicar FAOV sobre utilidades
  escOtras: number;     // Escenario otras asignaciones como salario
  xin: Record<string, any>; // Modificaciones manuales inputs LOTTT
  xo: Record<string, number>; // Modificaciones manuales celdas LOTTT
  crit: number;         // Criterio trimestres: 0 = iniciado (Excel), 1 = cumplido
  utMode: number;       // Criterio utilidades: 0 = devengado, 1 = utilidades, 2 = completas
  litc: number;         // Aplicar comparación literal c Art 142 (1 = sí, 0 = no)
  rows: MonthRow[];     // Filas mensuales de historial salarial
  ut: UtData;           // Datos de la hoja de utilidades
}

export interface CalculatedValues {
  [key: string]: any;
}
