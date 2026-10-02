export type SupportedLanguage = 'en' | 'hi' | 'mr' | 'bn' | 'ta' | 'te' | 'gu';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export type TermCategory = 'all' | 'banking' | 'savings_investment' | 'loans_debt' | 'safety_scams' | 'govt_schemes';

export interface GlossaryTerm {
  id: string;
  term: string;
  localizedTerm: Record<SupportedLanguage, string>;
  category: TermCategory;
  shortDefinition: Record<SupportedLanguage, string>;
  desiAnalogy: Record<SupportedLanguage, string>;
  cautionOrTip: Record<SupportedLanguage, string>;
  tags: string[];
}

export interface QuizQuestion {
  question: Record<SupportedLanguage, string>;
  options: Record<SupportedLanguage, string[]>;
  correctIndex: number;
  explanation: Record<SupportedLanguage, string>;
}

export interface GuideItem {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: 'basics' | 'savings' | 'investment' | 'loans' | 'cybersecurity';
  readTimeMinutes: number;
  videoDuration: string;
  youtubeId: string;
  summary: Record<SupportedLanguage, string>;
  bulletPoints: Record<SupportedLanguage, string[]>;
  quiz: QuizQuestion[];
}

export interface Transaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: 'ration' | 'rent_utility' | 'school_fees' | 'medical' | 'farming_business' | 'savings_gullak' | 'transport' | 'other';
  amount: number;
  note: string;
}

export interface ScamAnalysisResult {
  isScam: boolean;
  confidence: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'SUSPICIOUS' | 'SAFE';
  scamType: string;
  title: string;
  explanation: string;
  redFlags: string[];
  attackerGoal: string;
  immediateActions: string[];
}

export interface SampleScam {
  id: string;
  title: Record<SupportedLanguage, string>;
  category: Record<SupportedLanguage, string>;
  previewText: Record<SupportedLanguage, string>;
  imageBase64Fallback?: string;
  mockAnalysis: Record<SupportedLanguage, ScamAnalysisResult>;
}

export interface ScamAlertItem {
  id: string;
  title: Record<SupportedLanguage, string>;
  reportedIn: Record<SupportedLanguage, string>;
  risk: Record<SupportedLanguage, string>;
  summary: Record<SupportedLanguage, string>;
  preventiveAdvice: Record<SupportedLanguage, string>;
}
