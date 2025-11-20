import stripAnsi from 'strip-ansi';

export type Language =
  | 'python'
  | 'javascript'
  | 'typescript'
  | 'java'
  | 'cpp'
  | 'go'
  | 'rust';

interface ExplainCodeParams {
  code: string;
  language: Language;
  onChunk: (chunk: string) => void;
}

const API_BASE_URL = 'http://localhost:8000';

export const explainCode = async ({
  code,
  language,
  onChunk,
}: ExplainCodeParams): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code.trim(), language }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to fetch explanation');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: false });

  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const cleanChunk = stripAnsi(chunk);
      onChunk(cleanChunk);
    }
  }
};
