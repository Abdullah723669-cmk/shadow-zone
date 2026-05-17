import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabase';

// Initialize Gemini with API Key
const apiKey = process.env.Gemini_API_Key || process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenerativeAI(apiKey);
}

export async function POST(request) {
  try {
    if (!ai) {
      return NextResponse.json({ error: 'Gemini API Key is not configured on the server.' }, { status: 500 });
    }

    const { messages } = await request.json(); // Array of { role, content }
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages array' }, { status: 400 });
    }

    // 1. Fetch current catalog products and stock
    const { data: products } = await supabase
      .from('products')
      .select('*, stock(*)');

    // Build catalog context for the AI
    let catalogText = 'Shadow Zone Product Catalog:\n';
    if (products) {
      products.forEach(p => {
        const totalStock = p.stock ? p.stock.reduce((acc, curr) => acc + curr.quantity, 0) : (p.stock_quantity || 0);
        let stockStatus = 'Out of Stock';
        if (totalStock >= 10) stockStatus = 'Available';
        else if (totalStock > 0) stockStatus = `Low Stock (${totalStock} items left)`;

        catalogText += `- **Product ID**: ${p.id}\n`;
        catalogText += `  **Name**: ${p.name}\n`;
        catalogText += `  **Category**: ${p.category} / ${p.sub_category}\n`;
        catalogText += `  **Price**: ৳${p.price} ${p.original_price ? `(Original: ৳${p.original_price})` : ''}\n`;
        catalogText += `  **Stock Status**: ${stockStatus}\n`;
        if (p.stock && p.stock.length > 0) {
          catalogText += `  **Sizes Available**: ${p.stock.map(s => `${s.size} (${s.quantity})`).join(', ')}\n`;
        }
        catalogText += `  **Description**: ${p.description || 'N/A'}\n\n`;
      });
    }

    const systemPrompt = `You are "Shadow", the official helpful AI Shopping Assistant for Shadow Zone, a premium clothing brand.

${catalogText}

Policies & Info:
1. **Offers**: We currently have a flat 10% discount on first-time orders using coupon code "WELCOME10". There are also seasonal sales with up to 50% discount on featured products.
2. **Return & Refund Policy**: We have a 7-day hassle-free return policy. Items must be unused, unwashed, and with all original tags attached. You can initiate a return from your dashboard or visit one of our physical stores. Return shipping cost is covered by the customer unless the product is defective.
3. **Delivery Charges**: Flat rate of ৳60 inside Dhaka, and ৳120 outside Dhaka.
4. **General Behavior**: Be conversational, stylish, and highly helpful. Emphasize active stock levels and warn users if a product is "Low Stock" or completely "Out of Stock" (do not allow them to purchase if it is stock out). Keep answers concise and user-friendly.`;

    // 2. Call Gemini
    const model = ai.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    });

    // Format chat history for Gemini SDK
    // Gemini expects history in format: { role: 'user' | 'model', parts: [{ text: '...' }] }
    let formattedHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Gemini API strict rule: history MUST start with 'user'.
    if (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(lastMessage);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (err) {
    console.error('Chatbot API Error:', err);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}
