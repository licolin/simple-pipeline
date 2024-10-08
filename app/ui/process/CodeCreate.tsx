"use client";
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

export interface CodeEditorHandle {
    getCode: () => string;
}

interface CodeEditorProps {
    script: string;
}

export const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(({ script }, ref) => {
    const [code, setCode] = useState(script);

    const handleChange = (newCode: string) => {
        setCode(newCode);
    };

    useImperativeHandle(ref, () => ({
        getCode: () => code,
    }));

    return (
        <AceEditor
            height="95vh"
            width="47vw"
            mode="python"
            theme="pastel_on_dark"
            value={code}
            onChange={handleChange}
            name="python-code-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
                showLineNumbers: true,
                tabSize: 4,
            }}
        />
    );
});
