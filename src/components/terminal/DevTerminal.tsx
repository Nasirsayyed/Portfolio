import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { useUiStore } from '@/store/uiStore';
import { personalInfo, skills } from '@/data/portfolio';
import { experience } from '@/data/experience';
import { projects } from '@/data/projects';
import { scrollToSection } from '@/utils/scroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LogLine {
  type: 'input' | 'output';
  text: string;
}

const HELP_TEXT = [
  'Available commands:',
  '  about       — short professional summary',
  '  experience  — list roles',
  '  skills      — list technical skills',
  '  projects    — list shipped projects',
  '  contact     — contact details',
  '  resume      — download resume',
  '  clear       — clear the terminal',
  '  help        — show this list',
].join('\n');

function runCommand(input: string, reduceMotion: boolean): string | null {
  const cmd = input.trim().toLowerCase();

  switch (cmd) {
    case 'help':
      return HELP_TEXT;
    case 'about':
      return personalInfo.summary;
    case 'experience':
      return experience.map((e) => `${e.role} @ ${e.company} (${e.period})`).join('\n');
    case 'skills':
      return skills.map((s) => s.name).join(', ');
    case 'projects':
      return projects.map((p) => `- ${p.title}`).join('\n');
    case 'contact':
      return `${personalInfo.email}  |  ${personalInfo.phone}  |  ${personalInfo.location}`;
    case 'resume': {
      const link = document.createElement('a');
      link.href = personalInfo.resumeUrl;
      link.download = '';
      link.click();
      return 'Downloading resume...';
    }
    case 'clear':
      return null;
    case '':
      return '';
    default:
      if (['home', 'about', 'experience', 'skills', 'projects', 'education', 'contact'].includes(cmd)) {
        scrollToSection(cmd, reduceMotion);
        return `Navigating to ${cmd}...`;
      }
      return `Command not found: ${cmd}. Type "help" for available commands.`;
  }
}

export function DevTerminal() {
  const open = useUiStore((s) => s.terminalOpen);
  const setOpen = useUiStore((s) => s.setTerminalOpen);
  const reduceMotion = useReducedMotion();
  const [lines, setLines] = useState<LogLine[]>([
    { type: 'output', text: `Welcome, ${personalInfo.name.split(' ')[0]}'s portfolio terminal. Type "help" to get started.` },
  ]);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const command = value;
    setValue('');

    if (command.trim().toLowerCase() === 'clear') {
      setLines([]);
      return;
    }

    const output = runCommand(command, reduceMotion);
    setLines((prev) => [
      ...prev,
      { type: 'input', text: command },
      ...(output !== null ? [{ type: 'output' as const, text: output }] : []),
    ]);
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      labelledBy="terminal-title"
      className="max-w-xl !bg-[#0b0e14] !text-white"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-red-500/80" />
        <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="h-3 w-3 rounded-full bg-green-500/80" />
        <span id="terminal-title" className="ml-2 font-mono text-xs text-white/60">
          {personalInfo.name.toLowerCase().replace(/\s+/g, '-')} — terminal
        </span>
      </div>

      <div className="max-h-[50vh] overflow-y-auto px-5 py-4 font-mono text-sm leading-relaxed">
        {lines.map((line, i) => (
          <div key={i} className={line.type === 'input' ? 'text-white' : 'whitespace-pre-wrap text-emerald-300/90'}>
            {line.type === 'input' ? <span className="text-primary">$ {line.text}</span> : line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/10 px-5 py-3.5">
        <span className="font-mono text-sm text-primary">$</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          type="text"
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input"
          className="w-full bg-transparent font-mono text-sm text-white outline-none placeholder:text-white/30"
          placeholder="type a command..."
        />
      </form>
    </Modal>
  );
}
