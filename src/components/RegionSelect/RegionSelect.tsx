import { regions } from '../../data/suggestions';
import styles from './RegionSelect.module.css';

interface RegionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function RegionSelect({ value, onChange }: RegionSelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>Region</label>
      <select
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {regions.map(r => (
          <option key={r.code} value={r.code}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
