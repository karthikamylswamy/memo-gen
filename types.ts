
export interface CreditMemo {
  // 1. Header Information
  header: {
    reviewId: string;
    draftDate: string;
    submittedDate: string;
    authorizedDate: string;
    processedDate: string;
    reviewType: string;
  };
  // 2. Priority & Comments
  priority: {
    level: string;
    dateTime: string;
    comments: string;
  };
  // 3. Primary Borrower Details
  borrowerDetails: {
    name: string;
    office: string;
    group: string;
    accountClassification: string;
    flags: {
      quarterlyReview: boolean;
      leveragedLending: boolean;
      strategicLoan: boolean;
      creditStandardsException: boolean;
      covenantLite: boolean;
      weakUnderwriting: boolean;
      tdsPolicyException: boolean;
    };
  };
  // 4. Purpose
  purpose: {
    businessPurpose: string;
    adjudicationConsiderations: string;
    annualReviewStatus: string;
    purposeBreakdown: string; // New Facilities, Financial Covenants, Maturity Dates
  };
  // 5. Credit Position Table
  creditPosition: {
    entity: string;
    previousAuth: number;
    presentPosition: number;
    creditRequested: number;
    committedOverOneYear: number;
    totalCredit: number;
    tradingLine: number;
  }[];
  // 6. Group Exposure
  groupExposure: {
    entity: string;
    total: number;
    nonTrading: number;
    withinGuidelines: boolean;
    exposureGuidelines: string;
    totalExposure: number;
    overUnderGuideline: number;
    excessDetails: string;
  }[];
  // 7. Recent Financial Information and Covenants
  recentFinancials: {
    covenantName: string;
    mostRecentTest: string;
  }[];
  // 8. RAROC Section
  raroc: {
    lccApproval: string;
    projectedEconomicRaroc: number;
    projectedRelationshipRaroc: number;
    economicCapitalRequired: number;
  };
  // 9. Review Dates
  reviewDates: {
    newAnnualDate: string;
    authorizedAnnualDate: string;
    interimReviewDate: string;
    comments: string;
  };
  // 10. Counterparty Ratings Table
  counterpartyRatings: {
    name: string;
    brrRaReview: string;
    currentNewBrr: string;
    currentNewRa: string;
    policyModel: string;
  }[];
  // 11. Counterparty Information
  counterpartyInfo: {
    legalName: string;
    address: string;
    accountType: string;
    environmentalRisk: string;
    countryOfIncorp: string;
    countryOfRevenueRisk: string;
    businessEstablished: string;
    customerSince: string;
    baselCapitalAdequacy: string;
  };
  // 12. Risk Assessment Summary
  riskAssessmentSummary: {
    borrowerRatings: string;
    riskAnalyst: string;
    raFileName: string;
    summaryText: string;
  };
  // 13. Public Ratings Table
  publicRatings: {
    agency: string;
    issuerRating: string;
    seniorUnsecured: string;
    outlook: string;
    updatedLast: string;
  }[];
  // 14. Industry and Facility Details
  industryFacilityDetails: {
    sicCode: string;
    industryRisk: string;
    security: string;
    ltv: string;
    businessRisk: string;
    financialRisk: string;
    environmentalRisk: string;
    countryRiskRating: string;
    governanceRisk: string;
    withinCountryLimits: boolean;
  };
  // 15. Policy Tracking
  policyTracking: {
    policyTracking: string;
    materialWrongWayRisk: string;
  };
  // 16. Facility Summary and Facility Info
  facilitySummary: {
    number: string;
    description: string;
    previousAuthorized: number;
    presentPosition: number;
    creditRequested: number;
    maturity: string;
    syndication: string;
    participantPct: number;
  }[];
  // 17. Trading Lines
  tradingLines: {
    unhedgedLimit: number;
    bondLimit: number;
    interestRateSwapsNotional: number;
    subTotal: number;
    totalCredit: number;
  };
  // 18. Other Group Exposure
  otherGroupExposure: string;
  // 19. Facility Reporting
  facilityReporting: {
    number: string;
    liquidityFacility: string;
    creditStandard: string;
    additionalDetails: string;
    securedCRE: boolean;
    specializedLending: string;
  }[];
  // 20. Guarantors/Guarantees
  guarantees: string;
  // 21-22. Security & Collateral
  securityDetails: {
    code: string;
    seniority: string;
    comments: string;
    collateralComments: string;
  };
  // 23. Documentation
  documentation: {
    agreementType: string;
    date: string;
    status: string;
    amendments: string;
    agreementComments: string;
    documentationComments: string;
    jurisdiction: string;
    waiverOfJuryTrial: boolean;
  };
  // 24-28. Covenants, Defaults, Reporting
  covenants: {
    negative: string;
    positive: string;
    financial: {
      name: string;
      comments: string;
      type: string;
      valueDate: string;
      actual: string;
      relation: string;
      test: string;
      inCompliance: boolean;
    }[];
    eventsOfDefault: string;
    reportingRequirements: string;
  };
  // 29. Funding Conditions
  fundingConditions: {
    closingDate: string;
    precedentInitial: string;
    precedentAdditional: string;
    ongoing: string;
  };
  // 30. Borrowers
  borrowers: {
    name: string;
    principal: string;
    maxUsage: string;
    countryUltimateRisk: string;
    comments: string;
  }[];
  // 31. Booking Point
  bookingPoint: {
    principal: string;
    approval: string;
    comments: string;
  };
  // 32. Booking Options
  bookingOptions: {
    instrumentTypes: string;
    currencies: string;
    lcSublimit: string;
    competitiveAdvance: string;
  };
  // 33. Interest Rates and Fees
  interestRatesFees: {
    indexDebtRatings: string;
    applicableMargin: string;
    facilityFee: string;
    allInDrawn: string;
    upfrontFees: string;
  };
  // 34. Term and Renewal
  termRenewal: {
    tenor: string;
    maturityDate: string;
    term: string;
    extensionOptions: string;
    termOutOptions: string;
    comments: string;
  };
  // 35. Prepayment
  prepayment: {
    permitted: boolean;
    comments: string;
  };
  // 36. Repayment
  repayment: {
    amortizing: boolean;
    comments: string;
  };
  // 37. Syndication Information
  syndicationInfo: {
    tdRole: string;
    bankingGroup: string;
    amounts: string;
    percentageTD: string;
    comments: string;
  };
  // 38. Facility Risk Ratings
  facilityRiskRatings: {
    tdsGrade: string;
    natureOutput: string;
    industryStage: string;
    cashflowCovenant: string;
    marketStanding: string;
    realizabilityValue: string;
    ranking: string;
    frrComments: string;
  };
  // 39. Sales Restrictions
  salesRestrictions: {
    restriction: string;
    minAssignment: string;
    gracePeriods: string;
  };
  // 40-41. Additional & Purpose
  additionalFacilityInfo: string;
  facilityPurpose: string;
  // 42. Enclosures
  enclosures: {
    type: string;
    attachments: string;
    comments: string;
  }[];
  // 43-45. Comments & Risks
  managementComments: string;
  keyRisksIssues: string;
  // 46. Borrower Overview
  borrowerOverview: {
    companyDescription: string;
    recentEvents: string;
    transactionSourcesUses: string;
    financingPlan: string;
  };
  // 47-51. Narrative Summaries
  requestSummary: string;
  subordinationRisk: string;
  securityNarrative: string;
  industryRiskNarrative: string;
  businessRiskNarrative: string;
  // 52. Financial Risk
  financialRiskNarrative: {
    moodyAnalysis: string;
    ratioAnalysis: string;
    capitalStructure: string;
    liquidity: string;
    debtMaturity: string;
    specialItems: string;
  };
  // 53-54. Analysis Cases
  leverageLendingAnalysis: string;
  budgetSensitivity: {
    baseCaseAssumptions: string;
    baseCaseAnalysis: string;
    downsideCaseAssumptions: string;
    downsideCaseAnalysis: string;
  };
  // 55. Risk Rating Justification
  riskRatingJustification: {
    mraOutput: string;
    peerComp: string;
    creditFundamentals: string;
    fcfAnalysis: string;
    recommendation: string;
  };
  // 56-58. Finale
  dueDiligence: string;
  pricingStrategy: string;
  summaryRecommendation: string;
  // 59-63. Compliance & Signoff
  policyTrackingFinal: string;
  signOff: {
    name: string;
    title: string;
    date: string;
  }[];
  highestApprover: string;
  compliance: {
    declarationOfInterest: string;
    tdDirectors: string;
    illegalTying: string;
  };
  reviewCrmComments: string;
  cairoAdmin: string;
  subsequentDocs: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface AttachedFile {
  name: string;
  type: string;
  base64: string;
}
