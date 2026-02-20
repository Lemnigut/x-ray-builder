import { useState, useMemo } from 'react';
import { TagInput } from './components/TagInput/TagInput';
import { RegionSelect } from './components/RegionSelect/RegionSelect';
import { QueryPreview } from './components/QueryPreview/QueryPreview';
import { buildQuery, PLATFORMS } from './utils/buildQuery';
import { jobTitleSuggestions, skillSuggestions, locationSuggestions, excludeSuggestions } from './data/suggestions';
import { fetchSkillSuggestions } from './utils/fetchSkillSuggestions';
import { getRelatedSuggestions, getExcludeRelated } from './data/relatedSkills';
import type { FormState } from './types';
import styles from './App.module.css';

const initialState: FormState = {
  region: 'ru',
  jobTitles: [],
  skillsAnd: [],
  skillsOr: [],
  locations: [],
  companies: [],
  exclude: [],
  platforms: {},
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialState);

  const query = useMemo(() => buildQuery(form), [form]);
  const relatedJobTitles = useMemo(() => getRelatedSuggestions(form.jobTitles), [form.jobTitles]);
  const relatedSkillsAnd = useMemo(() => getRelatedSuggestions(form.skillsAnd), [form.skillsAnd]);
  const relatedSkillsOr = useMemo(() => getRelatedSuggestions(form.skillsOr), [form.skillsOr]);
  const relatedExclude = useMemo(() => getExcludeRelated(form.exclude), [form.exclude]);

  const togglePlatform = (key: string) => {
    setForm(prev => ({
      ...prev,
      platforms: { ...prev.platforms, [key]: !prev.platforms[key] },
    }));
  };

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Boolean X-Ray Builder</h1>
          <span className={styles.badge}>LinkedIn</span>
        </header>

        <div className={styles.form}>
          <RegionSelect
            value={form.region}
            onChange={v => update('region', v)}
          />

          {/* --- intitle: группа --- */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>intitle: — поиск в заголовке профиля</div>

            <TagInput
              label="Job Title"
              tags={form.jobTitles}
              onChange={v => update('jobTitles', v)}
              suggestions={jobTitleSuggestions}
              relatedTags={relatedJobTitles}
              placeholder="e.g. developer, engineer"
            />

            <TagInput
              label="Company"
              tags={form.companies}
              onChange={v => update('companies', v)}
              placeholder="e.g. Google, Yandex"
            />

            <TagInput
              label="Exclude (intitle) — исключить из заголовка"
              tags={form.exclude}
              onChange={v => update('exclude', v)}
              suggestions={excludeSuggestions}
              relatedTags={relatedExclude}
              placeholder="e.g. junior, intern"
            />
          </div>

          {/* --- текстовый поиск по профилю --- */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>Поиск по тексту профиля</div>

            <TagInput
              label="Skills — AND (все обязательны)"
              tags={form.skillsAnd}
              onChange={v => update('skillsAnd', v)}
              suggestions={skillSuggestions}
              fetchSuggestions={fetchSkillSuggestions}
              relatedTags={relatedSkillsAnd}
              placeholder="e.g. python, docker — все должны быть"
            />

            <TagInput
              label="Skills — OR (любой из)"
              tags={form.skillsOr}
              onChange={v => update('skillsOr', v)}
              suggestions={skillSuggestions}
              fetchSuggestions={fetchSkillSuggestions}
              relatedTags={relatedSkillsOr}
              placeholder="e.g. react, vue — хотя бы один"
            />

            <TagInput
              label="Location"
              tags={form.locations}
              onChange={v => update('locations', v)}
              suggestions={locationSuggestions}
              placeholder="e.g. Moscow, Remote"
            />

          </div>

          {/* --- платформы и контакты --- */}
          <div className={styles.group}>
            <div className={styles.groupLabel}>Платформы и контакты</div>
            <div className={styles.checkboxGrid}>
              {PLATFORMS.map(p => (
                <label key={p.key} className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={!!form.platforms[p.key]}
                    onChange={() => togglePlatform(p.key)}
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.divider} />

        <QueryPreview query={query} />
      </div>
    </div>
  );
}
