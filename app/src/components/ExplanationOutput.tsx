import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

interface ExplanationOutputProps {
  content: string;
}

const EMPTY_MESSAGE = 'Your code explanation will appear here...';

export const ExplanationOutput = ({ content }: ExplanationOutputProps) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="output-section">
      <h2>AI Code Analysis</h2>
      <div className="explanation-output" ref={outputRef}>
        {content ? (
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
        ) : (
          EMPTY_MESSAGE
        )}
      </div>
    </div>
  );
};
