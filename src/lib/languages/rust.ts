
import type { TestCase } from "@/lib/testRunner";

export const rustRunner = (userCode: string, testCases: TestCase[]) => {
    // Rust requires static typing, so we generate specific test runner code based on the problem type (e.g. Two Sum)
    // For a generic approach in this demo, we'll assume the signature exists.
    // In a real production app, we'd need robust parsing or problem-specific templates.

    // Convert JS test cases to Rust vector initialization string
    // This is a simplified generator for the Two Sum problem specifically for this demo

    const cases = testCases.map(t => {
        const nums = `vec![${(t.input[0] as number[]).join(', ')}]`;
        const target = t.input[1];
        const expected = `vec![${(t.expected as number[]).join(', ')}]`;
        return `((${nums}, ${target}), ${expected})`;
    });

    return `
use std::collections::HashMap;

// User Solution
${userCode}

fn main() {
    let test_cases = vec![
        ${cases.join(',\n        ')}
    ];

    let mut results = Vec::new();

    for ((nums, target), expected) in test_cases {
        // Capture stdout if needed, but for now just run
        let actual = Solution::two_sum(nums.clone(), target);
        let passed = actual == expected;
        
        // Simulating JSON output manually to avoid Serde dependency issues in simple Piston env
        let json = format!(
            r#"{{"passed": {}, "input": "{:?}, {}", "expected": "{:?}", "actual": "{:?}", "logs": []}}"#,
            passed, nums, target, expected, actual
        );
        results.push(json);
    }

    println!("---JSON_START---");
    println!("[{}]", results.join(", "));
    println!("---JSON_END---");
}
`;
};
