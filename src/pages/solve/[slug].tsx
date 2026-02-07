import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CodeEditor } from "@/components/CodeEditor";
import { runJavaScript, type TestCase, type TestResult } from "@/lib/testRunner";

// Mock Data (In real app, fetch from DB based on slug)
const PROBLEM_DATA: Record<string, any> = {
    "two-sum": {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.",
        starterCode: `function solution(nums, target) {
    // Write your code here
    
    return [];
}`,
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] }
        ]
    }
};

export default function SolvePage() {
    const router = useRouter();
    const { slug } = router.query;

    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [activeTab, setActiveTab] = useState<'description' | 'results'>('description');

    const problem = PROBLEM_DATA[slug as string] || PROBLEM_DATA["two-sum"];

    useEffect(() => {
        if (problem) {
            setCode(problem.starterCode);
        }
    }, [problem]);

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('results');

        // Slight delay to simulate processing and let UI update
        await new Promise(resolve => setTimeout(resolve, 500));

        const testResults = await runJavaScript(code, problem.testCases);
        setResults(testResults);
        setIsRunning(false);
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
            <Head>
                <title>Solve: {problem.title} | AlgoDaily</title>
            </Head>

            {/* Header */}
            <header className="h-14 border-b border-border bg-bg-secondary/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-text-muted hover:text-text-primary transition-colors font-mono text-sm">
                        &larr; cd ..
                    </Link>
                    <span className="h-4 w-[1px] bg-border"></span>
                    <h1 className="font-bold font-mono text-lg">{problem.title}</h1>
                </div>

                <div className="flex items-center gap-4">
                    <span className="px-2 py-0.5 rounded-sm font-mono text-[10px] uppercase tracking-wider font-bold bg-accent-green/10 text-accent-green border border-accent-green/20">
                        Easy
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Description & Results */}
                <div className="w-1/2 border-r border-border flex flex-col bg-bg-secondary/20">
                    <div className="flex border-b border-border">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`px-6 py-3 font-mono text-sm font-bold border-b-2 transition-colors ${activeTab === 'description'
                                ? 'border-accent-primary text-text-primary bg-accent-primary/5'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                                }`}
                        >
                            README.md
                        </button>
                        <button
                            onClick={() => setActiveTab('results')}
                            className={`px-6 py-3 font-mono text-sm font-bold border-b-2 transition-colors ${activeTab === 'results'
                                ? 'border-accent-primary text-text-primary bg-accent-primary/5'
                                : 'border-transparent text-text-muted hover:text-text-primary'
                                }`}
                        >
                            CONSOLE_OUTPUT
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-bg-tertiary scrollbar-track-transparent">
                        {activeTab === 'description' ? (
                            <div className="prose prose-invert max-w-none">
                                <h2 className="text-2xl font-bold mb-4 font-mono">Description</h2>
                                <p className="whitespace-pre-wrap text-text-secondary leading-relaxed">
                                    {problem.description}
                                </p>

                                <h3 className="text-xl font-bold mt-8 mb-4 font-mono">Examples</h3>
                                <div className="space-y-4">
                                    {problem.testCases.slice(0, 2).map((test: TestCase, i: number) => (
                                        <div key={i} className="bg-bg-tertiary rounded-md p-4 border border-border font-mono text-sm">
                                            <div className="mb-2">
                                                <span className="text-text-muted">Input:</span>{" "}
                                                <span className="text-accent-secondary">nums = {JSON.stringify(test.input[0])}, target = {JSON.stringify(test.input[1])}</span>
                                            </div>
                                            <div>
                                                <span className="text-text-muted">Output:</span>{" "}
                                                <span className="text-accent-green">{JSON.stringify(test.expected)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.length === 0 ? (
                                    <div className="text-center py-10 text-text-muted font-mono">
                                        // Run code to see results...
                                    </div>
                                ) : (
                                    results.map((res, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`rounded-md p-4 border font-mono text-sm ${res.passed
                                                ? 'bg-accent-green/5 border-accent-green/20'
                                                : 'bg-error/5 border-error/20'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold">Test Case {i + 1}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${res.passed ? 'bg-accent-green text-bg-primary' : 'bg-error text-white'
                                                    }`}>
                                                    {res.passed ? 'PASSED' : 'FAILED'}
                                                </span>
                                            </div>

                                            <div className="space-y-1 text-xs">
                                                <div className="flex gap-2">
                                                    <span className="text-text-muted min-w-[60px]">Input:</span>
                                                    <span className="text-text-primary truncate">{res.input}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-text-muted min-w-[60px]">Expected:</span>
                                                    <span className="text-accent-green">{res.expected}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-text-muted min-w-[60px]">Actual:</span>
                                                    <span className={`${res.passed ? 'text-accent-green' : 'text-error'}`}>
                                                        {res.actual}
                                                    </span>
                                                </div>
                                                {res.error && (
                                                    <div className="mt-2 text-error bg-error/10 p-2 rounded">
                                                        {res.error}
                                                    </div>
                                                )}
                                                {res.logs.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-border/50 text-text-muted">
                                                        <div className="mb-1 opacity-50">Logs:</div>
                                                        {res.logs.map((log, j) => (
                                                            <div key={j}>{log}</div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 bg-[#05050A] p-4">
                    <CodeEditor
                        initialCode={code}
                        language="javascript"
                        onChange={(value) => setCode(value || "")}
                        onRun={handleRun}
                        isRunning={isRunning}
                    />
                </div>
            </main>
        </div>
    );
}

// Ensure this page is only rendered on client-side for Monaco compatibility if needed, 
// though @monaco-editor/react handles this well generally. 
// But Next.js might complain about 'document' is not defined so we might need dynamic import if strictly required.
// For now, standard export should work with the library.
