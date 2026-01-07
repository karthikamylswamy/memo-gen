
import { CreditMemo } from './types';

export const INITIAL_MEMO_STATE: CreditMemo = {
  header: {
    reviewId: "REV-" + Math.floor(Math.random() * 100000),
    draftDate: new Date().toISOString().split('T')[0],
    submittedDate: "",
    authorizedDate: "",
    processedDate: "",
    reviewType: "Corporate Credit Review"
  },
  priority: {
    level: 'Standard',
    dateTime: new Date().toLocaleString(),
    comments: ""
  },
  borrowerDetails: {
    name: "",
    office: "",
    group: "",
    accountClassification: "",
    flags: {
      quarterlyReview: false,
      leveragedLending: false,
      strategicLoan: false,
      creditStandardsException: false,
      covenantLite: false,
      weakUnderwriting: false,
      tdsPolicyException: false
    }
  },
  purpose: {
    businessPurpose: "",
    adjudicationConsiderations: "",
    annualReviewStatus: "Current",
    purposeBreakdown: ""
  },
  creditPosition: [{
    entity: "Main Borrower",
    previousAuth: 0,
    presentPosition: 0,
    creditRequested: 0,
    committedOverOneYear: 0,
    totalCredit: 0,
    tradingLine: 0
  }],
  groupExposure: [],
  recentFinancials: [],
  raroc: {
    lccApproval: "Pending",
    projectedEconomicRaroc: 0,
    projectedRelationshipRaroc: 0,
    economicCapitalRequired: 0
  },
  reviewDates: {
    newAnnualDate: "",
    authorizedAnnualDate: "",
    interimReviewDate: "",
    comments: ""
  },
  counterpartyRatings: [],
  counterpartyInfo: {
    legalName: "",
    address: "",
    accountType: "",
    environmentalRisk: "",
    countryOfIncorp: "",
    countryOfRevenueRisk: "",
    businessEstablished: "",
    customerSince: "",
    baselCapitalAdequacy: ""
  },
  riskAssessmentSummary: {
    borrowerRatings: "",
    riskAnalyst: "",
    raFileName: "",
    summaryText: ""
  },
  publicRatings: [],
  industryFacilityDetails: {
    sicCode: "",
    industryRisk: "",
    security: "",
    ltv: "",
    businessRisk: "",
    financialRisk: "",
    environmentalRisk: "",
    countryRiskRating: "",
    governanceRisk: "",
    withinCountryLimits: true
  },
  policyTracking: {
    policyTracking: "",
    materialWrongWayRisk: ""
  },
  facilitySummary: [],
  tradingLines: {
    unhedgedLimit: 0,
    bondLimit: 0,
    interestRateSwapsNotional: 0,
    subTotal: 0,
    totalCredit: 0
  },
  otherGroupExposure: "",
  facilityReporting: [],
  guarantees: "",
  securityDetails: {
    code: "",
    seniority: "",
    comments: "",
    collateralComments: ""
  },
  documentation: {
    agreementType: "",
    date: "",
    status: "",
    amendments: "",
    agreementComments: "",
    documentationComments: "",
    jurisdiction: "",
    waiverOfJuryTrial: true
  },
  covenants: {
    negative: "",
    positive: "",
    financial: [],
    eventsOfDefault: "",
    reportingRequirements: ""
  },
  fundingConditions: {
    closingDate: "",
    precedentInitial: "",
    precedentAdditional: "",
    ongoing: ""
  },
  borrowers: [],
  bookingPoint: {
    principal: "",
    approval: "",
    comments: ""
  },
  interestRatesFees: {
    indexDebtRatings: "",
    applicableMargin: "",
    facilityFee: "",
    allInDrawn: "",
    upfrontFees: ""
  },
  termRenewal: {
    tenor: "",
    maturityDate: "",
    term: "",
    extensionOptions: "",
    termOutOptions: "",
    comments: ""
  },
  prepayment: {
    permitted: true,
    comments: ""
  },
  repayment: {
    amortizing: false,
    comments: ""
  },
  syndicationInfo: {
    tdRole: "",
    bankingGroup: "",
    amounts: "",
    percentageTD: "",
    comments: ""
  },
  facilityRiskRatings: {
    tdsGrade: "",
    natureOutput: "",
    industryStage: "",
    cashflowCovenant: "",
    marketStanding: "",
    realizabilityValue: "",
    ranking: "",
    frrComments: ""
  },
  salesRestrictions: {
    restriction: "",
    minAssignment: "",
    gracePeriods: ""
  },
  additionalFacilityInfo: "",
  facilityPurpose: "",
  enclosures: [],
  managementComments: "",
  keyRisksIssues: "",
  borrowerOverview: {
    companyDescription: "",
    recentEvents: "",
    transactionSourcesUses: "",
    financingPlan: ""
  },
  requestSummary: "",
  subordinationRisk: "",
  securityNarrative: "",
  industryRiskNarrative: "",
  businessRiskNarrative: "",
  financialRiskNarrative: {
    moodyAnalysis: "",
    ratioAnalysis: "",
    capitalStructure: "",
    liquidity: "",
    debtMaturity: "",
    specialItems: ""
  },
  leverageLendingAnalysis: "",
  budgetSensitivity: {
    baseCaseAssumptions: "",
    baseCaseAnalysis: "",
    downsideCaseAssumptions: "",
    downsideCaseAnalysis: ""
  },
  riskRatingJustification: {
    mraOutput: "",
    peerComp: "",
    creditFundamentals: "",
    fcfAnalysis: "",
    recommendation: ""
  },
  dueDiligence: "",
  pricingStrategy: "",
  summaryRecommendation: "",
  policyTrackingFinal: "",
  signOff: [],
  highestApprover: "",
  compliance: {
    declarationOfInterest: "",
    tdDirectors: "",
    illegalTying: ""
  },
  reviewCrmComments: "",
  cairoAdmin: "",
  subsequentDocs: ""
};
