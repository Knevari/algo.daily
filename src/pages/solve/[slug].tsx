import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CodeEditor } from "@/components/CodeEditor";
import { runJavaScript, type TestCase, type TestResult } from "@/lib/testRunner";
import type { GetServerSideProps } from "next";
import { db } from "@/lib/db";

interface SolvePageProps {
    problem: {
        id: string;
        title: string;
        description: string;
        starterCode: Record<string, string>;
        testCases: TestCase[];
        difficulty: string;
    } | null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const slug = context.params?.slug as string;

    const problemData = await db.problem.findUnique({
        where: { slug },
        select: {
            id: true,
            title: true,
            description: true,
            starterCode: true,
            testCases: true,
            difficulty: true,
        },
    });

    if (!problemData) {
        return {
            notFound: true,
        };
    }

    // Parse JSON fields safely
    let parsedTestCases = [];
    let parsedStarterCode = {};

    try {
        parsedTestCases = JSON.parse(problemData.testCases || "[]");
        parsedStarterCode = JSON.parse(problemData.starterCode || "{}");
    } catch (e) {
        console.error("Failed to parse problem data", e);
    }

    return {
        props: {
            problem: {
                ...problemData,
                testCases: parsedTestCases,
                starterCode: parsedStarterCode,
            },
        },
    };
};

