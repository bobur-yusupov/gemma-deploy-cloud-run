import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleExplain = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setExplanation('');

    try {
      const response = await fetch('http://localhost:8000/explain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, language }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          setExplanation((prev) => prev + chunk);
        }
      }
    } catch (error) {
      setExplanation('Error: Failed to explain code. Make sure the API is running.');
    } finally {
      setLoading(false);
    }
  };

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
              onChange={(e) => setLanguage(e.target.value)}
              className="language-select"
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
              {loading ? 'Explaining...' : 'Explain Code'}
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            className="code-input"
          />
        </div>

        <div className="output-section">
          <h2>Explanation</h2>
          <div className="explanation-output">
            {explanation || 'Your code explanation will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
