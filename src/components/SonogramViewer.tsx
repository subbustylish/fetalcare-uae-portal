import React, { useState } from 'react';
import { UltrasoundImage } from '../types';
import { ZoomIn, ZoomOut, Download, Eye, ShieldCheck, HeartPulse, Activity } from 'lucide-react';

interface SonogramViewerProps {
  image: UltrasoundImage;
  onClose?: () => void;
}

export const SonogramViewer: React.FC<SonogramViewerProps> = ({ image, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-950 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Ultrasound Console Banner */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[10px] sm:text-xs text-slate-300">
        <div className="flex items-center gap-1.5 sm:gap-2 truncate mr-2">
          <span className="font-semibold text-teal-400 whitespace-nowrap">GE Voluson E10</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 truncate">Dr. Tariq · DHCC</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-slate-400 shrink-0">
          <span>GA: {image.gestationalWeek}</span>
          <span className="hidden sm:inline">·</span>
          <span className="hidden sm:inline">MI 1.1</span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-1 text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Sonography Viewport */}
      <div className="relative w-full aspect-[4/3] bg-black overflow-hidden flex items-center justify-center select-none">
        {/* Background Ultrasound Fan / Acoustic Cone */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M 200 0 L 30 300 L 370 300 Z" fill="white" />
            <circle cx="200" cy="0" r="100" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3"/>
            <circle cx="200" cy="0" r="180" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3"/>
            <circle cx="200" cy="0" r="260" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="3 3"/>
          </svg>
        </div>

        {/* Display Content Based on Scan Category */}
        <div 
          className="relative transition-transform duration-200 ease-out flex items-center justify-center w-full h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {image.type === '3d' && (
            /* 3D HD-Live Render Simulation with Rich Warm Fetal Illumination */
            <div className="relative w-56 h-56 sm:w-76 sm:h-76 rounded-full flex items-center justify-center p-2 sm:p-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600/30 via-rose-700/20 to-transparent blur-2xl pointer-events-none"></div>
              <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-[0_0_35px_rgba(245,158,11,0.25)]">
                <defs>
                  <radialGradient id="fetalSkin" cx="45%" cy="40%" r="55%">
                    <stop offset="0%" stop-color="#fdba74" />
                    <stop offset="35%" stop-color="#ea580c" />
                    <stop offset="70%" stop-color="#9a3412" />
                    <stop offset="100%" stop-color="#431407" />
                  </radialGradient>
                  <radialGradient id="highlight" cx="30%" cy="30%" r="30%">
                    <stop offset="0%" stop-color="#ffedd5" stop-opacity="0.8" />
                    <stop offset="100%" stop-color="#ea580c" stop-opacity="0" />
                  </radialGradient>
                </defs>
                {/* Acoustic scan boundary circle */}
                <circle cx="160" cy="160" r="145" fill="#090d16" stroke="#1e293b" strokeWidth="2"/>
                {/* Sonographic speckle texture ring */}
                <circle cx="160" cy="160" r="135" fill="none" stroke="rgba(249, 115, 22, 0.15)" strokeWidth="16" strokeDasharray="4 8"/>
                
                {/* Fetal Head and Profile Contour */}
                <path d="M 120 70 C 180 60, 240 100, 245 160 C 250 210, 220 250, 160 255 C 110 260, 80 210, 85 150 C 90 95, 105 75, 120 70 Z" fill="url(#fetalSkin)"/>
                
                {/* Forehead light highlight */}
                <path d="M 130 85 C 165 75, 205 100, 210 135 C 190 145, 150 130, 130 85 Z" fill="url(#highlight)"/>
                
                {/* Fetal Eye Orbit & Eyelid */}
                <path d="M 175 142 C 185 138, 195 138, 205 144" stroke="#431407" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
                <path d="M 180 145 C 188 150, 195 150, 202 146" stroke="#7c2d12" strokeWidth="2" strokeLinecap="round" fill="none"/>
                
                {/* Fetal Nose Bridge & Cute Tip */}
                <path d="M 210 144 C 220 152, 228 165, 226 172 C 224 176, 215 177, 208 174" fill="none" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round"/>
                
                {/* Upper and Lower Lips */}
                <path d="M 205 190 C 212 188, 218 190, 215 195 C 212 198, 204 197, 201 194" fill="#9a3412"/>
                <path d="M 203 199 C 209 198, 214 200, 212 204 C 208 206, 202 205, 200 201" fill="#7c2d12"/>
                
                {/* Gentle Chin */}
                <path d="M 204 212 C 210 216, 208 225, 195 230 C 180 235, 160 236, 145 230" stroke="#ea580c" strokeWidth="3" fill="none"/>
                
                {/* Soft Baby Ear Contour */}
                <path d="M 125 155 C 120 140, 135 130, 142 140 C 145 155, 142 175, 132 180 C 124 185, 120 170, 125 155 Z" fill="#9a3412" stroke="#ea580c" strokeWidth="1.5"/>
                
                {/* Baby hand resting near cheek */}
                <path d="M 215 185 C 225 190, 235 205, 230 225 C 225 240, 210 245, 195 240" fill="none" stroke="#fdba74" strokeWidth="6" strokeLinecap="round"/>
                <circle cx="228" cy="192" r="4" fill="#ffedd5"/>
                <circle cx="233" cy="200" r="3.5" fill="#ffedd5"/>
                <circle cx="232" cy="209" r="3" fill="#ffedd5"/>
              </svg>
            </div>
          )}

          {image.type === 'profile' && (
            /* 2D Mid-Sagittal Facial Profile with Calipers */
            <div className="relative w-80 h-72 flex items-center justify-center">
              <svg viewBox="0 0 320 280" className="w-full h-full">
                {/* 2D Grayscale sonogram noise backdrop */}
                <circle cx="160" cy="140" r="130" fill="#030712" stroke="#1f2937" strokeWidth="1"/>
                
                {/* Bone echogenicity (bright white) */}
                {/* Calvarium (Skull roof) */}
                <path d="M 90 90 C 150 40, 240 70, 250 140 C 255 190, 220 230, 170 240" fill="none" stroke="#f8fafc" strokeWidth="4.5" filter="drop-shadow(0 0 4px #ffffff)"/>
                
                {/* Nasal Bone (FMF Screening target) */}
                <line x1="230" y1="125" x2="242" y2="135" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round"/>
                
                {/* Facial soft tissue outline */}
                <path d="M 220 105 C 228 115, 235 125, 246 138 C 242 144, 232 145, 230 152 C 235 158, 242 160, 238 168 C 230 172, 222 170, 220 178 C 222 186, 215 194, 200 200" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="1 1"/>
                
                {/* Nuchal region measurement indicator */}
                <path d="M 92 100 C 85 120, 85 150, 95 180" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3 3"/>
                
                {/* Calipers */}
                {showMeasurements && (
                  <g>
                    <circle cx="230" cy="125" r="3" fill="#38bdf8" />
                    <circle cx="242" cy="135" r="3" fill="#38bdf8" />
                    <line x1="225" y1="125" x2="235" y2="125" stroke="#38bdf8" strokeWidth="1"/>
                    <line x1="237" y1="135" x2="247" y2="135" stroke="#38bdf8" strokeWidth="1"/>
                    <text x="246" y="130" fill="#38bdf8" fontSize="10" fontFamily="monospace">NB: 6.4mm</text>
                  </g>
                )}
              </svg>
            </div>
          )}

          {image.type === '2d' && (
            /* 4-Chamber Heart & Outflow Tracts */
            <div className="relative w-80 h-72 flex items-center justify-center">
              <svg viewBox="0 0 320 280" className="w-full h-full">
                <circle cx="160" cy="140" r="125" fill="#040711" stroke="#1f2937" strokeWidth="1"/>
                
                {/* Fetal Thorax Rib Cage Cross-section */}
                <ellipse cx="160" cy="140" rx="95" ry="85" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="6 4"/>
                <circle cx="90" cy="140" r="10" fill="#0f172a" stroke="#cbd5e1" strokeWidth="3"/> {/* Spine */}
                
                {/* Cardiac 4 Chambers */}
                {/* Left & Right Atria */}
                <path d="M 135 150 C 135 130, 150 120, 160 130 C 160 145, 145 155, 135 150 Z" fill="#0284c7" fillOpacity="0.4" stroke="#e0f2fe" strokeWidth="1.5"/>
                <path d="M 165 130 C 175 120, 190 130, 190 150 C 180 155, 165 145, 165 130 Z" fill="#0284c7" fillOpacity="0.4" stroke="#e0f2fe" strokeWidth="1.5"/>
                
                {/* Left & Right Ventricles */}
                <path d="M 135 155 C 130 180, 150 200, 160 190 C 160 170, 148 158, 135 155 Z" fill="#e11d48" fillOpacity="0.4" stroke="#ffe4e6" strokeWidth="1.5"/>
                <path d="M 165 190 C 175 200, 195 180, 190 155 C 178 158, 165 170, 165 190 Z" fill="#e11d48" fillOpacity="0.4" stroke="#ffe4e6" strokeWidth="1.5"/>
                
                {/* Interventricular Septum */}
                <line x1="162" y1="130" x2="162" y2="195" stroke="#ffffff" strokeWidth="2.5"/>
                
                {/* Heart Axis Ray (45 degrees to sagittal) */}
                {showMeasurements && (
                  <g>
                    <line x1="90" y1="140" x2="230" y2="140" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
                    <line x1="162" y1="130" x2="162" y2="210" stroke="#34d399" strokeWidth="1.5" strokeDasharray="4 2"/>
                    <text x="175" y="180" fill="#34d399" fontSize="10" fontFamily="monospace">Cardiac Axis: 44°</text>
                  </g>
                )}
              </svg>
            </div>
          )}

          {image.type === 'doppler' && (
            /* Spectral Doppler Waveform Simulation */
            <div className="relative w-full h-full p-4 flex flex-col justify-end">
              {/* Upper 2D preview inset */}
              <div className="absolute top-3 left-4 w-32 h-24 bg-slate-900 border border-slate-700 rounded p-1 flex items-center justify-center">
                <svg viewBox="0 0 100 80" className="w-full h-full">
                  <path d="M 20 40 Q 50 20 80 40" stroke="#38bdf8" strokeWidth="4" fill="none"/>
                  <path d="M 20 45 Q 50 65 80 45" stroke="#f43f5e" strokeWidth="4" fill="none"/>
                  <rect x="42" y="28" width="16" height="24" fill="none" stroke="#22c55e" strokeWidth="1"/>
                </svg>
              </div>

              {/* Spectral Doppler Velocity Grid */}
              <div className="w-full h-44 bg-slate-950/90 border border-slate-800 rounded p-2 relative">
                <div className="absolute top-2 right-3 text-[10px] font-mono text-teal-400">
                  Vmax: 42.6 cm/s · Vmin: 16.2 cm/s · PI: 1.04 · RI: 0.62
                </div>
                
                {/* Zero baseline */}
                <div className="absolute bottom-6 left-0 right-0 h-[1px] bg-slate-700"></div>
                
                {/* Doppler Waves */}
                <svg className="w-full h-full" viewBox="0 0 400 120" preserveAspectRatio="none">
                  {/* Repeated systolic peak to diastolic flow cycles */}
                  <path 
                    d="M 10 90 L 30 20 L 50 60 L 75 75 L 85 90 
                       L 105 20 L 125 60 L 150 75 L 160 90 
                       L 180 20 L 200 60 L 225 75 L 235 90 
                       L 255 20 L 275 60 L 300 75 L 310 90 
                       L 330 20 L 350 60 L 375 75 L 385 90" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="2.5"
                  />
                  {/* Spectral fill below velocity envelope */}
                  <path 
                    d="M 10 90 L 30 20 L 50 60 L 75 75 L 85 90 
                       L 105 20 L 125 60 L 150 75 L 160 90 
                       L 180 20 L 200 60 L 225 75 L 235 90 
                       L 255 20 L 275 60 L 300 75 L 310 90 
                       L 330 20 L 350 60 L 375 75 L 385 90 L 385 90 L 10 90 Z" 
                    fill="url(#dopplerGradient)" 
                    opacity="0.35"
                  />
                  <defs>
                    <linearGradient id="dopplerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Floating Sonogram Overlay Controls */}
        <div className="absolute bottom-2.5 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-900/90 backdrop-blur-md px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700/60 text-xs">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
              className="p-1 text-slate-300 hover:text-white rounded min-w-[28px] min-h-[28px] flex items-center justify-center"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] sm:text-[11px] text-slate-300 w-7 sm:w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
              className="p-1 text-slate-300 hover:text-white rounded min-w-[28px] min-h-[28px] flex items-center justify-center"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <div className="h-3 w-[1px] bg-slate-700 mx-0.5" />
            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              className={`flex items-center gap-1 text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded transition ${
                showMeasurements ? 'text-teal-400 bg-teal-950/60' : 'text-slate-400'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Calipers</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 sm:gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-[11px] sm:text-xs font-medium px-3 sm:px-3.5 py-1.5 rounded-lg shadow-md transition active:scale-95 min-h-[32px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Save HD Sonogram</span>
            </button>
          </div>
        </div>

        {/* Feedback Toasts */}
        {downloadSuccess && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-medium px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-fade-in">
            <ShieldCheck className="w-4 h-4" />
            <span>High-Definition Sonogram saved to device</span>
          </div>
        )}
      </div>

      {/* Doctor's Clinical Annotation */}
      <div className="p-4 bg-slate-900/90 border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-200">{image.title}</span>
          <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Normal Morphology
          </span>
        </div>
        <p className="text-slate-400 leading-relaxed">{image.description}</p>
      </div>
    </div>
  );
};
