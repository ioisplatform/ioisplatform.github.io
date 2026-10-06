export interface PlanDetail {
  id: string;
  planNumber: number;
  name: string;
  subtitle: string;
  tagline: string;
  category: 'starter' | 'career' | 'master';
  price: number;
  incentive: number;
  payoutPercent: number;
  badge?: string;
  isPopular?: boolean;
  isSupreme?: boolean;
  secretAccessCode?: string; // Internal verification only - never shown in UI
  colorScheme: {
    bg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    accent: string;
    button: string;
  };
  features: string[];
  kyaMilega: {
    title: string;
    description: string;
    icon: string;
  }[];
  kiseJaruratHai: {
    target: string;
    why: string;
  }[];
  successStory: {
    title: string;
    person: string;
    story: string;
    earnings: string;
  };
  curriculum?: PlanCurriculum;
}

export interface IOISService {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  category: 'government' | 'education' | 'utility' | 'tools' | 'entertainment';
  icon: string;
  description: string;
  actionText: string;
  badge?: string;
  urlOrType: string;
}

export interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  location: string;
  ipAddress?: string;
  loginTime: string;
  lastActive: string;
  isCurrent?: boolean;
}

export interface MemberProfile {
  name: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  memberId: string;
  rollNumber: string; // Strictly non-editable, generated based on chosen plan
  planId: string;
  planName?: string;
  amountPaid: number;
  paymentRef?: string; // UTR / Transaction reference number
  grade?: string;
  joinedDate: string;
  status: 'Pending' | 'Verified' | 'Active' | 'Rejected';
  role?: 'student' | 'admin';
  accessiblePlans: string[]; // List of plans kit user has authorization to access
  avatarUrl?: string;
  customQrUrl?: string;
  customQrImage?: string;
  bloodGroup?: string;
  emergencyPhone?: string;
  sponsorName?: string;
  sponsorId?: string;
  payoutUpi?: string;
  withdrawalUpi?: string; // UPI ID or Bank Account + IFSC for receiving payouts
  address?: string; // Full address: House / Village / City / District / State / PIN
  utrNumber?: string;
  screenshotUrl?: string;
  paymentScreenshotUrl?: string;
  paymentAddressProofUrl?: string;
  password?: string;
  designation?: string;
  activeSessions?: ActiveSession[];
  sessionRevokedAt?: string;
  completedLessons?: Record<string, string[]>; // planId -> array of completed lesson IDs
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPlan?: string;
}

export interface StudyWorkContentItem {
  id: string;
  title: string;
  category: string;
  type: 'pdf' | 'tool' | 'template' | 'guide' | 'video' | 'task';
  description: string;
  fileSize?: string;
  downloadUrl?: string;
  actionLabel: string;
  isCompleted?: boolean;
}

export interface StudyWorkModule {
  planId: string;
  planNumber: number;
  planName: string;
  headerTagline: string;
  overviewHindi: string;
  primaryResources: StudyWorkContentItem[];
  workTasks: {
    id: string;
    title: string;
    instruction: string;
    incentiveBonus?: string;
    status: 'pending' | 'completed';
  }[];
  communityNotice: string;
}

export interface AssessmentTask {
  id: string;
  type: 'mcq' | 'activity' | 'challenge';
  question: string;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  practicalTask?: string;
}

export interface RealWorldExample {
  title: string;
  description: string;
  practicalApplication: string;
  icon?: string;
}

export interface CurriculumPage {
  id: string;
  pageNumber: number;
  titleHindi: string;
  titleEnglish: string;
  subject: string;
  gradeOrLevel: string;
  badge: string;
  imageUrl: string;
  aiImagePrompt?: string;
  conceptOverview: {
    hindi: string;
    english: string;
  };
  realWorldExamples: RealWorldExample[];
  keyFactsAndRules: string[];
  vocabularyOrFormulas?: {
    term: string;
    definition: string;
    example: string;
  }[];
  assessmentTasks: AssessmentTask[];
  printableNotesText?: string;
}

export interface PlanCurriculum {
  planId: string;
  planNumber: number;
  planName: string;
  totalCurriculumPages: number;
  subjectsAvailable: string[];
  targetAudience: string;
  overviewSummary: string;
  curriculumPages: CurriculumPage[];
}
