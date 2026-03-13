import { useState, useRef, useEffect } from 'react';
import { PLATFORM_CONFIGS } from '../../data/platformConfigs';
import type { Platform } from '../../data/platformConfigs';
import styles from './PlatformSelect.module.css';

export type { Platform };

interface Props {
  value: Platform;
  onChange: (v: Platform) => void;
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function triggerStyle(accent: string, active: boolean) {
  const { r, g, b } = hexToRgb(accent);
  return {
    background: `rgba(${r}, ${g}, ${b}, ${active ? 0.15 : 0.08})`,
    borderColor: `rgba(${r}, ${g}, ${b}, ${active ? 0.7 : 0.35})`,
    color: accent,
  };
}

export function PlatformSelect({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = PLATFORM_CONFIGS.find(o => o.key === value)!;

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={styles.trigger}
        style={triggerStyle(current.accent, false)}
        onClick={() => setOpen(o => !o)}
      >
        {current.label}
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className={styles.menu}>
          {PLATFORM_CONFIGS.map(o => (
            <button
              key={o.key}
              className={`${styles.item} ${o.key === value ? styles.itemActive : ''}`}
              onClick={() => { onChange(o.key); setOpen(false); }}
            >
              <span className={styles.dot} style={{ background: o.accent }} />
              {o.label}
              {o.key === value && <span className={styles.checkmark}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
