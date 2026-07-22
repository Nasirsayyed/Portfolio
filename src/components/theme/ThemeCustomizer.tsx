import { Check, Laptop, Moon, RotateCcw, Sun } from 'lucide-react';
import { themePresets } from '@/data/themePresets';
import { useThemeStore } from '@/store/themeStore';
import { useUiStore } from '@/store/uiStore';
import { Drawer } from '@/components/ui/Drawer';
import type { AppearanceMode, FontSizeKey, MotionKey, RadiusKey } from '@/types';

const appearanceOptions: { key: AppearanceMode; label: string; icon: typeof Sun }[] = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
  { key: 'system', label: 'System', icon: Laptop },
];

const radiusOptions: { key: RadiusKey; label: string }[] = [
  { key: 'sharp', label: 'Sharp' },
  { key: 'rounded', label: 'Rounded' },
  { key: 'extra-rounded', label: 'Extra Rounded' },
];

const motionOptions: { key: MotionKey; label: string }[] = [
  { key: 'full', label: 'Full' },
  { key: 'reduced', label: 'Reduced' },
];

const fontSizeOptions: { key: FontSizeKey; label: string }[] = [
  { key: 'compact', label: 'Compact' },
  { key: 'default', label: 'Default' },
  { key: 'comfortable', label: 'Comfortable' },
];

function SegmentGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold text-foreground">{label}</h3>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => onChange(option.key)}
            aria-pressed={value === option.key}
            className={`focus-ring rounded-lg border px-2 py-2.5 text-xs font-medium transition-colors ${
              value === option.key
                ? 'border-primary/50 bg-secondary text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ThemeCustomizer() {
  const open = useUiStore((s) => s.themeCustomizerOpen);
  const setOpen = useUiStore((s) => s.setThemeCustomizerOpen);

  const appearance = useThemeStore((s) => s.appearance);
  const preset = useThemeStore((s) => s.preset);
  const radius = useThemeStore((s) => s.radius);
  const motion = useThemeStore((s) => s.motion);
  const fontSize = useThemeStore((s) => s.fontSize);
  const setAppearance = useThemeStore((s) => s.setAppearance);
  const setPreset = useThemeStore((s) => s.setPreset);
  const setRadius = useThemeStore((s) => s.setRadius);
  const setMotion = useThemeStore((s) => s.setMotion);
  const setFontSize = useThemeStore((s) => s.setFontSize);
  const reset = useThemeStore((s) => s.reset);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} title="Customize">
      <div className="flex flex-col gap-8">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Appearance</h3>
          <div className="grid grid-cols-3 gap-2">
            {appearanceOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setAppearance(option.key)}
                  aria-pressed={appearance === option.key}
                  className={`focus-ring flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-colors ${
                    appearance === option.key
                      ? 'border-primary/50 bg-secondary text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-foreground">Theme Preset</h3>
          <div className="grid grid-cols-2 gap-3">
            {themePresets.map((themePreset) => (
              <button
                key={themePreset.key}
                type="button"
                onClick={() => setPreset(themePreset.key)}
                aria-pressed={preset === themePreset.key}
                className={`focus-ring group relative flex flex-col gap-2 overflow-hidden rounded-lg border p-3 text-left transition-colors ${
                  preset === themePreset.key ? 'border-primary/60' : 'border-border hover:border-primary/30'
                }`}
              >
                <span
                  className="block h-10 w-full rounded-md"
                  style={{ backgroundImage: themePreset.swatch }}
                  aria-hidden="true"
                />
                <span className="flex items-center justify-between text-xs font-semibold text-foreground">
                  {themePreset.name}
                  {preset === themePreset.key ? <Check className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}
                </span>
                <span className="text-[11px] leading-snug text-muted-foreground">{themePreset.description}</span>
              </button>
            ))}
          </div>
        </div>

        <SegmentGroup label="Border Radius" options={radiusOptions} value={radius} onChange={setRadius} />
        <SegmentGroup label="Animation" options={motionOptions} value={motion} onChange={setMotion} />
        <SegmentGroup label="Font Size" options={fontSizeOptions} value={fontSize} onChange={setFontSize} />

        <button
          type="button"
          onClick={reset}
          className="focus-ring flex items-center justify-center gap-2 rounded-lg border border-border py-3 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset to Default
        </button>
      </div>
    </Drawer>
  );
}
