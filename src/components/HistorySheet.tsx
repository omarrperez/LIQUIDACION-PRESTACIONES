import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  FolderOpen, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  User, 
  DollarSign, 
  RefreshCw, 
  FileUp, 
  CheckCircle,
  Eye,
  Info,
  Scale,
  FileDown
} from 'lucide-react';
import { 
  SavedLiquidacion, 
  getAllLiquidaciones, 
  deleteLiquidacionRecord, 
  exportFullDatabaseBackup, 
  importFullDatabaseBackup, 
  triggerFileDownload 
} from '../db/indexedDB';
import { LiquidationState } from '../types';
import { exportSheetToPdf, downloadBlob } from '../utils/exportUtils';
import { generateStandaloneHtml } from '../standaloneHtml';
import { nf, fd } from '../utils/lotttEngine';

interface HistorySheetProps {
  currentState: LiquidationState;
  privacyMode: boolean;
  onLoadRecord: (record: SavedLiquidacion) => void;
  onSaveCurrent: () => Promise<void>;
  showNotification: (msg: string, isError?: boolean) => void;
  onDownloadJson?: () => void;
  onUploadJson?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HistorySheet: React.FC<HistorySheetProps> = ({
  currentState,
  privacyMode,
  onLoadRecord,
  onSaveCurrent,
  showNotification,
  onDownloadJson,
  onUploadJson
}) => {
  const [records, setRecords] = useState<SavedLiquidacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMotivo, setFilterMotivo] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<SavedLiquidacion | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      showNotification('⏳ Generando archivo PDF del historial de liquidaciones...');
      await exportSheetToPdf('history_sheet_container', `Historial_Liquidaciones_${new Date().toISOString().slice(0, 10)}.pdf`, true);
      showNotification('✅ Historial descargado en PDF exitosamente.');
    } catch (err: any) {
      console.error(err);
      showNotification('Preparando vista para Guardar como PDF...');
      setTimeout(() => window.print(), 400);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Cargar registros desde IndexedDB
  const refreshRecords = async () => {
    try {
      setLoading(true);
      const list = await getAllLiquidaciones();
      setRecords(list);
    } catch (err: any) {
      console.error(err);
      showNotification('Error al leer la base de datos local: ' + err.message, true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshRecords();
  }, []);

  const handleSaveCurrent = async () => {
    setIsSaving(true);
    try {
      await onSaveCurrent();
      await refreshRecords();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadHtml = () => {
    try {
      showNotification('Generando archivo HTML autónomo en memoria...');
      const htmlContent = generateStandaloneHtml();
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, 'Liquidacion_Prestaciones_LOTTT_Venezuela.html');
      showNotification('✅ Archivo HTML autónomo descargado. Compatible con Chrome, Edge, Firefox y Opera.');
    } catch (err: any) {
      showNotification('Error al generar archivo HTML: ' + err.message, true);
    }
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (!window.confirm(`¿Está seguro de eliminar de la base de datos el expediente de "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await deleteLiquidacionRecord(id);
      showNotification(`Expediente de ${nombre} eliminado correctamente.`);
      await refreshRecords();
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err: any) {
      showNotification('Error al eliminar registro: ' + err.message, true);
    }
  };

  const handleExportBackup = async () => {
    try {
      const backupJson = await exportFullDatabaseBackup();
      const blob = new Blob([backupJson], { type: 'application/json' });
      triggerFileDownload(blob, `Respaldo_BD_Liquidaciones_LOTTT_${new Date().toISOString().slice(0, 10)}.json`);
      showNotification('Respaldo de la base de datos exportado con éxito.');
    } catch (err: any) {
      showNotification('Error al exportar respaldo: ' + err.message, true);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const count = await importFullDatabaseBackup(reader.result as string);
        showNotification(`Se importaron ${count} expedientes a la base de datos con éxito.`);
        await refreshRecords();
      } catch (err: any) {
        showNotification('Error al importar archivo de respaldo: ' + err.message, true);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtrado de registros
  const filteredRecords = records.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = 
      (r.nombre || '').toLowerCase().includes(q) ||
      (r.ci || '').toLowerCase().includes(q) ||
      (r.empresa || '').toLowerCase().includes(q) ||
      (r.cargo || '').toLowerCase().includes(q);

    const matchMotivo = filterMotivo === 'ALL' || (r.motivo || '').toUpperCase() === filterMotivo;

    return matchSearch && matchMotivo;
  });

  // Métricas agregadas
  const totalNetoBs = records.reduce((acc, curr) => acc + (curr.netoBs || 0), 0);
  const totalNetoUsd = records.reduce((acc, curr) => acc + (curr.netoUsd || 0), 0);
  const totalFiles = records.filter(r => r.fileBlob || r.fileName).length;

  // Formato seguro con modo privacidad
  const maskText = (text: string, isCI = false, isAmount = false) => {
    if (!privacyMode) return text;
    if (isCI) {
      return text.replace(/(\d{2})\d+(\d{2})/, '$1.***.$2');
    }
    if (isAmount) {
      return '••••••••';
    }
    return text;
  };

  return (
    <div id="history_sheet_container" className="sheet on bg-slate-100 min-h-screen pb-16 font-sans">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Banner de Cabecera */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-lg p-6 shadow-md border-b-4 border-amber-400">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-7 h-7 text-amber-300" />
                <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                  Base de Datos e Historial de Liquidaciones (LOTTT)
                </h1>
              </div>
              <p className="text-sm text-emerald-100 mt-1 max-w-3xl">
                Almacén seguro y permanente de expedientes y archivos originales (.xlsx / .json). 
                Sus liquidaciones se conservan de forma inmutable en el navegador y puede consultarlas, 
                reabrirlas meses después o descargar los archivos originales.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap no-print">
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2.5 rounded shadow transition cursor-pointer text-xs border border-emerald-400"
                title="Descargar la aplicación completa en un único archivo HTML para usarla en Google Chrome, Microsoft Edge, Mozilla Firefox u Opera sin necesidad de internet ni cookies"
              >
                <FileDown className="w-4 h-4 text-amber-300" />
                Descargar App HTML
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-2.5 rounded shadow transition cursor-pointer text-xs"
                title="Descargar reporte completo del historial de liquidaciones en formato PDF"
              >
                <Download className="w-4 h-4" />
                {isExportingPdf ? 'Generando...' : 'Descargar a PDF'}
              </button>

              <button
                onClick={handleSaveCurrent}
                disabled={isSaving}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-900 font-bold px-4 py-2.5 rounded shadow transition cursor-pointer text-xs"
              >
                <CheckCircle className="w-4 h-4 text-slate-900" />
                {isSaving ? 'Guardando...' : 'Guardar Liquidación Actual'}
              </button>
              
              <button
                onClick={handleExportBackup}
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded border border-emerald-500 shadow-sm transition cursor-pointer text-xs"
                title="Exportar archivo de copia de seguridad completo con todas las liquidaciones"
              >
                <Download className="w-4 h-4" />
                Exportar Respaldo
              </button>

              <label 
                className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded border border-emerald-500 shadow-sm transition cursor-pointer text-xs"
                title="Importar respaldo previo de liquidaciones"
              >
                <FileUp className="w-4 h-4" />
                Importar Respaldo
                <input 
                  type="file" 
                  accept=".json" 
                  onChange={handleImportBackup} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          {/* Tarjetas de Métricas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-4 border-t border-emerald-700/60 text-xs">
            <div className="bg-emerald-950/40 rounded p-2.5 border border-emerald-600/40">
              <span className="text-emerald-200 block text-[11px]">Expedientes Guardados</span>
              <span className="text-lg font-bold text-white">{records.length}</span>
            </div>
            <div className="bg-emerald-950/40 rounded p-2.5 border border-emerald-600/40">
              <span className="text-emerald-200 block text-[11px]">Total Liquidado (Bs.)</span>
              <span className="text-lg font-bold text-amber-300">
                {maskText(nf(totalNetoBs), false, true)}
              </span>
            </div>
            <div className="bg-emerald-950/40 rounded p-2.5 border border-emerald-600/40">
              <span className="text-emerald-200 block text-[11px]">Total Liquidado (USD)</span>
              <span className="text-lg font-bold text-emerald-300">
                ${maskText(nf(totalNetoUsd), false, true)}
              </span>
            </div>
            <div className="bg-emerald-950/40 rounded p-2.5 border border-emerald-600/40">
              <span className="text-emerald-200 block text-[11px]">Archivos Adjuntos (Bóveda)</span>
              <span className="text-lg font-bold text-cyan-300">{totalFiles}</span>
            </div>
          </div>
        </div>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre del trabajador, cédula, empresa o cargo..."
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-800"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={filterMotivo}
              onChange={(e) => setFilterMotivo(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-slate-700"
            >
              <option value="ALL">Todos los motivos</option>
              <option value="RENUNCIA">Renuncia voluntaria</option>
              <option value="DESPIDO">Despido</option>
              <option value="CULMINACION">Culminación de contrato</option>
              <option value="JUBILACION">Jubilación</option>
            </select>

            <button
              onClick={refreshRecords}
              className="p-2 border border-slate-300 rounded hover:bg-slate-50 text-slate-600 cursor-pointer"
              title="Refrescar lista"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabla de Expedientes Guardados */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Expedientes Históricos Guardados ({filteredRecords.length})
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protegido con almacenamiento IndexedDB</span>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
              Cargando expedientes desde la base de datos...
            </div>
          ) : filteredRecords.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs space-y-3">
              <Database className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No hay liquidaciones archivadas todavía</p>
              <p className="text-slate-400 max-w-md mx-auto text-[11px]">
                Cuando cargue un archivo Excel o presione el botón <b>"Guardar Liquidación Actual"</b>, 
                quedará guardada permanentemente en esta base de datos local para consultarla cuando regrese.
              </p>
              <button
                onClick={handleSaveCurrent}
                className="mt-2 bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded text-xs font-medium cursor-pointer inline-flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Guardar liquidación activa ahora
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-100 text-[11px] font-semibold text-slate-600 uppercase border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Fecha Registro</th>
                    <th className="p-2.5">Trabajador</th>
                    <th className="p-2.5">Cédula</th>
                    <th className="p-2.5">Empresa</th>
                    <th className="p-2.5">Período</th>
                    <th className="p-2.5">Motivo</th>
                    <th className="p-2.5 text-right">Neto a Pagar Bs.</th>
                    <th className="p-2.5 text-right">Neto USD</th>
                    <th className="p-2.5 text-center">Archivo</th>
                    <th className="p-2.5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecords.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5 whitespace-nowrap text-slate-500 text-[11px]">
                        <span className="font-medium text-slate-700 block">
                          {new Date(item.createdAt).toLocaleDateString('es-VE')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(item.createdAt).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>

                      <td className="p-2.5">
                        <span className="font-bold text-slate-900 block">{item.nombre || '—'}</span>
                        <span className="text-[11px] text-slate-500">{item.cargo || 'Sin cargo'}</span>
                      </td>

                      <td className="p-2.5 font-mono text-[11px] whitespace-nowrap">
                        {maskText(item.ci || '—', true)}
                      </td>

                      <td className="p-2.5">
                        <span className="text-slate-800 font-medium block truncate max-w-[140px]" title={item.empresa}>
                          {item.empresa || '—'}
                        </span>
                        <span className="text-[10px] text-slate-500">{item.rif || ''}</span>
                      </td>

                      <td className="p-2.5 whitespace-nowrap text-[11px]">
                        <span className="text-slate-600 block">{fd(item.ing)} al {fd(item.egr)}</span>
                        <span className="text-[10px] text-emerald-700 font-medium">
                          {item.stateData?.rows?.length || 0} meses calc.
                        </span>
                      </td>

                      <td className="p-2.5 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                          {item.motivo || 'EGRESO'}
                        </span>
                      </td>

                      <td className="p-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {maskText(nf(item.netoBs), false, true)}
                      </td>

                      <td className="p-2.5 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap">
                        ${maskText(nf(item.netoUsd), false, true)}
                      </td>

                      <td className="p-2.5 text-center whitespace-nowrap">
                        {item.fileBlob || item.fileName ? (
                          <button
                            onClick={() => {
                              if (item.fileBlob) {
                                triggerFileDownload(item.fileBlob, item.fileName || `Liquidacion_${item.nombre}.xlsx`);
                              } else {
                                showNotification('El archivo binario no está en caché, pero los datos están guardados.', true);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded cursor-pointer transition"
                            title={`Descargar archivo original: ${item.fileName || 'archivo'}`}
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                            <span>.xlsx</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">JSON</span>
                        )}
                      </td>

                      <td className="p-2.5 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => {
                              onLoadRecord(item);
                              showNotification(`Liquidación de "${item.nombre}" cargada en el calculador.`);
                            }}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm text-xs cursor-pointer"
                            title="Cargar esta liquidación en las hojas de cálculo para editar o imprimir"
                          >
                            <FolderOpen className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setSelectedRecord(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-300 text-xs cursor-pointer"
                            title="Ver resumen y dictamen legal LOTTT"
                          >
                            <Scale className="w-3.5 h-3.5 text-amber-700" />
                          </button>

                          <button
                            onClick={() => handleDelete(item.id, item.nombre)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded border border-rose-200 text-xs cursor-pointer"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal de Detalle / Dictamen Legal LOTTT */}
        {selectedRecord && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-300">
              <div className="bg-emerald-800 text-white p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scale className="w-5 h-5 text-amber-300" />
                  <h3 className="font-bold text-sm">
                    Ficha de Liquidación y Auditoría Jurídica LOTTT
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="text-white/80 hover:text-white font-bold px-2 py-0.5 text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs text-slate-700">
                <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Trabajador:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedRecord.nombre}</span>
                    <span className="block text-slate-600">C.I.: {maskText(selectedRecord.ci, true)}</span>
                    <span className="block text-slate-600">Cargo: {selectedRecord.cargo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Empresa:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedRecord.empresa}</span>
                    <span className="block text-slate-600">{selectedRecord.rif}</span>
                    <span className="block text-slate-600">Motivo: {selectedRecord.motivo}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded border border-slate-200 text-center">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Fecha de Ingreso</span>
                    <span className="font-semibold text-slate-800">{fd(selectedRecord.ing)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Fecha de Egreso</span>
                    <span className="font-semibold text-slate-800">{fd(selectedRecord.egr)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Tasa BCV Aplicada</span>
                    <span className="font-semibold text-slate-800">{nf(selectedRecord.tasa)} Bs/$</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-3 rounded border-l-4 border-amber-500 text-amber-900 text-[11px] space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    Criterio Legal de Prestaciones (Art. 142 LOTTT):
                  </div>
                  <p>
                    {selectedRecord.garantiaLit || 'Se pagó el mayor entre la garantía acumulada (literales a y b) y el cálculo retroactivo del literal c (30 días por año o fracción superior a 6 meses de conformidad con el literal d).'}
                  </p>
                </div>

                <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2">
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 border-b pb-2">
                    <span>Monto Neto de Liquidación:</span>
                    <span className="text-emerald-800 font-mono">
                      Bs. {maskText(nf(selectedRecord.netoBs), false, true)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600">
                    <span>Equivalente en Divisas (BCV):</span>
                    <span className="font-mono font-semibold text-slate-800">
                      ${maskText(nf(selectedRecord.netoUsd), false, true)} USD
                    </span>
                  </div>
                </div>

                {selectedRecord.fileName && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded border border-emerald-200">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                      <span className="font-medium text-emerald-900">{selectedRecord.fileName}</span>
                    </div>
                    {selectedRecord.fileBlob && (
                      <button
                        onClick={() => triggerFileDownload(selectedRecord.fileBlob!, selectedRecord.fileName!)}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-2.5 py-1 rounded text-[11px] font-medium cursor-pointer"
                      >
                        Descargar archivo original
                      </button>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    onClick={() => {
                      onLoadRecord(selectedRecord);
                      setSelectedRecord(null);
                      showNotification(`Liquidación de "${selectedRecord.nombre}" cargada en el calculador.`);
                    }}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <FolderOpen className="w-4 h-4" />
                    Cargar en Calculador
                  </button>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded text-xs cursor-pointer"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN AVANZADA PARA SISTEMAS / IT (OCULTA POR DEFECTO PARA EL USUARIO COMÚN) */}
        <div className="pt-6 border-t border-slate-300">
          <details className="group bg-slate-200/70 rounded-lg p-3 text-xs border border-slate-300 cursor-pointer">
            <summary className="font-semibold text-slate-700 flex items-center justify-between select-none">
              <span className="flex items-center gap-1.5">
                <span className="text-slate-500">⚙️</span>
                <span>Opciones avanzadas para soporte técnico / Exportación JSON (No requeridas para uso diario)</span>
              </span>
              <span className="text-[11px] text-slate-500 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            
            <div className="mt-3 pt-3 border-t border-slate-300 space-y-2 text-slate-600">
              <p className="text-[11px] text-slate-500">
                Estas opciones están reservadas para administradores de sistemas o migraciones técnicas. 
                El usuario de nómina y RRHH no necesita manipular archivos JSON, ya que todos los cálculos se guardan automáticamente en la Base de Datos y en archivos Excel.
              </p>
              
              <div className="flex items-center gap-2 flex-wrap pt-1">
                {onDownloadJson && (
                  <button
                    onClick={onDownloadJson}
                    className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Descargar liquidación activa en formato JSON
                  </button>
                )}

                {onUploadJson && (
                  <label className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-xs cursor-pointer">
                    <FileUp className="w-3.5 h-3.5" />
                    Cargar archivo JSON externo
                    <input
                      type="file"
                      accept=".json"
                      onChange={onUploadJson}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </details>
        </div>

      </div>
    </div>
  );
};
