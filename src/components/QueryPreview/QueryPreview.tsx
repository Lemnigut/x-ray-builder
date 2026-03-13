import { useState } from 'react';
import styles from './QueryPreview.module.css';

const QUERY_LIMIT = 2048;

interface QueryPreviewProps {
  query: string;
}

/** Разбивает запрос на токены, не разрывая кавычки */
function tokenize(query: string): string[] {
  const tokens: string[] = [];
  const re = /(-?intitle:"[^"]*"|"[^"]*"|site:\S+|\S+)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(query)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(query.slice(lastIndex, match.index));
    }
    tokens.push(match[0]);
    lastIndex = re.lastIndex;
  }
  if (lastIndex < query.length) {
    tokens.push(query.slice(lastIndex));
  }
  return tokens;
}

function highlightQuery(query: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokens = tokenize(query);
  let key = 0;

  for (const token of tokens) {
    if (/^\s+$/.test(token)) {
      nodes.push(<span key={key++}>{token}</span>);
      continue;
    }

    if (token === 'OR' || token === '|') {
      nodes.push(<span key={key++} className={styles.operator}>{token}</span>);
    } else if (token.startsWith('site:')) {
      nodes.push(
        <span key={key++}>
          <span className={styles.keyword}>site:</span>
          <span className={styles.value}>{token.slice(5)}</span>
        </span>
      );
    } else if (token.startsWith('-intitle:')) {
      nodes.push(
        <span key={key++}>
          <span className={styles.exclude}>-intitle:</span>
          <span className={styles.excludeValue}>{token.slice(9)}</span>
        </span>
      );
    } else if (token.startsWith('intitle:')) {
      nodes.push(
        <span key={key++}>
          <span className={styles.keyword}>intitle:</span>
          <span className={styles.value}>{token.slice(8)}</span>
        </span>
      );
    } else if (token.startsWith('"') && token.endsWith('"')) {
      nodes.push(<span key={key++} className={styles.quoted}>{token}</span>);
    } else {
      nodes.push(<span key={key++}>{token}</span>);
    }
  }

  return nodes;
}

export function QueryPreview({ query }: QueryPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [usePipe, setUsePipe] = useState(false);

  const displayQuery = usePipe ? query.replace(/ OR /g, '|') : query;
  const tooLong = displayQuery.length > QUERY_LIMIT;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = () => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(displayQuery)}`;
    window.open(url, '_blank');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Generated Query</div>

      {tooLong && (
        <div className={styles.warning}>
          Запрос слишком длинный ({displayQuery.length} символов). Google может обрезать его — попробуйте убрать лишние поля.
        </div>
      )}

      <div className={`${styles.queryBox} ${tooLong ? styles.queryBoxWarn : ''}`}>
        <code className={styles.queryText}>
          {displayQuery ? highlightQuery(displayQuery) : <span className={styles.placeholder}>Fill in the fields above...</span>}
        </code>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.btn} ${usePipe ? styles.btnActive : ''}`}
          onClick={() => setUsePipe(v => !v)}
          disabled={!query}
          title="Сокращает запрос, заменяя OR на |"
        >
          {usePipe ? 'Вернуть OR' : 'OR → |'}
        </button>
        <div className={styles.actionsRight}>
          <button className={styles.btn} onClick={handleCopy} disabled={!query}>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleSearch} disabled={!query}>
            Search in Google
          </button>
        </div>
      </div>
    </div>
  );
}
