
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { CreditMemo, AttachedFile } from "../types";

// Initialize the Gemini API client
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean base64 strings by removing data URL prefixes
 */
const cleanBase64 = (base64: string) => {
  return base64.includes(',') ? base64.split(',')[1] : base64;
};

export const geminiService = {
  /**
   * Performs a multi-agent analysis of documents to populate a Credit Memo.
   */
  async analyzeDocuments(files: AttachedFile[], currentData: CreditMemo): Promise<Partial<CreditMemo>> {
    const ai = getAI();
    const model = 'gemini-3-pro-preview'; // Best for complex underwriting logic

    // Prepare document parts for Gemini
    const fileParts = files.map(file => ({
      inlineData: {
        data: cleanBase64(file.base64),
        mimeType: file.type || 'application/pdf'
      }
    }));

    try {
      // STEP 1: Extraction Agent
      // Focuses on hard data: IDs, Dates, Numbers, and Tables.
      const extractionResponse = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              ...fileParts,
              { text: `
                AGENT ROLE: Extraction Specialist
                TASK: Extract all granular financial data, facility terms, and borrower identification from these documents.
                SCHEMA: Focus on the 'header', 'borrowerDetails', 'creditPosition', 'raroc', 'counterpartyInfo', 'industryFacilityDetails', 'tradingLines', 'documentation', and 'covenants' sections.
                
                Current state of memo: ${JSON.stringify(currentData.header)}
                
                Return a JSON object containing updates for these specific sections.
              `}
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });

      const extractionResults = JSON.parse(extractionResponse.text || "{}");

      // STEP 2: Underwriting & Narrative Agent
      // Focuses on synthesizing Moody's style analysis and business overviews.
      const synthesisResponse = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              ...fileParts,
              { text: `
                AGENT ROLE: Underwriting Narrator
                TASK: Based on the extracted facts (${JSON.stringify(extractionResults)}), synthesize professional banking narratives for the Credit Memo.
                SCHEMA: Focus on 'borrowerOverview', 'financialRiskNarrative', 'budgetSensitivity', and 'riskRatingJustification'.
                
                Ensure the tone is institutional, objective, and detailed.
                Return a JSON object containing the narrative updates.
              `}
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });

      const synthesisResults = JSON.parse(synthesisResponse.text || "{}");

      // STEP 3: Compliance & Risk Auditor
      // Scans for policy exceptions and risks.
      const complianceResponse = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              ...fileParts,
              { text: `
                AGENT ROLE: Compliance & Risk Auditor
                TASK: Review the synthesized memo data and original documents to identify regulatory risks and policy flags.
                SCHEMA: Focus on 'borrowerDetails.flags', 'compliance', and 'policyTracking'.
                
                Check for: Leveraged lending, strategic loan status, credit standards exceptions, and illegal tying.
                Return a JSON object containing the risk flag updates.
              `}
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const complianceResults = JSON.parse(complianceResponse.text || "{}");

      // Merge all agent outputs
      return {
        ...extractionResults,
        ...synthesisResults,
        ...complianceResults,
        // Ensure nested merges happen correctly in App.tsx deepMerge
      };

    } catch (error: any) {
      console.error("Multi-Agent Analysis Error:", error);
      throw new Error(`Underwriting Engine Error: ${error.message || "Unknown error occurred during document synthesis."}`);
    }
  },

  /**
   * Interactive chat for memo refinement using the Gemini model.
   */
  async chatRefinement(message: string, history: any[], currentData: CreditMemo): Promise<{ text: string, updates?: Partial<CreditMemo> }> {
    const ai = getAI();
    const model = 'gemini-3-flash-preview'; // Faster for chat

    const systemInstruction = `
      You are the TD Underwriting AI. You assist credit analysts in refining their syndicated loan credit memos.
      You have access to the current memo state: ${JSON.stringify(currentData)}
      
      If the user asks for changes (e.g., "Change the interest rate to 4.5%"), provide the text confirmation AND a JSON object in your response under an 'updates' field if you have the data.
      If you provide updates, return your response in this format:
      {
        "text": "Your conversational response here",
        "updates": { ...partial CreditMemo object... }
      }
      Otherwise, just return a string.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || "{}");
      return {
        text: result.text || "I processed your request.",
        updates: result.updates
      };
    } catch (error) {
      console.error("Chat Error:", error);
      return { text: "I'm having trouble processing that request right now." };
    }
  }
};
