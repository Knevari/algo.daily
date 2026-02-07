
import vm from 'vm';
import type { TestCase, TestResult } from "@/lib/testRunner";

export function runJavaScriptServer(userCode: string, testCases: TestCase[]): TestResult[] {
    const results: TestResult[] = [];

    // Wrap user code to ensure 'solution' function is accessible
    // We'll create a sandbox context
    const sandbox = {
        console: {
            log: (...args: any[]) => {
                // Determine which test case context we are in, or just accumulate logs
                // For simplicity in this sync runner, we might not capture per-test logs easily 
                // without complicating the wrapper. We'll leave logs empty or global.
            }
        },
        result: null as any
    };

    vm.createContext(sandbox);

    try {
        // Execute user code to define the function
        vm.runInContext(userCode, sandbox);

        // Check if solution is defined
        // @ts-ignore
        if (typeof sandbox.solution !== 'function') {
            throw new Error("Function 'solution' is not defined.");
        }

        // Run test cases
        for (const test of testCases) {
            const inputs = JSON.stringify(test.input).slice(1, -1); // remove brackets to pass args
            // Basic way to call: solution(...args)
            // But inputs is an array from the test case object

            // Construct the function call in the sandbox
            // We pass the arguments directly via a wrapper in the sandbox to handle spread safely

            // Safer approach:
            // 1. Inject args into sandbox
            // 2. Call solution

            // @ts-ignore
            sandbox.currentArgs = test.input;

            const executionScript = `solution(...currentArgs)`;

            let actual: any;
            let logs: string[] = [];

            try {
                actual = vm.runInContext(executionScript, sandbox);
            } catch (err: any) {
                actual = "Error";
                logs.push(err.message);
            }

            // Compare result (naive JSON stringify comparison for arrays/objects)
            const actualStr = JSON.stringify(actual);
            const expectedStr = JSON.stringify(test.expected);
            const passed = actualStr === expectedStr;

            results.push({
                passed,
                input: JSON.stringify(test.input),
                expected: expectedStr,
                actual: actualStr,
                logs
            });
        }

    } catch (e: any) {
        // Syntax error or global execution error
        return testCases.map(tc => ({
            passed: false,
            input: JSON.stringify(tc.input),
            expected: JSON.stringify(tc.expected),
            actual: "Syntax/Runtime Error",
            logs: [e.message]
        }));
    }

    return results;
}
