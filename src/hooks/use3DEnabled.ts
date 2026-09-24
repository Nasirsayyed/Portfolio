import { useState } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { isWebGLAvailable } from '@/components/three/webgl';

/** WebGL scenes render unless the browser can't, or Recruiter Mode asks for the concise 2D view. */
export function use3DEnabled(): boolean {
  const recruiterMode = useThemeStore((s) => s.recruiterMode);
  const [webgl] = useState(isWebGLAvailable);
  return webgl && !recruiterMode;
}
