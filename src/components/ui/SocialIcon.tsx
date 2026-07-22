import { Github, Linkedin, Mail, Phone, MapPin, Code2, type LucideIcon } from 'lucide-react';
import type { SocialLink } from '@/types';

const iconMap: Record<SocialLink['icon'], LucideIcon> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  phone: Phone,
  'map-pin': MapPin,
  code: Code2,
};

interface SocialIconProps {
  icon: SocialLink['icon'];
  className?: string;
}

export function SocialIcon({ icon, className = 'h-4 w-4' }: SocialIconProps) {
  const Icon = iconMap[icon];
  return <Icon className={className} aria-hidden="true" />;
}
