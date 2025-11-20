import { useState } from 'react';
import './App.css';
import { Language } from './services/codeExplainService';
import { Header } from './components/Header';
import { LanguageSelector } from './components/LanguageSelector';
import { CodeInput } from './components/CodeInput';
import { ExplanationOutput } from './components/ExplanationOutput';
import { useCodeExplanation } from './hooks/useCodeExplanation';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('python');
  const { explanation, loading, explain } = useCodeExplanation();

  const handleExplain = () => explain(code, language);

  const isExplainDisabled = loading || !code.trim();

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="input-section">
          <div className="controls">
            <LanguageSelector
              value={language}
              onChange={setLanguage}
              disabled={loading}
            />
            <button
              onClick={handleExplain}
              disabled={isExplainDisabled}
              className="explain-btn"
            >
              {loading ? 'Generating explanation...' : 'Explain Code'}
            </button>
          </div>
          <CodeInput
            value={code}
            onChange={setCode}
            onSubmit={handleExplain}
            disabled={loading}
          />
        </div>
        <ExplanationOutput content={explanation} />
      </div>
    </div>
  );
}

export default App;
