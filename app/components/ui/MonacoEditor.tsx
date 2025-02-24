import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

interface MonacoEditorProps {
    handleChange: (value: string | undefined, event: any) => void;
    // sessionId as a parameter for Monaco component
    sessionId: string;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({ handleChange,sessionId }) => {
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
                defaultValue=" '''代码编辑区域''' "
                onChange={handleChange}
                theme="vs-dark"
            />
        </div>
    );
};

export default MonacoEditor;