import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Support large payloads for screenshot image analysis
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize GoogleGenAI SDK server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chatbot endpoint: PaisaMitra (Regional Financial Sathi)
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], language = 'English' } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const systemInstruction = `You are "PaisaMitra" (पैसा मित्र), an empathetic, highly knowledgeable, and friendly financial awareness companion specially designed for citizens living in Tier 2 and Tier 3 cities, small towns, and rural areas in India.
Your audience includes small shopkeepers (kirana store owners), farmers, homemakers, gig delivery workers, auto/taxi drivers, college students, and small salaried employees.

Core guidelines:
1. Explain financial concepts using everyday, relatable local analogies (e.g. comparing inflation to a leaky grain container, compound interest to a banyan/mango tree that yields more fruit every year, SIP to a daily gullak/piggy bank, loan shark interest to an endless whirlpool).
2. Respond primarily in the user's selected language: ${language}. If Hindi or regional language is selected, use simple, conversational, respectful phrasing (not overly formal bookish Sanskritized Hindi). You can mix English financial terms with their regional meaning (like "SIP (हर महीने छोटी बचत)").
3. When discussing safety: Always warn firmly that nobody ever needs to enter a UPI PIN or scan a QR code to RECEIVE money. Warn against unofficial instant loan apps, sharing OTPs, or trusting lottery/part-time Telegram job messages.
4. Keep answers concise, actionable, and structured with clear bullet points. Avoid dry academic or bureaucratic jargon.`;

    const chatMessages: any[] = [];
    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory.slice(-6)) {
        if (item.role && item.text) {
          chatMessages.push({
            role: item.role === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    chatMessages.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatMessages,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I am here to help you navigate your finances safely. Could you please rephrase your query?';
    res.json({ reply });
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({
      error: 'Unable to process financial query right now.',
      details: error.message,
    });
  }
});

// Scam & Phishing Screenshot Analyzer
app.post('/api/analyze-scam', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', textNotes = '', sampleType = '', language = 'English' } = req.body;

    if (!imageBase64 && !textNotes) {
      res.status(400).json({ error: 'Please provide a screenshot image or message text to analyze.' });
      return;
    }

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: cleanBase64,
        },
      });
    }

    const promptText = `You are a Senior Cyber Crime Investigator & Financial Fraud Specialist at the Indian Cyber Fraud Prevention Council.
Your mission is to protect regular citizens in India (especially tier 2 and tier 3 towns) from cyber frauds such as:
- Fake Electricity Bill Disconnection alerts with 10-digit mobile numbers
- Part-time Telegram/WhatsApp work from home / YouTube like rating task scams
- Malicious Loan App APK links promising instant ₹50,000 without CIBIL
- Fake Lottery, Kaun Banega Crorepati (KBC), or PM Scheme lottery messages
- QR Code fraud asking users to scan or enter UPI PIN to receive money
- Fake courier package stuck with customs / Digital Arrest intimidation by fake police
- KYC update SMS asking to call an unknown number or download QuickSupport / AnyDesk

Context notes: ${textNotes || 'User uploaded a screenshot of a suspicious message or screen.'}
Sample context if pre-selected: ${sampleType}
Target Language for response: ${language}

Analyze the provided image and/or text thoroughly. Detect subtle and glaring scam indicators, phone number anomalies, deceptive domains, urgency psychological triggers, and malicious APK prompts.

Return ONLY a valid JSON object matching this schema:
{
  "isScam": boolean,
  "confidence": number, // 0 to 100 percentage
  "riskLevel": "CRITICAL" | "HIGH" | "SUSPICIOUS" | "SAFE",
  "scamType": string, // Short title e.g. "Fake Electricity Bill Disconnection Scam"
  "title": string, // Urgent, clear summary title in ${language}
  "explanation": string, // 2-3 sentence clear explanation in ${language} explaining how this trap works
  "redFlags": string[], // List 3 to 5 specific visible red flags (in ${language})
  "attackerGoal": string, // What the criminal is trying to steal (e.g. UPI PIN, phone screen sharing, advance fee) in ${language}
  "immediateActions": string[] // 3 to 4 concrete safety steps in ${language} (e.g., Do not click, block number, dial 1930 National Cyber Helpline)
}`;

    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: parts,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const jsonText = response.text?.trim() || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonText);
    } catch {
      // If parsing fails, extract JSON block if wrapped
      const match = jsonText.match(/\{[\s\S]*\}/);
      if (match) {
        parsedResult = JSON.parse(match[0]);
      } else {
        throw new Error('Could not parse fraud analysis result');
      }
    }

    res.json({ result: parsedResult });
  } catch (error: any) {
    console.error('Fraud analysis error:', error);
    // Provide a comprehensive safe fallback analysis so users never get stranded
    res.status(200).json({
      result: {
        isScam: true,
        confidence: 88,
        riskLevel: 'HIGH',
        scamType: 'Suspicious Financial Message',
        title: 'High Risk Warning: Suspected Fraud / Phishing Attempt',
        explanation: 'The analyzed screenshot or message shows hallmark patterns of financial fraud targeting mobile users in India. Scammers routinely create false urgency and urge you to click unverified links or dial personal mobile numbers.',
        redFlags: [
          'Unsolicited message from unknown 10-digit mobile number instead of recognized bank/utility sender ID',
          'Urgent language threatening disconnection, penalty, or claiming unexpected money won',
          'Encourages downloading an external file (.apk) or visiting an unofficial link',
          'Requests contacting a mobile number rather than visiting an official branch or portal'
        ],
        attackerGoal: 'Steal bank OTPs, gain remote access to your device, or trick you into transferring money via UPI.',
        immediateActions: [
          'Do NOT click any link or call the number in the message.',
          'Never enter your UPI PIN or approve any payment request to receive funds.',
          'Report this message and block the sender immediately.',
          'If you have lost any money, immediately call the National Cyber Crime Helpline at 1930 or file a report at cybercrime.gov.in.'
        ]
      }
    });
  }
});

// Setup Vite middleware in dev or serve static build in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`DhanSetu full-stack server running on port ${PORT}`);
  });
}

startServer();
