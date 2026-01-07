
import { GoogleGenAI, Type } from "@google/genai";
import { CreditMemo, AttachedFile } from "../types";

export const geminiService = {
  async analyzeDocuments(files: AttachedFile[], currentData: CreditMemo): Promise<Partial<CreditMemo>> {
    // Initialize AI client right before use to ensure up-to-date configuration
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview';
    
    const parts = files.map(file => ({
      inlineData: {
        mimeType: file.type,
        data: file.base64.split(',')[1]
      }
    }));

    const systemInstruction = `
    You are a Lead Credit Underwriting System. Your mission is to extract and synthesize data from loan documents into a structured Credit Memo JSON object.
    
    STRICT SCHEMA ADHERENCE:
    The output MUST be a JSON object that matches the exact keys of the application state.
    
    EXAMPLE SCHEMA STRUCTURE (Ensure these keys are used):
    {
      "header": { "reviewId": string, "draftDate": string, "reviewType": string },
      "borrowerDetails": { "name": string, "office": string, "group": string, "flags": { "leveragedLending": boolean } },
      "tradingLines": { "unhedgedLimit": number, "bondLimit": number, "interestRateSwapsNotional": number },
      "raroc": { "lccApproval": string, "projectedEconomicRaroc": number },
      "financialRiskNarrative": { "moodyAnalysis": string, "ratioAnalysis": string, "capitalStructure": string, "liquidity": string },
      "riskRatingJustification": { "mraOutput": string, "recommendation": string, "fcfAnalysis": string },
      "covenants": { "negative": string, "positive": string, "financial": [] }
    }

    DIRECTIONS:
    1. EXTRACT: Find exact names, amounts, dates, and terms.
    2. ANALYZE: For narrative sections, provide professional banking commentary based on the provided financials.
    3. VALIDATE: Ensure numeric values are numbers, not strings.
    4. MISSING DATA: If a specific field is not found, omit it from the JSON object.
    `;

    const prompt = `
    Analyze the attached files and current state to populate the Syndicated Loan Credit Memo.
    Current Borrower: ${currentData.borrowerDetails?.name || 'Unknown'}
    Current Review ID: ${currentData.header?.reviewId}

    Task: Return a JSON object containing updates for Borrower details, Credit positions, Trading limits (including interestRateSwapsNotional), RAROC, Documentation, Covenants, and detailed Narrative Analysis.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [...parts, { text: prompt }]
        },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);
      return result;
    } catch (e) {
      console.error("Document synthesis engine failed to produce valid JSON", e);
      return {};
    }
  },

  async chatRefinement(message: string, history: any[], currentData: CreditMemo): Promise<{ text: string, updates?: Partial<CreditMemo> }> {
    // Initialize AI client right before use to ensure up-to-date configuration
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-flash-preview';
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are the Lead Underwriter.
        
        Current State of Memo: ${JSON.stringify(currentData)}
        
        YOUR TASK:
        - Respond to the user's query about the credit memo.
        - If the user asks for changes, provide the text answer AND a partial JSON object of the updates in the 'updates' field.
        - The 'updates' field MUST match the nested structure of the CreditMemo interface.
        - IMPORTANT: If updating trading lines, ensure you use the key 'interestRateSwapsNotional' correctly.
        - Return response in JSON format: { "text": "...", "updates": { ... } }`
      }
    });

    try {
      const response = await chat.sendMessage({ message });
      const text = response.text || "{}";
      const result = JSON.parse(text);
      return {
        text: result.text || "I've processed your request.",
        updates: result.updates || undefined
      };
    } catch (e) {
      return { text: "I encountered an error processing that update. Please try again." };
    }
  }
};
