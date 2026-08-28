'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function simulateChat(messages: {role: string, content: string}[], systemPrompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'GEMINI_API_KEY eksik. Lütfen .env.local dosyasına ekleyin.' };
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt 
    });

    const formattedHistory = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: formattedHistory,
    });

    const lastMessage = messages[messages.length - 1].content;
    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return { text };
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return { error: error.message || 'Bir hata oluştu.' };
  }
}
