
import React from 'react';
import { CreditMemo } from '../types';

interface MemoPreviewProps {
  memo: CreditMemo;
}

const TableRow = ({ label, value, fullWidth = false, bold = false }: { label: string; value: any; fullWidth?: boolean; bold?: boolean }) => (
  <div className={`${fullWidth ? 'col-span-2' : ''} border-b border-gray-200 py-1.5 flex items-start gap-4 text-[10px]`}>
    <span className="text-gray-600 font-bold uppercase min-w-[160px] tracking-tight">{label}:</span>
    <span className={`${bold ? 'font-bold' : ''} text-gray-900 flex-1 whitespace-pre-wrap`}>{value || '---'}</span>
  </div>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="bg-slate-800 text-white px-3 py-2 text-[11px] font-black uppercase tracking-widest mt-10 mb-4 flex items-center justify-between">
    <span>{title}</span>
    <span className="text-[8px] opacity-50">TDS FORM 702-SYND</span>
  </h3>
);

const SubHeader = ({ title }: { title: string }) => (
  <h4 className="text-[9px] font-black uppercase text-slate-500 border-b-2 border-slate-200 mt-6 mb-3 tracking-widest bg-slate-50 px-2 py-0.5">
    {title}
  </h4>
);

export const MemoPreview: React.FC<MemoPreviewProps> = ({ memo }) => {
  const downloadAsDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Credit Memo</title><style>body { font-family: 'Times New Roman', serif; line-height: 1.2; } h3 { background: #333; color: #fff; padding: 5px; text-transform: uppercase; font-size: 14pt; } .row { border-bottom: 1px solid #ccc; padding: 2px; font-size: 10pt; } .bold { font-weight: bold; }</style></head><body>";
    const footer = "</body></html>";
    const sourceHTML = header + (document.getElementById("memo-document-root")?.innerHTML || "") + footer;
    
    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = `Memo_${memo.borrowerDetails.name || 'Draft'}.doc`;
    fileDownload.click();
    document.body.removeChild(fileDownload);
  };

  return (
    <div className="relative">
      <div className="sticky top-4 right-4 z-50 flex justify-end mb-6 gap-2 no-print">
        <button 
          onClick={downloadAsDoc}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-xs font-black shadow-2xl hover:bg-slate-800 transition-all border border-slate-700"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>
          EXPORT SYNDICATED REPORT (.DOC)
        </button>
      </div>

      <div id="memo-document-root" className="bg-white p-12 lg:p-20 shadow-2xl border border-gray-300 min-h-[11in] w-full max-w-5xl mx-auto font-serif text-gray-900 leading-snug print:shadow-none print:border-none">
        
        {/* TOP BRANDING */}
        <div className="flex justify-between items-start border-b-4 border-slate-900 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter">Corporate Credit Review</h1>
            <p className="text-xs font-bold text-slate-500 tracking-widest mt-1">SYNDICATED LOAN UNDERWRITING UNIT</p>
          </div>
          <div className="text-right text-[9px] uppercase font-bold text-slate-600">
            <p>Form ID: {memo.header.reviewId}</p>
            <p>Status: CONFIDENTIAL</p>
          </div>
        </div>

        {/* 1. Header Information */}
        <SectionHeader title="Header Information" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="Credit Review ID" value={memo.header.reviewId} bold />
          <TableRow label="Draft Date" value={memo.header.draftDate} />
          <TableRow label="Submitted Date" value={memo.header.submittedDate} />
          <TableRow label="Authorized Date" value={memo.header.authorizedDate} />
          <TableRow label="Processed Date" value={memo.header.processedDate} />
          <TableRow label="Corporate Credit Review" value={memo.header.reviewType} />
        </div>

        {/* 2. Priority & Comments */}
        <SectionHeader title="Priority & Comments" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="Priority" value={memo.priority.level} bold />
          <TableRow label="Date and Time" value={memo.priority.dateTime} />
          <TableRow label="Comments" value={memo.priority.comments} fullWidth />
        </div>

        {/* 3. Primary Borrower Details */}
        <SectionHeader title="Primary Borrower Details" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="Borrower Name" value={memo.borrowerDetails.name} bold />
          <TableRow label="Originating Office" value={memo.borrowerDetails.office} />
          <TableRow label="Group" value={memo.borrowerDetails.group} />
          <TableRow label="Account Classification" value={memo.borrowerDetails.accountClassification} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-y-2 bg-slate-50 p-3 border text-[9px] font-bold uppercase">
          {Object.entries(memo.borrowerDetails.flags).map(([key, val]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={`w-3 h-3 border ${val ? 'bg-slate-900' : 'bg-white'}`}></span>
              {key.replace(/([A-Z])/g, ' $1')}
            </div>
          ))}
        </div>

        {/* 4. Purpose */}
        <SectionHeader title="Purpose" />
        <div className="space-y-4">
          <TableRow label="Business Purpose" value={memo.purpose.businessPurpose} fullWidth />
          <TableRow label="Adjudication" value={memo.purpose.adjudicationConsiderations} fullWidth />
          <TableRow label="Annual Review Status" value={memo.purpose.annualReviewStatus} />
          <TableRow label="Review Purpose Breakdown" value={memo.purpose.purposeBreakdown} />
        </div>

        {/* 5. Credit Position Table */}
        <SectionHeader title="Credit Position Table" />
        <table className="w-full text-[9px] border-collapse border border-slate-300">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-300 p-1 text-left">Entity</th>
              <th className="border border-slate-300 p-1">Previous Authorization</th>
              <th className="border border-slate-300 p-1">Present Position</th>
              <th className="border border-slate-300 p-1">Credit Requested</th>
              <th className="border border-slate-300 p-1">Total Credit</th>
            </tr>
          </thead>
          <tbody>
            {(memo.creditPosition || []).map((cp, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-slate-300 p-1 text-left">{cp.entity}</td>
                <td className="border border-slate-300 p-1">${(cp.previousAuth || 0).toLocaleString()}</td>
                <td className="border border-slate-300 p-1">${(cp.presentPosition || 0).toLocaleString()}</td>
                <td className="border border-slate-300 p-1 font-bold">${(cp.creditRequested || 0).toLocaleString()}</td>
                <td className="border border-slate-300 p-1">${(cp.totalCredit || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 6. Group Exposure */}
        <SectionHeader title="Group Exposure" />
        <table className="w-full text-[9px] border-collapse border border-slate-300">
           <thead className="bg-slate-100">
             <tr>
               <th className="border border-slate-300 p-1">Entity</th>
               <th className="border border-slate-300 p-1">Total</th>
               <th className="border border-slate-300 p-1">Within Guidelines</th>
               <th className="border border-slate-300 p-1">Over/Under Guideline</th>
             </tr>
           </thead>
           <tbody>
             {(memo.groupExposure || []).map((ge, idx) => (
               <tr key={idx} className="text-center">
                 <td className="border border-slate-300 p-1">{ge.entity}</td>
                 <td className="border border-slate-300 p-1">${(ge.total || 0).toLocaleString()}</td>
                 <td className="border border-slate-300 p-1">{ge.withinGuidelines ? 'YES' : 'NO'}</td>
                 <td className="border border-slate-300 p-1">{ge.overUnderGuideline}</td>
               </tr>
             ))}
           </tbody>
        </table>

        {/* 8. RAROC SECTION */}
        <SectionHeader title="RAROC Section" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="LCC Approval Status" value={memo.raroc.lccApproval} />
          <TableRow label="Economic RAROC (%)" value={`${memo.raroc.projectedEconomicRaroc}%`} />
          <TableRow label="Relationship RAROC (%)" value={`${memo.raroc.projectedRelationshipRaroc}%`} />
          <TableRow label="Economic Capital Req" value={`$${(memo.raroc.economicCapitalRequired || 0).toLocaleString()}`} />
        </div>

        {/* 11. Counterparty Information */}
        <SectionHeader title="Counterparty Information" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="Legal Name" value={memo.counterpartyInfo.legalName} bold />
          <TableRow label="Address" value={memo.counterpartyInfo.address} fullWidth />
          <TableRow label="Account Type" value={memo.counterpartyInfo.accountType} />
          <TableRow label="Environmental Risk" value={memo.counterpartyInfo.environmentalRisk} />
          <TableRow label="Country of Incorp" value={memo.counterpartyInfo.countryOfIncorp} />
          <TableRow label="Basel Capital Adequacy" value={memo.counterpartyInfo.baselCapitalAdequacy} />
        </div>

        {/* 14. Industry and Facility Details */}
        <SectionHeader title="Industry and Facility Details" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="TD SIC Code" value={memo.industryFacilityDetails.sicCode} />
          <TableRow label="Industry Risk" value={memo.industryFacilityDetails.industryRisk} />
          <TableRow label="LTV Ratio" value={memo.industryFacilityDetails.ltv} />
          <TableRow label="Business Risk" value={memo.industryFacilityDetails.businessRisk} />
          <TableRow label="Financial Risk" value={memo.industryFacilityDetails.financialRisk} />
          <TableRow label="Gov Risk" value={memo.industryFacilityDetails.governanceRisk} />
        </div>

        {/* 23. Documentation */}
        <SectionHeader title="Documentation" />
        <div className="grid grid-cols-2 gap-x-10">
          <TableRow label="Agreement Type" value={memo.documentation.agreementType} />
          <TableRow label="Date of Agreement" value={memo.documentation.date} />
          <TableRow label="Status" value={memo.documentation.status} />
          <TableRow label="Jurisdiction" value={memo.documentation.jurisdiction} />
          <TableRow label="Agreement Comments" value={memo.documentation.agreementComments} fullWidth />
        </div>

        {/* COVENANTS */}
        <SectionHeader title="Covenants and Obligations" />
        <SubHeader title="Financial Covenants" />
        <table className="w-full text-[9px] border-collapse border border-slate-300">
           <thead className="bg-slate-100 uppercase">
             <tr>
               <th className="border border-slate-300 p-1">Covenant Name</th>
               <th className="border border-slate-300 p-1">Actual</th>
               <th className="border border-slate-300 p-1">Required</th>
               <th className="border border-slate-300 p-1">Compliance</th>
             </tr>
           </thead>
           <tbody>
             {(memo.covenants.financial || []).map((cf, idx) => (
               <tr key={idx} className="text-center">
                 <td className="border border-slate-300 p-1 text-left">{cf.name}</td>
                 <td className="border border-slate-300 p-1">{cf.actual}</td>
                 <td className="border border-slate-300 p-1">{cf.test}</td>
                 <td className="border border-slate-300 p-1 font-bold">{cf.inCompliance ? 'YES' : 'NO'}</td>
               </tr>
             ))}
           </tbody>
        </table>

        {/* 52. Financial Risk (NARRATIVE) */}
        <SectionHeader title="Financial Analysis" />
        <div className="space-y-6 text-[11px] leading-relaxed">
           <div><SubHeader title="Moody's Analysis" /><p>{memo.financialRiskNarrative.moodyAnalysis}</p></div>
           <div><SubHeader title="Ratio Analysis" /><p>{memo.financialRiskNarrative.ratioAnalysis}</p></div>
           <div><SubHeader title="Capital Structure" /><p>{memo.financialRiskNarrative.capitalStructure}</p></div>
           <div><SubHeader title="Liquidity" /><p>{memo.financialRiskNarrative.liquidity}</p></div>
        </div>

        {/* 55. Risk Rating Justification */}
        <SectionHeader title="Risk Rating Justification" />
        <div className="space-y-4">
          <TableRow label="MRA Output" value={memo.riskRatingJustification.mraOutput} fullWidth />
          <TableRow label="Peer Comparison" value={memo.riskRatingJustification.peerComp} fullWidth />
          <TableRow label="Recommendation" value={memo.riskRatingJustification.recommendation} bold fullWidth />
        </div>

        {/* 59-63. Sign-Off */}
        <SectionHeader title="Authorization and Sign-Off" />
        <div className="mt-12 grid grid-cols-3 gap-10">
          <div className="border-t border-slate-400 pt-2 text-[8px] uppercase font-black">
            Risk Analyst: {memo.riskAssessmentSummary.riskAnalyst || '________________'}<br/>Date: {new Date().toLocaleDateString()}
          </div>
          <div className="border-t border-slate-400 pt-2 text-[8px] uppercase font-black">
            Authorized Approver: ________________<br/>Date: ________________
          </div>
          <div className="border-t border-slate-400 pt-2 text-[8px] uppercase font-black">
            CAIRO Admin: {memo.cairoAdmin || '________________'}<br/>Date: ________________
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-32 border-t-2 border-slate-200 pt-6 text-center">
          <p className="text-[8px] tracking-[0.4em] uppercase font-black text-slate-400">Strictly Confidential - For Use within Syndicated Underwriting Group Only</p>
        </div>
      </div>
    </div>
  );
};
