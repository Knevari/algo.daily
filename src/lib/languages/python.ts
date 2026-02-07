
export const pythonRunner = (userCode: string, testCases: any[]) => {
    const testCasesJson = JSON.stringify(testCases);

    return `
import json
import sys

# User Solution
${userCode}

# Test Runner logic
def run_tests():
    test_cases_json = '${testCasesJson}'
    test_cases = json.loads(test_cases_json)
    results = []

    for i, test in enumerate(test_cases):
        inputs = test['input']
        expected = test['expected']
        
        try:
            # Check if inputs is a list for multiple arguments
            if isinstance(inputs, list):
                actual = solution(*inputs)
            else:
                actual = solution(inputs)
                
            passed = actual == expected
            results.append({
                "passed": passed,
                "input": str(inputs),
                "expected": str(expected),
                "actual": str(actual),
                "logs": []
            })
        except Exception as e:
            results.append({
                "passed": False,
                "input": str(inputs),
                "expected": str(expected),
                "actual": "Error",
                "logs": [str(e)]
            })

    print("---JSON_START---")
    print(json.dumps(results))
    print("---JSON_END---")

if __name__ == "__main__":
    run_tests()
`;
};
