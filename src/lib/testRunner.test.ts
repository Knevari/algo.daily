import { runJavaScript, type TestCase } from './testRunner';

describe('runJavaScript', () => {
    it('should pass for correct solution', async () => {
        const code = `function solution(a, b) { return a + b; } return solution;`;
        const testCases: TestCase[] = [
            { input: [1, 2], expected: 3 },
            { input: [5, 10], expected: 15 },
        ];

        const results = await runJavaScript(code, testCases);

        expect(results).toHaveLength(2);
        if (results) {
            expect(results![0]!.passed).toBe(true);
            expect(results![1]!.passed).toBe(true);
        }
    });

    it('should fail for incorrect solution', async () => {
        const code = `function solution(a, b) { return a - b; } return solution;`;
        const testCases: TestCase[] = [
            { input: [1, 2], expected: 3 },
        ];

        const results = await runJavaScript(code, testCases);

        if (results) {
            expect(results![0]!.passed).toBe(false);
            expect(results![0]!.actual).toBeDefined();
        }
    });

    it('should handle syntax errors gracefully', async () => {
        const code = `function solution(a, b) { return a + ; } return solution;`;
        const testCases: TestCase[] = [
            { input: [1, 2], expected: 3 },
        ];

        const results = await runJavaScript(code, testCases);

        if (results) {
            expect(results![0]!.passed).toBe(false);
            expect(results![0]!.error).toBeDefined();
        }
    });

    it('should capture console logs', async () => {
        const code = `function solution(a) { console.log('debug', a); return a; } return solution;`;
        const testCases: TestCase[] = [
            { input: [42], expected: 42 },
        ];

        const results = await runJavaScript(code, testCases);

        if (results) {
            expect(results![0]!.passed).toBe(true);
            expect(results![0]!.logs).toContain('debug 42');
        }
    });
});
