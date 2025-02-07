// 'use client';
//
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import * as monaco from 'monaco-editor';
//
// interface MonacoEditorProps {
//     value?: string;
//     language?: string;
//     onChange?: (value: string) => void;
// }
//
// const MonacoEditor: React.FC<MonacoEditorProps> = ({ value, language, onChange }) => {
//     const editorRef = useRef<HTMLDivElement | null>(null);
//     const editor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
//     const [isEditorLoaded, setIsEditorLoaded] = useState(false);
//
//     const handleOnChange = useCallback((newValue: string) => {
//         onChange && onChange(newValue);
//     }, [onChange]);
//
//     useEffect(() => {
//         let isMounted = true;
//         let monacoInstance: monaco.editor.IStandaloneCodeEditor | null = null;
//
//         const createEditor = () => {
//             if (editorRef.current) {
//                 monacoInstance = monaco.editor.create(editorRef.current, {
//                     value: value || '',
//                     language: language || 'python',
//                 });
//                 editor.current = monacoInstance;
//                 setIsEditorLoaded(true);
//
//                 monacoInstance.onDidChangeModelContent(() => {
//                     if(monacoInstance){
//                         handleOnChange(monacoInstance.getValue());
//                     }
//                 });
//
//                 if (value) monacoInstance.setValue(value);
//                 if (language) {
//                     const model = monacoInstance.getModel();
//                     if (model) {
//                         monaco.editor.setModelLanguage(model, language);
//                     }
//                 }
//             }
//         };
//
//         const loadMonaco = async () => {
//             if (typeof window !== 'undefined' && (window as any).monaco) {
//                 createEditor();
//             } else if (typeof window !== 'undefined') {
//                 const monacoRequire = require.context('monaco-editor/esm/vs', false, /\.js$/);
//                 window.MonacoEnvironment = {
//                     getWorkerUrl: function (moduleId, label) {
//                         return monacoRequire(`./${label}.worker.js`, true);
//                     },
//                 };
//                 import('monaco-editor').then((monaco) => {
//                     (window as any).monaco = monaco;
//                     createEditor();
//                 });
//             }
//         };
//
//         if (editorRef.current && !editor.current) {
//             loadMonaco();
//         } else if (editorRef.current && editor.current && isEditorLoaded) {
//             if (value !== editor.current.getValue()) {
//                 editor.current.setValue(value || '');
//             }
//             const model = editor.current.getModel();
//             if (model && language && model.getLanguageId() !== language) {
//                 monaco.editor.setModelLanguage(model, language);
//             }
//         }
//
//         const handleResize = () => editor.current?.layout();
//         window.addEventListener('resize', handleResize);
//
//         return () => {
//             isMounted = false;
//             window.removeEventListener('resize', handleResize);
//
//             if (monacoInstance) {
//                 if (isMounted) {
//                     monacoInstance.dispose();
//                 }
//                 monacoInstance = null;
//                 editor.current = null;
//                 setIsEditorLoaded(false);
//             }
//         };
//     }, [language, value, handleOnChange]);
//
//     return (
//         <div ref={editorRef} className="h-screen border border-gray-300 p-2 overflow-auto" />
//     );
// };
//
// export default MonacoEditor;


// components/MonacoEditor.tsx
// components/ui/MonacoEditor.tsx
// import React from 'react';
// import Editor from '@monaco-editor/react'; // 使用默认导入
//
// interface MonacoEditorProps {
//     handleChange: (value: string | undefined, event: any) => void;
// }
//
// const MonacoEditor: React.FC<MonacoEditorProps> = ({ handleChange }) => {
//     return (
//         <Editor
//             height="600px"
//             defaultLanguage="python"
//             defaultValue="// Your code here"
//             onChange={handleChange}
//             theme="vs-dark"
//         />
//     );
// };
//
// export default MonacoEditor; // 确保这里是默认导出


import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
    handleChange: (value: string | undefined, event: any) => void;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ handleChange }) => {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const [editorHeight, setEditorHeight] = useState<string>('600px'); // 默认高度

    useEffect(() => {
        const updateHeight = () => {
            if (editorRef.current) {
                const height = editorRef.current?.clientHeight; // 获取当前区域的高度
                setEditorHeight(`${height}px`);
            }
        };

        // 初始获取高度
        updateHeight();

        // 监听窗口大小变化
        window.addEventListener('resize', updateHeight);

        // 清理事件监听
        return () => {
            window.removeEventListener('resize', updateHeight);
        };
    }, []);

    return (
        <div ref={editorRef} style={{ height: '85%' }}>
            <Editor
                height={editorHeight} // 使用动态高度
                defaultLanguage="python"
                defaultValue="// Your code here"
                onChange={handleChange}
                theme="vs-dark"
            />
        </div>
    );
};

export default MonacoEditor;