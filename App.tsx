
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { CreditMemo, AttachedFile } from './types';
import { INITIAL_MEMO_STATE } from './constants';
import { 
  HeaderBorrowerSection, 
  PurposePositionSection,
  ExposureRarocSection,
  CounterpartyRatingsSection,
  IndustryPolicySection,
  FacilityTradingSection,
  SecurityDocsSection,
  CovenantsFundingSection,
  RatesTermsSection,
  SyndicationSalesSection,
  BorrowerOverviewSection,
  FinancialRiskSection,
  BudgetSensitivitySection,
  JustificationSignoffSection
} from './components/FormSections';
import { MemoPreview } from './components/MemoPreview';
import { ChatInterface } from './components/ChatInterface';
import { geminiService } from './services/geminiService';

const deepMerge = (target: any, source: any): any => {
  if (source === null || source === undefined) return target;
  if (typeof source !== 'object') return source;
  
  // If source is an array, we replace the target array entirely to maintain structure
  if (Array.isArray(source)) {
    return source;
  }
  
  // If target is an array but source is a plain object, we ignore the source 
  // to prevent corrupting the array into an object.
  if (Array.isArray(target)) {
    return target;
  }

  const result = { ...target };
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      result[key] = deepMerge(target[key], source[key]);
    }
  }
  return result;
};

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('header_borrower');
  const [memo, setMemo] = useState<CreditMemo>(INITIAL_MEMO_STATE);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [agentLogs, setAgentLogs] = useState<{agent: string, message: string, status: 'pending' | 'success' | 'error'}[]>([]);

  const performAnalysis = async (files: AttachedFile[]) => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    setAgentLogs([
      { agent: 'Extraction', message: 'Extracting financial data...', status: 'pending' },
      { agent: 'Underwriter', message: 'Synthesizing narratives...', status: 'pending' },
      { agent: 'Compliance', message: 'Auditing risk flags...', status: 'pending' },
    ]);

    try {
      const updates = await geminiService.analyzeDocuments(files, memo);
      
      if (updates && typeof updates === 'object') {
        setMemo(prev => deepMerge(prev || INITIAL_MEMO_STATE, updates));
        setAgentLogs(prev => prev.map(l => ({...l, status: 'success'})));
        
        setTimeout(() => {
          setIsAnalyzing(false);
          setActiveSection('preview');
        }, 3000); 
      }
    } catch (err: any) {
      console.error("Synthesis failed", err);
      setAnalysisError(err.message || "AI Analysis failed to complete.");
      setAgentLogs(prev => prev.map(l => l.status === 'pending' ? { ...l, status: 'error' as const, message: 'Process interrupted' } : l));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newFiles: AttachedFile[] = await Promise.all(filesArray.map(file => {
      return new Promise<AttachedFile>((resolve) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          resolve({
            name: file.name,
            type: file.type,
            base64: ev.target?.result as string
          });
        };
        reader.readAsDataURL(file);
      });
    }));
    setAttachedFiles(prev => [...prev, ...newFiles]);
    performAnalysis(newFiles);
  };

  const renderContent = () => {
    if (!memo) return <div className="p-12 text-slate-400 font-bold text-center">Loading Underwriting Context...</div>;
    
    const props = { memo, setMemo };
    switch (activeSection) {
      case 'header_borrower': return <HeaderBorrowerSection {...props} />;
      case 'purpose_position': return <PurposePositionSection {...props} />;
      case 'exposure_raroc': return <ExposureRarocSection {...props} />;
      case 'counterparty_ratings': return <CounterpartyRatingsSection {...props} />;
      case 'industry_policy': return <IndustryPolicySection {...props} />;
      case 'facility_trading': return <FacilityTradingSection {...props} />;
      case 'security_docs': return <SecurityDocsSection {...props} />;
      case 'covenants_funding': return <CovenantsFundingSection {...props} />;
      case 'rates_terms': return <RatesTermsSection {...props} />;
      case 'syndication_sales': return <SyndicationSalesSection {...props} />;
      case 'borrower_overview': return <BorrowerOverviewSection {...props} />;
      case 'financial_risk': return <FinancialRiskSection {...props} />;
      case 'budget_sensitivity': return <BudgetSensitivitySection {...props} />;
      case 'justification_signoff': return <JustificationSignoffSection {...props} />;
      case 'preview': return <MemoPreview memo={memo} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#f4f7f4] font-sans selection:bg-green-600 selection:text-white overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between z-20 shadow-sm">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syndicated Deal ID</span>
              <span className="text-sm font-mono font-black text-slate-900 tracking-tighter">{memo?.header?.reviewId || '---'}</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex gap-3">
               <label className="flex items-center gap-3 px-5 py-2.5 bg-[#008a00] text-white rounded-xl cursor-pointer transition-all text-[11px] font-black uppercase hover:bg-[#007000] shadow-lg shadow-green-500/10 active:scale-95 disabled:opacity-50">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                 {isAnalyzing ? 'Underwriting Active...' : 'Upload Deal Documents'}
                 <input type="file" multiple onChange={handleFileUpload} className="hidden" disabled={isAnalyzing} />
               </label>
            </div>
          </div>
          <div className="flex gap-5">
            {isAnalyzing && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-green-50 text-green-800 rounded-xl text-xs font-black border border-green-100 animate-pulse">
                 <div className="w-3.5 h-3.5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                 Multi-Agent Active
               </div>
            )}
            <button className="px-7 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-xs font-black uppercase hover:bg-slate-900 hover:text-white transition-all active:scale-95">
              Submit Review
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative bg-[#f8faf8]">
            <div className="max-w-6xl mx-auto mb-40">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-[12px] z-50 flex items-center justify-center p-12 overflow-hidden animate-in fade-in duration-500">
                   <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center gap-8 max-w-2xl w-full">
                      {analysisError ? (
                        <div className="text-center space-y-6">
                          <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div className="space-y-2">
                            <h2 className="text-2xl font-black text-slate-900 uppercase">Engine Failure</h2>
                            <p className="text-sm text-slate-500 font-medium">{analysisError}</p>
                          </div>
                          <button 
                            onClick={() => setIsAnalyzing(false)}
                            className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase hover:bg-slate-800 transition-all active:scale-95"
                          >
                            Close & Retry
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="relative group">
                            <div className="w-32 h-32 border-[10px] border-green-50 rounded-full"></div>
                            <div className="absolute inset-0 w-32 h-32 border-[10px] border-[#008a00] border-t-transparent rounded-full animate-spin shadow-xl"></div>
                            <div className="absolute inset-0 flex items-center justify-center font-black text-[#008a00] text-[10px] uppercase tracking-tighter">AI Underwriting</div>
                          </div>
                          <div className="text-center space-y-2">
                            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic">Full Deal Synthesis</h2>
                            <p className="text-sm text-slate-500 font-medium max-w-md mx-auto">Collaborative Agents are extracting data, drafting narratives, and auditing compliance in real-time.</p>
                          </div>
                          <div className="w-full space-y-3 bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-inner">
                            {agentLogs.map((log, i) => (
                              <div key={i} className="flex items-center justify-between text-xs transition-all animate-in slide-in-from-left duration-300" style={{ transitionDelay: `${i * 150}ms` }}>
                                <div className="flex items-center gap-4">
                                  <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${
                                    log.status === 'success' ? 'bg-green-500 shadow-green-500/40' : 
                                    log.status === 'error' ? 'bg-red-500 shadow-red-500/40' :
                                    'bg-[#008a00] animate-pulse shadow-green-700/40'
                                  }`}></div>
                                  <span className="font-black text-slate-400 uppercase w-24 text-[10px] tracking-widest">{log.agent}</span>
                                  <span className={`font-bold ${log.status === 'success' ? 'text-slate-900' : 'text-slate-500'}`}>{log.message}</span>
                                </div>
                                {log.status === 'success' && <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                              </div>
                            ))}
                          </div>
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                            <div className="h-full bg-[#008a00] animate-progress shadow-[0_0_15px_rgba(0,138,0,0.4)]"></div>
                          </div>
                        </>
                      )}
                   </div>
                </div>
              )}
              {renderContent()}
            </div>
          </div>
          <div className="w-[440px] flex-shrink-0 bg-white z-30 shadow-[-30px_0_60px_rgba(0,0,0,0.03)] border-l border-slate-200">
            <ChatInterface 
              memo={memo} 
              onUpdateMemo={(upd) => setMemo(prev => deepMerge(prev, upd))} 
            />
          </div>
        </div>
      </main>
      <style>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 25s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
