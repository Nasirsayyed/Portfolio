export function projectInitials(title: string): string {
  const words = title.replace(/[—-].*/, '').trim().split(/\s+/);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}
