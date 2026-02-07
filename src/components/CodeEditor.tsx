import Editor from "@monaco-editor/react";
import { useRef, useState } from "react";

interface CodeEditorProps {
    initialCode: string;
    language: string;
    onChange: (value: string | undefined) => void;
    onRun: () => void;
    onSubmit: () => void;
    isRunning: boolean;
    onChangeLanguage?: (lang: string) => void;
}

export function CodeEditor({ initialCode, language, onChange, onRun, onSubmit, isRunning, onChangeLanguage }: CodeEditorProps) {
    const editorRef = useRef<any>(null);

    function handleEditorDidMount(editor: any, monaco: any) {
        editorRef.current = editor;

        // Define Creative Coder theme
        monaco.editor.defineTheme('creative-coder', {
            base: 'vs-dark',
            inherit: true,
            rules: [
                { token: 'comment', foreground: '6272a4' },
                { token: 'keyword', foreground: 'ff79c6' },
                { token: 'string', foreground: 'f1fa8c' },
                { token: 'number', foreground: 'bd93f9' },
                { token: 'type', foreground: '8be9fd' },
            ],
            colors: {
                'editor.background': '#05050A', // Deep space black
                'editor.foreground': '#f8f8f2',
                'editorCursor.foreground': '#ff79c6',
                'editor.lineHighlightBackground': '#12121A',
                'editorLineNumber.foreground': '#6272a4',
                'editor.selectionBackground': '#44475a',
                'editor.inactiveSelectionBackground': '#44475a80',
            }
        });

        monaco.editor.setTheme('creative-coder');
    }

    return (
        <div className="h-full w-full relative group border border-border rounded-md overflow-hidden bg-[#05050A]">
            <div className="absolute top-0 left-0 right-0 h-8 bg-bg-tertiary border-b border-border flex items-center px-4 justify-between z-10">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
                    <span className="ml-2 text-xs font-mono text-text-muted">editor.tsx</span>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={language}
                        onChange={(e) => onChangeLanguage?.(e.target.value)}
                        className="bg-transparent text-xs font-mono text-accent-secondary border border-border rounded px-2 py-1 outline-none hover:border-accent-secondary transition-colors cursor-pointer"
                    >
                        <option value="javascript">JAVASCRIPT</option>
                        <option value="python">PYTHON</option>
                        <option value="cpp">C++</option>
                        <option value="java">JAVA</option>
                        <option value="rust">RUST</option>
                    </select>
                </div>
            </div>

            <div className="pt-10 h-full">
                <Editor
                    height="100%"
                    language={language}
                    value={initialCode}
                    onChange={onChange}
                    onMount={handleEditorDidMount}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: '"JetBrains Mono", monospace',
                        fontLigatures: true,
                        scrollBeyondLastLine: false,
                        padding: { top: 16, bottom: 16 },
                        smoothScrolling: true,
                        cursorBlinking: "phase",
                        cursorSmoothCaretAnimation: "on",
                        renderLineHighlight: "all",
                    }}
                    path={`file.${language}`} // Force new model on language change
                />
            </div>

            {/* Run & Submit Buttons Overlay */}
            <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                <button
                    onClick={onRun}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-transparent border border-accent-primary text-accent-primary font-mono font-bold text-sm rounded-md hover:bg-accent-primary/10 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRunning ? (
                        <>
                            <span className="animate-spin">⟳</span>
                            RUNNING...
                        </>
                    ) : (
                        <>
                            <span>▶</span>
                            RUN_CODE
                        </>
                    )}
                </button>
                <button
                    onClick={onSubmit}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 bg-accent-green text-bg-primary font-mono font-bold text-sm rounded-md shadow-lg shadow-accent-green/20 hover:shadow-accent-green/40 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isRunning ? (
                        <>
                            <span className="animate-spin">⟳</span>
                            SUBMITTING...
                        </>
                    ) : (
                        <>
                            <span>✓</span>
                            SUBMIT
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
