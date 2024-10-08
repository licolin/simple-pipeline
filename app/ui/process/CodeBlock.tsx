"use client"
import React, { useState } from 'react';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

export function CodeEditor({script}:{script:string}){
    const [code, setCode] = useState(script);

    const handleChange = (newCode: React.SetStateAction<string>) => {
        setCode(newCode);
    };

    return (
        <AceEditor
            height="95vh"
            width="40vw"
            mode="python"
            theme="pastel_on_dark"
            value={code}
            // onChange={handleCodeChange}
            name="python-code-editor"
            editorProps={{$blockScrolling: true}}
            setOptions={{
                showLineNumbers: true,
                tabSize: 4,
            }}
        />
    );
}