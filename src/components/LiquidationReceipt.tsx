import React from 'react';
import { AgribienesLogo } from './AgribienesLogo';
import { LiquidationState, CalculatedValues } from '../types';
import { nf, fd, fi, pn } from '../utils/lotttEngine';

interface LiquidationReceiptProps {
  state: LiquidationState;
  V: CalculatedValues;
  isLOTTT?: boolean;
  isEditMode?: boolean;
  privacyMode: boolean;
  logo: string;
  containerId?: string;
  onLogoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateField: (path: string, val: any) => void;
  onUpdateXinField?: (path: string, val: any) => void;
  maskSensitive: (val: string | number, isCI?: boolean, isAmount?: boolean) => string;
}

export const LiquidationReceipt: React.FC<LiquidationReceiptProps> = ({
  state,
  V,
  isLOTTT = false,
  isEditMode = false,
  privacyMode,
  logo,
  containerId,
  onLogoUpload,
  onUpdateField,
  onUpdateXinField,
  maskSensitive,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Helper para actualizar campos
  const handleFieldChange = (path: string, val: any) => {
    if (isLOTTT && onUpdateXinField) {
      onUpdateXinField(path, val);
    } else {
      onUpdateField(path, val);
    }
  };

  const getV = (key: string) => (isLOTTT ? V['x.' + key] ?? V[key] : V[key]);

  return (
    <div id={containerId} className="doc mx-auto border border-black bg-white text-black p-3 shadow-md font-sans">
      
      {/* Banner de control LOTTT o Excel */}
      {isLOTTT && (
        <div className="ban bl mb-2 text-center text-xs font-bold py-1 px-2 rounded-none bg-[#1f4e8c] text-white border border-black">
          LIQUIDACIÓN REVISADA SEGÚN LA LOTTT (cálculo de control)
          {Object.keys(state.xin || {}).length > 0 && <span className="text-amber-300"> · MODIFICADA POR RRHH</span>}
        </div>
      )}

      {/* FILA SUPERIOR: Logo y RIF a la izquierda | LUGAR Y FECHA a la derecha */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <div 
            onClick={() => !isLOTTT && fileInputRef.current?.click()} 
            className="cursor-pointer"
            title={!isLOTTT ? "Clic para cargar o cambiar logo de la empresa" : undefined}
          >
            <AgribienesLogo customLogo={logo} />
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={onLogoUpload} 
              accept="image/*" 
              hidden 
            />
          </div>
        </div>

        {/* Recuadro LUGAR Y FECHA (Exacto como en la imagen) */}
        <div className="w-[310px] border-[1.5px] border-black text-center text-xs">
          <div className="h font-bold text-[10px] py-0.5 border-b border-black bg-[#d9d9d9]">
            LUGAR Y FECHA
          </div>
          <div className="p-1 font-bold text-[11px] bg-white">
            {!isEditMode ? (
              <span>{state.lugar}</span>
            ) : (
              <input
                className="lottt-input text-center font-bold"
                value={state.lugar}
                onChange={(e) => handleFieldChange('lugar', e.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      {/* TÍTULO PRINCIPAL: RECIBO DE LIQUIDACIÓN */}
      <div className="bg-[#4a4a4a] text-white font-bold text-center py-1 text-[11px] tracking-wider border border-black mb-1">
        RECIBO DE LIQUIDACIÓN
      </div>

      {/* SECCIÓN IDENTIFICACIÓN Y TIEMPO DE SERVICIO (Con recuadro lateral exacto) */}
      <div className="flex gap-2 items-start mb-1">
        {/* Tabla principal de identificación del trabajador (Col B a N) */}
        <div className="flex-1">
          <div className="g mb-0">
            {/* Fila 1: Headers */}
            <div className="h" style={{ gridColumn: 'span 4' }}>NOMBRE Y APELLIDO</div>
            <div className="h" style={{ gridColumn: 'span 5' }}>CARGO</div>
            <div className="h" style={{ gridColumn: 'span 3' }}>C.I.</div>
            
            {/* Fila 1: Valores */}
            <div className="b" style={{ gridColumn: 'span 4' }}>
              {!isEditMode ? (
                <span>{state.nombre}</span>
              ) : (
                <input
                  className="lottt-input font-bold"
                  value={state.nombre}
                  onChange={(e) => handleFieldChange('nombre', e.target.value)}
                />
              )}
            </div>
            <div className="b" style={{ gridColumn: 'span 5' }}>
              {!isEditMode ? (
                <span>{state.cargo}</span>
              ) : (
                <input
                  className="lottt-input font-bold"
                  value={state.cargo}
                  onChange={(e) => handleFieldChange('cargo', e.target.value)}
                />
              )}
            </div>
            <div className="b" style={{ gridColumn: 'span 3' }}>
              {!isEditMode ? (
                <span>{privacyMode ? maskSensitive(state.ci, true) : state.ci}</span>
              ) : (
                <input
                  className="lottt-input font-bold"
                  value={privacyMode ? maskSensitive(state.ci, true) : state.ci}
                  onChange={(e) => !privacyMode && handleFieldChange('ci', e.target.value)}
                />
              )}
            </div>

            {/* Fila 2: Headers */}
            <div className="h" style={{ gridColumn: 'span 4' }}>MOTIVO DEL EGRESO</div>
            <div className="h" style={{ gridColumn: 'span 2' }}>FECHA DE INGRESO</div>
            <div className="h" style={{ gridColumn: 'span 2' }}>FECHA DE EGRESO</div>
            <div className="h" style={{ gridColumn: 'span 4' }}>TIEMPO DE SERVICIO</div>

            {/* Fila 2: Valores */}
            <div className="b" style={{ gridColumn: 'span 4' }}>
              {!isEditMode ? (
                <span>{state.motivo}</span>
              ) : (
                <input
                  className="lottt-input font-bold"
                  value={state.motivo}
                  onChange={(e) => handleFieldChange('motivo', e.target.value)}
                />
              )}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              {!isEditMode ? (
                <span>{fd(state.ing)}</span>
              ) : (
                <input
                  type="date"
                  className="lottt-input text-center"
                  value={state.ing}
                  onChange={(e) => handleFieldChange('ing', e.target.value)}
                />
              )}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              {!isEditMode ? (
                <span>{fd(state.egr)}</span>
              ) : (
                <input
                  type="date"
                  className="lottt-input text-center"
                  value={state.egr}
                  onChange={(e) => handleFieldChange('egr', e.target.value)}
                />
              )}
            </div>
            <div style={{ gridColumn: 'span 4' }} className="font-bold">
              {getV('M12')}
            </div>
          </div>
        </div>

        {/* Recuadro Lateral: TIEMPO DE SERVICIO (AÑOS | MESES [Amarillo] | DIAS) */}
        <div className="w-[180px] border border-black text-center text-xs">
          <div className="h font-bold text-[10px] py-0.5 border-b border-black bg-[#d9d9d9]">
            TIEMPO DE SERVICIO
          </div>
          <div className="grid grid-cols-3 border-b border-black text-[9px] font-bold bg-[#f2f2f2]">
            <div className="border-r border-black py-0.5">AÑOS</div>
            <div className="border-r border-black py-0.5">MESES</div>
            <div className="py-0.5">DIAS</div>
          </div>
          <div className="grid grid-cols-3 text-[11px] font-bold">
            <div className="border-r border-black py-1">{getV('P12')}</div>
            <div className="border-r border-black py-1 bg-[#ffff00]">{getV('Q12')}</div>
            <div className="py-1">{getV('R12')}</div>
          </div>
        </div>
      </div>

      {/* SECCIÓN SALARIOS Y TASA BCV */}
      <div className="flex gap-2 items-start mb-1">
        {/* Tabla de Estructura Salarial (6 columnas) */}
        <div className="flex-1">
          <div className="g mb-0">
            {[
              'SALARIO BASICO MENSUAL', 
              'SALARIO NORMAL MENSUAL', 
              'SALARIO DIARIO NORMAL', 
              'ALICUOTA DEL BONO VACACIONAL', 
              'ALICUOTA DE UTILIDADES', 
              'SALARIO DIARIO INTEGRAL'
            ].map((hdr, i) => (
              <div key={i} className="h" style={{ gridColumn: 'span 2' }}>{hdr}</div>
            ))}

            <div className="r" style={{ gridColumn: 'span 2' }}>
              {maskSensitive(getV('B15'), false, true)}
            </div>
            <div className="r" style={{ gridColumn: 'span 2' }}>
              {!isEditMode ? (
                <span>{maskSensitive(isLOTTT ? state.dNormal : state.dNormal, false, true)}</span>
              ) : (
                <input
                  className="lottt-input text-right"
                  value={fi(state.dNormal)}
                  onChange={(e) => handleFieldChange('dNormal', pn(e.target.value))}
                />
              )}
            </div>
            <div className="r" style={{ gridColumn: 'span 2' }}>
              {maskSensitive(getV('E15'), false, true)}
            </div>
            <div className="r" style={{ gridColumn: 'span 2' }}>
              {maskSensitive(getV('H15'), false, true)}
            </div>
            <div className="r" style={{ gridColumn: 'span 2' }}>
              {maskSensitive(getV('J15'), false, true)}
            </div>
            <div className="r b" style={{ gridColumn: 'span 2' }}>
              {maskSensitive(getV('L15'), false, true)}
            </div>
          </div>
        </div>

        {/* Recuadro Lateral: TASA BCV (Exacto como en la imagen) */}
        <div className="w-[180px] border border-black text-center text-xs">
          <div className="text-[10px] font-bold py-0.5 border-b border-black bg-[#f2f2f2]">
            Tasa BCV al {fd(state.egr)}
          </div>
          <div className="font-bold py-1 text-[11px] bg-white">
            {!isEditMode ? (
              <span>{nf(state.tasa)}</span>
            ) : (
              <input
                className="lottt-input text-center font-bold"
                value={fi(state.tasa)}
                onChange={(e) => handleFieldChange('tasa', pn(e.target.value))}
              />
            )}
          </div>
        </div>
      </div>

      {/* SECCIÓN GARANTÍA DE PRESTACIONES SOCIALES */}
      <div className="g mb-1">
        <div className="t-gray text-[10px]" style={{ gridColumn: 'span 8', background: '#d9d9d9', color: '#000', fontWeight: 'bold' }}>
          GARANTIA DE PRESTACIONES SOCIALES
        </div>
        <div className="t-gray text-[10px]" style={{ gridColumn: 'span 2', background: '#d9d9d9', color: '#000', fontWeight: 'bold' }}>
          DIAS
        </div>
        <div className="t-gray text-[10px]" style={{ gridColumn: 'span 2', background: '#d9d9d9', color: '#000', fontWeight: 'bold' }}>
          BS.
        </div>
        <div className="l text-[10.5px]" style={{ gridColumn: 'span 8' }}>
          {getV('c0')}
        </div>
        <div className="r font-bold" style={{ gridColumn: 'span 2' }}>
          {nf(getV('K18'), 0, 2)}
        </div>
        <div className="r font-bold" style={{ gridColumn: 'span 2' }}>
          {maskSensitive(getV('L18'), false, true)}
        </div>
      </div>

      {/* SECCIÓN CÁLCULO DE ASIGNACIONES */}
      <div className="bg-[#d9d9d9] font-bold text-center py-0.5 text-[11px] border border-black mb-1">
        Cálculo
      </div>

      <div className="g mb-1">
        <div className="h" style={{ gridColumn: 'span 1' }}>COD</div>
        <div className="h" style={{ gridColumn: 'span 7' }}>CONCEPTO</div>
        <div className="h" style={{ gridColumn: 'span 2' }}>DIAS</div>
        <div className="h" style={{ gridColumn: 'span 2' }}>BS.</div>

        {/* 1. Prestaciones Sociales Acumuladas */}
        <div style={{ gridColumn: 'span 1' }}>1</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>{getV('c0')}</div>
        <div className="r font-bold" style={{ gridColumn: 'span 2' }}>{nf(getV('L24'), 0, 2)}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N24'), false, true)}</div>

        {/* 2. Intereses Sobre Prestaciones */}
        <div style={{ gridColumn: 'span 1' }}>2</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Intereses Sobre Prestaciones Sociales</div>
        <div className="r" style={{ gridColumn: 'span 2' }}></div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N25'), false, true)}</div>

        {/* 3. Diferencia de Utilidades */}
        <div style={{ gridColumn: 'span 1' }}>3</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Diferencia de Utilidades</div>
        <div className="r" style={{ gridColumn: 'span 2' }}></div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N26'), false, true)}</div>

        {/* 4. Vacaciones Fraccionadas */}
        <div style={{ gridColumn: 'span 1' }}>4</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>{getV('c4')}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{nf(getV('L27'), 0, 2)}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N27'), false, true)}</div>

        {/* 5. Bono Vacacional Fraccionado */}
        <div style={{ gridColumn: 'span 1' }}>5</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>{getV('c5')}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{nf(getV('L28'), 0, 2)}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N28'), false, true)}</div>

        {/* 6. Sueldo días de egreso */}
        <div style={{ gridColumn: 'span 1' }}>6</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>{getV('c6')}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{state.l29}</span>
          ) : (
            <input
              className="lottt-input text-right"
              value={state.l29}
              onChange={(e) => handleFieldChange('l29', pn(e.target.value))}
            />
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N29'), false, true)}</div>

        {/* 7. Cesta Tickets */}
        <div style={{ gridColumn: 'span 1' }}>7</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>{getV('c7')}</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{state.l30}</span>
          ) : (
            <input
              className="lottt-input text-right"
              value={state.l30}
              onChange={(e) => handleFieldChange('l30', pn(e.target.value))}
            />
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N30'), false, true)}</div>

        {/* 8. Otras Asignaciones */}
        <div style={{ gridColumn: 'span 1' }}>8</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Otras Asignaciones</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{state.l31}</span>
          ) : (
            <input
              className="lottt-input text-right"
              value={state.l31}
              onChange={(e) => handleFieldChange('l31', pn(e.target.value))}
            />
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N31'), false, true)}</div>

        {/* Total Asignaciones */}
        <div className="nb" style={{ gridColumn: 'span 6' }}></div>
        <div className="nb r b" style={{ gridColumn: 'span 4' }}>TOTAL ASIGNACIONES</div>
        <div className="r b" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('M33'), false, true)}</div>
      </div>

      {/* SECCIÓN DEDUCCIONES */}
      <div className="bg-[#4a4a4a] text-white font-bold text-center py-0.5 text-[11px] border border-black mb-1">
        DEDUCCIONES
      </div>

      <div className="g mb-1">
        {/* 1. FAOV */}
        <div style={{ gridColumn: 'span 1' }}>1</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Aporte Reg. Prest. Vivienda y Hab.</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{nf(state.faov * 100, 2, 2)}%</span>
          ) : (
            <span className="pc">
              <input
                className="lottt-input text-right"
                value={fi(state.faov, 'p')}
                onChange={(e) => handleFieldChange('faov', pn(e.target.value) / 100)}
              />
            </span>
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N36'), false, true)}</div>

        {/* 2. IVSS */}
        <div style={{ gridColumn: 'span 1' }}>2</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Retención IVSS</div>
        <div className="r" style={{ gridColumn: 'span 2' }}></div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N37'), false, true)}</div>

        {/* 3. RPE */}
        <div style={{ gridColumn: 'span 1' }}>3</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Retención RPE</div>
        <div className="r" style={{ gridColumn: 'span 2' }}></div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N38'), false, true)}</div>

        {/* 4. INCES */}
        <div style={{ gridColumn: 'span 1' }}>4</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Retención INCES sobre Diferencia de Utilidades 2026</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{nf(state.inces * 100, 2, 2)}%</span>
          ) : (
            <span className="pc">
              <input
                className="lottt-input text-right"
                value={fi(state.inces, 'p')}
                onChange={(e) => handleFieldChange('inces', pn(e.target.value) / 100)}
              />
            </span>
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N39'), false, true)}</div>

        {/* 5. ISLR */}
        <div style={{ gridColumn: 'span 1' }}>5</div>
        <div className="l" style={{ gridColumn: 'span 7' }}>Retención ISLR</div>
        <div className="r" style={{ gridColumn: 'span 2' }}>
          {!isEditMode ? (
            <span>{nf(state.islr * 100, 2, 2)}%</span>
          ) : (
            <span className="pc">
              <input
                className="lottt-input text-right"
                value={fi(state.islr, 'p')}
                onChange={(e) => handleFieldChange('islr', pn(e.target.value) / 100)}
              />
            </span>
          )}
        </div>
        <div className="r" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('N40'), false, true)}</div>

        {/* Total Deducciones */}
        <div className="nb" style={{ gridColumn: 'span 6' }}></div>
        <div className="nb r b" style={{ gridColumn: 'span 4' }}>TOTAL DEDUCCIONES</div>
        <div className="r b" style={{ gridColumn: 'span 2' }}>{maskSensitive(getV('M42'), false, true)}</div>
      </div>

      {/* SECCIÓN NETO A PAGAR (Recuadro Gris Destacado exacto como en la imagen) */}
      <div className="g mb-2">
        <div className="nb" style={{ gridColumn: 'span 4' }}></div>
        <div className="neto r" style={{ gridColumn: 'span 4', fontSize: 14 }}>
          NETO A PAGAR Bs.
        </div>
        <div className="neto r" style={{ gridColumn: 'span 4', fontSize: 14 }}>
          {maskSensitive(getV('M44'), false, true)}
        </div>
      </div>

      {/* FIRMAS DE RRHH Y GERENCIA */}
      <div className="flex justify-between items-center text-xs font-bold pt-1.5 mb-2 border-t border-slate-300">
        <div>REALIZADO POR:___________________________________</div>
        <div>AUTORIZADO POR:___________________________________</div>
      </div>

      {/* PÁRRAFO DE FINIQUITO LEGAL SEGÚN LA LOTTT */}
      <div className="legal text-[9px] leading-tight text-justify mb-2 text-slate-800">
        {V.legal}
      </div>

      {/* SECCIÓN RECIBO CONFORME DEL TRABAJADOR Y HUELLAS DACTILARES */}
      <div className="flex justify-between items-end pt-1">
        <div className="flex-1 mr-4">
          <div className="text-center font-bold text-xs underline mb-2">
            RECIBO CONFORME
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <div>
              Nombre: _________________________________
            </div>
            <div>
              Firma: _________________________________
            </div>
            <div>
              C.I.: ____________________________________
            </div>
            <div>
              Fecha: _________________________________
            </div>
          </div>
        </div>

        {/* Caja de Huellas Dactilares (Exacta como en la imagen) */}
        <div className="w-[105px] h-[100px] border-[1.5px] border-black flex flex-col justify-end items-center pb-1 bg-white select-none">
          <span className="text-[9px] font-bold tracking-tight text-slate-800">
            Huellas Dactilares
          </span>
        </div>
      </div>

    </div>
  );
};
