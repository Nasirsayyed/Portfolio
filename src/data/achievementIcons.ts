import { Cloud, CreditCard, Gauge, Layers, Rocket, Users, type LucideIcon } from 'lucide-react';
import type { Achievement } from '@/types';

export const achievementIcons: Record<Achievement['icon'], LucideIcon> = {
  rocket: Rocket,
  'credit-card': CreditCard,
  layers: Layers,
  gauge: Gauge,
  cloud: Cloud,
  users: Users,
};
