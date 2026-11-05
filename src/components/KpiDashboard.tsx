import React, { useState } from 'react';
import { 
  getKpiItemsForFacility, 
  generateKpiCsvExport, 
  DOHKpiItem 
} from '../data/kpiData';
import { 
  BarChart3, 
  Download, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  Building2, 
  Calendar, 
  FileSpreadsheet, 
  Printer, 
  TrendingUp, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const KpiDashboard: React.FC = () => {
  const [selectedFacility, setSelectedFacility] = useState<'Abu Dhabi' | 'Dubai' | 'All'>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('YTD 2026 (Jan – Nov 2026)');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'compliant' | 'borderline' | 'action_required'>('all');
  const [copiedExport, setCopiedExport] = useState<boolean>(false);

  // Calculate items based on facility selection
  const kpiItems = getKpiItemsForFacility(selectedFacility);

  // Filter items
  const filteredKpis = kpiItems.filter(k => {
    const matchesSearch = k.indicator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          k.shortCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          k.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate summary stats
  const totalIndicators = kpiItems.length;
  const compliantCount = kpiItems.filter(k => k.status === 'compliant').length;
  const borderlineCount = kpiItems.filter(k => k.status === 'borderline').length;
  const actionRequiredCount = kpiItems.filter(k => k.status === 'action_required').length;
  const averageCompliance = Math.round(
    kpiItems.reduce((acc, k) => acc + k.percentage, 0) / totalIndicators
  );

  const handleExportCsv = () => {
    const csvContent = generateKpiCsvExport(kpiItems, selectedFacility, selectedDateRange);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DOH_Antenatal_KPI_Report_${selectedFacility}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Title & Metadata Header */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-teal-800 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-teal-600" />
            <span>Section 15: DOH Clinical Quality & Performance Dashboard</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 tracking-tight">
            Antenatal Care Standard Quality KPIs
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official 16 Quality Performance Indicators mandated by Abu Dhabi Department of Health (STD App.4).
          </p>
        </div>

        {/* Action Buttons: Export to Excel/CSV & Print */}
        <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition min-h-[44px]"
            title="Download full 16-indicator dataset in CSV/Excel format"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{copiedExport ? 'Downloaded CSV' : 'Export Excel / CSV'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition min-h-[44px]"
            title="Print or save as PDF report"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print PDF</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Spotlight Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              DOH Quality Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-slate-900">
              {averageCompliance}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">Overall</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Across all 16 DOH indicators
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Compliant Targets
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-emerald-700">
              {compliantCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">/ 16 Indicators</span>
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            Meeting or exceeding benchmark
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Borderline Watch
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-amber-700">
              {borderlineCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Within 5% gap</span>
          </div>
          <span className="text-[11px] text-amber-600 mt-1 block font-medium">
            Targeted clinical follow-up
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Action Required
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono text-rose-700">
              {actionRequiredCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Below Target</span>
          </div>
          <span className="text-[11px] text-rose-600 mt-1 block font-medium">
            Requires audit corrective plan
          </span>
        </div>
      </div>

      {/* Filter and Control Bar (Mobile Responsive) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Facility Selector */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 shrink-0">Facility:</span>
            <div className="flex overflow-x-auto no-scrollbar gap-1 p-0.5 bg-slate-100 rounded-lg text-xs w-full sm:w-auto">
              {(['All', 'Abu Dhabi', 'Dubai'] as const).map((fac) => (
                <button
                  key={fac}
                  onClick={() => setSelectedFacility(fac)}
                  className={`py-1.5 px-3 rounded-md font-medium whitespace-nowrap transition ${
                    selectedFacility === fac
                      ? 'bg-white text-teal-800 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {fac === 'All' ? 'All UAE Centers' : fac}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-700 shrink-0">Period:</span>
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-medium focus:outline-none"
            >
              <option value="YTD 2026 (Jan – Nov 2026)">Year to Date (Jan – Nov 2026)</option>
              <option value="Q3 2026 (Jul – Sep 2026)">Third Quarter 2026</option>
              <option value="Current Month (Nov 2026)">Current Month (Nov 2026)</option>
            </select>
          </div>
        </div>

        {/* Sub-filter: Status & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search indicator name, code, or DOH clause..."
            className="w-full sm:w-80 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] text-slate-400 font-medium">Filter Status:</span>
            {(['all', 'compliant', 'borderline', 'action_required'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`py-1 px-2.5 rounded-lg font-medium capitalize whitespace-nowrap transition ${
                  statusFilter === st
                    ? 'bg-slate-800 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st === 'action_required' ? 'Action Req' : st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main KPI Table & Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              DOH Appendix 4 Quality Indicators Performance Log
            </h3>
            <span className="text-xs text-slate-500">
              Showing {filteredKpis.length} of {totalIndicators} indicators · Benchmarks enforce DOH Antenatal Standards
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-mono font-bold border border-teal-200">
            Facility: {selectedFacility}
          </span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Indicator (STD App.4)</th>
                <th className="py-3 px-4 text-center">Numerator / Denominator</th>
                <th className="py-3 px-4 text-center">Rate (%)</th>
                <th className="py-3 px-4 text-center">Target</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredKpis.map((kpi) => (
                <tr key={kpi.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-4 font-mono font-bold text-teal-700">
                    {kpi.shortCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{kpi.indicator}</span>
                    <span className="text-[11px] text-slate-500 block line-clamp-1">{kpi.description}</span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    <span className="font-bold text-slate-800">{kpi.numerator}</span>
                    <span className="text-slate-400"> / </span>
                    <span className="text-slate-600">{kpi.denominator}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="font-mono font-bold text-sm text-slate-900">{kpi.percentage}%</span>
                      {/* Mini visual progress bar */}
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            kpi.status === 'compliant'
                              ? 'bg-emerald-500'
                              : kpi.status === 'borderline'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${Math.min(100, kpi.percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold text-slate-600">
                    {kpi.benchmarkCondition} {kpi.targetBenchmark}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      kpi.status === 'compliant'
                        ? 'bg-emerald-100 text-emerald-800'
                        : kpi.status === 'borderline'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {kpi.status === 'compliant' && <CheckCircle2 className="w-3 h-3" />}
                      {kpi.status === 'borderline' && <AlertTriangle className="w-3 h-3" />}
                      {kpi.status === 'action_required' && <AlertCircle className="w-3 h-3" />}
                      <span>{kpi.status === 'action_required' ? 'Action Req' : kpi.status}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] font-mono text-slate-400">
                    {kpi.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Responsive Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredKpis.map((kpi) => (
            <div key={kpi.id} className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-mono font-bold text-xs text-teal-700 block">
                    {kpi.shortCode}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {kpi.indicator}
                  </h4>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase shrink-0 ${
                  kpi.status === 'compliant'
                    ? 'bg-emerald-100 text-emerald-800'
                    : kpi.status === 'borderline'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-rose-100 text-rose-800'
                }`}>
                  {kpi.status === 'compliant' && <CheckCircle2 className="w-3 h-3" />}
                  {kpi.status === 'borderline' && <AlertTriangle className="w-3 h-3" />}
                  {kpi.status === 'action_required' && <AlertCircle className="w-3 h-3" />}
                  <span>{kpi.status === 'action_required' ? 'Action Req' : kpi.status}</span>
                </span>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                {kpi.description}
              </p>

              {/* Progress and Stats bar */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Rate / Target</span>
                  <div className="flex items-baseline gap-1 font-mono">
                    <span className="font-bold text-slate-900 text-sm">{kpi.percentage}%</span>
                    <span className="text-slate-400 text-[11px]">/ {kpi.targetBenchmark}%</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block">Numerator / Denominator</span>
                  <span className="font-bold text-slate-800">{kpi.numerator}</span>
                  <span className="text-slate-400"> / </span>
                  <span className="text-slate-600">{kpi.denominator}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                <span>Standard: {kpi.source}</span>
                <span>Facility: {kpi.facility}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
