'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { ClipboardIcon, CheckIcon, EyeIcon, PencilIcon } from '@heroicons/react/24/outline';

const defaultMarkdown = `# Welcome to the Markdown Editor

This is a **live preview** markdown editor. Type in the left panel and see the results on the right!

## Features

- **Live preview** - See changes instantly
- **Syntax highlighting** for code blocks
- **Copy to clipboard** functionality
- **Responsive design** that works on all devices

## Markdown Examples

### Text Formatting

You can make text **bold**, *italic*, or ***both***.

You can also ~~strikethrough~~ text.

### Lists

#### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

#### Ordered List
1. First item
2. Second item
3. Third item

### Links and Images

[Visit GitHub](https://github.com)

### Code

Inline code: \`console.log('Hello World')\`

Code block:
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.

### Tables

| Feature | Supported |
|---------|-----------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |
| Tables | ✅ |

---

**Happy writing!** 🚀
`;

export default function MarkdownPage() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Markdown Editor
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Write and preview markdown documents with live rendering.
            </p>
          </div>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <CheckIcon className="h-5 w-5" />
                Copied!
              </>
            ) : (
              <>
                <ClipboardIcon className="h-5 w-5" />
                Copy Markdown
              </>
            )}
          </button>
        </div>

        {/* Mobile Tab Navigation */}
        <div className="lg:hidden mb-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'edit'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <PencilIcon className="h-4 w-4 inline mr-2" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'preview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <EyeIcon className="h-4 w-4 inline mr-2" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Layout */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
          {/* Editor Panel */}
          <div className={`border-r border-gray-200 dark:border-gray-700 ${
            activeTab === 'preview' ? 'hidden lg:block' : ''
          }`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <PencilIcon className="h-5 w-5 mr-2" />
                Markdown Input
              </h3>
            </div>
            <div className="p-4">
              <textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                placeholder="Type your markdown here..."
                className="w-full h-[500px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-mono text-sm resize-none"
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${activeTab === 'edit' ? 'hidden lg:block' : ''}`}>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <EyeIcon className="h-5 w-5 mr-2" />
                Live Preview
              </h3>
            </div>
            <div className="p-4 h-[500px] overflow-y-auto">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    // Custom styling for code blocks
                    code: ({ node, inline, className, children, ...props }) => {
                      return inline ? (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono"
                          {...props}
                        >
                          {children}
                        </code>
                      ) : (
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
                          <code className="text-sm font-mono" {...props}>
                            {children}
                          </code>
                        </pre>
                      );
                    },
                    // Custom styling for blockquotes
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4">
                        {children}
                      </blockquote>
                    ),
                    // Custom styling for tables
                    table: ({ children }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          {children}
                        </table>
                      </div>
                    ),
                    thead: ({ children }) => (
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        {children}
                      </thead>
                    ),
                    th: ({ children }) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {children}
                      </td>
                    ),
                    // Custom styling for links
                    a: ({ href, children }) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {markdown}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Markdown Reference
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Headers</h4>
            <code className="text-gray-600 dark:text-gray-400">
              # H1<br />
              ## H2<br />
              ### H3
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emphasis</h4>
            <code className="text-gray-600 dark:text-gray-400">
              **bold**<br />
              *italic*<br />
              ~~strikethrough~~
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Lists</h4>
            <code className="text-gray-600 dark:text-gray-400">
              - Item 1<br />
              - Item 2<br />
              1. Numbered
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Links</h4>
            <code className="text-gray-600 dark:text-gray-400">
              [text](url)
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Code</h4>
            <code className="text-gray-600 dark:text-gray-400">
              `inline code`<br />
              ```<br />
              code block<br />
              ```
            </code>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Quote</h4>
            <code className="text-gray-600 dark:text-gray-400">
              &gt; blockquote
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}