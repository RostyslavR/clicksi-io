'use client';

import React from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: 'html' | 'text';
  className?: string;
}

export function SyntaxHighlighter({ code, language, className = '' }: SyntaxHighlighterProps) {
  const highlightHTML = (html: string): string => {
    return html
      // HTML tags
      .replace(/(&lt;\/?)([a-zA-Z][a-zA-Z0-9]*)(.*?)(&gt;)/g, 
        '$1<span class="html-tag">$2</span><span class="html-attr">$3</span>$4')
      // Comments
      .replace(/(&lt;!--)(.*?)(--&gt;)/g, 
        '<span class="html-comment">$1$2$3</span>')
      // Attributes
      .replace(/(\s)([a-zA-Z-]+)(=)(".*?")/g, 
        '$1<span class="html-attr-name">$2</span><span class="html-equals">$3</span><span class="html-attr-value">$4</span>')
      // Style attribute values (special handling)
      .replace(/(style=")([^"]*?)(")/g, 
        'style="<span class="html-style">$2</span>"');
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  const getHighlightedCode = (): string => {
    if (language === 'html') {
      const escaped = escapeHtml(code);
      return highlightHTML(escaped);
    }
    return escapeHtml(code);
  };

  return (
    <pre 
      className={`syntax-highlighter ${language} ${className}`}
      dangerouslySetInnerHTML={{ __html: getHighlightedCode() }}
    />
  );
}