export default function SolvePage({ problem }: SolvePageProps) {
    const router = useRouter();

    const [language, setLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<TestResult[]>([]);
    const [activeTab, setActiveTab] = useState<'description' | 'results'>('description');
    const [hintLevel, setHintLevel] = useState(0);
    const [hints, setHints] = useState<string[]>([]);

    // If problem is somehow null (though SSR handles 404), return fallback
    if (!problem) return <div>Problem not found</div>;

    useEffect(() => {
        // Set code to language specific starter if current code is empty or matches another starter
        setCode(problem.starterCode[language] || "");
    }, [problem, language]);

    const handleRun = async () => {
        setIsRunning(true);
        setActiveTab('results');
        setResults([]);

        // ... (execution logic)
        // Slight delay to simulate processing
        await new Promise(resolve => setTimeout(resolve, 600));

        let testResults: TestResult[] = [];

        if (language === 'javascript') {
            testResults = await runJavaScript(code, problem.testCases);
        } else {
            // ... (Piston logic)
            // Real execution via Piston API
            try {
                let fullCode = "";
                let version = "";

                // Dynamically import language runners
                switch (language) {
                    case 'python': {
                        const { pythonRunner } = await import('@/lib/languages/python');
                        fullCode = pythonRunner(code, problem.testCases);
                        version = "3.10.0";
                        break;
                    }
                    case 'rust': {
                        const { rustRunner } = await import('@/lib/languages/rust');
                        fullCode = rustRunner(code, problem.testCases);
                        version = "1.68.2";
                        break;
                    }
                    case 'cpp': {
                        const { cppRunner } = await import('@/lib/languages/cpp');
                        fullCode = cppRunner(code, problem.testCases);
                        version = "10.2.0";
                        break;
                    }
                    case 'java': {
                        const { javaRunner } = await import('@/lib/languages/java');
                        fullCode = javaRunner(code, problem.testCases);
                        version = "15.0.2";
                        break;
                    }
                }

                const { executePiston } = await import('@/lib/piston');
                const pistonLang = language === 'cpp' ? 'c++' : language;

                const response = await executePiston(pistonLang, version, fullCode);
                // ... (handling response)
                if (response.run.stderr) {
                    // Runtime error
                    console.error("Piston Error:", response.run.stderr);
                    testResults = problem.testCases.map((test: TestCase) => ({
                        passed: false,
                        input: JSON.stringify(test.input),
                        expected: JSON.stringify(test.expected),
                        actual: "Execution Error",
                        logs: [response.run.stderr],
                        error: "Runtime Error"
                    }));
                } else {
                    // Parse JSON output from stdout
                    try {
                        const stdout = response.run.stdout.trim();
                        // console.log("Piston Stdout:", stdout);

                        const jsonStart = stdout.lastIndexOf('---JSON_START---');
                        const jsonEnd = stdout.lastIndexOf('---JSON_END---');

                        if (jsonStart !== -1 && jsonEnd !== -1) {
                            const jsonStr = stdout.substring(jsonStart + '---JSON_START---'.length, jsonEnd).trim();
                            testResults = JSON.parse(jsonStr);
                        } else {
                            throw new Error("Invalid output format");
                        }
                    } catch (e) {
                        console.error("Parse Error:", e, response.run.stdout);
                        testResults = problem.testCases.map((test: TestCase) => ({
                            passed: false,
                            input: JSON.stringify(test.input),
                            expected: JSON.stringify(test.expected),
                            actual: "Parse Error",
                            logs: ["Failed to parse output", response.run.stdout],
                            error: "Output Parsing Failed"
                        }));
                    }
                }

            } catch (e: any) {
                console.error("Execution Failed", e);
                testResults = problem.testCases.map((test: TestCase) => ({
                    passed: false,
                    input: JSON.stringify(test.input),
                    expected: JSON.stringify(test.expected),
                    actual: "System Error",
                    logs: [e.message || "Unknown error"],
                    error: "Execution System Failed"
                }));
            }
        }
        setResults(testResults);
        setIsRunning(false);
    };

    const handleSubmit = async () => {
        setIsRunning(true);
        setActiveTab('results');
        setResults([]); // Clear previous results or show "Verifying..." state

        try {
            const res = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    problemId: problem.id,
                    code: code,
                    language: language
                }),
            });

            const data = await res.json();

            if (data.results) {
                setResults(data.results);
            }

            if (data.success) {
                // Trigger success (Sound)
                const { sounds } = await import('@/lib/sounds');
                sounds.playSuccess();
                // Optionally show toast or modal with data.message and data.xpEarned
            } else {
                // Handle failure (e.g. show error message)
                console.error("Verification failed:", data.message);
                if (!data.results) {
                    // Add a system error result if no detailed results came back
                    setResults([{
                        passed: false,
                        input: "-",
                        expected: "-",
                        actual: "Verification Failed",
                        logs: [data.message],
                        error: data.message
                    }]);
                }
            }

        } catch (e: any) {
            console.error("Failed to submit", e);
            setResults([{
                passed: false,
                input: "-",
                expected: "-",
                actual: "Submission Error",
                logs: [e.message || "Network error"],
                error: "Network Error"
            }]);
        } finally {
            setIsRunning(false);
        }
    };

    const handleGetHint = async () => {
        try {
            const res = await fetch("/api/hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug: router.query.slug,
                    hintLevel: hintLevel,
                    code: code,
                    language: language
                }),
            });

            const data = await res.json();

            if (data.success) {
                setHints(prev => [...prev, data.hint]);
                setHintLevel(data.hintLevel);
                setActiveTab('results');

                // Play a subtle sound
                const { sounds } = await import('@/lib/sounds');
                sounds.playLevelUp();
            }
        } catch (e) {
            console.error("Failed to fetch hint", e);
        }
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
                                {hints.length > 0 && (
                                    <div className="space-y-2 mb-6">
                                        {hints.map((hint, i) => (
                                            <motion.div
                                                key={`hint-${i}`}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="bg-accent-secondary/10 border border-accent-secondary/30 rounded-md p-4 font-mono text-xs text-accent-secondary"
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span>🦉</span>
                                                    <span className="font-bold uppercase tracking-widest text-[10px]">Conceptual Hint #{i + 1}</span>
                                                </div>
                                                <p className="leading-relaxed whitespace-pre-wrap">{hint}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {results.length === 0 ? (
                                    <div className="text-center py-10 text-text-muted font-mono">
                                        {hints.length === 0 ? "// Run code to see results..." : "// Use the hints above to guide your solution!"}
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
                        language={language}
                        onChange={(value) => setCode(value || "")}
                        onRun={handleRun}
                        onSubmit={handleSubmit}
                        onGetHint={handleGetHint}
                        isRunning={isRunning}
                        onChangeLanguage={setLanguage}
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
