import { useState, useRef } from 'react';
import { explainCode, Language } from '../services/codeExplainService';

export const useCodeExplanation = () => {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const explanationRef = useRef('');

  const explain = async (code: string, language: Language) => {
    if (!code.trim()) return;

    setLoading(true);
    setExplanation('');
    explanationRef.current = '';

    try {
      await explainCode({
        code,
        language,
        onChunk: (chunk) => {
          explanationRef.current += chunk;
          setExplanation(explanationRef.current);
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      explanationRef.current = `Error: ${message}`;
      setExplanation(explanationRef.current);
    } finally {
      setLoading(false);
    }
  };

  return { explanation, loading, explain };
};
