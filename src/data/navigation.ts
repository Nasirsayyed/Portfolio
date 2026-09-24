export interface Chapter {
  id: string;
  /** Two-digit chapter number shown as `[ 03 / 07 ]`. */
  number: string;
  label: string;
}

/** The story the page tells: boot → stack → experience → work → proof → connect. */
export const chapters: Chapter[] = [
  { id: 'boot', number: '01', label: 'Boot' },
  { id: 'about', number: '02', label: 'About' },
  { id: 'stack', number: '03', label: 'Stack' },
  { id: 'experience', number: '04', label: 'Experience' },
  { id: 'work', number: '05', label: 'Work' },
  { id: 'proof', number: '06', label: 'Proof' },
  { id: 'connect', number: '07', label: 'Connect' },
];

export const chapterCount = String(chapters.length).padStart(2, '0');

export function chapterById(id: string): Chapter | undefined {
  return chapters.find((chapter) => chapter.id === id);
}

/**
 * Recruiter Mode reuses the same section ids (so the command palette and
 * deep links keep working) in résumé order.
 */
export const recruiterChapters: Chapter[] = [
  { id: 'experience', number: '01', label: 'Experience' },
  { id: 'stack', number: '02', label: 'Skills' },
  { id: 'work', number: '03', label: 'Projects' },
  { id: 'proof', number: '04', label: 'Education' },
  { id: 'connect', number: '05', label: 'Contact' },
];
