
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
  FacilityDetailsSection,
  TradingReportingSection,
  SecurityDocsSection,
  CovenantsFundingSection,
  TermsRatesSection,
  SyndicationSalesSection,
  BorrowerNarrativeSection,
  RisksAnalysisSection,
  JustificationSignoffSection
} from './components/FormSections';
import { MemoPreview } from './components/MemoPreview';
import { ChatInterface } from './components/ChatInterface';
import { aiService } from './services/aiService';

const deepMerge = (target: any, source: any): any => {
  if (source === null || source === undefined) return target;
  if (typeof source !== 'object') return source;
  if (Array.isArray(source)) return source;
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

  const performAnalysis = async (files: AttachedFile[]) => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    try {
      const updates = await aiService.analyzeDocuments(files, memo);
      setMemo(prev => deepMerge(prev || INITIAL_MEMO_STATE, updates));
      setActiveSection('preview');
    } catch (err) {
      console.error("Critical AI failure", err);
    } finally {
      setIsAnalyzing(false);
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
    const props = { memo, setMemo };
    switch (activeSection) {
      case 'header_borrower': return <HeaderBorrowerSection {...props} />;
      case 'purpose_position': return <PurposePositionSection {...props} />;
      case 'exposure_raroc': return <ExposureRarocSection {...props} />;
      case 'counterparty_ratings': return <CounterpartyRatingsSection {...props} />;
      case 'industry_policy': return <IndustryPolicySection {...props} />;
      case 'facility_details': return <FacilityDetailsSection {...props} />;
      case 'trading_reporting': return <TradingReportingSection {...props} />;
      case 'security_docs': return <SecurityDocsSection {...props} />;
      case 'covenants_funding': return <CovenantsFundingSection {...props} />;
      case 'terms_rates': return <TermsRatesSection {...props} />;
      case 'syndication_sales': return <SyndicationSalesSection {...props} />;
      case 'borrower_narrative': return <BorrowerNarrativeSection {...props} />;
      case 'risks_analysis': return <RisksAnalysisSection {...props} />;
      case 'justification_signoff': return <JustificationSignoffSection {...props} />;
      case 'preview': return <MemoPreview memo={memo} />;
      default: return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-100 font-sans selection:bg-blue-600 selection:text-white overflow-hidden">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between z-20 shadow-sm">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syndicated Deal ID</span>
              <span className="text-sm font-mono font-black text-slate-900 tracking-tighter">{memo.header?.reviewId || '---'}</span>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div className="flex gap-3">
               <label className="flex items-center gap-3 px-5 py-2.5 bg-blue-600 text-white rounded-xl cursor-pointer transition-all text-[11px] font-black uppercase hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                 {isAnalyzing ? 'Running Synthesis...' : 'Attach Source Files'}
                 <input type="file" multiple onChange={handleFileUpload} className="hidden" disabled={isAnalyzing} />
               </label>
               {attachedFiles.length > 0 && (
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[11px] font-black uppercase border border-slate-200">
                   {attachedFiles.length} Source Assets
                 </div>
               )}
            </div>
          </div>
          <div className="flex gap-5">
            {isAnalyzing && (
               <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-black animate-pulse border border-blue-100">
                 <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                 Advanced Reasoning Active
               </div>
            )}
            <button className="px-7 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl text-xs font-black uppercase hover:bg-slate-900 hover:text-white transition-all active:scale-95">
              Finalize Memo
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50 custom-scrollbar relative">
            <div className="max-w-6xl mx-auto mb-40">
              {isAnalyzing && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[6px] z-50 rounded-3xl flex items-center justify-center p-12">
                   <div className="bg-white p-12 rounded-[2rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col items-center gap-6 max-w-lg">
                      <div className="relative">
                        <div className="w-20 h-20 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center font-black text-blue-600 text-xs uppercase tracking-tighter">Thinking</div>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Engaging Reasoning Agents</p>
                        <p className="text-sm text-slate-500 font-medium italic">Analyzing complex financial structures and cross-referencing covenants for the underwriting memo...</p>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4">
                        <div className="h-full bg-blue-600 animate-progress"></div>
                      </div>
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
        @keyframes progress { 0% { width: 0%; } 50% { width: 70%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 10s infinite ease-in-out; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;
