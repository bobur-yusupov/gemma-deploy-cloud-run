import { KeyboardEvent } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export const CodeInput = ({ value, onChange, onSubmit, disabled }: CodeInputProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') onSubmit();
  };

  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Paste your code here..."
      className="code-input"
      disabled={disabled}
    />
  );
};
