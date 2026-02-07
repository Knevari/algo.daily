import { GoogleGenerativeAI } from "@google/generative-ai";
import type { IAIService } from "../../../core/application/ports/OutboundPorts";
import { getExpertHint } from "@/lib/hints";

export class GeminiAdapter implements IAIService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateHint(slug: string, code: string, language: string, level: number): Promise<string> {
        try {
            const model = this.genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: "You are a senior algorithm instructor. Provide a brief, CONCEPTUAL hint for a coding problem. NEVER provide the solution code. Focus on the strategy, data structure, or an edge case. Keep it under 2 sentences. Be encouraging but cryptic."
            });

            const prompt = `
        Problem: ${slug}
        Language: ${language}
        Current User Code:
        \`\`\`${language}
        ${code}
        \`\`\`
        Hint Level Request: ${level + 1}

        Provide the next conceptual hint.
      `;

            const result = await model.generateContent(prompt);
            const hint = result.response.text();
            return hint || getExpertHint(slug, level);
        } catch (err) {
            console.error("Gemini adapter failed, falling back to expert hints", err);
            return getExpertHint(slug, level);
        }
    }
}

