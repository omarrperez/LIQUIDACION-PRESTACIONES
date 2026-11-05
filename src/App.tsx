import React, { useState, useEffect, useRef } from 'react';
import { 
  Database, 
  Printer, 
  FileSpreadsheet, 
  FolderOpen, 
  Download, 
  Upload, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Save, 
  FilePlus, 
  Sparkles,
  Edit3,
  Undo2,
  CheckCircle2,
  AlertCircle,
  FileDown,
  FileText
} from 'lucide-react';
import { LiquidationState, MonthRow } from './types';
import { D0, clone, calc, lottt, plan, audit, nf, fd, pn, fi, MES } from './utils/lotttEngine';
import { readXlsx, impXlsx } from './utils/excelParser';
import { 
  saveLiquidacionRecord, 
  getAllLiquidaciones, 
  SavedLiquidacion 
} from './db/indexedDB';
import { HistorySheet } from './components/HistorySheet';
import { LiquidationReceipt } from './components/LiquidationReceipt';
import { exportSheetToPdf, exportLiquidationToWord, downloadBlob } from './utils/exportUtils';
import { generateStandaloneHtml } from './standaloneHtml';

export default function App() {
  const [state, setState] = useState<LiquidationState>(() => {
    try {
      const saved = localStorage.getItem('liq1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...clone(D0),
          ...parsed,
          crit: parsed.crit ?? 0,
          utMode: parsed.utMode ?? 0,
          litc: parsed.litc ?? 1,
          xin: parsed.xin || {},
          xo: parsed.xo || {}
        };
      }
    } catch (e) {
      console.warn('Error loading local state:', e);
    }
    return clone(D0);
  });

  const [activeTab, setActiveTab] = useState<number>(0);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [privacyMode, setPrivacyMode] = useState<boolean>(false);
  const [logo, setLogo] = useState<string>(() => localStorage.getItem('liq_logo') || '');
  const [dbCount, setDbCount] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; isError?: boolean } | null>(null);

  const fileInputExcelRef = useRef<HTMLInputElement>(null);
  const fileInputJsonRef = useRef<HTMLInputElement>(null);
  const fileInputLogoRef = useRef<HTMLInputElement>(null);

  // Guardar estado en localStorage al cambiar
  useEffect(() => {
    try {
      localStorage.setItem('liq1', JSON.stringify(state));
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }, [state]);

  // Contar registros en IndexedDB
  const updateDbCount = async () => {
    try {
      const all = await getAllLiquidaciones();
      setDbCount(all.length);
    } catch (e) {
      console.warn('Error checking db count:', e);
    }
  };

  useEffect(() => {
    updateDbCount();
  }, []);

  const showNotification = (message: string, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 6000);
  };

  // Cálculos reactivos
  const V = calc(state);
  const c0Text = (q: any) => 
    'Prestaciones Sociales Acumuladas + Complemento Art. 142. LOTTT, literales a ) ' +
    (q.useC ? '(se aplica literal c, Art. 142 d)' : '');
  V.c0 = c0Text(V);

  // Cálculo LOTTT de control
  const stateWithXin = clone(state);
  for (const p in state.xin) {
    const a = p.split('.');
    const l = a.pop()!;
    a.reduce((o: any, k: string) => o[k], stateWithXin)[l] = state.xin[p];
  }

  const stateLOTTT = lottt(stateWithXin);
  const V2 = calc(stateLOTTT);
  for (const k in state.xo) {
    V2[k] = state.xo[k];
  }

  V2.K18 = V2.L24;
  V2.L18 = V2.N24;
  V2.M33 = V2.N24 + V2.N25 + V2.N26 + V2.N27 + V2.N28 + V2.N29 + V2.N30 + V2.N31;
  V2.M42 = V2.N36 + V2.N37 + V2.N38 + V2.N39 + V2.N40;
  V2.M44 = V2.M33 - V2.M42;
  V2.Q44 = V2.M44 / stateLOTTT.tasa;

  for (const k in V2) {
    V['x.' + k] = V2[k];
  }

  V['x.c0'] = (() => {
    const sk = stateLOTTT.rows.reduce((a, r) => a + r.k, 0);
    const sl = stateLOTTT.rows.reduce((a, r) => a + r.l, 0);
    return V2.useC
      ? `Garantía Art. 142 literal c): 30 días x ${V2.litDays / 30} año(s) o fracción superior a 6 meses (mayor que a+b, literal d)`
      : `Garantía Art. 142 literal a): ${sk / 15} trimestre(s) iniciado(s) x 15 días${sl > 0 ? ' + literal b) ' + sl + ' días adicionales' : ''} (el literal c) no supera la garantía)`;
  })();

  const CK = ['L24', 'N24', 'N25', 'N26', 'L27', 'N27', 'L28', 'N28', 'N29', 'N30', 'N31', 'M33', 'N36', 'N37', 'N38', 'N39', 'N40', 'M42', 'M44'];
  CK.forEach(k => {
    V['d.' + k] = V2[k] - V[k];
  });

  // Ayudante de mutación inmutable de estado
  const updateStateField = (path: string, val: any) => {
    setState(prev => {
      const next = clone(prev);
      const parts = path.split('.');
      const last = parts.pop()!;
      let obj: any = next;
      for (const p of parts) {
        if (!obj[p]) obj[p] = {};
        obj = obj[p];
      }
      obj[last] = val;
      return next;
    });
  };

  const updateXinField = (path: string, val: any) => {
    setState(prev => {
      const next = clone(prev);
      if (val === '' || val === null || val === undefined) {
        delete next.xin[path];
      } else {
        next.xin[path] = val;
      }
      return next;
    });
  };

  const updateXoField = (key: string, val: any) => {
    setState(prev => {
      const next = clone(prev);
      if (val === '' || val === null || isNaN(val)) {
        delete next.xo[key];
      } else {
        next.xo[key] = val;
      }
      return next;
    });
  };

  // Resetear modificaciones de la hoja LOTTT
  const handleResetLOTTTEdits = () => {
    if (!Object.keys(state.xin).length && !Object.keys(state.xo).length) return;
    if (window.confirm('¿Descartar todas las modificaciones manuales y volver al cálculo LOTTT original?')) {
      setState(prev => ({ ...prev, xin: {}, xo: {} }));
      showNotification('Modificaciones descartadas. Cálculo LOTTT restaurado.');
    }
  };

  // Guardar liquidación activa en la Base de Datos
  const handleSaveToDatabase = async (fileObj?: { name: string; blob: Blob; type: 'xlsx' | 'json' }) => {
    try {
      const litCriteria = V.useC 
        ? 'Art. 142 literal c (retroactivo 30 días/año)' 
        : 'Art. 142 literales a y b (garantía trimestral)';

      await saveLiquidacionRecord({
        nombre: state.nombre || 'Trabajador sin nombre',
        ci: state.ci || 'Sin cédula',
        cargo: state.cargo || 'Sin cargo',
        empresa: state.emp || 'Sin empresa',
        rif: state.rif || '',
        ing: state.ing,
        egr: state.egr,
        motivo: state.motivo || 'EGRESO',
        tasa: state.tasa,
        netoBs: V.M44 || 0,
        netoUsd: V.Q44 || 0,
        garantiaLit: litCriteria,
        stateData: clone(state),
        fileName: fileObj ? fileObj.name : undefined,
        fileType: fileObj ? fileObj.type : undefined,
        fileBlob: fileObj ? fileObj.blob : undefined
      }, fileObj);

      await updateDbCount();
      showNotification(`✅ Liquidación de "${state.nombre || 'Trabajador'}" guardada permanentemente en la Base de Datos.`);
    } catch (err: any) {
      showNotification('Error al guardar en la Base de Datos: ' + err.message, true);
    }
  };

  // Cargar archivo Excel
  const handleUploadExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = await readXlsx(arrayBuffer);
      const { state: importedState, missing } = impXlsx(workbook);
      
      setState(importedState);
      setActiveTab(0);

      // Guardar inmediatamente en IndexedDB tanto el estado como el archivo físico original
      await handleSaveToDatabase({
        name: file.name,
        blob: file,
        type: 'xlsx'
      });

      const nz = importedState.rows.filter(r => r.c > 0).length;
      showNotification(
        `✅ Excel "${file.name}" cargado y archivado en Base de Datos: ${importedState.nombre || 'Trabajador'} (${nz} meses con sueldo).`
      );

      if (missing.length > 0) {
        console.info('Campos no detectados en Excel:', missing);
      }
    } catch (err: any) {
      showNotification('No se pudo procesar el archivo Excel: ' + err.message, true);
    }
    e.target.value = '';
  };

  // Cargar archivo JSON
  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        setState({
          ...clone(D0),
          ...parsed,
          crit: parsed.crit ?? 0,
          utMode: parsed.utMode ?? 0,
          litc: parsed.litc ?? 1,
          xin: parsed.xin || {},
          xo: parsed.xo || {}
        });
        setActiveTab(0);
        showNotification(`Archivo JSON "${file.name}" abierto correctamente.`);
      } catch (err: any) {
        showNotification('Archivo JSON no válido: ' + err.message, true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Guardar archivo JSON a disco
  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `liquidacion_${(state.nombre || 'trabajador').replace(/\s+/g, '_')}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Descargar la aplicación en un archivo HTML autónomo para abrir en cualquier navegador sin internet (Cero cookies)
  const handleDownloadStandaloneHtml = () => {
    try {
      showNotification('Generando archivo HTML autónomo (100% libre de cookies)...');
      const htmlContent = generateStandaloneHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, 'Liquidacion_Prestaciones_LOTTT_Venezuela.html');
      showNotification('✅ Archivo HTML descargado con éxito. Puede abrirlo en cualquier navegador (Google Chrome, Microsoft Edge, Mozilla Firefox, Opera) sin internet.');
    } catch (err: any) {
      showNotification('Error al descargar archivo HTML: ' + err.message, true);
    }
  };

  // Nueva liquidación en blanco
  const handleNewBlank = () => {
    if (!window.confirm('¿Iniciar una liquidación en blanco? (Se conservan las tasas oficiales)')) return;
    const b = clone(D0);
    const today = new Date().toISOString().slice(0, 10);
    Object.assign(b, {
      nombre: '',
      ci: '',
      cargo: '',
      motivo: 'RENUNCIA',
      dNormal: 0,
      p36: 0,
      l29: 0,
      l30: 0,
      l31: 0,
      ing: today,
      egr: today
    });
    b.rows.forEach(r => Object.assign(r, { c: 0, e: 0, f: 0, k: 0, l: 0, p: 0, u: 0 }));
    ['a', 'b'].forEach(k => {
      (b.ut as any)[k].m = (b.ut as any)[k].m.map(() => 0);
      (b.ut as any)[k].u = 0;
    });
    setState(b);
    setActiveTab(0);
    showNotification('Nueva liquidación en blanco inicializada.');
  };

  // Cargar ejemplo
  const handleLoadExample = () => {
    setState(clone(D0));
    setActiveTab(0);
    showNotification('Ejemplo modelo cargado.');
  };

  // Cargar logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const res = r.result as string;
      setLogo(res);
      try {
        localStorage.setItem('liq_logo', res);
      } catch (err) {}
    };
    r.readAsDataURL(f);
  };

  // Imprimir
  const handlePrint = () => {
    const isWide = activeTab === 2 || activeTab === 3 || activeTab === 4;
    const styleEl = document.getElementById('pgst') || document.head.appendChild(Object.assign(document.createElement('style'), { id: 'pgst' }));
    styleEl.textContent = isWide ? '@page{size:letter landscape;margin:8mm}' : '@page{size:letter portrait;margin:8mm}';
    
    const tabNames = ['LIQUIDACIÓN (Excel)', 'LIQUIDACIÓN LOTTT', 'COMPARATIVO', state.nombre || 'TRABAJADOR', 'UTILIDADES 2026', 'HISTORIAL'];
    const oldTitle = document.title;
    document.title = `Liquidación - ${tabNames[activeTab] || 'LOTTT'}`;
    
    window.onafterprint = () => {
      document.title = oldTitle;
    };
    try {
      window.print();
    } catch (e) {
      alert('Presione Ctrl+P (o Cmd+P) para imprimir.');
    }
  };

  // Descarga directa a PDF de cualquier hoja
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPdf = async (targetId: string, sheetTitle: string, isLandscape = false) => {
    try {
      setIsGeneratingPdf(true);
      showNotification('⏳ Generando y procesando archivo PDF...');
      const cleanWorker = (state.nombre || 'Trabajador').replace(/\s+/g, '_');
      await exportSheetToPdf(targetId, `${sheetTitle}_${cleanWorker}.pdf`, isLandscape);
      showNotification('✅ Archivo PDF generado y descargado exitosamente.');
    } catch (err: any) {
      console.error('Error en generación de PDF:', err);
      showNotification('Preparando vista de alta fidelidad para Guardar como PDF...');
      setTimeout(() => {
        handlePrint();
      }, 400);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Exportar liquidación a Word (.doc)
  const handleExportWord = (isLOTTT: boolean) => {
    try {
      showNotification('📄 Generando documento de Word...');
      exportLiquidationToWord(isLOTTT ? stateWithXin : state, V, isLOTTT);
      showNotification('✅ Documento de Word (.doc) generado y descargado exitosamente.');
    } catch (err: any) {
      console.error(err);
      showNotification('Error al exportar a Word: ' + err.message, true);
    }
  };

  // Modos de privacidad
  const maskSensitive = (val: string | number, isCI = false, isAmount = false): string => {
    if (!privacyMode) {
      return typeof val === 'number' ? nf(val) : String(val ?? '');
    }
    if (isCI) {
      return String(val).replace(/(\d{2})\d+(\d{2})/, '$1.***.$2');
    }
    if (isAmount) {
      return '••••••••';
    }
    return String(val ?? '');
  };

  // Filas y columnas de la hoja de cálculo de prestaciones
  const handleAddMonthRow = () => {
    setState(prev => {
      const next = clone(prev);
      const l = next.rows[next.rows.length - 1];
      const mi = MES.indexOf((l.b || '').trim().toUpperCase());
      const y = +l.a || new Date().getFullYear();
      const ni = (mi + 1) % 12;
      next.rows.push({
        a: mi === 11 ? y + 1 : y,
        b: MES[ni],
        c: 0,
        e: 0,
        f: 0,
        k: 0,
        l: 0,
        p: 0,
        r: l.r,
        u: 0
      });
      return next;
    });
  };

  const handleDelMonthRow = () => {
    setState(prev => {
      if (prev.rows.length <= 1) return prev;
      const next = clone(prev);
      next.rows.pop();
      return next;
    });
  };

  const handleAutoCalcDays = () => {
    setState(prev => {
      const next = clone(prev);
      const p = plan(next);
      next.rows.forEach((r, i) => {
        r.k = p.K[i];
        r.l = p.L[i];
      });
      return next;
    });
    showNotification('Días de prestaciones calculados según Art. 142 a/b.');
  };

  const auditResults = audit(state, V);
  const totalModifications = Object.keys(state.xin).length + Object.keys(state.xo).length;

  return (
    <div className={`min-h-screen text-black ${editMode ? 'edx' : ''}`}>
      
      {/* BARRA SUPERIOR DE ACCIONES */}
      <div className="bar no-print flex items-center justify-between">
        <div className="flex items-center gap-2">
          <b>Liquidación de Prestaciones Sociales · LOTTT Venezuela</b>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-emerald-900/80 px-2 py-0.5 rounded text-emerald-200 border border-emerald-500/30">
            <Database className="w-3 h-3 text-amber-300" />
            <span>Base de Datos: <b>{dbCount}</b> exp.</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={() => handleSaveToDatabase()} 
            className="bg-amber-500! hover:bg-amber-600! text-slate-950! font-bold"
            title="Guardar la liquidación activa en la Base de Datos para consultarla meses después"
          >
            <Save className="w-3.5 h-3.5" />
            Guardar en BD
          </button>

          <button 
            onClick={handleDownloadStandaloneHtml}
            className="bg-emerald-600! hover:bg-emerald-500! text-white! font-bold border border-emerald-300/40"
            title="Descargar la aplicación completa en un único archivo HTML autónomo para abrirlo y usarlo en cualquier navegador (Chrome, Opera, Firefox, Edge) sin necesidad de internet"
          >
            <FileDown className="w-3.5 h-3.5 text-amber-300" />
            Descargar App HTML
          </button>

          <button 
            onClick={() => fileInputExcelRef.current?.click()}
            title="Cargar y archivar hoja Excel de nómina"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Cargar Excel (RRHH)
          </button>
          <input 
            type="file" 
            ref={fileInputExcelRef} 
            onChange={handleUploadExcel} 
            accept=".xlsx" 
            hidden 
          />

          <button 
            onClick={() => {
              if (activeTab === 0) handleDownloadPdf('s0_doc', 'Liquidacion_Empresa_Excel', false);
              else if (activeTab === 1) handleDownloadPdf('s3_doc', 'Liquidacion_LOTTT', false);
              else if (activeTab === 2) handleDownloadPdf('s4', 'Comparativo_LOTTT_vs_Empresa', true);
              else if (activeTab === 3) handleDownloadPdf('s1', 'Prestaciones_Mensuales', true);
              else if (activeTab === 4) handleDownloadPdf('s2', 'Utilidades_2026', true);
              else if (activeTab === 5) handleDownloadPdf('history_sheet_container', 'Historial_Liquidaciones', true);
            }}
            disabled={isGeneratingPdf}
            className="bg-red-700! hover:bg-red-800! text-white! font-bold"
            title="Descargar la hoja actual en archivo PDF listo para imprimir o enviar"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Generando PDF...' : 'Descargar a PDF'}
          </button>

          <button onClick={handlePrint} title="Imprimir hoja actual">
            <Printer className="w-3.5 h-3.5" />
            Imprimir
          </button>

          <button onClick={handleNewBlank} title="Comenzar cálculo en blanco">
            <FilePlus className="w-3.5 h-3.5" />
            En blanco
          </button>

          <button onClick={handleLoadExample} title="Cargar ejemplo modelo">
            <Sparkles className="w-3.5 h-3.5" />
            Ejemplo
          </button>

          {/* Los botones JSON se movieron a opciones avanzadas de sistemas en la pestaña de Base de Datos */}

          <button
            onClick={() => setPrivacyMode(!privacyMode)}
            className={`border transition ${privacyMode ? 'bg-amber-500! text-black! font-bold' : ''}`}
            title="Ocultar o enmascarar cédula y salarios para no mostrar datos sensibles en pantalla"
          >
            {privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {privacyMode ? 'Privacidad: ON' : 'Modo Privacidad'}
          </button>
        </div>
      </div>

      {/* MENSAJES Y NOTIFICACIONES */}
      {notification && (
        <div id="msg" className="no-print">
          <div className={notification.isError ? 'e' : ''}>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="ml-3 text-slate-500 hover:text-black font-bold text-xs"
            >
              ✕ cerrar
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          HOJA 0: LIQUIDACIÓN SEGÚN EL EXCEL CARGADO (Cálculo de la Empresa)
          ========================================================================= */}
      <div className={`sheet ${activeTab === 0 ? 'on' : ''}`} id="s0">
        <div className="flex-doc">
          <div className="flex-1 flex flex-col min-w-0">
            {/* Barra de Exportación Hoja 1 */}
            <div className="no-print flex items-center justify-between mb-2 bg-slate-100 p-2 border border-slate-300 rounded shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">Hoja 1: Liquidación según Empresa (Excel)</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">· Formato Agribienes C.A.</span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDownloadPdf('s0_doc', 'Liquidacion_Empresa_Excel', false)}
                  disabled={isGeneratingPdf}
                  className="flex items-center gap-1.5 bg-red-700! hover:bg-red-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
                  title="Descargar esta liquidación en formato PDF listo para imprimir o enviar"
                >
                  <Download className="w-3.5 h-3.5" />
                  {isGeneratingPdf ? 'Generando...' : 'Descargar a PDF'}
                </button>
                <button 
                  onClick={() => handleExportWord(false)}
                  className="flex items-center gap-1.5 bg-blue-700! hover:bg-blue-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
                  title="Exportar esta liquidación a documento Microsoft Word (.doc) editable con finiquito y firmas"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Exportar a Word
                </button>
              </div>
            </div>

            <LiquidationReceipt
              containerId="s0_doc"
              state={state}
              V={V}
              isLOTTT={false}
              isEditMode={true}
              privacyMode={privacyMode}
              logo={logo}
              onLogoUpload={handleLogoUpload}
              onUpdateField={updateStateField}
              maskSensitive={maskSensitive}
            />
          </div>

          {/* Panel Lateral Parámetros y Auditoría */}
          <aside className="panel no-print">
            <h4>Datos y parámetros (celdas amarillas)</h4>
            <label>
              Empresa
              <input
                className="lottt-input"
                value={state.emp}
                onChange={(e) => updateStateField('emp', e.target.value)}
              />
            </label>
            <label>
              {V.tasaLbl}
              <input
                className="lottt-input text-right"
                value={fi(state.tasa)}
                onChange={(e) => updateStateField('tasa', pn(e.target.value))}
              />
            </label>

            <table>
              <tbody>
                <tr><th colSpan={3}>TIEMPO DE SERVICIO</th></tr>
                <tr><th>AÑOS</th><th>MESES</th><th>DIAS</th></tr>
                <tr>
                  <td>{V.P12}</td>
                  <td>{V.Q12}</td>
                  <td>{V.R12}</td>
                </tr>
              </tbody>
            </table>

            <label>
              Sueldo base mensual (US$)
              <input
                className="lottt-input text-right"
                value={fi(state.baseUsd)}
                onChange={(e) => updateStateField('baseUsd', pn(e.target.value))}
              />
            </label>
            <label>
              Cesta ticket mensual (US$)
              <input
                className="lottt-input text-right"
                value={fi(state.cestaUsd)}
                onChange={(e) => updateStateField('cestaUsd', pn(e.target.value))}
              />
            </label>
            <label>
              Otras asignaciones (US$/día)
              <input
                className="lottt-input text-right"
                value={fi(state.otrasUsd)}
                onChange={(e) => updateStateField('otrasUsd', pn(e.target.value))}
              />
            </label>
            <label>
              Días bono vacacional
              <input
                className="lottt-input text-right"
                value={state.diasBV}
                onChange={(e) => updateStateField('diasBV', pn(e.target.value))}
              />
            </label>
            <label>
              Días utilidades
              <input
                className="lottt-input text-right"
                value={state.diasUt}
                onChange={(e) => updateStateField('diasUt', pn(e.target.value))}
              />
            </label>
            <label>
              Días vacaciones/año
              <input
                className="lottt-input text-right"
                value={state.vacD}
                onChange={(e) => updateStateField('vacD', pn(e.target.value))}
              />
            </label>
            <label>
              Días bono vac./año
              <input
                className="lottt-input text-right"
                value={state.bvD}
                onChange={(e) => updateStateField('bvD', pn(e.target.value))}
              />
            </label>
            <label>
              Meses fracción (vacío=auto)
              <input
                className="lottt-input text-right"
                value={state.mf === null ? '' : state.mf}
                onChange={(e) => updateStateField('mf', e.target.value === '' ? null : pn(e.target.value))}
              />
            </label>
            <label>
              1era quincena (P36)
              <input
                className="lottt-input text-right"
                value={fi(state.p36)}
                onChange={(e) => updateStateField('p36', pn(e.target.value))}
              />
            </label>
            <label>
              Base IVSS (Bs.)
              <input
                className="lottt-input text-right"
                value={fi(state.ivssBase)}
                onChange={(e) => updateStateField('ivssBase', pn(e.target.value))}
              />
            </label>
            <label>
              % IVSS
              <span className="pc">
                <input
                  className="lottt-input text-right"
                  value={fi(state.ivssPct, 'p')}
                  onChange={(e) => updateStateField('ivssPct', pn(e.target.value) / 100)}
                />
              </span>
            </label>
            <label>
              Base RPE (Bs.)
              <input
                className="lottt-input text-right"
                value={fi(state.rpeBase)}
                onChange={(e) => updateStateField('rpeBase', pn(e.target.value))}
              />
            </label>
            <label>
              % RPE
              <span className="pc">
                <input
                  className="lottt-input text-right"
                  value={fi(state.rpePct, 'p')}
                  onChange={(e) => updateStateField('rpePct', pn(e.target.value) / 100)}
                />
              </span>
            </label>
            <label>
              Semanas
              <input
                className="lottt-input text-right"
                value={state.sem}
                onChange={(e) => updateStateField('sem', pn(e.target.value))}
              />
            </label>
            <label>
              Trimestres Art. 142 a
              <select
                value={state.crit}
                onChange={(e) => updateStateField('crit', +e.target.value)}
              >
                <option value={0}>Iniciado (Excel)</option>
                <option value={1}>Cumplido</option>
              </select>
            </label>
            <label>
              Dif. utilidades
              <select
                value={state.utMode}
                onChange={(e) => updateStateField('utMode', +e.target.value)}
              >
                <option value={0}>Sobre devengado (Excel)</option>
                <option value={1}>Sobre utilidades</option>
                <option value={2}>Utilidades completas</option>
              </select>
            </label>
            <label>
              Literal c (Art. 142 d)
              <input
                type="checkbox"
                checked={state.litc === 1}
                onChange={(e) => updateStateField('litc', e.target.checked ? 1 : 0)}
                style={{ width: 'auto' }}
              />
            </label>
            <label>
              Neto en US$ (÷ tasa)
              <b>${maskSensitive(V.Q44, false, true)}</b>
            </label>

            <h4 style={{ marginTop: 8 }}>Auditoría LOTTT</h4>
            <div>
              {auditResults.map((item, idx) => (
                <div key={idx} className={item.type} dangerouslySetInnerHTML={{ __html: item.text }} />
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================================
          HOJA 1: LIQUIDACIÓN LOTTT (Cálculo de Control Revisado)
          ========================================================================= */}
      <div className={`sheet ${activeTab === 1 ? 'on' : ''}`} id="s3">
        <div className="xbar no-print flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <button 
              id="bedit" 
              onClick={() => setEditMode(!editMode)}
              className={editMode ? 'on' : ''}
            >
              {editMode ? '✔ Terminar de modificar' : '✏️ Modificar'}
            </button>
            <button onClick={handleResetLOTTTEdits}>
              ↺ Restaurar cálculo LOTTT
            </button>
            {totalModifications > 0 && (
              <span id="xstat" style={{ color: '#a05a00', fontWeight: 'bold' }}>
                ⚠ {totalModifications} valor(es) modificado(s) por RRHH (en amarillo)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleDownloadPdf('s3_doc', 'Liquidacion_LOTTT', false)}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 bg-red-700! hover:bg-red-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
              title="Descargar liquidación revisada según LOTTT en formato PDF listo para imprimir"
            >
              <Download className="w-3.5 h-3.5" />
              {isGeneratingPdf ? 'Generando...' : 'Descargar a PDF'}
            </button>
            <button 
              onClick={() => handleExportWord(true)}
              className="flex items-center gap-1.5 bg-blue-700! hover:bg-blue-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
              title="Exportar liquidación revisada según LOTTT a documento Microsoft Word (.doc) editable con finiquito y firmas"
            >
              <FileText className="w-3.5 h-3.5" />
              Exportar a Word
            </button>
          </div>
        </div>

        <div className="flex-doc">
          <LiquidationReceipt
            containerId="s3_doc"
            state={stateWithXin}
            V={V}
            isLOTTT={true}
            isEditMode={editMode}
            privacyMode={privacyMode}
            logo={logo}
            onLogoUpload={handleLogoUpload}
            onUpdateField={updateStateField}
            onUpdateXinField={updateXinField}
            maskSensitive={maskSensitive}
          />

          {/* Panel Lateral LOTTT */}
          <aside className="panel no-print">
            <h4>Criterios aplicados (LOTTT)</h4>
            <div className="ok">
              <b>Garantía (Art. 142):</b> a) 15 días por trimestre iniciado; b) días adicionales solo después del primer año; c) 30 días/año o fracción superior a 6 meses; d) se paga el mayor; e) 5 días/mes solo si termina antes de 3 meses.
            </div>
            <div className="ok">
              <b>Vacaciones y bono:</b> 15 días + 1 por año adicional (Arts. 190 y 192).
            </div>
            <div className="ok">
              <b>Intereses:</b> Art. 143, incluyendo el tramo del 01 al día de egreso.
            </div>
            <div className="ok">
              <b>Utilidades:</b> Arts. 131-132: utilidades del período completo (incluye días del mes de egreso) menos el anticipo realmente pagado.
            </div>
            <div className="ok">
              <b>FAOV:</b> 1% también sobre utilidades, igual que la hoja UTILIDADES.
            </div>
            <div className="w">
              Pulse <b>✏️ Modificar</b> (arriba) para cambiar datos y montos. Los totales se recalculan solos y las celdas cambiadas se marcan en amarillo.
            </div>

            <h4 style={{ marginTop: 8 }}>Datos que cambian el resultado</h4>
            <label>
              Tasa BCV (solo esta hoja)
              <input
                className="lottt-input text-right"
                value={stateLOTTT.tasa}
                onChange={(e) => updateXinField('tasa', pn(e.target.value))}
              />
            </label>
            <label>
              Anticipo utilidades (Bs)
              <input
                className="lottt-input text-right"
                value={state.ut.b.u}
                onChange={(e) => updateStateField('ut.b.u', pn(e.target.value))}
              />
            </label>
            <label>
              Escenario: "otras asig." son salario
              <input
                type="checkbox"
                checked={state.escOtras === 1}
                onChange={(e) => updateStateField('escOtras', e.target.checked ? 1 : 0)}
                style={{ width: 'auto' }}
              />
            </label>

            <div className="w">
              Si se prueba que los 147.609,30 Bs estimados sí se pagaron, escríbalos como anticipo. El escenario de "otras asignaciones" suma ese monto mensual al salario (aproximación).
            </div>
            <div className="w">
              Pendientes fuera del cálculo: mora e indexación (Art. 142 f) y conversión a la tasa BCV del día de pago.
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================================
          HOJA 2: COMPARATIVO EMPRESA VS. LOTTT
          ========================================================================= */}
      <div className={`sheet wide ${activeTab === 2 ? 'on' : ''}`} id="s4">
        <div className="no-print flex items-center justify-between mb-3 bg-slate-100 p-2 border border-slate-300 rounded shadow-xs">
          <span className="text-xs font-bold text-slate-700">Cuadro Comparativo Empresa vs. LOTTT</span>
          <button
            onClick={() => handleDownloadPdf('s4', 'Comparativo_LOTTT_vs_Empresa', true)}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-red-700! hover:bg-red-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
            title="Descargar cuadro comparativo a archivo PDF"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Generando...' : 'Descargar a PDF'}
          </button>
        </div>

        <div className="ti">
          COMPARATIVO: CÁLCULO DE LA EMPRESA (EXCEL) VS. CÁLCULO SEGÚN LA LOTTT
        </div>
        <div className="small">
          Diferencia = LOTTT − Excel. Positiva: el cálculo de la ley es mayor que el de la empresa.
        </div>

        <div className="wrap" style={{ maxHeight: 'none' }}>
          <table className="t2">
            <thead>
              <tr>
                <th>#</th>
                <th style={{ textAlign: 'left' }}>CONCEPTO</th>
                <th>DÍAS (Excel)</th>
                <th>Bs. (Excel)</th>
                <th>DÍAS (LOTTT)</th>
                <th>Bs. (LOTTT)</th>
                <th>DIFERENCIA Bs.</th>
                <th style={{ textAlign: 'left' }}>FUNDAMENTO LEGAL LOTTT</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: '1', c: 'Prestaciones sociales (garantía, Art. 142)', d: 'L24', k: 'N24', f: 'Art. 142 a, b y d: días por trimestre y literal c) comparado; salario integral.' },
                { n: '2', c: 'Intereses sobre prestaciones', d: '', k: 'N25', f: 'Art. 143: tasa BCV sobre el saldo; se incluye el tramo hasta el egreso.' },
                { n: '3', c: 'Utilidades (diferencia / pago)', d: '', k: 'N26', f: 'Arts. 131-132: utilidades del período menos anticipo pagado.' },
                { n: '4', c: 'Vacaciones fraccionadas', d: 'L27', k: 'N27', f: 'Arts. 190 y 196 LOTTT.' },
                { n: '5', c: 'Bono vacacional fraccionado', d: 'L28', k: 'N28', f: 'Art. 192: 15 días el primer año (+1 por año adicional).' },
                { n: '6', c: 'Sueldo de los días del mes de egreso', d: 'L29', k: 'N29', f: 'Sin cambio.' },
                { n: '7', c: 'Cesta Tickets', d: 'L30', k: 'N30', f: 'Sin cambio.' },
                { n: '8', c: 'Otras asignaciones', d: 'L31', k: 'N31', f: 'Sin cambio (ver escenario en hoja LOTTT).' },
                { n: '', c: 'TOTAL ASIGNACIONES', d: '', k: 'M33', f: '', tot: true },
                { n: '1', c: 'Aporte FAOV', d: '', k: 'N36', f: 'Misma base que la hoja UTILIDADES (incluye utilidades).' },
                { n: '2', c: 'Retención IVSS', d: '', k: 'N37', f: 'Sin cambio.' },
                { n: '3', c: 'Retención RPE', d: '', k: 'N38', f: 'Sin cambio.' },
                { n: '4', c: 'Retención INCES (0,5% utilidades)', d: '', k: 'N39', f: 'Sobre el pago de utilidades.' },
                { n: '5', c: 'Retención ISLR', d: '', k: 'N40', f: 'Sin cambio.' },
                { n: '', c: 'TOTAL DEDUCCIONES', d: '', k: 'M42', f: '', tot: true },
                { n: '', c: 'NETO A PAGAR', d: '', k: 'M44', f: '', tot: true }
              ].map((row, idx) => (
                <tr key={idx} className={row.tot ? 'tot' : ''}>
                  <td>{row.n}</td>
                  <td style={{ textAlign: 'left' }}>{row.c}</td>
                  <td>{row.d ? nf(V[row.d], 0, 2) : ''}</td>
                  <td>{maskSensitive(V[row.k], false, true)}</td>
                  <td>{row.d ? nf(V['x.' + row.d], 0, 2) : ''}</td>
                  <td>{maskSensitive(V['x.' + row.k], false, true)}</td>
                  <td><b>{maskSensitive(V['d.' + row.k], false, true)}</b></td>
                  <td style={{ textAlign: 'left', whiteSpace: 'normal', minWidth: 260 }}>{row.f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="small">
          Neto en US$ (Excel): <b>${maskSensitive(V.Q44, false, true)}</b> · (LOTTT): <b>${maskSensitive(V['x.Q44'], false, true)}</b>
        </div>
      </div>

      {/* =========================================================================
          HOJA 3: CÁLCULO DE LAS PRESTACIONES (Hoja del Trabajador)
          ========================================================================= */}
      <div className={`sheet wide ${activeTab === 3 ? 'on' : ''}`} id="s1">
        <div className="ti">{state.emp}</div>
        <div className="ti" style={{ fontSize: 13 }}>CÁLCULO DE LAS PRESTACIONES SOCIALES</div>

        <div className="mt">
          <b>NOMBRE DEL TRABAJADOR:</b> {state.nombre} &nbsp; &nbsp; <b>FECHA DE EGRESO:</b> {fd(state.egr)}<br />
          <b>CEDULA DEL TRABAJADOR:</b> {maskSensitive(state.ci, true)} &nbsp; &nbsp; <b>TIEMPO EN LA EMPRESA:</b> {V.M12}<br />
          <b>CARGO:</b> {state.cargo}<br />
          <b>FECHA DE INGRESO (DIA/MES/AÑO):</b> {V.ing_d} / {V.ing_m} / {V.ing_y} &nbsp; &nbsp; <b>DIAS PRESTACIONES AL TRIMESTRE =</b> {state.q7}
        </div>

        <div className="small flex items-center gap-1.5 flex-wrap no-print">
          <button onClick={handleAutoCalcDays} className="cursor-pointer">Calcular días (Art. 142 a/b)</button>
          <button onClick={handleAddMonthRow} className="cursor-pointer">+ Agregar mes</button>
          <button onClick={handleDelMonthRow} className="cursor-pointer">− Quitar último mes</button>
          <button 
            onClick={() => handleDownloadPdf('s1', 'Prestaciones_Mensuales', true)}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-red-700! hover:bg-red-800! text-white! font-bold text-xs px-3 py-1 rounded cursor-pointer shadow-xs ml-auto"
            title="Descargar cálculo mensual de prestaciones sociales a archivo PDF"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Generando...' : 'Descargar a PDF'}
          </button>
        </div>

        <div className="wrap">
          <table className="t2">
            <thead>
              <tr>
                {[
                  'AÑO', 'MES', 'SUELDO DEL MES', 'SALARIO DIARIO', 'TIEMPO SERVICIO AÑOS', 
                  'TIEMPO SERVICIO MESES', 'ALICUOTA UTILIDADES', 'ALICUOTA BONO VACACIONAL', 
                  'SUELDO INTEGRAL', 'SALARIO INTEGRAL DIARIO', 'DIAS PRESTAC', 'DIAS ADICIONALES', 
                  'TOTAL DIAS PRESTACIONES', 'PRESTACIONES DEL MES', 'PRESTACIONES ACUMULADAS', 
                  'ANTICIPO PRESTACIONES', 'SALDO', 'TASA INTERES %', 'INTERES EN EL MES', 
                  'ANTICIPO INTERESES PAGADOS', 'INTERESES ACUMULADOS'
                ].map((col, idx) => (
                  <th key={idx}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {state.rows.map((r, i) => {
                const n = 13 + i;
                return (
                  <tr key={i}>
                    <td>
                      <input
                        className="lottt-input"
                        value={r.a}
                        onChange={(e) => updateStateField(`rows.${i}.a`, pn(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        className="lottt-input"
                        value={r.b}
                        onChange={(e) => updateStateField(`rows.${i}.b`, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={fi(r.c)}
                        onChange={(e) => updateStateField(`rows.${i}.c`, pn(e.target.value))}
                      />
                    </td>
                    <td>{maskSensitive(V['pD' + n], false, true)}</td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={r.e}
                        onChange={(e) => updateStateField(`rows.${i}.e`, pn(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={r.f}
                        onChange={(e) => updateStateField(`rows.${i}.f`, pn(e.target.value))}
                      />
                    </td>
                    <td>{maskSensitive(V['pG' + n], false, true)}</td>
                    <td>{maskSensitive(V['pH' + n], false, true)}</td>
                    <td>{maskSensitive(V['pI' + n], false, true)}</td>
                    <td>{maskSensitive(V['pJ' + n], false, true)}</td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={r.k}
                        onChange={(e) => updateStateField(`rows.${i}.k`, pn(e.target.value))}
                      />
                    </td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={r.l}
                        onChange={(e) => updateStateField(`rows.${i}.l`, pn(e.target.value))}
                      />
                    </td>
                    <td>{nf(V['pM' + n], 0, 2)}</td>
                    <td>{maskSensitive(V['pN' + n], false, true)}</td>
                    <td>{maskSensitive(V['pO' + n], false, true)}</td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={fi(r.p)}
                        onChange={(e) => updateStateField(`rows.${i}.p`, pn(e.target.value))}
                      />
                    </td>
                    <td>{maskSensitive(V['pQ' + n], false, true)}</td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={fi(r.r, 'p')}
                        onChange={(e) => updateStateField(`rows.${i}.r`, pn(e.target.value) / 100)}
                      />
                    </td>
                    <td>{maskSensitive(V['pT' + n], false, true)}</td>
                    <td>
                      <input
                        className="lottt-input text-right"
                        value={fi(r.u)}
                        onChange={(e) => updateStateField(`rows.${i}.u`, pn(e.target.value))}
                      />
                    </td>
                    <td>{maskSensitive(V['pV' + n], false, true)}</td>
                  </tr>
                );
              })}
              <tr className="tot">
                <td colSpan={10}>TOTALES</td>
                <td>{nf(V.K69, 0, 2)}</td>
                <td>{nf(V.L69, 0, 2)}</td>
                <td>{nf(V.M69, 0, 2)}</td>
                <td>{maskSensitive(V.N69, false, true)}</td>
                <td></td>
                <td>{maskSensitive(V.P69, false, true)}</td>
                <td>{maskSensitive(V.Q69, false, true)}</td>
                <td></td>
                <td>{maskSensitive(V.T69, false, true)}</td>
                <td>{maskSensitive(V.U69, false, true)}</td>
                <td>{maskSensitive(V.V69, false, true)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt">
          Suma sueldos últimos 6 meses: <b style={{ minWidth: 0 }}>{maskSensitive(V.B71, false, true)}</b> &nbsp; &nbsp; 
          <b style={{ minWidth: 0 }}>Total Disponible para Anticipo (75% Art. 144 LOTTT):</b> {maskSensitive(V.Q71, false, true)}
        </div>
      </div>

      {/* =========================================================================
          HOJA 4: UTILIDADES 2026
          ========================================================================= */}
      <div className={`sheet wide ${activeTab === 4 ? 'on' : ''}`} id="s2">
        <div className="no-print flex items-center justify-between mb-3 bg-slate-100 p-2 border border-slate-300 rounded shadow-xs">
          <span className="text-xs font-bold text-slate-700">Devengado para Utilidades Año 2026</span>
          <button
            onClick={() => handleDownloadPdf('s2', 'Utilidades_2026', true)}
            disabled={isGeneratingPdf}
            className="flex items-center gap-1.5 bg-red-700! hover:bg-red-800! text-white! font-bold text-xs px-3 py-1.5 rounded cursor-pointer shadow-xs"
            title="Descargar cuadro de devengado para utilidades a archivo PDF"
          >
            <Download className="w-3.5 h-3.5" />
            {isGeneratingPdf ? 'Generando...' : 'Descargar a PDF'}
          </button>
        </div>

        <div className="ti">DEVENGADO PARA UTILIDADES AÑO 2026</div>
        <div className="small">
          Fracción utilidades (T3): <b>{nf(V.T3, 4, 4)}</b> &nbsp; &nbsp; ESTIMADOS A PERCIBIR (P-R) · DEDUCCIONES (U-Z)
        </div>

        {/* Tabla a: Estimada */}
        <div className="wrap" style={{ maxHeight: 'none' }}>
          <table className="t2 ut">
            <thead>
              <tr>
                {[
                  'ITEM', 'CEDULA', 'NOMBRE', 'FECHA INGRESO', 'EMPRESA', 'CARGO',
                  'DEVENGADO ENERO', 'DEVENGADO FEBRERO', 'DEVENGADO MARZO', 'DEVENGADO ABRIL', 
                  'DEVENGADO MAYO', 'DEVENGADO JUNIO', 'DEVENGADO JULIO', 'DEVENGADO AGOSTO', 
                  'DEVENGADO SEPTIEMBRE', 'ESTIMADO OCTUBRE', 'ESTIMADO NOVIEMBRE', 'ESTIMADO DICIEMBRE',
                  'TOTAL DEVENGADO', 'UTILIDADES 2026', 'ANTICIPO', '0,5% INCES', '1% FAOV', 
                  '%', 'ISLR', 'TOTAL DED.', 'TOTAL A PAGAR', 'US$', 'Sueldo Base'
                ].map((th, i) => (
                  <th key={i}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{maskSensitive(state.ci, true)}</td>
                <td>{state.nombre}</td>
                <td>{fd(state.ing)}</td>
                <td>{state.emp}</td>
                <td>{state.cargo}</td>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <td key={i}>
                    <input
                      className="lottt-input text-right"
                      value={fi(state.ut.a.m[i])}
                      onChange={(e) => updateStateField(`ut.a.m.${i}`, pn(e.target.value))}
                    />
                  </td>
                ))}
                <td>{maskSensitive(V['a.P'], false, true)}</td>
                <td>{maskSensitive(V['a.Q'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.a.m[11])}
                    onChange={(e) => updateStateField(`ut.a.m.11`, pn(e.target.value))}
                  />
                </td>
                <td>{maskSensitive(V['a.S'], false, true)}</td>
                <td>{maskSensitive(V['a.T'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.a.u)}
                    onChange={(e) => updateStateField(`ut.a.u`, pn(e.target.value))}
                  />
                </td>
                <td>{maskSensitive(V['a.V'], false, true)}</td>
                <td>{maskSensitive(V['a.W'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.a.x, 'p')}
                    onChange={(e) => updateStateField(`ut.a.x`, pn(e.target.value) / 100)}
                  />
                </td>
                <td>{maskSensitive(V['a.Y'], false, true)}</td>
                <td>{maskSensitive(V['a.Z'], false, true)}</td>
                <td>{maskSensitive(V['a.AA'], false, true)}</td>
                <td>{maskSensitive(V['a.AB'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.a.ac)}
                    onChange={(e) => updateStateField(`ut.a.ac`, pn(e.target.value))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="small">
          <b>TASA BCV</b> fecha {state.ut.vd} tasa {state.ut.w9}
        </div>

        {/* Tabla b: Real */}
        <div className="wrap" style={{ maxHeight: 'none' }}>
          <table className="t2 ut">
            <thead>
              <tr>
                {[
                  'ITEM', 'CEDULA', 'NOMBRE', 'FECHA INGRESO', 'EMPRESA', 'CARGO',
                  'DEVENGADO ENERO', 'DEVENGADO FEBRERO', 'DEVENGADO MARZO', 'DEVENGADO ABRIL', 
                  'DEVENGADO MAYO', 'DEVENGADO JUNIO', 'DEVENGADO JULIO', 'DEVENGADO AGOSTO', 
                  'DEVENGADO SEPTIEMBRE', 'DEVENGADO OCTUBRE', 'DEVENGADO NOVIEMBRE', 'DEVENGADO DICIEMBRE',
                  'TOTAL DEVENGADO', 'UTILIDADES 2026', 'ANTICIPO', '0,5% INCES', '1% FAOV', 
                  '%', 'ISLR', 'TOTAL DED.', 'TOTAL A PAGAR', 'US$', 'Sueldo Base'
                ].map((th, i) => (
                  <th key={i}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>{maskSensitive(state.ci, true)}</td>
                <td>{state.nombre}</td>
                <td>{fd(state.ing)}</td>
                <td>{state.emp}</td>
                <td>{state.cargo}</td>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                  <td key={i}>
                    <input
                      className="lottt-input text-right"
                      value={fi(state.ut.b.m[i])}
                      onChange={(e) => updateStateField(`ut.b.m.${i}`, pn(e.target.value))}
                    />
                  </td>
                ))}
                <td>{maskSensitive(V['b.S'], false, true)}</td>
                <td>{maskSensitive(V['b.T'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.b.u)}
                    onChange={(e) => updateStateField(`ut.b.u`, pn(e.target.value))}
                  />
                </td>
                <td>{maskSensitive(V['b.V'], false, true)}</td>
                <td>{maskSensitive(V['b.W'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.b.x, 'p')}
                    onChange={(e) => updateStateField(`ut.b.x`, pn(e.target.value) / 100)}
                  />
                </td>
                <td>{maskSensitive(V['b.Y'], false, true)}</td>
                <td>{maskSensitive(V['b.Z'], false, true)}</td>
                <td>{maskSensitive(V['b.AA'], false, true)}</td>
                <td>{maskSensitive(V['b.AB'], false, true)}</td>
                <td>
                  <input
                    className="lottt-input text-right"
                    value={fi(state.ut.b.ac)}
                    onChange={(e) => updateStateField(`ut.b.ac`, pn(e.target.value))}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="small">
          US$ de AA6: <b>${maskSensitive(V.AA8, false, true)}</b> &nbsp; Monto (AA9): {fi(state.ut.aa9)} &nbsp; Diferencia (AA9 − AA6): <b>{maskSensitive(V.AA11, false, true)}</b>
        </div>
        <div className="small">
          Total devengado real (R16): <b>{maskSensitive(V.R16, false, true)}</b> &nbsp; estimado (R17): <b>{maskSensitive(V.R17, false, true)}</b> &nbsp; 
          <b>Diferencia de Utilidades (R18 → LIQUIDACION N26): {maskSensitive(V.R18, false, true)}</b> &nbsp; Dif. INCES (V18): <b>{maskSensitive(V.V18, false, true)}</b>
        </div>
      </div>

      {/* =========================================================================
          HOJA 5: BASE DE DATOS E HISTORIAL DE LIQUIDACIONES (¡Nueva Hoja!)
          ========================================================================= */}
      {activeTab === 5 && (
        <HistorySheet
          currentState={state}
          privacyMode={privacyMode}
          onLoadRecord={(rec) => {
            setState(clone(rec.stateData));
            setActiveTab(0);
          }}
          onSaveCurrent={() => handleSaveToDatabase()}
          showNotification={showNotification}
          onDownloadJson={handleDownloadJson}
          onUploadJson={handleUploadJson}
        />
      )}

      {/* TABS INFERIORES FIJOS */}
      <div className="tabs no-print" id="tabs">
        <button
          className={activeTab === 0 ? 'on' : ''}
          onClick={() => setActiveTab(0)}
        >
          LIQUIDACIÓN (Excel)
        </button>
        <button
          className={activeTab === 1 ? 'on' : ''}
          onClick={() => setActiveTab(1)}
        >
          LIQUIDACIÓN LOTTT
        </button>
        <button
          className={activeTab === 2 ? 'on' : ''}
          onClick={() => setActiveTab(2)}
        >
          COMPARATIVO
        </button>
        <button
          className={activeTab === 3 ? 'on' : ''}
          onClick={() => setActiveTab(3)}
        >
          {(state.nombre || 'TRABAJADOR').toUpperCase()}
        </button>
        <button
          className={activeTab === 4 ? 'on' : ''}
          onClick={() => setActiveTab(4)}
        >
          UTILIDADES 2026
        </button>
        <button
          className={`font-bold! ${activeTab === 5 ? 'on bg-emerald-800! text-white!' : 'text-emerald-800!'}`}
          onClick={() => setActiveTab(5)}
        >
          📂 BASE DE DATOS / HISTORIAL ({dbCount})
        </button>
      </div>

    </div>
  );
}
