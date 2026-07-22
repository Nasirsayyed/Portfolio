export interface SocialLink {
  label: string;
  url: string;
  icon: 'github' | 'linkedin' | 'mail' | 'phone' | 'map-pin' | 'code';
}

export interface PersonalInfo {
  name: string;
  initials: string;
  title: string;
  roles: string[];
  location: string;
  email: string;
  phone: string;
  availability: string;
  summary: string;
  valueProposition: string;
  resumeUrl: string;
  socials: SocialLink[];
}

export interface StatItem {
  label: string;
  value: number;
  suffix?: string;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  period: string;
  location?: string;
  current: boolean;
  summary: string;
  highlights: string[];
  technologies: string[];
}

export type SkillCategory =
  | 'Languages'
  | 'Frameworks'
  | 'Front-End'
  | 'APIs & Integration'
  | 'Databases'
  | 'Tools'
  | 'Practices'
  | 'Cloud';

export interface Skill {
  name: string;
  category: SkillCategory;
}

export interface Project {
  id: string;
  title: string;
  company: string;
  period: string;
  description: string;
  role: string;
  features: string[];
  technologies: string[];
  outcome?: string;
  gradient: [string, string];
}

export interface Achievement {
  title: string;
  description: string;
  icon: 'rocket' | 'credit-card' | 'layers' | 'gauge' | 'cloud' | 'users';
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  period: string;
  detail?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  url?: string;
}

export type AppearanceMode = 'light' | 'dark' | 'system';
export type ThemePresetKey = 'ocean' | 'royal' | 'emerald' | 'sunset' | 'monochrome' | 'cyber';
export type RadiusKey = 'sharp' | 'rounded' | 'extra-rounded';
export type MotionKey = 'full' | 'reduced';
export type FontSizeKey = 'compact' | 'default' | 'comfortable';

export interface ThemeTokens {
  '--background': string;
  '--foreground': string;
  '--primary': string;
  '--primary-foreground': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--accent': string;
  '--accent-foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--border': string;
  '--muted': string;
  '--muted-foreground': string;
  '--gradient-start': string;
  '--gradient-end': string;
  '--glow': string;
}

export interface ThemePreset {
  key: ThemePresetKey;
  name: string;
  description: string;
  swatch: string;
  light: ThemeTokens;
  dark: ThemeTokens;
}
