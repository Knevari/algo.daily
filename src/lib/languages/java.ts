
import type { TestCase } from "@/lib/testRunner";

export const javaRunner = (userCode: string, testCases: TestCase[]) => {
    // Construct Java array initializers
    const casesGenerator = testCases.map(t => {
        const nums = `{${(t.input[0] as number[]).join(', ')}}`;
        const target = t.input[1];
        const expected = `{${(t.expected as number[]).join(', ')}}`;
        return `new TestItem(new int[]${nums}, ${target}, new int[]${expected})`;
    });

    return `
import java.util.*;

// User Code
${userCode}

class TestItem {
    int[] nums;
    int target;
    int[] expected;
    
    TestItem(int[] nums, int target, int[] expected) {
        this.nums = nums;
        this.target = target;
        this.expected = expected;
    }
}

public class Main {
    public static void main(String[] args) {
        TestItem[] tests = new TestItem[] {
            ${casesGenerator.join(',\n            ')}
        };
        
        Solution sol = new Solution();
        List<String> results = new ArrayList<>();
        
        for(TestItem t : tests) {
            try {
                int[] actual = sol.twoSum(t.nums, t.target);
                boolean passed = Arrays.equals(actual, t.expected);
                
                String json = String.format(
                    "{\\"passed\\": %b, \\"input\\": \\"%s, %d\\", \\"expected\\": \\"%s\\", \\"actual\\": \\"%s\\", \\"logs\\": []}",
                    passed,
                    Arrays.toString(t.nums), t.target,
                    Arrays.toString(t.expected),
                    Arrays.toString(actual)
                );
                results.add(json);
            } catch (Exception e) {
                String json = String.format(
                    "{\\"passed\\": false, \\"input\\": \\"%s\\", \\"expected\\": \\"%s\\", \\"actual\\": \\"Error: %s\\", \\"logs\\": []}",
                    Arrays.toString(t.nums),
                    Arrays.toString(t.expected),
                    e.getMessage()
                );
                results.add(json);
            }
        }
        
        System.out.println("---JSON_START---");
        System.out.println("[" + String.join(", ", results) + "]");
        System.out.println("---JSON_END---");
    }
}
`;
};
