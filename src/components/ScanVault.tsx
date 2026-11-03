import React, { useState } from 'react';
import { PAST_SCAN_REPORTS } from '../data/mockData';
import { ScanReport, UltrasoundImage } from '../types';
import { SonogramViewer } from './SonogramViewer';
import { GrowthChart } from './GrowthChart';
import { 
  FileText, 
  Sparkles, 
  Activity, 
  Calendar, 
  Download, 
  CheckCircle, 
  ChevronRight,
  ShieldCheck,
  Building,
  Layers
} from 'lucide-react';

export const ScanVault: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ScanReport>(PAST_SCAN_REPORTS[0]);
  const [activeImage, setActiveImage] = useState<UltrasoundImage>(PAST_SCAN_REPORTS[0].images[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [downloadingReport, setDownloadingReport] = useState<boolean>(false);

  const filteredImages = selectedReport.images.filter(img => {
    if (filterType === 'all') return true;
    if (filterType === '3d') return img.type === '3d';
    if (filterType === '2d') return img.type === '2d' || img.type === 'profile';
    if (filterType === 'doppler') return img.type === 'doppler';
    return true;
  });

  const handleDownloadPdf = () => {
    setDownloadingReport(true);
    setTimeout(() => {
      setDownloadingReport(false);
    }, 1200);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-wider border border-teal-200">
              GE Voluson E10 Console
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">·</span>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Diagnostic Fetal Acoustics</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Ultrasound Sonogram Console
          </h2>
          <p className="text-[11px] sm:text-sm text-slate-500 mt-0.5">
            Interactive high-definition 3D/4D HD-live images, Doppler velocimetry, and certified clinical reports from Dr. Tariq Al-Hashimi.
          </p>
        </div>

        {/* Scan Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto shrink-0">
          {PAST_SCAN_REPORTS.map((report) => (
            <button
              key={report.id}
              onClick={() => {
                setSelectedReport(report);
                setActiveImage(report.images[0]);
              }}
              className={`px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedReport.id === report.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {report.scanType === 'anomaly_scan' ? '22w Anomaly Scan' : '12w NT Scan'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Sonogram Viewer + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Ultrasound Viewer & Thumbnail Reel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <SonogramViewer image={activeImage} />

          {/* Thumbnail Gallery Reel */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-800">
                Ultrasound Image Gallery ({selectedReport.images.length} Captures)
              </span>

              {/* Filter controls */}
              <div className="flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded transition ${
                    filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType('3d')}
                  className={`px-2 py-0.5 rounded transition ${
                    filterType === '3d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  3D HD
                </button>
                <button
                  onClick={() => setFilterType('2d')}
                  className={`px-2 py-0.5 rounded transition ${
                    filterType === '2d' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  2D Anatomy
                </button>
                <button
                  onClick={() => setFilterType('doppler')}
                  className={`px-2 py-0.5 rounded transition ${
                    filterType === 'doppler' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Doppler
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {filteredImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(img)}
                  className={`group relative text-left rounded-xl p-2 border transition ${
                    activeImage.id === img.id
                      ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="aspect-[4/3] rounded-lg bg-slate-950 flex items-center justify-center overflow-hidden mb-1.5 relative">
                    <span className="text-xl">
                      {img.type === '3d' ? '👶' : img.type === 'doppler' ? '🌊' : '🩺'}
                    </span>
                    <span className="absolute bottom-1 right-1 px-1 bg-black/70 text-[9px] font-mono text-white rounded">
                      {img.category}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-800 line-clamp-1 block">
                    {img.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {img.gestationalWeek}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Certified Clinical Report & Biometric Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            {/* Report Header */}
            <div className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                  Official Scan Record
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedReport.date}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                {selectedReport.title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedReport.doctorName} · {selectedReport.clinicLocation}
              </p>
            </div>

            {/* UAE Interoperability Sync Tags (Inspired by Malaffi / Nabidh) */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="flex items-center gap-1 font-medium text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Malaffi Sync: #{selectedReport.malaffiRefId}
              </span>
              <span>·</span>
              <span className="text-slate-500">Nabidh: #{selectedReport.nabidhRefId}</span>
            </div>

            {/* Doctor's Summary Statement */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-800 block">
                Clinical Summary
              </span>
              <p className="text-xs text-slate-600 leading-relaxed bg-teal-50/40 p-3 rounded-xl border border-teal-100">
                {selectedReport.summary}
              </p>
            </div>

            {/* Key Clinical Markers List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Fetal Heart Rate</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {selectedReport.biometrics.fetalHeartRateBpm} bpm (Normal Rhythm)
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Placental Location</span>
                <span className="font-semibold text-slate-900">
                  {selectedReport.biometrics.placentaLocation}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Amniotic Fluid Index (AFI)</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {selectedReport.biometrics.afiCm} cm (Adequate Volume)
                </span>
              </div>
              {selectedReport.biometrics.cervicalLengthMm && (
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Cervical Length (Transvaginal)</span>
                  <span className="font-semibold text-emerald-700 font-mono">
                    {selectedReport.biometrics.cervicalLengthMm} mm (Closed & Competent)
                  </span>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-800 block">
                Doctor's Recommendations
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {selectedReport.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Download Official Report Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={downloadingReport}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition active:scale-98 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>
                {downloadingReport ? 'Generating Certified PDF...' : 'Download Certified Clinical PDF'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Fetal Growth Trajectory Section */}
      <GrowthChart 
        biometrics={selectedReport.biometrics} 
        gestationalWeek={selectedReport.scanType === 'anomaly_scan' ? 22 : 12} 
      />
    </div>
  );
};
