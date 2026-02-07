
export const EXPERT_HINTS: Record<string, string[]> = {
    "two-sum": [
        "Think about how a Hash Map could store the numbers you've already seen. If you are looking for target - x, can you find it in O(1) time?",
        "Complementary approach: For every number 'x', the value we need is 'target - x'. If we store visited numbers in a Map, we can check for existence instantly.",
        "One-pass vs Two-pass: You can actually build the map and check for the complement in the same iteration."
    ],
    "contains-duplicate": [
        "A Set (or Hash Set) provides average O(1) time for both insertions and checking if a value exists. This could solve it in O(N).",
        "If space is a constraint, sorting the array first puts duplicates next to each other, allowing for an O(N log N) time and O(1) space solution.",
        "The most efficient way is usually a single pass with a Set: if the current element is already in the Set, you've found a duplicate!"
    ],
    "valid-anagram": [
        "Sorting both strings and comparing them is a simple O(N log N) solution. Is there a way to do it in O(N)?",
        "Consider using a frequency counter (Hash Map or fixed-size array) to count character occurrences in both strings.",
        "If the strings are anagrams, their character counts must be identical. Can you use one counter to 'add' for string A and 'subtract' for string B?"
    ],
    "group-anagrams": [
        "If you sort the characters of each word, all anagrams result in the same 'key'. Can you use this key in a Hash Map?",
        "Instead of sorting, can you represent the character counts (e.g., a tuple of 26 integers) as a key for your Hash Map?",
        "The goal is to group words: Map<sorted_string, string[]>. Every time you find a sorted string, append the original word to its list."
    ]
};

export function getExpertHint(slug: string, hintLevel: number): string {
    const hints = EXPERT_HINTS[slug] || [
        "Analyze the constraints: Is an O(N²) solution acceptable, or do you need O(N) or O(N log N)?",
        "Consider using a common data structure like a Set, Map, or Stack to optimize lookups.",
        "Think about edge cases: Empty input, negative numbers, or extremely large inputs."
    ];

    return hints[Math.min(hintLevel, hints.length - 1)] || "Analyze the problem carefully.";
}
