import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_STRINGS } from '../data/translations';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface PaisaMitraChatProps {
  currentLang: SupportedLanguage;
}

export const PaisaMitraChat: React.FC<PaisaMitraChatProps> = ({ currentLang }) => {
  const t = UI_STRINGS[currentLang] || UI_STRINGS.hi;

  const initialGreetingByLang: Record<SupportedLanguage, string> = {
    hi: 'नमस्ते! मैं आपका "पैसा मित्र" (PaisaMitra) हूँ। बचत, बैंक खाता, सरकारी योजनाएं, FD/RD या किसी भी ऑनलाइन फ्रॉड के बारे में बेझिझक मुझसे अपनी भाषा में पूछें।',
    en: 'Hello! I am your PaisaMitra. Ask me anything about budgeting, bank accounts, government schemes, FD/RD, or verifying potential online frauds in simple language.',
    mr: 'नमस्कार! मी तुमचा "पैसा मित्र" आहे. बचत, बँक खाते, सरकारी योजना किंवा ऑनलाइन फसवणुकीबद्दल तुमच्या स्वतःच्या भाषेत मला कोणताही प्रश्न विचारा.',
    bn: 'নমস্কার! আমি আপনার "পয়সা মিত্র"। সঞ্চয়, ব্যাংক অ্যাকাউন্ট, সরকারি প্রকল্প বা অনলাইন প্রতারণা সম্পর্কে যেকোনো প্রশ্ন নির্ভয়ে করুন।',
    ta: 'வணக்கம்! நான் உங்கள் "பைசா மித்ரா". சேமிப்பு, வங்கி கணக்கு, அரசு திட்டங்கள் அல்லது ஆன்லைன் மோசடிகள் பற்றி எளிய தமிழில் என்னிடம் கேளுங்கள்.',
    te: 'నమస్కారం! నేను మీ "పైసా మిత్ర". పొదుపు, బ్యాంకింగ్, ప్రభుత్వ పథకాలు లేదా సైబర్ మోసాల గురించి ఏవైనా ప్రశ్నలు అడగండి.',
    gu: 'નમસ્તે! હું તમારો "પૈસા મિત્ર" છું. બચત, બેંકિંગ, સરકારી યોજનાઓ કે ઓનલાઇન ફ્રોડ વિશે મને તમારી ભાષામાં પ્રશ્ન પૂછો.',
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: initialGreetingByLang[currentLang] || initialGreetingByLang.hi,
    },
  ]);

  // Update welcome greeting when language changes if only welcome message is present
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: 'msg-welcome',
            role: 'model',
            text: initialGreetingByLang[currentLang] || initialGreetingByLang.hi,
          },
        ];
      }
      return prev;
    });
  }, [currentLang]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeSpeechId, setActiveSpeechId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions: Record<SupportedLanguage, string[]> = {
    hi: [
      'क्या QR कोड स्कैन करने से मुझे पैसे मिल सकते हैं?',
      'FD और RD में क्या अंतर है? कौन सा बेहतर है?',
      'साहूकार से कर्ज़ लूं या बैंक का MUDRA लोन?',
      'मोबाइल की EMI न भरने पर सिबिल स्कोर पर क्या असर पड़ता है?',
      'सुकन्या समृद्धि योजना में कितना ब्याज मिलता है?'
    ],
    en: [
      'Can I receive money by scanning a QR code?',
      'What is the difference between FD and RD?',
      'Should I borrow from a moneylender or take a Mudra loan?',
      'What happens if I miss a smartphone EMI payment?',
      'How does Sukanya Samriddhi Yojana protect my daughter?'
    ],
    mr: [
      'पैसे मिळवण्यासाठी क्यूआर कोड स्कॅन करावा लागतो का?',
      'एफडी आणि आरडी मध्ये काय फरक आहे?',
      'सावकारापेक्षा बँक कर्ज का चांगले आहे?',
      'सिबिल स्कोअर कसा सुधारायचा?'
    ],
    bn: [
      'টাকা পেতে কি কিউআর কোড স্ক্যান করতে হয়?',
      'এফডি এবং আরডি এর মধ্যে পার্থক্য কী?',
      'মুদ্রা লোন কীভাবে পাওয়া যায়?'
    ],
    ta: [
      'பணம் வரவு வைக்க QR குறியீட்டை ஸ்கேன் செய்ய வேண்டுமா?',
      'FD மற்றும் RD இடையே உள்ள வித்தியாசம் என்ன?',
      'முத்ரா கடன் எப்படி வாங்குவது?'
    ],
    te: [
      'డబ్బులు రావడానికి QR కోడ్ స్కాన్ చేయాలా?',
      'FD మరియు RD మధ్య తేడా ఏమిటి?',
      'ముద్రా రుణం ఎలా పొందాలి?'
    ],
    gu: [
      'પૈસા મેળવવા માટે ક્યુઆર કોડ સ્કેન કરવો પડે?',
      'FD અને RD વચ્ચે શું તફાવત છે?',
      'મુદ્રા લોન કેવી રીતે મળે?'
    ],
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: query.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          language: currentLang,
          conversationHistory: messages.slice(-4),
        }),
      });

      const data = await response.json();
      const botReply = data.reply || initialGreetingByLang[currentLang];

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: botReply,
        },
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'model',
          text: 'Error connecting to server. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (activeSpeechId === msgId) {
      window.speechSynthesis.cancel();
      setActiveSpeechId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    const langMap: Record<SupportedLanguage, string> = {
      hi: 'hi-IN',
      en: 'en-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      gu: 'gu-IN',
    };
    utterance.lang = langMap[currentLang] || 'hi-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setActiveSpeechId(null);
    utterance.onerror = () => setActiveSpeechId(null);

    setActiveSpeechId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const currentQuestions = quickQuestions[currentLang] || quickQuestions.hi;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Bot className="w-3.5 h-3.5" />
            <span>{t.chatHeaderTag}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
            {t.chatTitle}
          </h2>
          <p className="mt-1 text-sm text-stone-600 max-w-2xl">
            {t.chatSubtitle}
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs flex flex-col h-[580px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-stone-50/40">
          {messages.map((msg) => {
            const isBot = msg.role === 'model';
            const isSpeaking = activeSpeechId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isBot
                      ? 'bg-white border border-stone-200 text-stone-800 shadow-xs'
                      : 'bg-emerald-900 text-white shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {isBot && (
                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
                      <span>{t.botName}</span>
                      <button
                        type="button"
                        onClick={() => handleReadAloud(msg.id, msg.text)}
                        className="flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors"
                        title={isSpeaking ? t.stopBtn : t.listenBtn}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                            <span className="text-amber-800 font-medium">{t.stopBtn}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{t.listenBtn}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {!isBot && (
                  <div className="w-8 h-8 rounded-full bg-stone-700 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-stone-200 rounded-2xl px-4 py-3 text-xs text-stone-500 flex items-center gap-2 shadow-xs">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                <span>{t.chatThinking}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 py-2.5 bg-stone-100/70 border-t border-stone-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
          <span className="text-[11px] font-semibold text-stone-400 shrink-0">
            {t.quickQuestions}:
          </span>
          {currentQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-xs text-stone-700 bg-white hover:bg-emerald-50 hover:text-emerald-900 border border-stone-200 rounded-md whitespace-nowrap transition-colors shrink-0 font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={t.chatPlaceholder}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
          />

          <button
            type="button"
            disabled={!inputValue.trim() || isLoading}
            onClick={() => handleSendMessage()}
            className="px-4 py-2.5 bg-emerald-900 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>{t.send}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
