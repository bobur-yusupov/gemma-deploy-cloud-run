import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import ansiRegex from 'ansi-regex';
import './App.css';

type Language =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust';

function App() {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<Language>('python');
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const outputRef = useRef<HTMLDivElement | null>(null);
  const explanationRef = useRef<string>('');

  const stripAnsi = (text: string) =>
    text.replace(ansiRegex({ onlyFirst: false }), '');

  const handleExplain = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setExplanation('');
    explanationRef.current = '';

    try {
      const response = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim(), language }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Failed to fetch explanation');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const cleanChunk = stripAnsi(chunk);

          explanationRef.current += cleanChunk;
          setExplanation(explanationRef.current);
        }
      }
    } catch (error: any) {
      explanationRef.current = `Error: ${error.message}`;
      setExplanation(explanationRef.current);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') handleExplain();
  };

  // Auto-scroll as explanation updates
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [explanation]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🤖 Explain This Code</h1>
        <p>Paste your code and get an AI-powered explanation</p>
      </header>

      <div className="container">
        <div className="input-section">
          <div className="controls">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="language-select"
              disabled={loading}
            >
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
            </select>
            <button
              onClick={handleExplain}
              disabled={loading || !code.trim()}
              className="explain-btn"
            >
              {loading ? 'Generating explanation...' : 'Explain Code'}
            </button>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste your code here..."
            className="code-input"
            disabled={loading}
          />
        </div>

        <div className="output-section">
          <h2>Explanation</h2>
          <div className="explanation-output" ref={outputRef}>
            {explanation ? (
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {explanation}
              </ReactMarkdown>
            ) : (
              'Your code explanation will appear here...'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
