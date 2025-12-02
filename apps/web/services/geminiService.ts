import { GoogleGenAI } from "@google/genai";
import { getInventoryWithDetails, INBOUND_ORDERS, BILLING_RULES } from './mockData';

// Initialize Gemini
// Note: In a real app, API_KEY should be in process.env. Using a placeholder logic here.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const generateAIResponse = async (userPrompt: string): Promise<string> => {
  if (!apiKey) {
    return "שגיאה: מפתח API חסר. נא להגדיר את process.env.API_KEY.";
  }

  // Context Injection (RAG-lite)
  // We serialize the current state of the WMS to let the model "see" the data.
  const inventory = getInventoryWithDetails();
  const inbound = INBOUND_ORDERS;
  const billing = BILLING_RULES;

  const contextData = JSON.stringify({
    inventorySummary: inventory.map(i => ({
      sku: i.product?.sku,
      name: i.product?.name,
      qty: i.quantity,
      location: i.location?.name,
      status: i.status
    })),
    pendingInbound: inbound.filter(o => o.status === 'pending').map(o => ({
      supplier: o.supplier_name,
      items: o.items.map(i => `${i.product_name} (${i.expected_qty})`)
    })),
    billingRules: billing.map(b => `${b.name}: ${b.fee_amount} ${b.currency}`)
  }, null, 2);

  const systemInstruction = `
    You are "LogiBot", an expert AI assistant for LogiSnap WMS (Israel).
    User Language: Hebrew (Always reply in Hebrew unless asked otherwise).
    Role: Help warehouse managers find stock, check orders, and understand billing.
    Context: You have access to the current warehouse state provided below in JSON format.
    
    Data Context:
    ${contextData}

    Rules:
    1. Be concise and professional.
    2. If asked about stock, look at the inventorySummary.
    3. If asked about incoming orders, look at pendingInbound.
    4. Provide specific numbers and locations.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2, // Low temperature for factual data retrieval
      }
    });

    return response.text || "לא התקבלה תשובה.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "מצטערים, אירעה שגיאה בתקשורת עם ה-AI.";
  }
};