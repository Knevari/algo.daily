import type { ICodeExecutionService } from "../../../core/application/ports/OutboundPorts";
import { LocalJSAdapter } from "./LocalJSAdapter";
import { PistonAdapter } from "./PistonAdapter";

export class UnifiedCodeExecutionAdapter implements ICodeExecutionService {
    constructor(
        private localJsAdapter: LocalJSAdapter,
        private pistonAdapter: PistonAdapter
    ) { }

    async execute(language: string, code: string, testCases: any[]): Promise<any> {
        if (language === 'javascript') {
            return this.localJsAdapter.execute(language, code, testCases);
        }
        return this.pistonAdapter.execute(language, code, testCases);
    }
}

