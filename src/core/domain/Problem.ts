export interface ProblemProps {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    category: string;
    description: string;
    starterCode: string; // JSON string
    testCases: string;   // JSON string
    externalUrl: string;
    weekNumber?: number;
}

export class Problem {
    constructor(private props: ProblemProps) { }

    get id() { return this.props.id; }
    get title() { return this.props.title; }
    get slug() { return this.props.slug; }
    get weekNumber() { return this.props.weekNumber; }

    getProperties() {
        return { ...this.props };
    }

    // Domain logic for content protection
    getGatedContent(isPro: boolean) {
        if (isPro || this.props.weekNumber === 1) {
            return {
                description: this.props.description,
                starterCode: this.props.starterCode,
                testCases: this.props.testCases
            };
        }

        // Obfuscated content for non-pro users
        return {
            description: this.obfuscate(this.props.description),
            starterCode: "{}", // Locked
            testCases: "[]"    // Locked
        };
    }

    private obfuscate(text: string): string {
        const plainText = text.replace(/<[^>]*>?/gm, '');
        return plainText.split(' ').map(word => {
            if (word.length <= 3) return ".".repeat(word.length);
            const first = word[0];
            const last = word[word.length - 1];
            let result = first || "";
            for (let i = 1; i < word.length - 1; i++) {
                result += ".";
            }
            result += last || "";
            return result;
        }).join(' ');
    }
}

