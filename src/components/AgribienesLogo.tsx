import React from 'react';

interface LogoProps {
  customLogo?: string;
  className?: string;
}

export const AgribienesLogo: React.FC<LogoProps> = ({ customLogo, className = '' }) => {
  if (customLogo) {
    return <img src={customLogo} alt="Logo Empresa" className={`max-h-[65px] object-contain ${className}`} />;
  }

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Emblema geométrico Agribienes */}
      <svg width="42" height="42" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Faceta Superior Ámbar/Naranja */}
        <polygon points="50,10 75,50 50,55" fill="#E65100" />
        {/* Faceta Izquierda Verde */}
        <polygon points="50,10 50,55 20,60" fill="#2E7D32" />
        {/* Faceta Derecha Azul */}
        <polygon points="75,50 85,85 50,70" fill="#1565C0" />
        {/* Faceta Inferior Amarilla/Dorada */}
        <polygon points="20,60 50,70 35,90" fill="#FBC02D" />
        {/* Núcleo Central */}
        <polygon points="50,55 75,50 50,70 20,60" fill="#43A047" opacity="0.9" />
      </svg>
      <div className="flex flex-col">
        <span className="font-extrabold text-[15px] tracking-tight text-slate-800 font-sans leading-none">
          AGRIBIENES C.A.
        </span>
        <span className="text-[10px] text-slate-600 font-mono mt-0.5">
          RIF: J-31471703-0
        </span>
      </div>
    </div>
  );
};
