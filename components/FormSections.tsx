
import React, { useState } from 'react';
import { CreditMemo } from '../types';

interface SectionProps {
  memo: CreditMemo;
  setMemo: (memo: CreditMemo) => void;
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
    {children}
  </label>
);

const Input = ({ label, name, value, onChange, type = "text", placeholder = "" }: any) => (
  <div>
    <Label>{label}</Label>
    <input 
      type={type} 
      name={name} 
      value={value ?? ""} 
      onChange={onChange} 
      placeholder={placeholder}
      className="block w-full rounded-lg border-slate-200 border p-2 text-sm focus:ring-2 focus:ring-[#008a00] outline-none transition-all shadow-sm" 
    />
  </div>
);

const TextArea = ({ label, name, value, onChange, rows = 3, placeholder = "" }: any) => (
  <div>
    <Label>{label}</Label>
    <textarea 
      name={name} 
      value={value ?? ""} 
      onChange={onChange} 
      rows={rows}
      placeholder={placeholder}
      className="block w-full rounded-lg border-slate-200 border p-2 text-sm focus:ring-2 focus:ring-[#008a00] outline-none transition-all shadow-sm" 
    />
  </div>
);

const SectionTitle = ({ title, subtitle, isSynthesized }: { title: string; subtitle?: string; isSynthesized?: boolean }) => (
  <div className="flex items-start justify-between border-l-4 border-[#008a00] pl-4 mb-6">
    <div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
      {subtitle && <p className="text-slate-500 text-xs font-medium">{subtitle}</p>}
    </div>
    {isSynthesized && (
      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 animate-in fade-in duration-1000">
        <div className="w-1.5 h-1.5 bg-[#00a100] rounded-full animate-pulse"></div>
        <span className="text-[9px] font-black uppercase tracking-widest">Synthesized</span>
      </div>
    )}
  </div>
);

