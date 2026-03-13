import { useState, useMemo } from 'react';
import { TagInput } from './components/TagInput/TagInput';
import { RegionSelect } from './components/RegionSelect/RegionSelect';
import { QueryPreview } from './components/QueryPreview/QueryPreview';
import { PlatformSelect } from './components/PlatformSelect/PlatformSelect';
import type { Platform } from './data/platformConfigs';
import { getPlatformConfig } from './data/platformConfigs';
import { buildQuery, PLATFORMS } from './utils/buildQuery';
import { jobTitleSuggestions, skillSuggestions, locationSuggestions, excludeSuggestions } from './data/suggestions';
import { fetchSkillSuggestions } from './utils/fetchSkillSuggestions';
import { getRelatedSuggestions, getExcludeRelated, getGradeRelated } from './data/relatedSkills';
import type { FormState, HabrStatus } from './types';
import styles from './App.module.css';

const GRADE_SUGGESTIONS = [
  'intern', 'junior', 'junior+', 'middle', 'middle+', 'senior', 'senior+',
  'lead', 'principal', 'staff', 'стажёр', 'джун', 'джуниор', 'младший',
  'мидл', 'сеньор', 'старший', 'ведущий', 'тимлид', 'техлид',
];

const initialState: FormState = {
  region: 'ru',
  jobTitles: [],
  skillsAnd: [],
  skillsOr: [],
  locations: [],
  companies: [],
  exclude: [],
  platforms: {},
  habrStatus: '',
  habrGrades: [],
};

