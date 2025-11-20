import { Language } from '../services/codeExplainService';

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  disabled: boolean;
}

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

export const LanguageSelector = ({ value, onChange, disabled }: LanguageSelectorProps) => (
  <div className="language-selector">
    <label htmlFor="language-select">Language:</label>
    <select
      id="language-select"
      value={value}
      onChange={(e) => onChange(e.target.value as Language)}
      className="language-select"
      disabled={disabled}
    >
      {LANGUAGES.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  </div>
);
