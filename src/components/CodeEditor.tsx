import Editor from "@monaco-editor/react";
import { useRef, useState, useEffect } from "react";

interface CodeEditorProps {
    initialCode: string;
    language: string;
    onChange: (value: string | undefined) => void;
    onRun: () => void;
    onSubmit: () => void;
    isRunning: boolean;
    onChangeLanguage?: (lang: string) => void;
    onGetHint?: () => void;
}

export function CodeEditor({ initialCode, language, onChange, onRun, onSubmit, isRunning, onChangeLanguage, onGetHint }: CodeEditorProps) {
    const editorRef = useRef<any>(null);
    const vimModeRef = useRef<any>(null);
    const [isVimEnabled, setIsVimEnabled] = useState(false);

    // Load Vim preference on mount
    useEffect(() => {
        const savedVim = localStorage.getItem("algodaily_vim_enabled");
        if (savedVim === "true") {
            setIsVimEnabled(true);
        }
    }, []);

    // Handle Vim Mode Toggle
    useEffect(() => {
        if (!editorRef.current) return;

        const toggleVim = async () => {
            if (isVimEnabled) {
                const { initVimMode } = await import("monaco-vim");
                // The vim status bar can be added if needed, but for now we'll keep it clean
                // We create a dummy element for the status bar to avoid errors or floating text
                const statusNode = document.getElementById('vim-status-bar');
                vimModeRef.current = initVimMode(editorRef.current, statusNode);
            } else {
                if (vimModeRef.current) {
                    vimModeRef.current.dispose();
                    vimModeRef.current = null;
                }
            }
        };

        toggleVim();
        localStorage.setItem("algodaily_vim_enabled", String(isVimEnabled));

        return () => {
            if (vimModeRef.current) {
                vimModeRef.current.dispose();
            }
        };
    }, [isVimEnabled]);

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

        // Re-trigger Vim initialization if it was enabled
        if (isVimEnabled) {
            import("monaco-vim").then(({ initVimMode }) => {
                const statusNode = document.getElementById('vim-status-bar');
                vimModeRef.current = initVimMode(editor, statusNode);
            });
        }
    }

    return (
        <div className="h-full w-full relative group border border-border rounded-md overflow-hidden bg-[#05050A] flex flex-col">
            <div className="h-10 bg-bg-tertiary border-b border-border flex items-center px-4 justify-between z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></span>
                    <span className="ml-2 text-xs font-mono text-text-muted">editor.tsx</span>
                </div>
                <div className="flex items-center gap-4">
                    {/* Get Hint Button */}
                    <button
                        onClick={onGetHint}
                        className="flex items-center gap-x-1 px-2 py-1 rounded border border-accent-secondary/30 text-accent-secondary text-[10px] font-mono hover:bg-accent-secondary/10 transition-all hover:scale-105"
                        title="Get a conceptual hint"
                    >
                        <span>🦉</span>
                        <span>GET_HINT</span>
                    </button>

                    {/* Vim Toggle */}
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono transition-colors ${isVimEnabled ? 'text-accent-primary' : 'text-text-muted'}`}>VIM_MODE</span>
                        <button
                            onClick={() => setIsVimEnabled(!isVimEnabled)}
                            className={`w-8 h-4 rounded-full relative transition-colors ${isVimEnabled ? 'bg-accent-primary/50' : 'bg-bg-primary border border-border'}`}
                        >
                            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${isVimEnabled ? 'left-4 bg-accent-primary' : 'left-0.5 bg-text-muted'}`} />
                        </button>
                    </div>

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

            <div className="flex-1 min-h-0 relative">
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
                        cursorBlinking: isVimEnabled ? "blink" : "phase",
                        cursorSmoothCaretAnimation: "on",
                        renderLineHighlight: "all",
                    }}
                    path={`file.${language}`} // Force new model on language change
                />

                {/* Vim Status Bar (Hidden but present for monaco-vim) */}
                <div id="vim-status-bar" className="absolute bottom-0 left-0 right-0 bg-bg-tertiary text-text-muted font-mono text-[10px] px-2 h-4 pointer-events-none opacity-50" />
            </div>

            {/* Run & Submit Buttons Overlay */}
            <div className="absolute bottom-6 right-4 z-20 flex gap-2">
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
