export interface UserProfile {
  userId: string; // Non-editable custom formula: IOIS + PlanPrice + Initials + Counter (e.g. IOIS10RK01)
  fullName: string;
  mobileNumber: string;
  email: string;
  selectedPlanId: number;
  role: string;
  password?: string;
  photoUrl: string;
  googleDrivePhotoLink?: string;
  paymentScreenshotUrl?: string;
  googleDrivePaymentLink?: string;
  paymentUtr?: string;
  paymentStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
  address?: string;
  payoutUpi?: string;
  sponsorId?: string;
  emergencyContact?: string;
}

export interface HelpTicket {
  id: string;
  userId: string;
  userName: string;
  userMobile: string;
  subject: string;
  description: string;
  attachmentUrl?: string;
  googleDriveAttachmentLink?: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  adminReply?: string;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  tagline: string;
  price: number;
  instantPayout: number;
  percentage: number;
  themeColor: string;
  borderColor: string;
  bgGradient: string;
  resources: string[];
  description: string;
  realWorldScenario: string;
  storyTitle: string;
  storyPerson: string;
  storyDescription: string;
  recommendedFor: string;
  formLink: string;
  telegramLink: string;
}

export type PageType = 
  | 'home' 
  | 'study'
  | 'student-study'
  | 'plans' 
  | 'rtps-services'
  | 'weather'
  | 'news'
  | 'entertainment'
  | 'entertainment-chat'
  | 'panchang-rashifal'
  | 'mandi-market'
  | 'govt-schemes'
  | 'jobs'
  | 'register' 
  | 'idcard' 
  | 'calculator' 
  | 'assessment' 
  | 'parents' 
  | 'utilities' 
  | 'admin' 
  | 'dashboard' 
  | 'contact'
  | 'privacy-policy'
  | 'terms'
  | 'disclaimer';

export interface CommunityMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole?: string;
  senderPhoto?: string;
  senderPlanId?: number;
  channel: 'general' | 'earning' | 'students' | 'entertainment';
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'audio' | 'video';
  timestamp: string;
  reactions?: Record<string, number>;
}

export interface PlaylistItem {
  id: string;
  title: string;
  category: string;
  url: string;
  embedUrl: string;
  thumbnail?: string;
  duration?: string;
  addedBy?: string;
}

export interface WeatherData {
  city: string;
  state?: string;
  temp: number;
  feelsLike: number;
  condition: string;
  conditionCode: number;
  weatherType: 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'windy';
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  aqi: number;
  aqiStatus: string;
  pressure: number;
  visibility: number;
  sunrise: string;
  sunset: string;
  minTemp: number;
  maxTemp: number;
  descriptionHi: string;
  alert?: string;
  hourly: Array<{
    time: string;
    temp: number;
    icon: string;
    rainProb: number;
  }>;
  daily: Array<{
    day: string;
    date: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    weatherType: 'clear' | 'cloudy' | 'rain' | 'thunderstorm' | 'snow' | 'fog' | 'windy';
  }>;
}

export interface NewsChannel {
  id: string;
  name: string;
  language: string;
  category: string;
  logo: string;
  streamUrl: string;
  embedUrl: string;
  isLive: boolean;
  description: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: 'national' | 'state' | 'kisan' | 'business' | 'jobs' | 'tech' | 'sports';
  source: string;
  time: string;
  summary: string;
  link?: string;
  readTime: string;
}

export interface ENewspaper {
  id: string;
  name: string;
  language: string;
  frequency: string;
  url: string;
  epaperUrl: string;
  description: string;
  howToRead: string;
}

export interface RashiForecast {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  symbol: string;
  dateRange: string;
  element: string;
  luckyColor: string;
  luckyColorHex: string;
  luckyNumber: number;
  luckyTime: string;
  rating: number; // 1 to 5
  overview: string;
  careerFinance: string;
  healthWellness: string;
  loveFamily: string;
  remedy: string;
}

export interface MandiItem {
  id: string;
  cropName: string;
  variety: string;
  state: string;
  mandiName: string;
  arrivalQty: string;
  minPrice: number;
  modalPrice: number;
  maxPrice: number;
  unit: string;
  change: number; // percentage or diff
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

export interface BullionRate {
  city: string;
  gold24k: number; // per 10g
  gold22k: number;
  gold18k: number;
  silver1kg: number;
  silver10g: number;
  goldChange: number;
  silverChange: number;
  updatedAt: string;
}

export interface MarketDeal {
  id: string;
  category: string;
  item: string;
  mrp: number;
  bestPrice: number;
  discountPct: number;
  cheapestSource: string;
  expensiveSource: string;
  priceDiff: number;
  buyingTip: string;
  status: 'sasta' | 'mehnga' | 'neutral';
}

export interface GovtPortal {
  id: string;
  name: string;
  shortName: string;
  category: 'identity' | 'finance' | 'farmers' | 'health' | 'education' | 'jobs' | 'land' | 'transport';
  url: string;
  badge: string;
  purposeHindi: string;
  howToUse: string[];
  keyServices: string[];
}

export interface GovtRuleLaw {
  id: string;
  title: string;
  effectiveDate: string;
  category: string;
  summary: string;
  impact: string;
  officialRef?: string;
}

export interface JobAlert {
  id: string;
  title: string;
  department: string;
  type: 'govt' | 'private' | 'iois';
  totalPosts: string;
  qualification: string;
  ageLimit: string;
  salary: string;
  location: string;
  lastDate: string;
  applyUrl: string;
  notificationUrl?: string;
  isNew: boolean;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  subtitle?: string;
  options: {
    text: string;
    score: number;
    planHint?: number;
    insight: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  grounded?: boolean;
  searchQueries?: string[];
  sources?: Array<{ title: string; uri: string }>;
}

export type TickerSpeed = 'paused' | 'slow' | 'normal' | 'fast';

export interface TelegramConfig {
  enabled: boolean;
  botToken?: string;
  chatId?: string;
  adminSecret?: string;
  hasToken?: boolean;
}

export interface KnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  createdAt: string;
  hits?: number;
}

export interface InterviewSubmission {
  candidateName: string;
  candidateMobile: string;
  totalScore: number;
  recommendedPlanId: number;
  recommendedPlanName: string;
  answers: Array<{
    questionId: number;
    question: string;
    answerText: string;
    score: number;
  }>;
  submittedAt: string;
}

