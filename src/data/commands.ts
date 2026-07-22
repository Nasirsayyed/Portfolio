export interface CommandAction {
  id: string;
  label: string;
  group: 'Navigate' | 'Actions' | 'Appearance';
  keywords?: string;
}

export const commandActions: CommandAction[] = [
  { id: 'home', label: 'Go Home', group: 'Navigate' },
  { id: 'about', label: 'About Me', group: 'Navigate' },
  { id: 'experience', label: 'View Experience', group: 'Navigate' },
  { id: 'skills', label: 'View Skills', group: 'Navigate' },
  { id: 'projects', label: 'View Projects', group: 'Navigate' },
  { id: 'education', label: 'View Education & Certifications', group: 'Navigate' },
  { id: 'contact', label: 'Contact Me', group: 'Navigate' },
  { id: 'download-resume', label: 'Download Resume', group: 'Actions', keywords: 'cv pdf' },
  { id: 'toggle-dark-mode', label: 'Toggle Dark Mode', group: 'Appearance', keywords: 'light theme' },
  { id: 'open-theme-customizer', label: 'Open Theme Customizer', group: 'Appearance', keywords: 'settings colors' },
  { id: 'toggle-recruiter-mode', label: 'Toggle Recruiter Mode', group: 'Appearance', keywords: 'hr concise' },
  { id: 'open-terminal', label: 'Open Developer Terminal', group: 'Actions', keywords: 'console cli' },
];
