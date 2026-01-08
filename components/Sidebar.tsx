
import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sections = [
  { id: 'header_borrower', label: 'Primary Borrower Details' },
  { id: 'purpose_position', label: 'Purpose & Position' },
  { id: 'exposure_raroc', label: 'Exposure & RAROC' },
  { id: 'counterparty_ratings', label: 'Counterparty Ratings' },
  { id: 'industry_policy', label: 'Industry & Policy' },
  { id: 'facility_trading', label: 'Facilities & Trading' },
  { id: 'security_docs', label: 'Security & Documentation' },
  { id: 'covenants_funding', label: 'Covenants & Funding' },
  { id: 'rates_terms', label: 'Rates, Terms & Repayment' },
  { id: 'syndication_sales', label: 'Syndication & Sales' },
  { id: 'borrower_overview', label: 'Borrower Overview' },
  { id: 'financial_risk', label: 'Financial Risk Analysis' },
  { id: 'budget_sensitivity', label: 'Budget & Sensitivity' },
  { id: 'justification_signoff', label: 'Justification & Compliance' },
  { id: 'preview', label: 'Final Document Preview' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <aside className="w-72 bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-[#008a00] rounded flex items-center justify-center text-xs font-black shadow-lg shadow-green-900/20">TD</div>
          <span className="tracking-tight">CreditMemo <span className="text-[#008a00]">AI</span></span>
        </h1>
        <p className="text-[10px] mt-2 text-slate-500 uppercase tracking-widest font-bold">Syndicated Underwriting</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full text-left px-6 py-3 text-sm transition-all hover:bg-slate-800 flex items-center gap-3 ${
              activeSection === section.id ? 'bg-slate-800 text-[#00a100] border-r-4 border-[#00a100] font-bold' : ''
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSection === section.id ? 'bg-[#00a100]' : 'bg-slate-600'}`}></div>
            {section.label}
          </button>
        ))}
      </nav>
      <div className="p-4 bg-slate-800/50 text-[10px] text-slate-400 border-t border-slate-700 font-medium">
        Institutional Banking Division
      </div>
    </aside>
  );
};
