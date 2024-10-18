import React, { useEffect } from 'react';
import Prism from 'prismjs';
// import 'prismjs/themes/prism.css'; // Import Prism's CSS for styling
import 'prismjs/themes/prism-solarizedlight.css'

interface CodeBlockProps {
    language: string;
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
    useEffect(() => {
        Prism.highlightAll(); // Highlight the code when component mounts
    }, [code]);

    return (
        <pre className="overflow-x-auto">
            <code className={`language-${language}`}>
                {code}
            </code>
        </pre>
    );
};

export default CodeBlock;
