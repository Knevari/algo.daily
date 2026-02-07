import type { ICodeExecutionService } from "../../../core/application/ports/OutboundPorts";

export class LocalJSAdapter implements ICodeExecutionService {
    async execute(language: string, code: string, testCases: any[]): Promise<any> {
        if (language !== 'javascript') {
            throw new Error(`LocalJSAdapter only supports javascript, got ${language}`);
        }

        const { runJavaScriptServer } = await import("@/lib/serverJsRunner");
        return runJavaScriptServer(code, testCases);
    }
}

