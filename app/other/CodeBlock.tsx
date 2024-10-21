import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import { FiClipboard } from 'react-icons/fi'; // Using react-icons for the clipboard icon
import { FcCopyright } from 'react-icons/fc';

interface CodeBlockProps {
    language: string;
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    const [copied, setCopied] = useState<boolean>(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset "copied" state after 2 seconds
        });
    };

    return (
        <div className="relative">
            {/* Copy button */}
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 bg-gray-50 text-xs hover:bg-gray-300 text-black p-1 rounded"
                aria-label="Copy code"
            >
                {copied ? 'copied!' : <FcCopyright size={18} />}
            </button>

            {/* Code block */}
            <SyntaxHighlighter language={language} style={vs}>
                {code}
            </SyntaxHighlighter>
        </div>
    );
};

export default CodeBlock;



