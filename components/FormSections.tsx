
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
      className="block w-full rounded-lg border-slate-200 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
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
      className="block w-full rounded-lg border-slate-200 border p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm" 
    />
  </div>
);

const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="border-l-4 border-blue-600 pl-4 mb-6">
    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{title}</h2>
    {subtitle && <p className="text-slate-500 text-xs font-medium">{subtitle}</p>}
  </div>
);

const SaveButton = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex justify-end mt-10 pt-6 border-t border-slate-100">
      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 ${
          saved 
            ? 'bg-green-500 text-white shadow-green-500/20' 
            : 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800'
        }`}
      >
        {saved ? (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Section Saved
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Progress
          </>
        )}
      </button>
    </div>
  );
};

export const HeaderBorrowerSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleHeader = (e: any) => setMemo({ ...memo, header: { ...memo.header, [e.target.name]: e.target.value } });
  const handleBorrower = (e: any) => setMemo({ ...memo, borrowerDetails: { ...memo.borrowerDetails, [e.target.name]: e.target.value } });
  const handlePriority = (e: any) => setMemo({ ...memo, priority: { ...memo.priority, [e.target.name]: e.target.value } });
  
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Header & Borrower" subtitle="Primary identification and priority levels" />
      <div className="grid grid-cols-3 gap-4">
        <Input label="Credit Review ID" name="reviewId" value={memo.header?.reviewId} onChange={handleHeader} />
        <Input label="Draft Date" name="draftDate" type="date" value={memo.header?.draftDate} onChange={handleHeader} />
        <Input label="Review Type" name="reviewType" value={memo.header?.reviewType} onChange={handleHeader} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Priority Level" name="level" value={memo.priority?.level} onChange={handlePriority} />
        <Input label="Priority Date/Time" name="dateTime" value={memo.priority?.dateTime} onChange={handlePriority} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Borrower Name" name="name" value={memo.borrowerDetails?.name} onChange={handleBorrower} />
        <Input label="Originating Office" name="office" value={memo.borrowerDetails?.office} onChange={handleBorrower} />
        <Input label="Group" name="group" value={memo.borrowerDetails?.group} onChange={handleBorrower} />
        <Input label="Account Classification" name="accountClassification" value={memo.borrowerDetails?.accountClassification} onChange={handleBorrower} />
      </div>
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-2 gap-x-6 gap-y-2">
        {Object.keys(memo.borrowerDetails?.flags || {}).map(flag => (
          <label key={flag} className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1 rounded transition-colors">
            <input 
              type="checkbox" 
              checked={!!(memo.borrowerDetails?.flags as any)?.[flag]} 
              onChange={() => handleFlag(flag)} 
              className="rounded text-blue-600 focus:ring-blue-500" 
            />
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
  
  const defaultCreditPosition = {
    entity: "Main Borrower",
    previousAuth: 0,
    presentPosition: 0,
    creditRequested: 0,
    committedOverOneYear: 0,
    totalCredit: 0,
    tradingLine: 0
  };
  const creditPos = memo.creditPosition && memo.creditPosition.length > 0 
    ? memo.creditPosition 
    : [defaultCreditPosition];
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Purpose & Position" subtitle="Business rationale and current credit exposure" />
      <TextArea label="Business Purpose" name="businessPurpose" value={memo.purpose?.businessPurpose} onChange={handlePurpose} rows={4} />
      <TextArea label="Adjudication Considerations" name="adjudicationConsiderations" value={memo.purpose?.adjudicationConsiderations} onChange={handlePurpose} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Annual Review Status" name="annualReviewStatus" value={memo.purpose?.annualReviewStatus} onChange={handlePurpose} />
        <Input label="Purpose Breakdown" name="purposeBreakdown" value={memo.purpose?.purposeBreakdown} onChange={handlePurpose} />
      </div>
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-4 py-2 border-b">
          <h3 className="text-xs font-black uppercase text-slate-600">Credit Position Matrix</h3>
        </div>
        <div className="p-4 grid grid-cols-3 gap-4">
          <Input label="Previous Authorized" name="previousAuth" type="number" value={creditPos[0]?.previousAuth} onChange={(e: any) => {
            const cp = [...creditPos];
            cp[0] = { ...cp[0], previousAuth: parseFloat(e.target.value) || 0 };
            setMemo({ ...memo, creditPosition: cp });
          }} />
          <Input label="Present Position" name="presentPosition" type="number" value={creditPos[0]?.presentPosition} onChange={(e: any) => {
            const cp = [...creditPos];
            cp[0] = { ...cp[0], presentPosition: parseFloat(e.target.value) || 0 };
            setMemo({ ...memo, creditPosition: cp });
          }} />
          <Input label="Credit Requested" name="creditRequested" type="number" value={creditPos[0]?.creditRequested} onChange={(e: any) => {
            const cp = [...creditPos];
            cp[0] = { ...cp[0], creditRequested: parseFloat(e.target.value) || 0 };
            setMemo({ ...memo, creditPosition: cp });
          }} />
        </div>
      </div>
      <SaveButton />
    </div>
  );
};

export const ExposureRarocSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleRaroc = (e: any) => setMemo({ ...memo, raroc: { ...memo.raroc, [e.target.name]: e.target.value } });
  
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Exposure & RAROC" subtitle="Profitability metrics and group exposure" />
      <div className="grid grid-cols-2 gap-6 bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <Input label="LCC Approval Status" name="lccApproval" value={memo.raroc?.lccApproval} onChange={handleRaroc} />
        <Input label="Projected Economic RAROC (%)" name="projectedEconomicRaroc" type="number" value={memo.raroc?.projectedEconomicRaroc} onChange={handleRaroc} />
        <Input label="Projected Relationship RAROC (%)" name="projectedRelationshipRaroc" type="number" value={memo.raroc?.projectedRelationshipRaroc} onChange={handleRaroc} />
        <Input label="Economic Capital Required" name="economicCapitalRequired" type="number" value={memo.raroc?.economicCapitalRequired} onChange={handleRaroc} />
      </div>
      <TextArea label="Group Exposure Details" name="otherGroupExposure" value={memo.otherGroupExposure} onChange={(e: any) => setMemo({ ...memo, otherGroupExposure: e.target.value })} />
      <SaveButton />
    </div>
  );
};

export const CounterpartyRatingsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleInfo = (e: any) => setMemo({ ...memo, counterpartyInfo: { ...memo.counterpartyInfo, [e.target.name]: e.target.value } });
  const handleSummary = (e: any) => setMemo({ ...memo, riskAssessmentSummary: { ...memo.riskAssessmentSummary, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Counterparty & Ratings" subtitle="Legal and internal risk classifications" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Legal Name" name="legalName" value={memo.counterpartyInfo?.legalName} onChange={handleInfo} />
        <Input label="Account Type" name="accountType" value={memo.counterpartyInfo?.accountType} onChange={handleInfo} />
        <Input label="Country of Incorporation" name="countryOfIncorp" value={memo.counterpartyInfo?.countryOfIncorp} onChange={handleInfo} />
        <Input label="Customer Since" name="customerSince" value={memo.counterpartyInfo?.customerSince} onChange={handleInfo} />
      </div>
      <TextArea label="Address" name="address" value={memo.counterpartyInfo?.address} onChange={handleInfo} />
      <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-600">Risk Assessment Summary</h3>
        <Input label="Borrower Ratings" name="borrowerRatings" value={memo.riskAssessmentSummary?.borrowerRatings} onChange={handleSummary} />
        <TextArea label="Summary Text" name="summaryText" value={memo.riskAssessmentSummary?.summaryText} onChange={handleSummary} />
      </div>
      <SaveButton />
    </div>
  );
};

export const IndustryPolicySection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleIndustry = (e: any) => setMemo({ ...memo, industryFacilityDetails: { ...memo.industryFacilityDetails, [e.target.name]: e.target.value } });
  const handlePolicy = (e: any) => setMemo({ ...memo, policyTracking: { ...memo.policyTracking, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Industry & Policy" subtitle="Sector risk and compliance tracking" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="SIC Code" name="sicCode" value={memo.industryFacilityDetails?.sicCode} onChange={handleIndustry} />
        <Input label="Industry Risk" name="industryRisk" value={memo.industryFacilityDetails?.industryRisk} onChange={handleIndustry} />
        <Input label="Business Risk" name="businessRisk" value={memo.industryFacilityDetails?.businessRisk} onChange={handleIndustry} />
        <Input label="Financial Risk" name="financialRisk" value={memo.industryFacilityDetails?.financialRisk} onChange={handleIndustry} />
        <Input label="Environmental Risk" name="environmentalRisk" value={memo.industryFacilityDetails?.environmentalRisk} onChange={handleIndustry} />
        <Input label="Country Risk Rating" name="countryRiskRating" value={memo.industryFacilityDetails?.countryRiskRating} onChange={handleIndustry} />
      </div>
      <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4 shadow-xl">
        <h3 className="text-xs font-black uppercase text-slate-400">Policy Tracking</h3>
        <TextArea label="Policy Tracking Comments" name="policyTracking" value={memo.policyTracking?.policyTracking} onChange={handlePolicy} />
        <Input label="Material Wrong Way Risk" name="materialWrongWayRisk" value={memo.policyTracking?.materialWrongWayRisk} onChange={handlePolicy} />
      </div>
      <SaveButton />
    </div>
  );
};

export const FacilityDetailsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Facility Details" subtitle="Specific loan facility structures and maturity" />
      <div className="p-12 text-center bg-white border-2 border-dashed border-slate-200 rounded-3xl text-slate-400">
        <p className="font-bold text-sm">Facility Management Module</p>
        <p className="text-xs">Individual facility data can be synthesized from the Attached Documents.</p>
      </div>
      <SaveButton />
    </div>
  );
};

export const TradingReportingSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  // Fix: Removed the spread of (memo.tradingLines || {}) which introduced property optionality issues.
  // memo.tradingLines is guaranteed by the CreditMemo interface and INITIAL_MEMO_STATE.
  const handleTrading = (e: any) => {
    const value = parseFloat(e.target.value) || 0;
    setMemo({ 
      ...memo, 
      tradingLines: { 
        ...memo.tradingLines, 
        [e.target.name]: value 
      } 
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Trading & Reporting" subtitle="Market exposure and specialized reporting" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Unhedged Limit" name="unhedgedLimit" type="number" value={memo.tradingLines?.unhedgedLimit} onChange={handleTrading} />
        <Input label="Bond Limit" name="bondLimit" type="number" value={memo.tradingLines?.bondLimit} onChange={handleTrading} />
        <Input label="Interest Rate Swaps Notional" name="interestRateSwapsNotional" type="number" value={memo.tradingLines?.interestRateSwapsNotional} onChange={handleTrading} />
      </div>
      <TextArea label="Facility Reporting Comments" name="facilityReporting" value={memo.reviewCrmComments} onChange={(e: any) => setMemo({...memo, reviewCrmComments: e.target.value})} />
      <SaveButton />
    </div>
  );
};

export const SecurityDocsSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleDoc = (e: any) => setMemo({ ...memo, documentation: { ...memo.documentation, [e.target.name]: e.target.value } });
  const handleSec = (e: any) => setMemo({ ...memo, securityDetails: { ...memo.securityDetails, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Security & Documentation" subtitle="Collateral details and legal agreement status" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Agreement Type" name="agreementType" value={memo.documentation?.agreementType} onChange={handleDoc} />
        <Input label="Agreement Date" name="date" type="date" value={memo.documentation?.date} onChange={handleDoc} />
        <Input label="Status" name="status" value={memo.documentation?.status} onChange={handleDoc} />
        <Input label="Jurisdiction" name="jurisdiction" value={memo.documentation?.jurisdiction} onChange={handleDoc} />
      </div>
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-600">Security Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Security Code" name="code" value={memo.securityDetails?.code} onChange={handleSec} />
          <Input label="Seniority" name="seniority" value={memo.securityDetails?.seniority} onChange={handleSec} />
        </div>
        <TextArea label="Security Comments" name="comments" value={memo.securityDetails?.comments} onChange={handleSec} />
        <TextArea label="Collateral Comments" name="collateralComments" value={memo.securityDetails?.collateralComments} onChange={handleSec} />
      </div>
      <SaveButton />
    </div>
  );
};

export const CovenantsFundingSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleCov = (e: any) => setMemo({ ...memo, covenants: { ...memo.covenants, [e.target.name]: e.target.value } });
  const handleFun = (e: any) => setMemo({ ...memo, fundingConditions: { ...memo.fundingConditions, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Covenants & Funding" subtitle="Contractual requirements and draw conditions" />
      <div className="space-y-4">
        <TextArea label="Negative Covenants" name="negative" value={memo.covenants?.negative} onChange={handleCov} rows={4} />
        <TextArea label="Positive Covenants" name="positive" value={memo.covenants?.positive} onChange={handleCov} rows={4} />
        <TextArea label="Events of Default" name="eventsOfDefault" value={memo.covenants?.eventsOfDefault} onChange={handleCov} />
        <TextArea label="Reporting Requirements" name="reportingRequirements" value={memo.covenants?.reportingRequirements} onChange={handleCov} />
      </div>
      <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 space-y-4">
        <h3 className="text-xs font-black uppercase text-blue-700">Funding Conditions</h3>
        <Input label="Anticipated Closing Date" name="closingDate" type="date" value={memo.fundingConditions?.closingDate} onChange={handleFun} />
        <TextArea label="Conditions Precedent (Initial)" name="precedentInitial" value={memo.fundingConditions?.precedentInitial} onChange={handleFun} />
        <TextArea label="Ongoing Conditions" name="ongoing" value={memo.fundingConditions?.ongoing} onChange={handleFun} />
      </div>
      <SaveButton />
    </div>
  );
};

export const TermsRatesSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleRates = (e: any) => setMemo({ ...memo, interestRatesFees: { ...memo.interestRatesFees, [e.target.name]: e.target.value } });
  const handleTerms = (e: any) => setMemo({ ...memo, termRenewal: { ...memo.termRenewal, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Terms, Rates & Fees" subtitle="Pricing index, margins, and facility fees" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Applicable Margin" name="applicableMargin" value={memo.interestRatesFees?.applicableMargin} onChange={handleRates} />
        <Input label="Facility Fee" name="facilityFee" value={memo.interestRatesFees?.facilityFee} onChange={handleRates} />
        <Input label="Index Debt Ratings" name="indexDebtRatings" value={memo.interestRatesFees?.indexDebtRatings} onChange={handleRates} />
        <Input label="Upfront Fees" name="upfrontFees" value={memo.interestRatesFees?.upfrontFees} onChange={handleRates} />
      </div>
      <div className="bg-slate-50 p-6 rounded-xl border space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-600">Term & Renewal</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Tenor" name="tenor" value={memo.termRenewal?.tenor} onChange={handleTerms} />
          <Input label="Maturity Date" name="maturityDate" type="date" value={memo.termRenewal?.maturityDate} onChange={handleTerms} />
        </div>
        <TextArea label="Renewal Options" name="extensionOptions" value={memo.termRenewal?.extensionOptions} onChange={handleTerms} />
      </div>
      <SaveButton />
    </div>
  );
};

export const SyndicationSalesSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleSynd = (e: any) => setMemo({ ...memo, syndicationInfo: { ...memo.syndicationInfo, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Syndication & Sales" subtitle="Banking group roles and sales restrictions" />
      <div className="grid grid-cols-2 gap-4">
        <Input label="TD Role" name="tdRole" value={memo.syndicationInfo?.tdRole} onChange={handleSynd} />
        <Input label="Percentage Held" name="percentageTD" value={memo.syndicationInfo?.percentageTD} onChange={handleSynd} />
      </div>
      <TextArea label="Syndication Comments" name="comments" value={memo.syndicationInfo?.comments} onChange={handleSynd} />
      <Input label="Sales Restrictions" name="restriction" value={memo.salesRestrictions?.restriction} onChange={(e: any) => setMemo({...memo, salesRestrictions: {...memo.salesRestrictions, restriction: e.target.value}})} />
      <SaveButton />
    </div>
  );
};

export const BorrowerNarrativeSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleOverview = (e: any) => setMemo({ ...memo, borrowerOverview: { ...memo.borrowerOverview, [e.target.name]: e.target.value } });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Borrower Narrative" subtitle="Strategic company overview and events" />
      <TextArea label="Company Description" name="companyDescription" value={memo.borrowerOverview?.companyDescription} onChange={handleOverview} rows={6} />
      <TextArea label="Recent Events" name="recentEvents" value={memo.borrowerOverview?.recentEvents} onChange={handleOverview} />
      <TextArea label="Transaction Sources & Uses" name="transactionSourcesUses" value={memo.borrowerOverview?.transactionSourcesUses} onChange={handleOverview} />
      <SaveButton />
    </div>
  );
};

export const RisksAnalysisSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleNarrative = (e: any) => setMemo({ ...memo, financialRiskNarrative: { ...memo.financialRiskNarrative, [e.target.name]: e.target.value } });
  const handleOther = (e: any) => setMemo({ ...memo, [e.target.name]: e.target.value });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Risks & Financials" subtitle="Detailed qualitative and quantitative analysis" />
      <div className="space-y-6">
        <TextArea label="Moody's Financial Analysis" name="moodyAnalysis" value={memo.financialRiskNarrative?.moodyAnalysis} onChange={handleNarrative} rows={4} />
        <TextArea label="Ratio Analysis" name="ratioAnalysis" value={memo.financialRiskNarrative?.ratioAnalysis} onChange={handleNarrative} rows={4} />
        <TextArea label="Capital Structure" name="capitalStructure" value={memo.financialRiskNarrative?.capitalStructure} onChange={handleNarrative} rows={4} />
        <TextArea label="Liquidity Analysis" name="liquidity" value={memo.financialRiskNarrative?.liquidity} onChange={handleNarrative} rows={4} />
        <div className="grid grid-cols-2 gap-4">
          <TextArea label="Industry Risk Narrative" name="industryRiskNarrative" value={memo.industryRiskNarrative} onChange={handleOther} />
          <TextArea label="Business Risk Narrative" name="businessRiskNarrative" value={memo.businessRiskNarrative} onChange={handleOther} />
        </div>
      </div>
      <SaveButton />
    </div>
  );
};

export const JustificationSignoffSection: React.FC<SectionProps> = ({ memo, setMemo }) => {
  const handleJustification = (e: any) => setMemo({ ...memo, riskRatingJustification: { ...memo.riskRatingJustification, [e.target.name]: e.target.value } });
  const handleOther = (e: any) => setMemo({ ...memo, [e.target.name]: e.target.value });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <SectionTitle title="Justification & SignOff" subtitle="Final risk rating and administrative approval" />
      <div className="space-y-4">
        <TextArea label="MRA Output" name="mraOutput" value={memo.riskRatingJustification?.mraOutput} onChange={handleJustification} />
        <TextArea label="FCF Analysis" name="fcfAnalysis" value={memo.riskRatingJustification?.fcfAnalysis} onChange={handleJustification} />
        <TextArea label="Recommendation Rationale" name="recommendation" value={memo.riskRatingJustification?.recommendation} onChange={handleJustification} rows={4} />
        <TextArea label="Executive Summary" name="summaryRecommendation" value={memo.summaryRecommendation} onChange={handleOther} rows={4} />
        <TextArea label="Management Comments" name="managementComments" value={memo.managementComments} onChange={handleOther} />
      </div>
      <div className="grid grid-cols-2 gap-4 pt-8 border-t border-slate-200">
        <div className="p-4 border rounded-xl bg-slate-50">
          <Input label="Risk Analyst Name" name="riskAnalyst" value={memo.riskAssessmentSummary?.riskAnalyst} onChange={(e: any) => setMemo({...memo, riskAssessmentSummary: {...memo.riskAssessmentSummary, riskAnalyst: e.target.value}})} />
        </div>
        <div className="p-4 border rounded-xl bg-slate-50">
          <Input label="Review Date" name="submittedDate" type="date" value={memo.header?.submittedDate} onChange={(e: any) => setMemo({...memo, header: {...memo.header, submittedDate: e.target.value}})} />
        </div>
      </div>
      <SaveButton />
    </div>
  );
};
