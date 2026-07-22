import {
  Braces,
  Cloud,
  Database,
  Layers,
  LayoutGrid,
  Plug,
  Terminal,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { SkillCategory } from '@/types';

export const skillCategoryIcons: Record<SkillCategory, LucideIcon> = {
  Languages: Braces,
  Frameworks: Layers,
  'Front-End': LayoutGrid,
  'APIs & Integration': Plug,
  Databases: Database,
  Tools: Terminal,
  Practices: Workflow,
  Cloud: Cloud,
};
