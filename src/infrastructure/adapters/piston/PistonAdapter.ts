import type { ICodeExecutionService } from "../../../core/application/ports/OutboundPorts";

export class PistonAdapter implements ICodeExecutionService {
    constructor(private pistonUrl: string = "https://emkc.org/api/v2/piston") { }

    async execute(language: string, code: string, testCases: any[]): Promise<any> {
        const { pythonRunner } = await import('@/lib/languages/python');
        const { rustRunner } = await import('@/lib/languages/rust');
        const { cppRunner } = await import('@/lib/languages/cpp');
        const { javaRunner } = await import('@/lib/languages/java');
        const { executePiston } = await import('@/lib/piston');

        let fullCode = "";
        let version = "";

        switch (language) {
            case 'python':
                fullCode = pythonRunner(code, testCases);
                version = "3.10.0";
                break;
            case 'rust':
                fullCode = rustRunner(code, testCases);
                version = "1.68.2";
                break;
            case 'cpp':
                fullCode = cppRunner(code, testCases);
                version = "10.2.0";
                break;
            case 'java':
                fullCode = javaRunner(code, testCases);
                version = "15.0.2";
                break;
            default:
                throw new Error(`Unsupported language for Piston: ${language}`);
        }

        const pistonLang = language === 'cpp' ? 'c++' : language;
        const response = await executePiston(pistonLang, version, fullCode);

        if (response.run.stderr) {
            throw new Error(response.run.stderr);
        }

        const stdout = response.run.stdout.trim();
        const jsonStart = stdout.lastIndexOf('---JSON_START---');
        const jsonEnd = stdout.lastIndexOf('---JSON_END---');

        if (jsonStart !== -1 && jsonEnd !== -1) {
            const jsonStr = stdout.substring(jsonStart + '---JSON_START---'.length, jsonEnd).trim();
            return JSON.parse(jsonStr);
        } else {
            throw new Error("Failed to parse execution results from Piston output");
        }
    }
}