const SaveButton = () => {
  const [status, setStatus] = useState<'idle' | 'confirming' | 'saved'>('idle');

  const handleInitialClick = () => {
    setStatus('confirming');
  };

  const handleCancel = () => {
    setStatus('idle');
  };

  const handleConfirm = () => {
    setStatus('saved');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-4">
        {status === 'confirming' && (
          <button 
            onClick={handleCancel}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
        )}
        
        <button 
          onClick={status === 'idle' ? handleInitialClick : (status === 'confirming' ? handleConfirm : undefined)}
          disabled={status === 'saved'}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 border-2 ${
            status === 'idle' 
              ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
              : status === 'confirming'
                ? 'bg-[#008a00] text-white border-[#008a00] animate-pulse shadow-green-500/20'
                : 'bg-green-50 text-green-700 border-green-200 cursor-default'
          }`}
        >
          {status === 'idle' && 'Save Progress'}
          {status === 'confirming' && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Confirm Save?
            </div>
          )}
          {status === 'saved' && (
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              Section Saved
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export const HeaderBorrowerSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleHeader = (e: any) => setMemo({ ...memo, header: { ...memo.header, [e.target.name]: e.target.value } });
  const handleBorrower = (e: any) => setMemo({ ...memo, borrowerDetails: { ...memo.borrowerDetails, [e.target.name]: e.target.value } });
  
  // Fixed type error: removed the fallback to an empty object which caused a mismatch with the full flags interface.
  const handleFlag = (flag: string) => {
    const flags = memo.borrowerDetails.flags;
    setMemo({ 
      ...memo, 
      borrowerDetails: { 
        ...memo.borrowerDetails, 
        flags: { 
          ...flags, 
          [flag]: !((flags as any)[flag]) 
        } 
      } 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Primary Borrower Details" subtitle="Identification, account classification, and risk flags" isSynthesized={!!memo.borrowerDetails?.name} />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Credit Review ID" name="reviewId" value={memo?.header?.reviewId} onChange={handleHeader} />
        <Input label="Draft Date" name="draftDate" type="date" value={memo?.header?.draftDate} onChange={handleHeader} />
        <Input label="Review Type" name="reviewType" value={memo?.header?.reviewType} onChange={handleHeader} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Borrower Name" name="name" value={memo?.borrowerDetails?.name} onChange={handleBorrower} />
        <Input label="Originating Office" name="office" value={memo?.borrowerDetails?.office} onChange={handleBorrower} />
        <Input label="Group" name="group" value={memo?.borrowerDetails?.group} onChange={handleBorrower} />
        <Input label="Account Classification" name="accountClassification" value={memo?.borrowerDetails?.accountClassification} onChange={handleBorrower} />
      </div>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-2 gap-x-6 gap-y-3">
        {Object.keys(memo?.borrowerDetails?.flags || {}).map(flag => (
          <label key={flag} className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 p-2 rounded-lg transition-colors">
            <input type="checkbox" checked={!!(memo.borrowerDetails?.flags as any)?.[flag]} onChange={() => handleFlag(flag)} className="rounded text-green-700 focus:ring-[#00a100]" />
            <span className="text-xs font-bold text-slate-700 capitalize">{flag.replace(/([A-Z])/g, ' $1')}</span>
          </label>
        ))}
      </div>
      <SaveButton />
    </div>
  );
};

export const PurposePositionSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handlePurpose = (e: any) => setMemo({ ...memo, purpose: { ...memo.purpose, [e.target.name]: e.target.value } });
  const creditPosArr = Array.isArray(memo?.creditPosition) ? memo.creditPosition : [];
  const creditPos = creditPosArr[0] || { entity: "", previousAuth: 0, presentPosition: 0, creditRequested: 0 };
  
  const handleCP = (e: any) => {
    const cp = [...(Array.isArray(memo.creditPosition) ? memo.creditPosition : [{entity: "Main Borrower", previousAuth: 0, presentPosition: 0, creditRequested: 0, committedOverOneYear: 0, totalCredit: 0, tradingLine: 0}])];
    cp[0] = { ...cp[0], [e.target.name]: parseFloat(e.target.value) || 0 };
    setMemo({...memo, creditPosition: cp});
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Purpose & Position" subtitle="Business rationale and credit position matrix" isSynthesized={!!memo.purpose?.businessPurpose} />
      <TextArea label="Business Purpose (New, Acquisition, etc.)" name="businessPurpose" value={memo?.purpose?.businessPurpose} onChange={handlePurpose} rows={4} />
      <TextArea label="Adjudication Considerations" name="adjudicationConsiderations" value={memo?.purpose?.adjudicationConsiderations} onChange={handlePurpose} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Annual Review Status" name="annualReviewStatus" value={memo?.purpose?.annualReviewStatus} onChange={handlePurpose} />
        <Input label="Purpose Breakdown" name="purposeBreakdown" value={memo?.purpose?.purposeBreakdown} onChange={handlePurpose} placeholder="New Facilities, Covenants, Maturity..." />
      </div>
      <div className="bg-white border-2 border-[#008a00] rounded-xl overflow-hidden shadow-sm">
        <div className="bg-[#008a00] px-4 py-2 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase text-white">Credit Position Table</h3>
          <span className="text-[10px] text-green-100 font-bold uppercase">Institutional Banking Matrix</span>
        </div>
        <div className="p-6 grid grid-cols-3 gap-6">
          <Input label="Previous Authorized" name="previousAuth" type="number" value={creditPos.previousAuth} onChange={handleCP} />
          <Input label="Present Position" name="presentPosition" type="number" value={creditPos.presentPosition} onChange={handleCP} />
          <Input label="Credit Requested" name="creditRequested" type="number" value={creditPos.creditRequested} onChange={handleCP} />
        </div>
      </div>
      <SaveButton />
    </div>
  );
};

export const ExposureRarocSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleRaroc = (e: any) => setMemo({ ...memo, raroc: { ...memo.raroc, [e.target.name]: e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Exposure & RAROC" subtitle="Economic capital and relationship metrics" isSynthesized={memo.raroc?.projectedEconomicRaroc > 0} />
      <div className="grid grid-cols-2 gap-6 bg-green-50/30 p-8 rounded-2xl border border-green-100">
        <Input label="LCC Approval Status" name="lccApproval" value={memo?.raroc?.lccApproval} onChange={handleRaroc} />
        <Input label="Projected Economic RAROC (%)" name="projectedEconomicRaroc" type="number" value={memo?.raroc?.projectedEconomicRaroc} onChange={handleRaroc} />
        <Input label="Projected Relationship RAROC (%)" name="projectedRelationshipRaroc" type="number" value={memo?.raroc?.projectedRelationshipRaroc} onChange={handleRaroc} />
        <Input label="Economic Capital Required" name="economicCapitalRequired" type="number" value={memo?.raroc?.economicCapitalRequired} onChange={handleRaroc} />
      </div>
      <SaveButton />
    </div>
  );
};

export const CounterpartyRatingsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleInfo = (e: any) => setMemo({ ...memo, counterpartyInfo: { ...memo.counterpartyInfo, [e.target.name]: e.target.value } });
  const handleSummary = (e: any) => setMemo({ ...memo, riskAssessmentSummary: { ...memo.riskAssessmentSummary, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Counterparty & Ratings" subtitle="Legal details and internal risk classifications" isSynthesized={!!memo.counterpartyInfo?.legalName} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Legal Name" name="legalName" value={memo?.counterpartyInfo?.legalName} onChange={handleInfo} />
        <Input label="Environmental Risk" name="environmentalRisk" value={memo?.counterpartyInfo?.environmentalRisk} onChange={handleInfo} />
        <Input label="Country of Incorporation" name="countryOfIncorp" value={memo?.counterpartyInfo?.countryOfIncorp} onChange={handleInfo} />
        <Input label="Basel Capital Adequacy" name="baselCapitalAdequacy" value={memo?.counterpartyInfo?.baselCapitalAdequacy} onChange={handleInfo} />
      </div>
      <TextArea label="Legal Address" name="address" value={memo?.counterpartyInfo?.address} onChange={handleInfo} />
      <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-600">Risk Assessment Summary</h3>
        <Input label="Borrower Ratings" name="borrowerRatings" value={memo?.riskAssessmentSummary?.borrowerRatings} onChange={handleSummary} />
        <Input label="Risk Analyst" name="riskAnalyst" value={memo?.riskAssessmentSummary?.riskAnalyst} onChange={handleSummary} />
        <TextArea label="RA File Summary" name="summaryText" value={memo?.riskAssessmentSummary?.summaryText} onChange={handleSummary} />
      </div>
      <SaveButton />
    </div>
  );
};

export const IndustryPolicySection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleIndustry = (e: any) => setMemo({ ...memo, industryFacilityDetails: { ...memo.industryFacilityDetails, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Industry & Policy" subtitle="TD SIC codes and governance risk" isSynthesized={!!memo.industryFacilityDetails?.sicCode} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="TD SIC Code" name="sicCode" value={memo?.industryFacilityDetails?.sicCode} onChange={handleIndustry} />
        <Input label="Industry Risk" name="industryRisk" value={memo?.industryFacilityDetails?.industryRisk} onChange={handleIndustry} />
        <Input label="Governance Risk" name="governanceRisk" value={memo?.industryFacilityDetails?.governanceRisk} onChange={handleIndustry} />
        <Input label="Country Risk Rating" name="countryRiskRating" value={memo?.industryFacilityDetails?.countryRiskRating} onChange={handleIndustry} />
      </div>
      <SaveButton />
    </div>
  );
};

export const FacilityTradingSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleTrading = (e: any) => setMemo({ ...memo, tradingLines: { ...memo.tradingLines, [e.target.name]: parseFloat(e.target.value) || 0 } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Facilities & Trading" subtitle="Granular facility info and specialized trading lines" isSynthesized={memo.tradingLines?.totalCredit > 0} />
      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <Input label="Unhedged Trading Limit" name="unhedgedLimit" type="number" value={memo?.tradingLines?.unhedgedLimit} onChange={handleTrading} />
        <Input label="Bond Trading Limit" name="bondLimit" type="number" value={memo?.tradingLines?.bondLimit} onChange={handleTrading} />
        <Input label="Sub-Total Trading Lines" name="subTotal" type="number" value={memo?.tradingLines?.subTotal} onChange={handleTrading} />
        <Input label="TOTAL CREDIT (Incl Daylights)" name="totalCredit" type="number" value={memo?.tradingLines?.totalCredit} onChange={handleTrading} />
      </div>
      <SaveButton />
    </div>
  );
};

export const SecurityDocsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleDoc = (e: any) => setMemo({ ...memo, documentation: { ...memo.documentation, [e.target.name]: e.target.value } });
  const handleSec = (e: any) => setMemo({ ...memo, securityDetails: { ...memo.securityDetails, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Security & Documentation" subtitle="Legal jurisdiction and collateral hierarchy" isSynthesized={!!memo.documentation?.agreementType} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Facility Agreement Type" name="agreementType" value={memo?.documentation?.agreementType} onChange={handleDoc} />
        <Input label="Legal Jurisdiction" name="jurisdiction" value={memo?.documentation?.jurisdiction} onChange={handleDoc} />
        <Input label="Seniority Level" name="seniority" value={memo?.securityDetails?.seniority} onChange={handleSec} />
        <Input label="Security Code" name="code" value={memo?.securityDetails?.code} onChange={handleSec} />
      </div>
      <TextArea label="Security Comments" name="comments" value={memo?.securityDetails?.comments} onChange={handleSec} />
      <TextArea label="Collateral Comments" name="collateralComments" value={memo?.securityDetails?.collateralComments} onChange={handleSec} />
      <SaveButton />
    </div>
  );
};

export const CovenantsFundingSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleCov = (e: any) => setMemo({ ...memo, covenants: { ...memo.covenants, [e.target.name]: e.target.value } });
  const handleFun = (e: any) => setMemo({ ...memo, fundingConditions: { ...memo.fundingConditions, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Covenants & Funding" subtitle="Negative, positive, and conditions precedent" isSynthesized={!!memo.covenants?.negative} />
      <TextArea label="Negative Covenants" name="negative" value={memo?.covenants?.negative} onChange={handleCov} rows={4} />
      <TextArea label="Positive Covenants" name="positive" value={memo?.covenants?.positive} onChange={handleCov} rows={4} />
      <div className="bg-green-50/20 p-6 rounded-xl border border-green-100 space-y-4">
        <h3 className="text-xs font-black uppercase text-green-700">Funding Conditions Precedent</h3>
        <TextArea label="Initial Draw Conditions" name="precedentInitial" value={memo?.fundingConditions?.precedentInitial} onChange={handleFun} />
        <TextArea label="Additional Draw Conditions" name="precedentAdditional" value={memo?.fundingConditions?.precedentAdditional} onChange={handleFun} />
      </div>
      <SaveButton />
    </div>
  );
};

export const RatesTermsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleRates = (e: any) => setMemo({ ...memo, interestRatesFees: { ...memo.interestRatesFees, [e.target.name]: e.target.value } });
  const handleRepay = (e: any) => setMemo({ ...memo, repayment: { ...memo.repayment, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Rates, Terms & Repayment" subtitle="Applicable margins, upfront fees, and amortization" isSynthesized={!!memo.interestRatesFees?.applicableMargin} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Applicable Margin" name="applicableMargin" value={memo?.interestRatesFees?.applicableMargin} onChange={handleRates} />
        <Input label="Facility Fee" name="facilityFee" value={memo?.interestRatesFees?.facilityFee} onChange={handleRates} />
        <Input label="Upfront Fees" name="upfrontFees" value={memo?.interestRatesFees?.upfrontFees} onChange={handleRates} />
        <Input label="Repayment Comments" name="comments" value={memo?.repayment?.comments} onChange={handleRepay} />
      </div>
      <SaveButton />
    </div>
  );
};

export const SyndicationSalesSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleSynd = (e: any) => setMemo({ ...memo, syndicationInfo: { ...memo.syndicationInfo, [e.target.name]: e.target.value } });
  const handleSales = (e: any) => setMemo({ ...memo, salesRestrictions: { ...memo.salesRestrictions, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Syndication & Sales" subtitle="TD role and banking group details" isSynthesized={!!memo.syndicationInfo?.tdRole} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="TD Role" name="tdRole" value={memo?.syndicationInfo?.tdRole} onChange={handleSynd} />
        <Input label="Banking Group" name="bankingGroup" value={memo?.syndicationInfo?.bankingGroup} onChange={handleSynd} />
        <Input label="Contractual Sales Restrictions" name="restriction" value={memo?.salesRestrictions?.restriction} onChange={handleSales} />
        <Input label="Minimum Assignment Amount" name="minAssignment" value={memo?.salesRestrictions?.minAssignment} onChange={handleSales} />
      </div>
      <SaveButton />
    </div>
  );
};

export const BorrowerOverviewSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleOverview = (e: any) => setMemo({ ...memo, borrowerOverview: { ...memo.borrowerOverview, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Borrower Overview" subtitle="Strategic company description and recent events" isSynthesized={!!memo.borrowerOverview?.companyDescription} />
      <TextArea label="Company Description" name="companyDescription" value={memo?.borrowerOverview?.companyDescription} onChange={handleOverview} rows={6} />
      <TextArea label="Recent Significant Events" name="recentEvents" value={memo?.borrowerOverview?.recentEvents} onChange={handleOverview} />
      <TextArea label="Transaction Sources & Uses" name="transactionSourcesUses" value={memo?.borrowerOverview?.transactionSourcesUses} onChange={handleOverview} />
      <SaveButton />
    </div>
  );
};

export const FinancialRiskSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleNarrative = (e: any) => setMemo({ ...memo, financialRiskNarrative: { ...memo.financialRiskNarrative, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Financial Risk Analysis" subtitle="Moody's insights, ratios, and capital structure" isSynthesized={!!memo.financialRiskNarrative?.moodyAnalysis} />
      <TextArea label="Moody's Financial Analysis" name="moodyAnalysis" value={memo?.financialRiskNarrative?.moodyAnalysis} onChange={handleNarrative} rows={4} />
      <TextArea label="Ratio Analysis" name="ratioAnalysis" value={memo?.financialRiskNarrative?.ratioAnalysis} onChange={handleNarrative} rows={4} />
      <TextArea label="Capital Structure Analysis" name="capitalStructure" value={memo?.financialRiskNarrative?.capitalStructure} onChange={handleNarrative} rows={4} />
      <TextArea label="Liquidity & Debt Maturity" name="liquidity" value={memo?.financialRiskNarrative?.liquidity} onChange={handleNarrative} rows={4} />
      <SaveButton />
    </div>
  );
};

export const BudgetSensitivitySection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleBudget = (e: any) => setMemo({ ...memo, budgetSensitivity: { ...memo.budgetSensitivity, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Budget & Sensitivity" subtitle="Base Case vs Downside Case analysis" isSynthesized={!!memo.budgetSensitivity?.baseCaseAnalysis} />
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Base Case Assumptions" name="baseCaseAssumptions" value={memo?.budgetSensitivity?.baseCaseAssumptions} onChange={handleBudget} />
        <TextArea label="Base Case Analysis" name="baseCaseAnalysis" value={memo?.budgetSensitivity?.baseCaseAnalysis} onChange={handleBudget} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextArea label="Downside Case Assumptions" name="downsideCaseAssumptions" value={memo?.budgetSensitivity?.downsideCaseAssumptions} onChange={handleBudget} />
        <TextArea label="Downside Case Analysis" name="downsideCaseAnalysis" value={memo?.budgetSensitivity?.downsideCaseAnalysis} onChange={handleBudget} />
      </div>
      <SaveButton />
    </div>
  );
};

export const JustificationSignoffSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleJust = (e: any) => setMemo({ ...memo, riskRatingJustification: { ...memo.riskRatingJustification, [e.target.name]: e.target.value } });
  const handleComp = (e: any) => setMemo({ ...memo, compliance: { ...memo.compliance, [e.target.name]: e.target.value } });
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <SectionTitle title="Justification & Compliance" subtitle="Final risk justification and regulatory sign-off" isSynthesized={!!memo.riskRatingJustification?.recommendation} />
      <TextArea label="MRA Output Justification" name="mraOutput" value={memo?.riskRatingJustification?.mraOutput} onChange={handleJust} />
      <TextArea label="Recommendation Rationale" name="recommendation" value={memo?.riskRatingJustification?.recommendation} onChange={handleJust} rows={4} />
      <div className="grid grid-cols-1 gap-4 bg-slate-900 text-white p-6 rounded-xl shadow-xl mt-8">
        <h3 className="text-xs font-black uppercase text-[#00a100] mb-4">Compliance Declaration</h3>
        <Input label="Declaration of Interest" name="declarationOfInterest" value={memo?.compliance?.declarationOfInterest} onChange={handleComp} />
        <Input label="Illegal Tying Arrangements" name="illegalTying" value={memo?.compliance?.illegalTying} onChange={handleComp} />
        <Input label="TD Directors Disclosure" name="tdDirectors" value={memo?.compliance?.tdDirectors} onChange={handleComp} />
      </div>
      <SaveButton />
    </div>
  );
};
