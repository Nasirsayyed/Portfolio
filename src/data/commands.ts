export interface CommandAction {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions' | 'Appearance';
  keywords?: string;
}

export const commandActions: CommandAction[] = [
  { id: 'boot', label: '01 · Boot — top of page', group: 'Navigate', keywords: 'home hero start' },
  { id: 'about', label: '02 · About', group: 'Navigate', keywords: 'bio summary' },
  { id: 'stack', label: '03 · Stack', group: 'Navigate', keywords: 'skills technologies' },
  { id: 'experience', label: '04 · Experience', group: 'Navigate', keywords: 'jobs career roles' },
  { id: 'work', label: '05 · Work', group: 'Navigate', keywords: 'projects case studies' },
  { id: 'proof', label: '06 · Proof', group: 'Navigate', keywords: 'highlights education certifications' },
  { id: 'connect', label: '07 · Connect', group: 'Navigate', keywords: 'contact email' },
  { id: 'open-contact', label: 'Send a message', group: 'Actions', keywords: 'contact form email' },
  { id: 'download-resume', label: 'Download Resume', group: 'Actions', keywords: 'cv pdf' },
  { id: 'toggle-dark-mode', label: 'Toggle Dark Mode', group: 'Appearance', keywords: 'light theme' },
  { id: 'open-theme-customizer', label: 'Open Theme Customizer', group: 'Appearance', keywords: 'settings colors' },
  { id: 'toggle-recruiter-mode', label: 'Toggle Recruiter Mode', group: 'Appearance', keywords: 'hr concise' },
  { id: 'open-terminal', label: 'Open Developer Terminal', group: 'Actions', keywords: 'console cli' },
];
