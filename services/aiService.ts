
import { GoogleGenAI, Type } from "@google/genai";
import { CreditMemo, AttachedFile } from "../types";

export const aiService = {
  async analyzeDocuments(files: AttachedFile[], currentData: CreditMemo): Promise<Partial<CreditMemo>> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    // Using the most advanced Pro model for high-stakes financial analysis
    const model = 'gemini-3-pro-preview';
    
    const parts = files.map(file => ({
      inlineData: {
        mimeType: file.type,
        data: file.base64.split(',')[1]
      }
    }));

    const systemInstruction = `
    You are a specialized AI Underwriting Engine for Syndicated Loans. You operate as a trio of virtual agents:
    
    1. THE EXTRACTION AGENT: Scans raw documents for exact values (e.g., facility amounts, margins, dates).
    2. THE ANALYTICAL UNDERWRITER: Calculates ratios, assesses industry risk, and drafts the credit rationale.
    3. THE COMPLIANCE AGENT: Cross-references data against policy standards and identifies covenant breaches.

    STRICT OUTPUT PROTOCOL:
    - You MUST return a single JSON object that perfectly aligns with the CreditMemo state structure.
    - Narrative sections (Moody's Analysis, FCF, Recommendation) should be extensive, professional, and data-driven.
    - All numeric values MUST be numbers.
    - If a section is not found in the source, do not hallucinate; omit the keys.
    `;

    const prompt = `
    Analyze the provided loan documentation (Term Sheets, Financials, Credit Agreements).
    Current Memo Context: Borrower: ${currentData.borrowerDetails?.name || 'New Prospect'}, ID: ${currentData.header?.reviewId}.
    
    Perform a complete synthesis. Populate all relevant sections from Header to Sign-Off.
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
          // Enable Advanced Reasoning for complex underwriting tasks
          thinkingConfig: { thinkingBudget: 32768 } 
        }
      });

      const text = response.text || "{}";
      return JSON.parse(text);
    } catch (e) {
      console.error("AI Analysis Engine Error:", e);
      return {};
    }
  },

  async chatRefinement(message: string, history: any[], currentData: CreditMemo): Promise<{ text: string, updates?: Partial<CreditMemo> }> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-3-pro-preview'; // Use Pro for chat as well to handle complex logic queries
    
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: `You are the Lead Underwriting Agent. 
        Current State: ${JSON.stringify(currentData)}
        
        Respond to the user's queries about the deal. 
        If changes are requested (e.g. "Update the margin to 250bps"), provide the text confirmation AND the JSON 'updates' field.
        The 'updates' field must use the exact nested keys of the CreditMemo interface.
        
        Format: { "text": "Confirmation message", "updates": { "targetSection": { "targetKey": "New Value" } } }`
      }
    });

    try {
      const response = await chat.sendMessage({ message });
      const result = JSON.parse(response.text || "{}");
      return {
        text: result.text || "Request processed.",
        updates: result.updates || undefined
      };
    } catch (e) {
      return { text: "I encountered an error updating the memo structure. Please refine your request." };
    }
  }
};
