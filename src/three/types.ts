/** Theme colours read from the live CSS custom properties. */
export interface SceneColors {
  primary: string;
  start: string;
  end: string;
  foreground: string;
  background: string;
  dark: boolean;
}

/**
 * Mutable state shared between React/GSAP and a running scene. React and
 * GSAP write into it (pointer, scroll progress, intro progress); the scene
 * reads it every frame. Never replaced, only mutated.
 */
export interface SceneInput {
  /** Pointer position over the canvas in normalised device coords (-1..1). */
  pointer: { x: number; y: number };
  /** True while the pointer is over the canvas. */
  pointerInside: boolean;
  /** 0..1 progress, typically scrubbed by a ScrollTrigger. */
  scroll: number;
  /** 0..1 entrance progress, tweened by GSAP. */
  intro: number;
}

export interface SceneInstance {
  resize: (width: number, height: number, pixelRatio: number) => void;
  render: (time: number, delta: number) => void;
  setColors: (colors: SceneColors) => void;
  /** Pointer pressed inside the canvas bounds (NDC coords). */
  pointerDown?: (x: number, y: number) => void;
  dispose: () => void;
}

export type SceneFactory<T extends SceneInput = SceneInput> = (
  canvas: HTMLCanvasElement,
  input: T,
  colors: SceneColors,
) => SceneInstance;

export function createSceneInput<T extends object = object>(extra?: T): SceneInput & T {
  return { pointer: { x: 0, y: 0 }, pointerInside: false, scroll: 0, intro: 0, ...(extra as T) };
}
