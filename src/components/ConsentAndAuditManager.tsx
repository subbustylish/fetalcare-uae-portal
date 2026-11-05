import React, { useState } from 'react';
import { 
  INITIAL_SCREENING_CONSENTS, 
  INITIAL_AUDIT_TRAIL, 
  MALAFFI_NABIDH_MOCK_DATABASE,
  ScreeningConsentRecord,
  AuditLogEntry,
  MalaffiNabidhRecord
} from '../data/consentAuditData';
import { 
  ShieldCheck, 
  FileCheck2, 
  History, 
  UserCheck, 
  Lock, 
  Smartphone, 
  Building2, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Key, 
  Globe, 
  Database,
  ExternalLink,
  Signature,
  FileText
} from 'lucide-react';

interface ConsentAndAuditManagerProps {
  currentClinicianRole?: string;
}

export const ConsentAndAuditManager: React.FC<ConsentAndAuditManagerProps> = ({
  currentClinicianRole = 'Consultant OB/GYN'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'consents' | 'audit' | 'rbac_2fa' | 'hie_exchange'>('consents');

  // Consents State
  const [consents, setConsents] = useState<ScreeningConsentRecord[]>(INITIAL_SCREENING_CONSENTS);
  const [selectedConsentId, setSelectedConsentId] = useState<string | null>(null);
  const [declineReasonInput, setDeclineReasonInput] = useState<string>('');
  const [showDeclineModal, setShowDeclineModal] = useState<boolean>(false);

  // Audit Log State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_TRAIL);
  const [auditSearch, setAuditSearch] = useState<string>('');

  // 2FA Simulator State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [twoFactorVerified, setTwoFactorVerified] = useState<boolean>(true);
  const [otpCode, setOtpCode] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<boolean>(false);

  // Active Role Switcher
  const [activeRole, setActiveRole] = useState<'Consultant OB/GYN' | 'MFM Subspecialist' | 'Sonographer' | 'Registered Midwife' | 'Clinical Administrator'>('Consultant OB/GYN');

  // HIE (Malaffi & NABIDH) State
  const [hieSelectedPatient, setHieSelectedPatient] = useState<string>('pt-sarah');
  const [hieLookupLoading, setHieLookupLoading] = useState<boolean>(false);
  const [hieRecord, setHieRecord] = useState<MalaffiNabidhRecord | null>(MALAFFI_NABIDH_MOCK_DATABASE['pt-sarah']);

  // Handle Consent Decision (Accepted / Declined)
  const handleUpdateConsentStatus = (id: string, newStatus: 'accepted' | 'declined') => {
    if (newStatus === 'declined') {
      setSelectedConsentId(id);
      setShowDeclineModal(true);
      return;
    }

    const updated = consents.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: newStatus,
          decisionDate: new Date().toISOString().split('T')[0],
          signatureReference: `SIG-DOH-${Date.now()}`
        };
      }
      return c;
    });
    setConsents(updated);

    // Append to immutable audit trail
    const target = consents.find(c => c.id === id);
    if (target) {
      const newAudit: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'doc-tariq-01',
        actorName: 'Dr. Tariq Al-Hashimi',
        role: activeRole,
        actionType: 'CONSENT_RECORDED',
        patientId: target.patientId,
        patientName: target.patientName,
        facility: 'Abu Dhabi',
        details: `Screening Consent ACCEPTED: ${target.screeningName} (STD 3.2.1.2). Digital Signature recorded.`,
        cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }
  };

  const handleConfirmDecline = () => {
    if (!selectedConsentId) return;

    const updated = consents.map(c => {
      if (c.id === selectedConsentId) {
        return {
          ...c,
          status: 'declined' as const,
          declinedReason: declineReasonInput || 'Patient declined following clinical risk/benefit discussion.',
          decisionDate: new Date().toISOString().split('T')[0],
          signatureReference: `SIG-DECLINE-${Date.now()}`
        };
      }
      return c;
    });
    setConsents(updated);

    const target = consents.find(c => c.id === selectedConsentId);
    if (target) {
      const newAudit: AuditLogEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorId: 'doc-tariq-01',
        actorName: 'Dr. Tariq Al-Hashimi',
        role: activeRole,
        actionType: 'CONSENT_RECORDED',
        patientId: target.patientId,
        patientName: target.patientName,
        facility: 'Abu Dhabi',
        details: `Screening Consent DECLINED: ${target.screeningName}. Mandatory Reason logged: "${declineReasonInput}"`,
        cryptographicHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
      };
      setAuditLogs([newAudit, ...auditLogs]);
    }

    setShowDeclineModal(false);
    setDeclineReasonInput('');
  };

  const handleSimulateHieLookup = (patientId: string) => {
    setHieSelectedPatient(patientId);
    setHieLookupLoading(true);
    setTimeout(() => {
      setHieRecord(MALAFFI_NABIDH_MOCK_DATABASE[patientId] || null);
      setHieLookupLoading(false);
    }, 600);
  };

  const handleVerify2Fa = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length === 6) {
      setTwoFactorVerified(true);
      setShowOtpModal(false);
      setOtpSuccessMessage(true);
      setOtpCode('');
      setTimeout(() => setOtpSuccessMessage(false), 3500);
    }
  };

  const filteredAudits = auditLogs.filter(a => {
    return a.actorName.toLowerCase().includes(auditSearch.toLowerCase()) ||
           a.patientName.toLowerCase().includes(auditSearch.toLowerCase()) ||
           a.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
           a.actionType.toLowerCase().includes(auditSearch.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Title & Metadata Header */}
      <div className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-teal-400 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Section 16: Governance, Security, Audit & Interoperability</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold">
            Consent Records, Clinical Audit & Health Exchange
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compliance engine for DOH STD 3.2.1.2, UAE Federal Health Data Law, 2FA, and Malaffi / NABIDH HIE.
          </p>
        </div>

        {/* Sub-tab navigation (Mobile responsive horizontal scroll) */}
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 bg-slate-800 rounded-xl text-xs w-full md:w-auto shrink-0">
          <button
            onClick={() => setActiveSubTab('consents')}
            className={`py-2 px-3 rounded-lg font-medium whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'consents' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Screening Consents ({consents.length})
          </button>
          <button
            onClick={() => setActiveSubTab('audit')}
            className={`py-2 px-3 rounded-lg font-medium whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'audit' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Immutable Audit Trail
          </button>
          <button
            onClick={() => setActiveSubTab('rbac_2fa')}
            className={`py-2 px-3 rounded-lg font-medium whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'rbac_2fa' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            RBAC & 2FA Security
          </button>
          <button
            onClick={() => setActiveSubTab('hie_exchange')}
            className={`py-2 px-3 rounded-lg font-medium whitespace-nowrap transition min-h-[40px] ${
              activeSubTab === 'hie_exchange' ? 'bg-teal-600 text-white font-bold' : 'text-slate-300 hover:text-white'
            }`}
          >
            Malaffi / NABIDH (HIE)
          </button>
        </div>
      </div>

      {/* 2FA Verification Alert Notification */}
      {otpSuccessMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Two-Factor Authentication (2FA) re-verified successfully. High-privilege clinical permissions active.</span>
        </div>
      )}

      {/* SUB-TAB 1: SCREENING CONSENT LOG (STD 3.2.1.2) */}
      {activeSubTab === 'consents' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Antenatal Screening Consent Log (STD 3.2.1.2)
                </h3>
                <p className="text-xs text-slate-500">
                  Mandatory documentation of all screening tests offered, accepted, or declined with patient signature reference.
                </p>
              </div>
              <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-teal-50 text-teal-800 font-semibold border border-teal-200 self-start sm:self-auto">
                DOH Standard 3.2.1.2
              </span>
            </div>

            <div className="space-y-3">
              {consents.map((c) => (
                <div
                  key={c.id}
                  className={`p-4 rounded-2xl border transition space-y-2.5 ${
                    c.status === 'accepted'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : c.status === 'declined'
                      ? 'border-rose-200 bg-rose-50/20'
                      : 'border-slate-200 bg-slate-50/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {c.category}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          Patient: <strong className="text-slate-800">{c.patientName}</strong>
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                        {c.screeningName}
                      </h4>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        Offered by {c.clinicianName} ({c.clinicianRole}) on {c.offeredDate}
                      </span>
                    </div>

                    {/* Status Badge & Decision Toggles */}
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        c.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'declined'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.status}
                      </span>

                      {/* Quick Toggle Actions */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdateConsentStatus(c.id, 'accepted')}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            c.status === 'accepted'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-white hover:bg-emerald-50 text-emerald-700 border-slate-200'
                          }`}
                          title="Record Mother Accepted"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateConsentStatus(c.id, 'declined')}
                          className={`p-1.5 rounded-lg border text-xs transition ${
                            c.status === 'declined'
                              ? 'bg-rose-600 text-white border-rose-600'
                              : 'bg-white hover:bg-rose-50 text-rose-700 border-slate-200'
                          }`}
                          title="Record Mother Declined"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Declining justification if declined */}
                  {c.status === 'declined' && c.declinedReason && (
                    <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs text-rose-900 space-y-0.5">
                      <span className="font-bold block text-[11px]">Mandatory Reason for Declining (STD 3.2.1.2):</span>
                      <p className="leading-relaxed">{c.declinedReason}</p>
                    </div>
                  )}

                  {/* Footer details */}
                  <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-mono">
                      <Signature className="w-3.5 h-3.5 text-slate-400" />
                      Ref: {c.signatureReference}
                    </span>
                    <span>Clause: {c.dohStandard}</span>
                    <span>Leaflet: {c.informationLeafletProvided ? 'Provided (Patient Informed)' : 'Pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: IMMUTABLE AUDIT TRAIL */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Immutable Clinical Audit Trail
              </h3>
              <p className="text-xs text-slate-500">
                Timestamped log of clinical decisions, alert overrides, and biometric reports with SHA-256 cryptographic verification.
              </p>
            </div>

            <input
              type="text"
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              placeholder="Search audit records..."
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 w-full sm:w-64 focus:outline-none"
            />
          </div>

          <div className="space-y-2.5">
            {filteredAudits.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-slate-50/50 transition space-y-1.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="px-2 py-0.2 rounded bg-slate-200/70 text-slate-700 font-semibold text-[10px]">
                      {log.role}
                    </span>
                    <span className="text-teal-700 font-medium font-mono">{log.facility}</span>
                  </div>
                  <span className="font-mono text-slate-400">{log.timestamp}</span>
                </div>

                <div className="flex items-start gap-2 pt-0.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-white font-mono text-[10px] font-bold uppercase shrink-0 mt-0.5">
                    {log.actionType}
                  </span>
                  <div>
                    <span className="font-semibold text-slate-800">
                      Patient: {log.patientName} ({log.patientId}) —{' '}
                    </span>
                    <span className="text-slate-700">{log.details}</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Audit ID: {log.id}</span>
                  <span className="truncate max-w-xs" title={log.cryptographicHash}>
                    Hash: {log.cryptographicHash}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RBAC & 2FA SECURITY */}
      {activeSubTab === 'rbac_2fa' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 2FA Status & Simulation (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-teal-800 uppercase tracking-wider block">
                Access Security
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Two-Factor Authentication (2FA)
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">2FA Protection</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                  {twoFactorVerified ? 'Active & Verified' : 'Action Required'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mandatory for all clinical sign-offs, clinical alert overrides, and invasive procedure scheduling per DOH Cybersecurity Standards.
              </p>
              <button
                onClick={() => setShowOtpModal(true)}
                className="w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Key className="w-4 h-4" />
                <span>Simulate 2FA Security Challenge</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Method:</span>
                <span className="font-semibold text-slate-900">SMS / UAE PASS Authenticator</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Session Timeout:</span>
                <span className="font-mono text-slate-900">15 minutes idle</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span>Encryption:</span>
                <span className="font-mono text-slate-900">AES-256 in transit & at rest</span>
              </div>
            </div>
          </div>

          {/* Right Column: Role-Based Access Control (RBAC) (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Privilege Matrix
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Role-Based Access Control (RBAC)
              </h3>
            </div>

            {/* Role Switcher */}
            <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
              {[
                'Consultant OB/GYN',
                'MFM Subspecialist',
                'Sonographer',
                'Registered Midwife',
                'Clinical Administrator'
              ].map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveRole(role as any)}
                  className={`py-1.5 px-3 rounded-lg font-medium transition whitespace-nowrap ${
                    activeRole === role
                      ? 'bg-teal-700 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            {/* Permission Table for Selected Role */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 block text-xs">
                Permissions Granted to: <span className="text-teal-700">{activeRole}</span>
              </span>

              <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span>Sign Anatomy & Biometry Scans:</span>
                  <span className={`font-semibold ${
                    activeRole.includes('Consultant') || activeRole.includes('MFM') || activeRole.includes('Sonographer')
                      ? 'text-emerald-700'
                      : 'text-rose-600'
                  }`}>
                    {activeRole.includes('Consultant') || activeRole.includes('MFM') || activeRole.includes('Sonographer') ? 'Allowed' : 'Prohibited'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Override DOH Fetal Medicine Alert:</span>
                  <span className={`font-semibold ${
                    activeRole.includes('Consultant') || activeRole.includes('MFM')
                      ? 'text-emerald-700'
                      : 'text-rose-600'
                  }`}>
                    {activeRole.includes('Consultant') || activeRole.includes('MFM') ? 'Allowed (Requires Reason)' : 'Prohibited'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Schedule Tertiary Fetal Therapy:</span>
                  <span className={`font-semibold ${
                    activeRole.includes('MFM') ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {activeRole.includes('MFM') ? 'Allowed (Subspecialist)' : 'Prohibited'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sign Mandatory Antenatal Visits:</span>
                  <span className="text-emerald-700 font-semibold">
                    Allowed (All Clinicians)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: UAE HIE INTEROPERABILITY (MALAFFI & NABIDH) */}
      {activeSubTab === 'hie_exchange' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-bold text-teal-800 uppercase tracking-wider">
                    UAE National Health Information Exchange
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  Malaffi (Abu Dhabi) & NABIDH (Dubai) Record Lookup
                </h3>
              </div>

              {/* UAE Health Data Law Compliance Badge */}
              <div className="px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2 self-start sm:self-auto">
                <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0" />
                <span className="font-semibold text-[11px]">
                  UAE Federal Law No. 2 of 2019 Compliant (Data In-Country)
                </span>
              </div>
            </div>

            {/* Patient Selector for HIE Lookup */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Select Patient for HIE Query:</span>
              {[
                { id: 'pt-sarah', label: 'Sarah (Malaffi · Abu Dhabi)' },
                { id: 'pt-noura', label: 'Noura (Malaffi · Abu Dhabi)' },
                { id: 'pt-maryam', label: 'Maryam (NABIDH · Dubai)' },
                { id: 'pt-aisha', label: 'Aisha (Malaffi · Abu Dhabi)' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSimulateHieLookup(p.id)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                    hieSelectedPatient === p.id
                      ? 'bg-teal-700 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* HIE Lookup Results */}
            {hieLookupLoading ? (
              <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
                Querying UAE National Health Information Exchange gateway...
              </div>
            ) : hieRecord ? (
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">
                      {hieRecord.sourceAuthority}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900">
                      {hieRecord.patientName} · Emirates ID: {hieRecord.emiratesId}
                    </h4>
                    <span className="text-xs text-slate-500">
                      Linked Primary Facility: {hieRecord.linkedFacility}
                    </span>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold font-mono self-start sm:self-auto">
                    {hieRecord.consentStatus}
                  </span>
                </div>

                {/* Available Records Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block text-xs">Known Allergies & Medical History</span>
                    <p className="text-slate-600">Allergies: {hieRecord.availableRecords.knownAllergies.join(', ')}</p>
                    <p className="text-slate-600">Conditions: {hieRecord.availableRecords.chronicConditions.join(', ')}</p>
                    <p className="text-slate-600">Prior Pregnancies: {hieRecord.availableRecords.priorPregnanciesCount}</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-800 block text-xs">Prior Ultrasounds & Lab Records</span>
                    <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                      {hieRecord.availableRecords.recentUltrasounds.map((u, i) => (
                        <li key={i}>{u}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-slate-200/60">
                  <span>HIE National ID: {hieRecord.nationalHieId}</span>
                  <span>Compliance Seal: {hieRecord.complianceSeal}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Document Reason for Declining Screening</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Per DOH Standard 3.2.1.2, every screening test declined requires a documented explanation of informed maternal refusal following clinical counselling.
            </p>

            <textarea
              value={declineReasonInput}
              onChange={(e) => setDeclineReasonInput(e.target.value)}
              placeholder="Enter patient reason (e.g. risks/benefits explained, mother elected non-invasive cfDNA instead of invasive amniocentesis)..."
              rows={3}
              className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-rose-500"
              required
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeclineModal(false)}
                className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                className="w-1/2 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md min-h-[44px]"
              >
                Save Refusal Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Challenge Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
              <Key className="w-5 h-5 text-teal-600 shrink-0" />
              <span>Two-Factor Authentication (2FA)</span>
            </div>
            <p className="text-xs text-slate-500">
              Enter the 6-digit verification code sent to your registered UAE mobile device.
            </p>

            <form onSubmit={handleVerify2Fa} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center tracking-widest font-mono text-xl py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none font-bold"
                required
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowOtpModal(false)}
                  className="w-1/2 py-2.5 text-xs font-semibold text-slate-600 rounded-xl border border-slate-200 hover:bg-slate-50 min-h-[44px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={otpCode.length !== 6}
                  className="w-1/2 py-2.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-500 disabled:opacity-50 rounded-xl shadow-md min-h-[44px]"
                >
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
