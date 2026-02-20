import { useState, useRef, useCallback, useEffect } from 'react';
import styles from './TagInput.module.css';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  fetchSuggestions?: (query: string) => Promise<string[]>;
  relatedTags?: string[];
  placeholder?: string;
}

export function TagInput({ label, tags, onChange, suggestions = [], fetchSuggestions, relatedTags = [], placeholder = 'Type and press Enter' }: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [asyncResults, setAsyncResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Совпадение с начала любого слова: "fig" → "figma", "UI des" → "UI designer"
  const matchesFromStart = (suggestion: string, query: string): boolean => {
    const q = query.toLowerCase();
    const s = suggestion.toLowerCase();
    if (s.startsWith(q)) return true;
    // проверяем начало каждого слова в suggestion
    const words = s.split(/[\s/]+/);
    return words.some(w => w.startsWith(q));
  };

  // Статическая фильтрация
  const staticFiltered = input.trim()
    ? suggestions.filter(
        s => matchesFromStart(s, input.trim()) && !tags.includes(s)
      )
    : [];

  // Объединяем: сначала статические, потом API (без дубликатов)
  const staticSet = new Set(staticFiltered);
  const merged = [
    ...staticFiltered,
    ...asyncResults.filter(s => !staticSet.has(s) && !tags.includes(s)),
  ];
  const filtered = merged.slice(0, 10);

  // Async-запрос с debounce
  useEffect(() => {
    if (!fetchSuggestions) return;

    clearTimeout(debounceRef.current);

    const q = input.trim();
    if (q.length < 2) {
      setAsyncResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(q).then(results => {
        setAsyncResults(results);
        setLoading(false);
      });
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [input, fetchSuggestions]);

  const addTag = useCallback((value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setAsyncResults([]);
  }, [tags, onChange]);

  const removeTag = useCallback((index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  }, [tags, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        addTag(filtered[highlightedIndex]);
      } else if (input.trim()) {
        addTag(input);
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.field} ref={containerRef}>
      <label className={styles.label}>{label}</label>
      <div className={styles.inputArea} onClick={() => inputRef.current?.focus()}>
        {tags.map((tag, i) => (
          <span key={i} className={styles.tag}>
            {tag}
            <button
              type="button"
              className={styles.removeTag}
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          className={styles.input}
          value={input}
          onChange={e => {
            setInput(e.target.value);
            setShowSuggestions(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
        />
      </div>
      {showSuggestions && (filtered.length > 0 || loading) && (
        <ul className={styles.suggestions}>
          {filtered.map((s, i) => (
            <li
              key={s}
              className={`${styles.suggestionItem} ${i === highlightedIndex ? styles.highlighted : ''}`}
              onMouseDown={() => addTag(s)}
              onMouseEnter={() => setHighlightedIndex(i)}
            >
              {s}
            </li>
          ))}
          {loading && <li className={styles.loading}>Loading...</li>}
        </ul>
      )}
      {relatedTags.length > 0 && (
        <div className={styles.related}>
          <span className={styles.relatedLabel}>+</span>
          {relatedTags.map(r => (
            <button
              key={r}
              type="button"
              className={styles.relatedChip}
              onClick={() => addTag(r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
