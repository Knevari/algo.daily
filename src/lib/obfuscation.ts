/**
 * Obfuscates text by replacing middle characters with dots,
 * preserving only the first and last characters of words.
 */
export function mumble(text: string): string {
    // Strip HTML tags to prevent breaking the UI with scrambled tags
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