export default function App() {
  const [platform, setPlatform] = useState<Platform>('linkedin');
  const [form, setForm] = useState<FormState>(initialState);

  const query = useMemo(() => buildQuery(form, platform), [form, platform]);
  const relatedJobTitles = useMemo(() => getRelatedSuggestions(form.jobTitles), [form.jobTitles]);
  const relatedSkillsAnd = useMemo(() => getRelatedSuggestions(form.skillsAnd), [form.skillsAnd]);
  const relatedSkillsOr  = useMemo(() => getRelatedSuggestions(form.skillsOr),  [form.skillsOr]);
  const relatedExclude   = useMemo(() => getExcludeRelated(form.exclude),        [form.exclude]);
  const relatedGrades    = useMemo(() => getGradeRelated(form.habrGrades),       [form.habrGrades]);

  const layout = getPlatformConfig(platform).layout;

  const toggleContact = (key: string) =>
    setForm(prev => ({ ...prev, platforms: { ...prev.platforms, [key]: !prev.platforms[key] } }));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const clearAll = () => setForm(initialState);

  const genericFields = (
    <>
      <div className={styles.group}>
        <div className={styles.groupLabel}>Поиск по тексту профиля</div>

        <TagInput label="Job Title" tags={form.jobTitles} onChange={v => update('jobTitles', v)}
          suggestions={jobTitleSuggestions} relatedTags={relatedJobTitles}
          placeholder="e.g. developer, engineer" />

        <TagInput label="Грейд — OR (любой из)" tags={form.habrGrades} onChange={v => update('habrGrades', v)}
          suggestions={GRADE_SUGGESTIONS} relatedTags={relatedGrades}
          placeholder="e.g. senior, старший" />

        <TagInput label="Company" tags={form.companies} onChange={v => update('companies', v)}
          placeholder="e.g. Яндекс, Авито" />

        <TagInput label="Skills — AND (все обязательны)" tags={form.skillsAnd} onChange={v => update('skillsAnd', v)}
          suggestions={skillSuggestions} fetchSuggestions={fetchSkillSuggestions} relatedTags={relatedSkillsAnd}
          placeholder="e.g. python, docker — все должны быть" />

        <TagInput label="Skills — OR (любой из)" tags={form.skillsOr} onChange={v => update('skillsOr', v)}
          suggestions={skillSuggestions} fetchSuggestions={fetchSkillSuggestions} relatedTags={relatedSkillsOr}
          placeholder="e.g. react, vue — хотя бы один" />

        <TagInput label="Location" tags={form.locations} onChange={v => update('locations', v)}
          suggestions={locationSuggestions} placeholder="e.g. Москва, Удалённо" />
      </div>

      <div className={styles.group}>
        <div className={styles.groupLabel}>Платформы и контакты</div>
        <div className={styles.checkboxGrid}>
          {PLATFORMS.map(p => (
            <label key={p.key} className={styles.checkbox}>
              <input type="checkbox" checked={!!form.platforms[p.key]} onChange={() => toggleContact(p.key)} />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <div className={styles.groupLabel}>Исключить</div>
        <TagInput label="Exclude — исключить из результатов" tags={form.exclude} onChange={v => update('exclude', v)}
          suggestions={excludeSuggestions} relatedTags={relatedExclude}
          placeholder="e.g. junior, intern" />
      </div>
    </>
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Boolean X-Ray Builder</h1>
          <div className={styles.headerRight}>
            <button className={styles.clearBtn} onClick={clearAll}>Очистить</button>
            <PlatformSelect value={platform} onChange={setPlatform} />
          </div>
        </header>

        <div className={styles.form}>

          {/* ── LinkedIn ── */}
          {layout === 'linkedin' && (
            <>
              <RegionSelect value={form.region} onChange={v => update('region', v)} />

              <div className={styles.group}>
                <div className={styles.groupLabel}>intitle: — поиск в заголовке профиля</div>
                <TagInput label="Job Title" tags={form.jobTitles} onChange={v => update('jobTitles', v)}
                  suggestions={jobTitleSuggestions} relatedTags={relatedJobTitles}
                  placeholder="e.g. developer, engineer" />
                <TagInput label="Company" tags={form.companies} onChange={v => update('companies', v)}
                  placeholder="e.g. Google, Yandex" />
                <TagInput label="Exclude (intitle) — исключить из заголовка" tags={form.exclude}
                  onChange={v => update('exclude', v)} suggestions={excludeSuggestions}
                  relatedTags={relatedExclude} placeholder="e.g. junior, intern" />
              </div>

              <div className={styles.group}>
                <div className={styles.groupLabel}>Поиск по тексту профиля</div>
                <TagInput label="Skills — AND (все обязательны)" tags={form.skillsAnd} onChange={v => update('skillsAnd', v)}
                  suggestions={skillSuggestions} fetchSuggestions={fetchSkillSuggestions} relatedTags={relatedSkillsAnd}
                  placeholder="e.g. python, docker — все должны быть" />
                <TagInput label="Skills — OR (любой из)" tags={form.skillsOr} onChange={v => update('skillsOr', v)}
                  suggestions={skillSuggestions} fetchSuggestions={fetchSkillSuggestions} relatedTags={relatedSkillsOr}
                  placeholder="e.g. react, vue — хотя бы один" />
                <TagInput label="Location" tags={form.locations} onChange={v => update('locations', v)}
                  suggestions={locationSuggestions} placeholder="e.g. Moscow, Remote" />
              </div>

              <div className={styles.group}>
                <div className={styles.groupLabel}>Платформы и контакты</div>
                <div className={styles.checkboxGrid}>
                  {PLATFORMS.map(p => (
                    <label key={p.key} className={styles.checkbox}>
                      <input type="checkbox" checked={!!form.platforms[p.key]} onChange={() => toggleContact(p.key)} />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Habr Career ── */}
          {layout === 'habr' && (
            <>
              <div className={styles.group}>
                <div className={styles.groupLabel}>Ключевые слова</div>
                <div className={styles.statusToggle}>
                  {([
                    { value: 'about',   label: 'Обо мне' },
                    { value: 'seeking', label: 'Ищу работу' },
                  ] as { value: HabrStatus; label: string }[]).map(opt => (
                    <button key={opt.value}
                      className={`${styles.statusBtn} ${form.habrStatus === opt.value ? styles.statusBtnActive : ''}`}
                      onClick={() => update('habrStatus', form.habrStatus === opt.value ? '' : opt.value)}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {genericFields}
            </>
          )}

          {/* ── Все остальные платформы ── */}
          {layout === 'generic' && genericFields}

        </div>

        <div className={styles.divider} />
        <QueryPreview query={query} />
      </div>
    </div>
  );
}
