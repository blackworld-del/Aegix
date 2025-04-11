import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="markdown-content prose prose-slate max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
};
