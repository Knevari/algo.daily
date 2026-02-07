
import type { TestCase } from "@/lib/testRunner";

export const cppRunner = (userCode: string, testCases: TestCase[]) => {
    const cases = testCases.map(t => {
        const nums = `{${(t.input[0] as number[]).join(', ')}}`;
        const target = t.input[1];
        const expected = `{${(t.expected as number[]).join(', ')}}`;
        return `{${nums}, ${target}, ${expected}}`;
    });

    return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

// User Solution
${userCode}

struct TestCase {
    vector<int> nums;
    int target;
    vector<int> expected;
};

// Helper to print vector
string vec_to_string(const vector<int>& v) {
    stringstream ss;
    ss << "[";
    for(size_t i = 0; i < v.size(); ++i) {
        ss << v[i];
        if(i < v.size() - 1) ss << ", ";
    }
    ss << "]";
    return ss.str();
}

int main() {
    // Hardcoded test cases for simplicity in this demo environment
    // In strict prod, we'd parse JSON stdin
    vector<TestCase> tests = {
        ${cases.map(c => `{${c}}`).join(',\n        ')}
    };

    Solution sol;
    cout << "---JSON_START---" << endl;
    cout << "[";
    
    for(size_t i = 0; i < tests.size(); ++i) {
        vector<int> actual = sol.twoSum(tests[i].nums, tests[i].target);
        bool passed = actual == tests[i].expected;
        
        cout << "{"
             << "\"passed\": " << (passed ? "true" : "false") << ", "
             << "\"input\": " << "\"" << vec_to_string(tests[i].nums) << ", " << tests[i].target << "\", "
             << "\"expected\": " << "\"" << vec_to_string(tests[i].expected) << "\", "
             << "\"actual\": " << "\"" << vec_to_string(actual) << "\", "
             << "\"logs\": []"
             << "}";
             
        if(i < tests.size() - 1) cout << ", ";
    }
    
    cout << "]" << endl;
    cout << "---JSON_END---" << endl;
    return 0;
}
`;
};
