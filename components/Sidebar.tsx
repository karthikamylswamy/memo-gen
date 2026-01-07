
import React from 'react';

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const sections = [
  { id: 'header_borrower', label: 'Header & Borrower' },
  { id: 'purpose_position', label: 'Purpose & Position' },
  { id: 'exposure_raroc', label: 'Exposure & RAROC' },
  { id: 'counterparty_ratings', label: 'Counterparty & Ratings' },
  { id: 'industry_policy', label: 'Industry & Policy' },
  { id: 'facility_details', label: 'Facility Details' },
  { id: 'trading_reporting', label: 'Trading & Reporting' },
  { id: 'security_docs', label: 'Security & Documentation' },
  { id: 'covenants_funding', label: 'Covenants & Funding' },
  { id: 'terms_rates', label: 'Terms, Rates & Fees' },
  { id: 'syndication_sales', label: 'Syndication & Sales' },
  { id: 'borrower_narrative', label: 'Borrower Narrative' },
  { id: 'risks_analysis', label: 'Risks & Financials' },
  { id: 'justification_signoff', label: 'Justification & SignOff' },
  { id: 'preview', label: 'Final Document Preview' },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  return (
    <aside className="w-72 bg-slate-900 text-slate-300 h-full flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs shadow-lg shadow-blue-500/20">CM</div>
          CreditMemo AI
        </h1>
        <p className="text-[10px] mt-2 text-slate-500 uppercase tracking-widest font-bold">Underwriting v3.0</p>
      </div>
      <nav className="flex-1 py-4 overflow-y-auto custom-scrollbar">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full text-left px-6 py-3 text-sm transition-all hover:bg-slate-800 flex items-center gap-3 ${
              activeSection === section.id ? 'bg-slate-800 text-blue-400 border-r-4 border-blue-400 font-bold' : ''
            }`}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${activeSection === section.id ? 'bg-blue-400' : 'bg-slate-600'}`}></div>
            {section.label}
          </button>
        ))}
      </nav>
      <div className="p-4 bg-slate-800/50 text-[10px] text-slate-400 border-t border-slate-700">
        Syndicated Underwriting Desk
      </div>
    </aside>
  );
};
