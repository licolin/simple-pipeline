'use client';

import * as monaco from 'monaco-editor';
import { useEffect, useRef } from 'react';

interface MonacoEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function MonacoEditor({ value, onChange }: MonacoEditorProps) {
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // 初始化 Monaco Editor
        editorRef.current = monaco.editor.create(containerRef.current!, {
            value,
            language: 'python',
            theme: 'vs-dark',
            automaticLayout: true,
        });

        // 创建 Pyright 会话
        const initializeSession = async () => {
            const response = await fetch('/api/pyright/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const { sessionId } = await response.json();
            sessionIdRef.current = sessionId;

            // 设置初始内容
            await updateDiagnostics(value);
        };

        initializeSession().then(r => console.log("execute"));

        // 处理内容变化
        if ("onDidChangeModelContent" in editorRef.current) {
            editorRef.current.onDidChangeModelContent(() => {
                const newValue = editorRef.current?.getValue() || '';
                onChange(newValue);
                updateDiagnostics(newValue).then(r => console.log(value));
            });
        }

        // 配置自动补全
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: async (model, position) => {
                if (!sessionIdRef.current) return { suggestions: [] };

                console.log("line "+position.lineNumber + ": character" + position.column);
                const response = await fetch(
                    `/api/pyright/session/${sessionIdRef.current}/completion`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            position:{
                                line: position.lineNumber,
                                character: position.column,
                            },
                            code: model.getValue(),
                        }),
                    }
                );
                const data = await response.json();

                // 从返回数据中提取 completionList
                const completionList = data.completionList || {};
                const items = !Array.isArray(completionList.items) ? [] : completionList.items;

                // 转换为 Monaco Editor 期望的补全项格式
                const suggestions = items.map((item: any) => ({
                    label: item.label || item,  // 假设服务端返回的 item 有 label 或直接是字符串
                    kind: monaco.languages.CompletionItemKind[item.kind] || monaco.languages.CompletionItemKind.Text,
                    insertText: item.insertText || item.label || item,
                    detail: item.detail || '',
                    documentation: item.documentation || '',
                    range: {
                        startLineNumber: position.lineNumber,
                        startColumn: position.column,
                        endLineNumber: position.lineNumber,
                        endColumn: position.column
                    }
                }));

                console.log("suggestion is " + JSON.stringify(suggestions));

                return {
                    suggestions,
                    isIncomplete: completionList.isIncomplete || false
                };
            },
        });

        return () => {
            if (sessionIdRef.current) {
                fetch(`/api/pyright/session/${sessionIdRef.current}`, {
                    method: 'DELETE',
                });
            }
            editorRef.current?.dispose();
        };
    }, []);

    const updateDiagnostics = async (content: string) => {
        if (!sessionIdRef.current || !editorRef.current) return;

        console.log("content "+content);
        const response = await fetch(
            `/api/pyright/session/${sessionIdRef.current}/diagnostics`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: content }),
            }
        );
        const diagnostics = await response.json();

        console.log("diagnostics "+JSON.stringify(diagnostics));
        const diagnosticsArray = Array.isArray(diagnostics.diagnostics) ? diagnostics.diagnostics : [];


        if ("getModel" in editorRef.current) {
            monaco.editor.setModelMarkers(
                editorRef.current.getModel()!,
                'pyright',
                diagnosticsArray.map((diag: any) => ({
                    startLineNumber: diag.range.start.line,
                    startColumn: diag.range.start.character,
                    endLineNumber: diag.range.end.line,
                    endColumn: diag.range.end.character,
                    message: diag.message,
                    severity: monaco.MarkerSeverity.Error,
                }))
            );
        }
    };

    return <div ref={containerRef} style={{ height: '85%', width: '100%' }} />;
}