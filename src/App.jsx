import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
  Download,
  Mail,
  ArrowRight,
  Gavel,
  ShieldCheck,
  Plus,
  Info,
  Scale,
  Copy,
  Check,
  Edit3,
  Eye,
  FileSearch,
  ChevronRight,
  User,
  Building
} from 'lucide-react';

const App = () => {
  const [step, setStep] = useState('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [clientInfo, setClientInfo] = useState(null);
  const [tenantInfo, setTenantInfo] = useState({ name: '', address: '', status: '' });
  const [leaseClauses, setLeaseClauses] = useState(null);
  const [demandType, setDemandType] = useState(null);
  const [finalDoc, setFinalDoc] = useState("");

  const handleFileUpload = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setClientInfo({
        name: "Acme Property Management",
        email: "contact@acme-props.com",
        contactPerson: "Sarah Jenkins"
      });
      setProcessing(false);
      setStep('client-match');
    }, 1200);
  };

  const startLeaseAnalysis = () => {
    setProcessing(true);
    setTimeout(() => {
      setTenantInfo({
        name: "John Doe",
        address: "123 Baker Street, London, NW1 6XE",
        status: "new" // 'new' or 'existing'
      });
      setLeaseClauses({
        interestClause: "Clause 4.2",
        interestRate: "4% above Barclays Base Rate",
        latePaymentClause: "Clause 7.1",
        adminFee: "£50.00",
        legalCharges: "Clause 12 (Indemnity Basis)",
        totalPrincipal: "3600.00",
        interestCalculated: "50.00",
        totalDue: "3650.00",
        serviceMethod: "First Class Post",
        snippets: {
          interest: { title: "Lease_Final_Signed.pdf - P.14", text: "...interest shall be payable at the rate of 4% per annum above the base rate of Barclays Bank PLC..." },
          legal: { title: "Lease_Final_Signed.pdf - P.22", text: "...to pay to the Landlord on an indemnity basis all costs and expenses incurred in connection with the recovery..." },
          arrears: { title: "SOA_November_2023.xlsx", text: "Balance b/f: £0.00 | Q3 Rent: £3,600.00 | Current Arrears: £3,600.00" },
          service: { title: "Lease_Final_Signed.pdf - P.31", text: "...any notice shall be sufficiently served if sent by first class post or delivered by hand..." }
        }
      });
      setProcessing(false);
      setStep('lease-analysis');
    }, 1800);
  };

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = finalDoc;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateDocument = () => {
    const doc = `${demandType === 'stat' ? 'STATUTORY DEMAND UNDER SECTION 268(1)(a) OF THE INSOLVENCY ACT 1986' : 'FORMAL NOTICE OF SERVICE CHARGE / RENT ARREARS'}

To: ${tenantInfo.name}
Address: ${tenantInfo.address}

Reference: LEASE-REF-9920
Date: ${new Date().toLocaleDateString()}

TAKE NOTICE that we act on behalf of ${clientInfo.name} ("the Landlord"). 

Our records demonstrate a total outstanding balance of £${leaseClauses.totalDue}. This sum is comprised of:
- Principal Arrears: £${leaseClauses.totalPrincipal}
- Interest calculated per ${leaseClauses.interestClause}: £${leaseClauses.interestCalculated}

Pursuant to ${leaseClauses.legalCharges} of your Lease Agreement, you are further liable for the costs associated with this recovery action.

${demandType === 'stat' ? 'Failure to satisfy this debt within 21 days may result in a bankruptcy petition being presented against you.' : 'You are required to make payment within 14 days, failing which legal proceedings will be issued without further notice.'}

Yours faithfully,
Debt Recovery Department
For and on behalf of ${clientInfo.name}`;
    setFinalDoc(doc);
    setStep('final');
  };

  const VisualSourceTooltip = ({ snippet }) => (
    <div className="absolute z-[100] bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 max-w-[90vw] shadow-2xl animate-in fade-in zoom-in-95 pointer-events-none">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col shadow-lg">
        <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between items-center">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight flex items-center gap-1">
            <Eye size={10} /> OCR Verification
          </span>
          <span className="text-[9px] text-blue-600 font-bold truncate max-w-[120px]">{snippet.title}</span>
        </div>
        <div className="p-3 bg-white relative">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '8px 8px' }}></div>
          <p className="text-[10px] leading-relaxed text-slate-600 italic font-serif relative z-10 border-l-2 border-blue-200 pl-2">
            "{snippet.text}"
          </p>
        </div>
      </div>
      <div className="w-2.5 h-2.5 bg-white border-r border-b border-slate-200 rotate-45 mx-auto -mt-1.5 relative z-[101]"></div>
    </div>
  );

  const EditableField = ({ label, value, onChange, snippet, className = "", highlight = false, badge }) => (
    <div className={`p-4 bg-white border border-slate-200 rounded-xl group relative transition-all duration-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-50/50 focus-within:z-10 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
          {badge}
        </div>
        {snippet && (
          <div className="relative group/tooltip z-20">
            <button className="text-slate-300 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
              <Info size={14} />
            </button>
            <div className="hidden group-hover/tooltip:block">
              <VisualSourceTooltip snippet={snippet} />
            </div>
          </div>
        )}
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full font-semibold bg-transparent border-none p-0 focus:outline-none text-sm ${highlight ? 'text-blue-600' : 'text-slate-800'}`}
      />
    </div>
  );

  const StepIndicator = () => {
    const steps = [
      { id: 'upload', label: 'Instruction' },
      { id: 'client-match', label: 'Verification' },
      { id: 'lease-analysis', label: 'Extraction' },
      { id: 'selection', label: 'Parameters' },
      { id: 'final', label: 'Draft' }
    ];
    const currentIndex = steps.findIndex(s => s.id === step);
    return (
      <div className="flex items-center justify-between mb-12 px-4 max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className="flex flex-col items-center group cursor-default">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${i <= currentIndex ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border-2 border-slate-100 text-slate-300'}`}>
                {i <= currentIndex ? <Check size={14} strokeWidth={3} /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-tight mt-2.5 transition-colors ${i <= currentIndex ? 'text-blue-700' : 'text-slate-300'}`}>{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`h-[2px] flex-1 mx-4 rounded-full transition-all duration-500 ${i < currentIndex ? 'bg-blue-100' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-12 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 w-screen">
      <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 overflow-hidden border border-white ring-1 ring-slate-200/50">

        {/* Header */}
        <div className="bg-white/50 p-8 border-b border-slate-100 flex justify-between items-center sticky top-0 z-40 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="bg-slate-900 p-2.5 rounded-xl shadow-lg shadow-slate-900/10">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 font-display">Aequitas <span className="text-blue-600">Recover</span></h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Automated Recovery Suite</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">System Active</span>
          </div>
        </div>

        <div className="p-10 min-h-[600px]">
          <StepIndicator />

          {/* 1. Upload */}
          {step === 'upload' && (
            <div className="max-w-xl mx-auto py-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">New Instruction</h2>
                <p className="text-slate-500 text-sm mt-2 font-medium">Initialize case analysis by providing the instruction email.</p>
              </div>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileUpload}
                className={`border-2 border-dashed rounded-[2rem] p-16 transition-all duration-300 text-center cursor-pointer group ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-50'}`}
              >
                {processing ? (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-slate-700 text-sm animate-pulse">Analyzing Metadata & Attachments...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white shadow-lg shadow-slate-100 border border-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Mail className="text-slate-400 group-hover:text-blue-600 transition-colors" size={28} />
                    </div>
                    <p className="text-lg font-bold text-slate-700">Drop Instruction File (.msg)</p>
                    <p className="text-slate-400 text-[11px] mt-2 font-medium max-w-[200px] leading-relaxed">System will auto-parse Client ID, Lease PDF, and Account Statement</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Client Match */}
          {step === 'client-match' && (
            <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-[#0F172A] text-white p-8 rounded-3xl mb-8 flex items-center justify-between shadow-2xl shadow-slate-200">
                <div className="flex items-center gap-5">
                  <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-900/20"><CheckCircle size={24} className="text-white" /></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-1">Identified Principal</p>
                    <p className="text-xl font-bold tracking-tight">{clientInfo.name}</p>
                  </div>
                </div>
                <div className="text-right pl-8 border-l border-slate-700/50">
                  <p className="text-[10px] font-bold uppercase opacity-60 tracking-widest mb-1">Instruction Source</p>
                  <p className="text-sm font-medium">{clientInfo.contactPerson}</p>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                  <FileSearch size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Document Classification</h3>
                <p className="text-sm text-slate-500 mt-2 mb-8 max-w-md mx-auto leading-relaxed">
                  Successfully detected <strong>Lease_Final.pdf</strong> (Execution Copy) and <strong>Account_Summary.xlsx</strong> (Arrears Schedule).
                </p>
                <button onClick={startLeaseAnalysis} className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mx-auto shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5">
                  Begin Legal Extraction <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* 3. Extraction */}
          {step === 'lease-analysis' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Entity & Clause Verification</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Review AI-extracted data points against source documents.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <EditableField
                  label="Tenant Entity"
                  value={tenantInfo.name}
                  onChange={(v) => setTenantInfo({ ...tenantInfo, name: v })}
                  snippet={{ title: "Lease P.1", text: "BETWEEN (1) The Landlord and (2) THE TENANT: " + tenantInfo.name }}
                  badge={
                    tenantInfo.status === 'new' ?
                      <span className="bg-amber-100 text-amber-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-amber-200 uppercase tracking-wide flex items-center gap-1"><AlertCircle size={10} /> New Entity</span> :
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold border border-emerald-200 uppercase tracking-wide">Existing Record</span>
                  }
                />
                <EditableField label="Service Address" value={tenantInfo.address} onChange={(v) => setTenantInfo({ ...tenantInfo, address: v })} snippet={{ title: "Lease Schedule 1", text: "The Premises: 123 Baker Street..." }} />
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-8 shadow-sm">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center gap-2">
                  <FileText size={14} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Extracted Lease Logic</span>
                </div>
                <div className="grid md:grid-cols-2 divide-x divide-y divide-slate-100">
                  <EditableField label="Interest Provision" value={leaseClauses.interestClause} snippet={leaseClauses.snippets.interest} onChange={(v) => setLeaseClauses({ ...leaseClauses, interestClause: v })} className="border-none rounded-none shadow-none" />
                  <EditableField label="Calculated Rate" value={leaseClauses.interestRate} snippet={leaseClauses.snippets.interest} onChange={(v) => setLeaseClauses({ ...leaseClauses, interestRate: v })} className="border-none rounded-none shadow-none" />
                  <EditableField label="Administration Charges" value={leaseClauses.adminFee} snippet={{ title: "Lease Clause 7.1", text: "...administrative fee of £50.00 in respect of any late payment..." }} onChange={(v) => setLeaseClauses({ ...leaseClauses, adminFee: v })} className="border-none rounded-none shadow-none" />
                  <EditableField label="Indemnity Provision" value={leaseClauses.legalCharges} snippet={leaseClauses.snippets.legal} onChange={(v) => setLeaseClauses({ ...leaseClauses, legalCharges: v })} className="border-none rounded-none shadow-none" />
                </div>
              </div>

              <div className="flex flex-col items-center bg-gradient-to-b from-blue-50/80 to-slate-50/50 rounded-3xl p-10 border border-blue-100/50">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Select Instrument</h3>
                <div className="grid md:grid-cols-2 gap-4 w-full max-w-2xl">
                  <button onClick={() => { setDemandType('service'); setStep('selection') }} className="p-6 bg-white border border-blue-100 rounded-2xl hover:border-blue-400 hover:ring-4 hover:ring-blue-50 hover:shadow-xl transition-all text-left shadow-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-blue-100/50"></div>
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10">
                      <FileText size={20} />
                    </div>
                    <div className="font-bold text-slate-900 relative z-10">Formal Service Demand</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium relative z-10">Notice under CPR Part 7 (14 Days)</div>
                  </button>
                  <button onClick={() => { setDemandType('stat'); setStep('selection') }} className="p-6 bg-white border border-slate-200 rounded-2xl hover:border-slate-800 hover:ring-4 hover:ring-slate-100 hover:shadow-xl transition-all text-left shadow-sm group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-150 group-hover:bg-slate-100"></div>
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-slate-800 group-hover:text-white transition-colors relative z-10">
                      <Gavel size={20} />
                    </div>
                    <div className="font-bold text-slate-900 relative z-10">Statutory Demand</div>
                    <div className="text-[11px] text-slate-500 mt-1 font-medium relative z-10">Insolvency Act S.268 (21 Days)</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Parameters */}
          {step === 'selection' && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-200"><Scale size={24} /></div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Calculation Summary</h2>
                  <p className="text-slate-500 text-sm font-medium mt-1">Review consolidated arrears and interest for the {demandType === 'stat' ? 'Statutory' : 'Service'} Demand.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Principal Sum</span>
                    <div className="relative group/tt">
                      <Info size={14} className="text-slate-300 cursor-help" />
                      <div className="hidden group-hover/tt:block"><VisualSourceTooltip snippet={leaseClauses.snippets.arrears} /></div>
                    </div>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-slate-900">
                    <span className="text-slate-300 mr-1 text-lg font-medium">£</span>
                    <input className="bg-transparent border-none focus:outline-none w-full font-bold" value={leaseClauses.totalPrincipal} onChange={(e) => setLeaseClauses({ ...leaseClauses, totalPrincipal: e.target.value })} />
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Accrued Interest</span>
                    <div className="relative group/tt">
                      <Info size={14} className="text-slate-300 cursor-help" />
                      <div className="hidden group-hover/tt:block"><VisualSourceTooltip snippet={leaseClauses.snippets.interest} /></div>
                    </div>
                  </div>
                  <div className="flex items-center text-2xl font-bold text-blue-600">
                    <span className="text-blue-200 mr-1 text-lg font-medium">£</span>
                    <input className="bg-transparent border-none focus:outline-none w-full font-bold" value={leaseClauses.interestCalculated} onChange={(e) => setLeaseClauses({ ...leaseClauses, interestCalculated: e.target.value })} />
                  </div>
                </div>
                <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-xl shadow-blue-200 bg-gradient-to-br from-blue-600 to-blue-700">
                  <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Total Liability</span>
                  <div className="text-3xl font-bold mt-2 tracking-tight">£{(parseFloat(leaseClauses.totalPrincipal || 0) + parseFloat(leaseClauses.interestCalculated || 0)).toFixed(2)}</div>
                  <p className="text-[9px] font-bold opacity-60 mt-1 uppercase tracking-tight">Consolidated Arrears</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Protocol</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">{leaseClauses.serviceMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compliance Period</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">{demandType === 'stat' ? '21 Days' : '14 Days'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setProcessing(true); setTimeout(() => { setProcessing(false); generateDocument(); }, 1200) }}
                    className="bg-slate-900 text-white py-4 px-10 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-3 shadow-xl shadow-slate-200 hover:shadow-2xl transform hover:-translate-y-0.5"
                  >
                    {processing ? "Formatting Draft..." : <>Generate Instrument <ArrowRight size={18} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Final Draft */}
          {step === 'final' && (
            <div className="animate-in fade-in duration-700 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Instrument Preview</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Review and refine the recovery notice below.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleCopy} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Content</>}
                  </button>
                </div>
              </div>

              <div className="relative mb-10 group">
                <textarea
                  value={finalDoc}
                  onChange={(e) => setFinalDoc(e.target.value)}
                  className="w-full h-[450px] p-12 rounded-2xl font-serif text-[13px] leading-relaxed border border-slate-200 shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 bg-[#fcfcfc] text-slate-800 resize-none transition-shadow"
                  spellCheck="false"
                />
                <div className="absolute top-4 right-6 text-[9px] font-bold uppercase text-slate-300 flex items-center gap-1 group-hover:text-blue-400 transition-colors">
                  <Edit3 size={10} /> Editable Workspace
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <button className="bg-slate-900 text-white py-4.5 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 hover:shadow-2xl">
                  <Download size={20} /> Export Final PDF
                </button>
                <button onClick={() => setStep('upload')} className="bg-white border border-slate-200 text-slate-600 py-4.5 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 hover:border-slate-300">
                  <Plus size={20} /> New Case
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-10 py-5 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Aequitas Recover Suite | v2.4.0</span>
          <span className="text-slate-300 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            Compliance Verified: CPR / Insolvency Act
          </span>
        </div>
      </div>
    </div>
  );
};

export default App;
