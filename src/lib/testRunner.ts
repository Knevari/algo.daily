
export interface TestCase {
    input: any[];
    expected: any;
}

export interface TestResult {
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
    error?: string;
    logs: string[];
}

export async function runJavaScript(code: string, testCases: TestCase[]): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const test of testCases) {
        const logs: string[] = [];

        // Mock console.log
        const mockConsole = {
            log: (...args: any[]) => {
                logs.push(args.map(a =>
                    typeof a === 'object' ? JSON.stringify(a) : String(a)
                ).join(' '));
            }
        };

        try {
            // Function constructor to create a sandboxed-ish environment
            // This is NOT secure for untrusted code in a real multi-tenant app, 
            // but fine for a client-side portfolio where the user runs their own code in their own browser.
            const fn = new Function('console', `
                ${code}
                return solution;
            `);

            const solutionFn = fn(mockConsole);

            if (typeof solutionFn !== 'function') {
                throw new Error("Code must end with 'return solution' or define a solution function.");
            }

            const startTime = performance.now();
            const result = solutionFn(...test.input);
            const endTime = performance.now();

            // Check correctness (simple JSON stringify comparison for now)
            const actualStr = JSON.stringify(result);
            const expectedStr = JSON.stringify(test.expected);

            const passed = actualStr === expectedStr;

            results.push({
                passed,
                input: JSON.stringify(test.input),
                expected: expectedStr,
                actual: actualStr === undefined ? "undefined" : actualStr,
                logs
            });

        } catch (err: any) {
            results.push({
                passed: false,
                input: JSON.stringify(test.input),
                expected: JSON.stringify(test.expected),
                actual: "Error",
                error: err.message || String(err),
                logs
            });
        }
    }

    return results;
}
