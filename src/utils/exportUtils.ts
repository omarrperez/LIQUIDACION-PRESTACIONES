/**
 * Utilidades profesionales de exportación para Liquidaciones LOTTT
 * - Generación de PDF con jsPDF y html2canvas-pro (Soporta OKLCH, display-p3, Tailwind v4 y todos los navegadores)
 * - Exportación de Liquidaciones a Microsoft Word (.doc con formato oficial)
 */

import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import { LiquidationState, CalculatedValues } from '../types';
import { nf, fd } from './lotttEngine';

/**
 * Descarga universal y segura de archivos Blob compatible con cualquier navegador (Chrome, Edge, Firefox, Opera, Safari)
 */
export function downloadBlob(blob: Blob, fileName: string): void {
  const cleanName = fileName.replace(/[/\\?%*:|"<>]/g, '_');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = cleanName;
  a.setAttribute('download', cleanName);
  a.target = '_self';
  document.body.appendChild(a);

  a.click();

  // Mantiene vivo el enlace durante 45 segundos para descargas en segundo plano o conexiones lentas
  setTimeout(() => {
    try {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {}
  }, 45000);
}

/**
 * Exporta un contenedor HTML a archivo PDF descargable con resolución nítida y paginación impecable
 */
export async function exportSheetToPdf(
  elementId: string, 
  fileName: string, 
  isLandscape = false
): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) {
    throw new Error(`No se encontró el elemento a exportar (${elementId}). Asegúrese de estar en la pestaña correcta.`);
  }

  // Captura nítida con html2canvas-pro (soporta OKLCH, oklab, display-p3 de Tailwind CSS v4)
  const canvas = await html2canvas(el, {
    scale: 2, // 2x para resolución nítida y legible
    useCORS: true,
    allowTaint: true,
    logging: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    ignoreElements: (element) => 
      element.classList?.contains('no-print') || 
      element.getAttribute('data-no-print') === 'true',
  });

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 6; // Margen optimizado de 6mm para aprovechar el formato carta
  const printableWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;

  // CASO HOJA 1 Y HOJA 2: GARANTÍA ESTRICTA DE 1 SOLA HOJA (NO 2 PÁGINAS)
  if (elementId === 's0_doc' || elementId === 's3_doc' || !isLandscape) {
    // Escala matemática proporcional para que encaje 100% dentro de los límites de 1 sola página Letter
    const scale = Math.min(printableWidth / canvas.width, printableHeight / canvas.height);
    const renderWidth = canvas.width * scale;
    const renderHeight = canvas.height * scale;

    // Centrado perfecto en la página única
    const offsetX = margin + (printableWidth - renderWidth) / 2;
    const offsetY = margin + (printableHeight - renderHeight) / 2;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    pdf.addImage(imgData, 'JPEG', offsetX, offsetY, renderWidth, renderHeight, undefined, 'FAST');

    // Descarga directa del archivo de 1 sola página
    const pdfBlob = pdf.output('blob');
    const safeName = (fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`).replace(/[/\\?%*:|"<>]/g, '_');
    downloadBlob(pdfBlob, safeName);
    return;
  }

  // Altura total proporcional al ancho imprimible para hojas anchas (s4, s1, s2, historial)
  const totalPdfHeight = (canvas.height * printableWidth) / canvas.width;

  if (totalPdfHeight <= printableHeight) {
    const imgData = canvas.toDataURL('image/jpeg', 0.96);
    pdf.addImage(imgData, 'JPEG', margin, margin, printableWidth, totalPdfHeight, undefined, 'FAST');
  } else {
    // Si excede una página (tablas largas como Historial o Prestaciones mensuales):
    // Partición limpia de páginas mediante slicing de canvas en memoria
    const pageCanvasHeight = Math.floor((canvas.width * printableHeight) / printableWidth);
    let renderedHeight = 0;
    let pageCount = 0;

    while (renderedHeight < canvas.height) {
      if (pageCount > 0) {
        pdf.addPage();
      }

      const chunkHeight = Math.min(pageCanvasHeight, canvas.height - renderedHeight);
      const pageCanvas = document.createElement('canvas');
      pageCanvas.width = canvas.width;
      pageCanvas.height = chunkHeight;
      const ctx = pageCanvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
        ctx.drawImage(
          canvas,
          0, renderedHeight, canvas.width, chunkHeight,
          0, 0, canvas.width, chunkHeight
        );
        const chunkData = pageCanvas.toDataURL('image/jpeg', 0.96);
        const chunkPdfHeight = (chunkHeight * printableWidth) / canvas.width;
        pdf.addImage(chunkData, 'JPEG', margin, margin, printableWidth, chunkPdfHeight, undefined, 'FAST');
      }

      renderedHeight += chunkHeight;
      pageCount++;
    }
  }

  // Genera el Blob y lo descarga de forma segura en cualquier navegador (Chrome, Edge, Firefox, Opera, etc.)
  const pdfBlob = pdf.output('blob');
  const safeName = (fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`).replace(/[/\\?%*:|"<>]/g, '_');
  downloadBlob(pdfBlob, safeName);
}

/**
 * Exporta el recibo de liquidación a formato Microsoft Word (.doc)
 * Genera un archivo con formato XML/HTML nativo de Word con membrete, tablas, bordes y firmas
 */
export function exportLiquidationToWord(
  state: LiquidationState,
  V: CalculatedValues,
  isLOTTT = false
): void {
  const getV = (k: string) => (isLOTTT ? V['x.' + k] ?? V[k] : V[k]);
  const workerName = state.nombre || 'Trabajador';
  const fileName = `Liquidacion_${workerName.replace(/\s+/g, '_')}_${isLOTTT ? 'LOTTT' : 'Empresa'}.doc`;

  const wordHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Liquidación de Prestaciones Sociales - ${workerName}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page {
          size: letter portrait;
          margin: 1.5cm 1.5cm 1.5cm 1.5cm;
        }
        body {
          font-family: Calibri, Arial, sans-serif;
          font-size: 10pt;
          color: #000;
          line-height: 1.2;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 6px;
        }
        td, th {
          border: 1pt solid #000;
          padding: 3px 5px;
          font-size: 9pt;
        }
        .header-bg {
          background-color: #d9d9d9;
          font-weight: bold;
          text-align: center;
        }
        .banner-title {
          background-color: ${isLOTTT ? '#1f4e8c' : '#404040'};
          color: #ffffff;
          font-weight: bold;
          text-align: center;
          font-size: 11pt;
          padding: 5px;
        }
        .text-right {
          text-align: right;
        }
        .text-center {
          text-align: center;
        }
        .bold {
          font-weight: bold;
        }
        .yellow-box {
          background-color: #ffff00;
          font-weight: bold;
          text-align: center;
        }
        .neto-row {
          background-color: #bfbfbf;
          font-size: 12pt;
          font-weight: bold;
        }
        .no-border {
          border: none !important;
        }
        .legal-text {
          font-size: 8pt;
          text-align: justify;
          margin-top: 10px;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .firma-box {
          width: 100px;
          height: 100px;
          border: 1.5pt solid #000;
          text-align: center;
          vertical-align: bottom;
          font-size: 8pt;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      
      <!-- Membrete y Lugar y Fecha -->
      <table style="border: none; margin-bottom: 8px;">
        <tr style="border: none;">
          <td style="border: none; width: 55%; vertical-align: top;">
            <b style="font-size: 13pt; color: #1a4d2e;">${state.emp || 'AGRIBIENES C.A.'}</b><br>
            <span style="font-size: 9pt; color: #333;">${state.rif || 'RIF: J-31471703-0'}</span>
          </td>
          <td style="border: none; width: 45%; vertical-align: top;">
            <table style="border: 1.5pt solid #000;">
              <tr>
                <td class="header-bg" style="font-size: 9pt;">LUGAR Y FECHA</td>
              </tr>
              <tr>
                <td class="text-center bold" style="font-size: 9.5pt;">${state.lugar || 'Puerto Cabello, ' + fd(state.egr)}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Cintillo Recibo de Liquidación -->
      <div class="banner-title">
        ${isLOTTT ? 'LIQUIDACIÓN REVISADA SEGÚN LA LOTTT (CÁLCULO DE CONTROL)' : 'RECIBO DE LIQUIDACIÓN DE PRESTACIONES SOCIALES'}
      </div>

      <!-- Datos del Trabajador y Tiempo de Servicio -->
      <table style="margin-top: 4px;">
        <tr>
          <td class="header-bg" style="width: 35%;">NOMBRE Y APELLIDO</td>
          <td class="header-bg" style="width: 40%;">CARGO</td>
          <td class="header-bg" style="width: 25%;">C.I.</td>
        </tr>
        <tr>
          <td class="bold text-center">${state.nombre}</td>
          <td class="bold text-center">${state.cargo}</td>
          <td class="bold text-center">${state.ci}</td>
        </tr>
        <tr>
          <td class="header-bg">MOTIVO DEL EGRESO</td>
          <td class="header-bg">FECHA DE INGRESO</td>
          <td class="header-bg">FECHA DE EGRESO</td>
        </tr>
        <tr>
          <td class="bold text-center">${state.motivo}</td>
          <td class="text-center">${fd(state.ing)}</td>
          <td class="text-center">${fd(state.egr)}</td>
        </tr>
      </table>

      <!-- Tiempo de Servicio y Tasa BCV -->
      <table>
        <tr>
          <td class="header-bg" colspan="3" style="width: 50%;">TIEMPO DE SERVICIO</td>
          <td class="header-bg" colspan="2" style="width: 50%;">TASA BCV AL ${fd(state.egr)}</td>
        </tr>
        <tr>
          <td class="text-center bold" style="width: 16%;">AÑOS: ${getV('P12')}</td>
          <td class="yellow-box" style="width: 17%;">MESES: ${getV('Q12')}</td>
          <td class="text-center bold" style="width: 17%;">DÍAS: ${getV('R12')}</td>
          <td class="text-center bold" colspan="2" style="font-size: 10pt;">${nf(state.tasa)} Bs/USD</td>
        </tr>
      </table>

      <!-- Estructura Salarial -->
      <table>
        <tr class="header-bg">
          <td style="width: 16%;">SALARIO BÁSICO</td>
          <td style="width: 17%;">SALARIO NORMAL</td>
          <td style="width: 17%;">SALARIO DIARIO</td>
          <td style="width: 16%;">ALÍCUOTA BONO VAC.</td>
          <td style="width: 17%;">ALÍCUOTA UTILIDADES</td>
          <td style="width: 17%;">SALARIO INTEGRAL</td>
        </tr>
        <tr>
          <td class="text-right">${nf(getV('B15'))}</td>
          <td class="text-right">${nf(state.dNormal)}</td>
          <td class="text-right">${nf(getV('E15'))}</td>
          <td class="text-right">${nf(getV('H15'))}</td>
          <td class="text-right">${nf(getV('J15'))}</td>
          <td class="text-right bold">${nf(getV('L15'))}</td>
        </tr>
      </table>

      <!-- Garantía de Prestaciones Sociales -->
      <table>
        <tr class="header-bg">
          <td style="width: 70%;">GARANTÍA DE PRESTACIONES SOCIALES (Art. 142 LOTTT)</td>
          <td style="width: 15%;">DÍAS</td>
          <td style="width: 15%;">BS.</td>
        </tr>
        <tr>
          <td>${getV('c0')}</td>
          <td class="text-center bold">${nf(getV('K18'), 0, 2)}</td>
          <td class="text-right bold">${nf(getV('L18'))}</td>
        </tr>
      </table>

      <!-- Cálculo de Asignaciones -->
      <table>
        <tr>
          <td class="header-bg bold" colspan="4" style="font-size: 9.5pt;">CÁLCULO DE ASIGNACIONES</td>
        </tr>
        <tr class="header-bg">
          <td style="width: 6%;">CÓD.</td>
          <td style="width: 64%;">CONCEPTO</td>
          <td style="width: 15%;">DÍAS</td>
          <td style="width: 15%;">BS.</td>
        </tr>
        <tr>
          <td class="text-center">1</td>
          <td>${getV('c0')}</td>
          <td class="text-center bold">${nf(getV('L24'), 0, 2)}</td>
          <td class="text-right">${nf(getV('N24'))}</td>
        </tr>
        <tr>
          <td class="text-center">2</td>
          <td>Intereses Sobre Prestaciones Sociales (Art. 143 LOTTT)</td>
          <td class="text-center">—</td>
          <td class="text-right">${nf(getV('N25'))}</td>
        </tr>
        <tr>
          <td class="text-center">3</td>
          <td>Diferencia de Utilidades</td>
          <td class="text-center">—</td>
          <td class="text-right">${nf(getV('N26'))}</td>
        </tr>
        <tr>
          <td class="text-center">4</td>
          <td>${getV('c4')}</td>
          <td class="text-center bold">${nf(getV('L27'), 0, 2)}</td>
          <td class="text-right">${nf(getV('N27'))}</td>
        </tr>
        <tr>
          <td class="text-center">5</td>
          <td>${getV('c5')}</td>
          <td class="text-center bold">${nf(getV('L28'), 0, 2)}</td>
          <td class="text-right">${nf(getV('N28'))}</td>
        </tr>
        <tr>
          <td class="text-center">6</td>
          <td>${getV('c6')}</td>
          <td class="text-center bold">${state.l29}</td>
          <td class="text-right">${nf(getV('N29'))}</td>
        </tr>
        <tr>
          <td class="text-center">7</td>
          <td>${getV('c7')}</td>
          <td class="text-center bold">${state.l30}</td>
          <td class="text-right">${nf(getV('N30'))}</td>
        </tr>
        <tr>
          <td class="text-center">8</td>
          <td>Otras Asignaciones</td>
          <td class="text-center bold">${state.l31}</td>
          <td class="text-right">${nf(getV('N31'))}</td>
        </tr>
        <tr>
          <td class="no-border" colspan="2"></td>
          <td class="header-bg bold text-right">TOTAL ASIGNACIONES</td>
          <td class="text-right bold" style="background-color: #f5f5f5;">${nf(getV('M33'))}</td>
        </tr>
      </table>

      <!-- Deducciones -->
      <table>
        <tr>
          <td class="banner-title" colspan="4" style="font-size: 9.5pt; padding: 3px;">DEDUCCIONES</td>
        </tr>
        <tr class="header-bg">
          <td style="width: 6%;">CÓD.</td>
          <td style="width: 64%;">CONCEPTO</td>
          <td style="width: 15%;">TASA / %</td>
          <td style="width: 15%;">BS.</td>
        </tr>
        <tr>
          <td class="text-center">1</td>
          <td>Aporte Reg. Prest. Vivienda y Hábitat (FAOV)</td>
          <td class="text-center">${nf(state.faov * 100, 2, 2)}%</td>
          <td class="text-right">${nf(getV('N36'))}</td>
        </tr>
        <tr>
          <td class="text-center">2</td>
          <td>Retención IVSS</td>
          <td class="text-center">—</td>
          <td class="text-right">${nf(getV('N37'))}</td>
        </tr>
        <tr>
          <td class="text-center">3</td>
          <td>Retención RPE (Paro Forzoso)</td>
          <td class="text-center">—</td>
          <td class="text-right">${nf(getV('N38'))}</td>
        </tr>
        <tr>
          <td class="text-center">4</td>
          <td>Retención INCES sobre Diferencia de Utilidades</td>
          <td class="text-center">${nf(state.inces * 100, 2, 2)}%</td>
          <td class="text-right">${nf(getV('N39'))}</td>
        </tr>
        <tr>
          <td class="text-center">5</td>
          <td>Retención ISLR</td>
          <td class="text-center">${nf(state.islr * 100, 2, 2)}%</td>
          <td class="text-right">${nf(getV('N40'))}</td>
        </tr>
        <tr>
          <td class="no-border" colspan="2"></td>
          <td class="header-bg bold text-right">TOTAL DEDUCCIONES</td>
          <td class="text-right bold" style="background-color: #f5f5f5;">${nf(getV('M42'))}</td>
        </tr>
      </table>

      <!-- Neto a Pagar -->
      <table>
        <tr class="neto-row">
          <td class="no-border" style="width: 30%;"></td>
          <td class="text-right bold" style="width: 35%; font-size: 11pt;">NETO A PAGAR Bs.</td>
          <td class="text-right bold" style="width: 35%; font-size: 13pt;">${nf(getV('M44'))} Bs.</td>
        </tr>
        <tr>
          <td class="no-border"></td>
          <td class="text-right bold" style="font-size: 9pt;">EQUIVALENTE DIVISAS (BCV):</td>
          <td class="text-right bold" style="font-size: 10pt; color: #1a4d2e;">$ ${nf(getV('Q44'))} USD</td>
        </tr>
      </table>

      <!-- Firmas de la Empresa -->
      <table style="border: none; margin-top: 15px; margin-bottom: 10px;">
        <tr style="border: none;">
          <td style="border: none; width: 50%; text-align: left; font-weight: bold; font-size: 8.5pt;">
            REALIZADO POR: _________________________________________
          </td>
          <td style="border: none; width: 50%; text-align: right; font-weight: bold; font-size: 8.5pt;">
            AUTORIZADO POR: _________________________________________
          </td>
        </tr>
      </table>

      <!-- Texto Legal de Finiquito -->
      <div class="legal-text">
        ${V.legal}
      </div>

      <!-- Recibo Conforme y Huellas Dactilares -->
      <table style="border: none; margin-top: 10px;">
        <tr style="border: none;">
          <td style="border: none; width: 75%; vertical-align: top;">
            <div style="text-align: center; font-weight: bold; text-decoration: underline; margin-bottom: 10px;">
              RECIBO CONFORME
            </div>
            <table style="border: none; font-size: 9pt; width: 100%;">
              <tr style="border: none;">
                <td style="border: none; padding: 4px;">Nombre: _________________________________</td>
                <td style="border: none; padding: 4px;">Firma: __________________________________</td>
              </tr>
              <tr style="border: none;">
                <td style="border: none; padding: 4px;">C.I.: ____________________________________</td>
                <td style="border: none; padding: 4px;">Fecha: __________________________________</td>
              </tr>
            </table>
          </td>
          <td style="border: none; width: 25%; text-align: center; vertical-align: middle;">
            <div class="firma-box">
              <br><br><br>Huellas Dactilares
            </div>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordHtml], { type: 'application/msword;charset=utf-8' });
  downloadBlob(blob, fileName);
}
