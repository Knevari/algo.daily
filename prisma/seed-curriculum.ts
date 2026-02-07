import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 12-week curriculum structure
const curriculum = [
    {
        weekNumber: 1,
        title: "Arrays & Hashing Fundamentals",
        description: "Master the basics of array manipulation and hash map patterns.",
        category: "Arrays & Hashing",
        problems: [
            // Day 1
            {
                slug: "two-sum",
                title: "Two Sum",
                difficulty: "Easy",
                day: 1,
                order: 1,
                testCases: JSON.stringify([
                    { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
                    { input: [[3, 2, 4], 6], expected: [1, 2] },
                    { input: [[3, 3], 6], expected: [0, 1] }
                ]),
                description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
                starterCode: JSON.stringify({
                    javascript: `function solution(nums, target) {
    // Write your code here
    
    return [];
}`,
                    python: `def solution(nums, target):
    # Write your code here
    
    return []`,
                    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
                    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        
    }
}`,
                    rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        vec![]
    }
}`
                })
            },
            {
                slug: "contains-duplicate",
                title: "Contains Duplicate",
                difficulty: "Easy",
                day: 1,
                order: 2,
                testCases: JSON.stringify([
                    { input: [[1, 2, 3, 1]], expected: true },
                    { input: [[1, 2, 3, 4]], expected: false },
                    { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true }
                ]),
                description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
                starterCode: JSON.stringify({
                    javascript: `function solution(nums) {
    // Write your code here
    
}`,
                    python: `def solution(nums):
    # Write your code here
    
    return False`,
                    cpp: `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        
    }
};`,
                    java: `class Solution {
    public boolean containsDuplicate(int[] nums) {
        
    }
}`
                })
            },
            // Day 2
            {
                slug: "valid-anagram",
                title: "Valid Anagram",
                difficulty: "Easy",
                day: 2,
                order: 1,
                testCases: JSON.stringify([
                    { input: ["anagram", "nagaram"], expected: true },
                    { input: ["rat", "car"], expected: false }
                ]),
                description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
                starterCode: JSON.stringify({
                    javascript: `function solution(s, t) {
    // Write your code here
    
}`,
                    python: `def solution(s, t):
    # Write your code here
    
    return False`,
                    java: `class Solution {
    public boolean isAnagram(String s, String t) {
        
    }
}`
                })
            },
            { slug: "group-anagrams", title: "Group Anagrams", difficulty: "Medium", day: 2, order: 2 },
            // Day 3
            { slug: "top-k-frequent-elements", title: "Top K Frequent Elements", difficulty: "Medium", day: 3, order: 1 },
            { slug: "product-of-array-except-self", title: "Product of Array Except Self", difficulty: "Medium", day: 3, order: 2 },
            // Day 4
            { slug: "valid-sudoku", title: "Valid Sudoku", difficulty: "Medium", day: 4, order: 1 },
            { slug: "encode-and-decode-strings", title: "Encode and Decode Strings", difficulty: "Medium", day: 4, order: 2 },
            // Day 5
            { slug: "longest-consecutive-sequence", title: "Longest Consecutive Sequence", difficulty: "Medium", day: 5, order: 1 },
            { slug: "sort-colors", title: "Sort Colors", difficulty: "Medium", day: 5, order: 2 },
            // Day 6
            { slug: "majority-element", title: "Majority Element", difficulty: "Easy", day: 6, order: 1 },
            { slug: "first-missing-positive", title: "First Missing Positive", difficulty: "Hard", day: 6, order: 2 },
            // Day 7
            { slug: "pascals-triangle", title: "Pascal's Triangle", difficulty: "Easy", day: 7, order: 1 },
            { slug: "set-matrix-zeroes", title: "Set Matrix Zeroes", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 2,
        title: "Two Pointers Technique",
        description: "Learn the elegant two pointers approach for sorted arrays and string problems.",
        category: "Two Pointers",
        problems: [
            { slug: "valid-palindrome", title: "Valid Palindrome", difficulty: "Easy", day: 1, order: 1 },
            { slug: "two-sum-ii-input-array-is-sorted", title: "Two Sum II", difficulty: "Medium", day: 1, order: 2 },
            { slug: "3sum", title: "3Sum", difficulty: "Medium", day: 2, order: 1 },
            { slug: "container-with-most-water", title: "Container With Most Water", difficulty: "Medium", day: 2, order: 2 },
            { slug: "trapping-rain-water", title: "Trapping Rain Water", difficulty: "Hard", day: 3, order: 1 },
            { slug: "remove-duplicates-from-sorted-array", title: "Remove Duplicates from Sorted Array", difficulty: "Easy", day: 3, order: 2 },
            { slug: "move-zeroes", title: "Move Zeroes", difficulty: "Easy", day: 4, order: 1 },
            { slug: "squares-of-a-sorted-array", title: "Squares of a Sorted Array", difficulty: "Easy", day: 4, order: 2 },
            { slug: "4sum", title: "4Sum", difficulty: "Medium", day: 5, order: 1 },
            { slug: "sort-colors", title: "Sort Colors", difficulty: "Medium", day: 5, order: 2 },
            { slug: "reverse-string", title: "Reverse String", difficulty: "Easy", day: 6, order: 1 },
            { slug: "is-subsequence", title: "Is Subsequence", difficulty: "Easy", day: 6, order: 2 },
            { slug: "next-permutation", title: "Next Permutation", difficulty: "Medium", day: 7, order: 1 },
            { slug: "intersection-of-two-arrays-ii", title: "Intersection of Two Arrays II", difficulty: "Easy", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 3,
        title: "Sliding Window",
        description: "Master the sliding window pattern for subarray and substring problems.",
        category: "Sliding Window",
        problems: [
            { slug: "best-time-to-buy-and-sell-stock", title: "Best Time to Buy and Sell Stock", difficulty: "Easy", day: 1, order: 1 },
            { slug: "longest-substring-without-repeating-characters", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", day: 1, order: 2 },
            { slug: "longest-repeating-character-replacement", title: "Longest Repeating Character Replacement", difficulty: "Medium", day: 2, order: 1 },
            { slug: "permutation-in-string", title: "Permutation in String", difficulty: "Medium", day: 2, order: 2 },
            { slug: "minimum-window-substring", title: "Minimum Window Substring", difficulty: "Hard", day: 3, order: 1 },
            { slug: "sliding-window-maximum", title: "Sliding Window Maximum", difficulty: "Hard", day: 3, order: 2 },
            { slug: "maximum-average-subarray-i", title: "Maximum Average Subarray I", difficulty: "Easy", day: 4, order: 1 },
            { slug: "max-consecutive-ones-iii", title: "Max Consecutive Ones III", difficulty: "Medium", day: 4, order: 2 },
            { slug: "minimum-size-subarray-sum", title: "Minimum Size Subarray Sum", difficulty: "Medium", day: 5, order: 1 },
            { slug: "fruit-into-baskets", title: "Fruit Into Baskets", difficulty: "Medium", day: 5, order: 2 },
            { slug: "subarray-product-less-than-k", title: "Subarray Product Less Than K", difficulty: "Medium", day: 6, order: 1 },
            { slug: "find-all-anagrams-in-a-string", title: "Find All Anagrams in a String", difficulty: "Medium", day: 6, order: 2 },
            { slug: "grumpy-bookstore-owner", title: "Grumpy Bookstore Owner", difficulty: "Medium", day: 7, order: 1 },
            { slug: "count-number-of-nice-subarrays", title: "Count Number of Nice Subarrays", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 4,
        title: "Stack & Queue",
        description: "Learn stack and queue patterns for parsing and monotonic problems.",
        category: "Stack",
        problems: [
            { slug: "valid-parentheses", title: "Valid Parentheses", difficulty: "Easy", day: 1, order: 1 },
            { slug: "min-stack", title: "Min Stack", difficulty: "Medium", day: 1, order: 2 },
            { slug: "evaluate-reverse-polish-notation", title: "Evaluate Reverse Polish Notation", difficulty: "Medium", day: 2, order: 1 },
            { slug: "generate-parentheses", title: "Generate Parentheses", difficulty: "Medium", day: 2, order: 2 },
            { slug: "daily-temperatures", title: "Daily Temperatures", difficulty: "Medium", day: 3, order: 1 },
            { slug: "car-fleet", title: "Car Fleet", difficulty: "Medium", day: 3, order: 2 },
            { slug: "largest-rectangle-in-histogram", title: "Largest Rectangle in Histogram", difficulty: "Hard", day: 4, order: 1 },
            { slug: "implement-queue-using-stacks", title: "Implement Queue using Stacks", difficulty: "Easy", day: 4, order: 2 },
            { slug: "implement-stack-using-queues", title: "Implement Stack using Queues", difficulty: "Easy", day: 5, order: 1 },
            { slug: "simplify-path", title: "Simplify Path", difficulty: "Medium", day: 5, order: 2 },
            { slug: "decode-string", title: "Decode String", difficulty: "Medium", day: 6, order: 1 },
            { slug: "asteroid-collision", title: "Asteroid Collision", difficulty: "Medium", day: 6, order: 2 },
            { slug: "basic-calculator", title: "Basic Calculator", difficulty: "Hard", day: 7, order: 1 },
            { slug: "next-greater-element-i", title: "Next Greater Element I", difficulty: "Easy", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 5,
        title: "Binary Search",
        description: "Master binary search and its many variants.",
        category: "Binary Search",
        problems: [
            { slug: "binary-search", title: "Binary Search", difficulty: "Easy", day: 1, order: 1 },
            { slug: "search-a-2d-matrix", title: "Search a 2D Matrix", difficulty: "Medium", day: 1, order: 2 },
            { slug: "koko-eating-bananas", title: "Koko Eating Bananas", difficulty: "Medium", day: 2, order: 1 },
            { slug: "find-minimum-in-rotated-sorted-array", title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", day: 2, order: 2 },
            { slug: "search-in-rotated-sorted-array", title: "Search in Rotated Sorted Array", difficulty: "Medium", day: 3, order: 1 },
            { slug: "time-based-key-value-store", title: "Time Based Key-Value Store", difficulty: "Medium", day: 3, order: 2 },
            { slug: "median-of-two-sorted-arrays", title: "Median of Two Sorted Arrays", difficulty: "Hard", day: 4, order: 1 },
            { slug: "first-bad-version", title: "First Bad Version", difficulty: "Easy", day: 4, order: 2 },
            { slug: "find-peak-element", title: "Find Peak Element", difficulty: "Medium", day: 5, order: 1 },
            { slug: "search-insert-position", title: "Search Insert Position", difficulty: "Easy", day: 5, order: 2 },
            { slug: "find-first-and-last-position-of-element-in-sorted-array", title: "Find First and Last Position", difficulty: "Medium", day: 6, order: 1 },
            { slug: "sqrtx", title: "Sqrt(x)", difficulty: "Easy", day: 6, order: 2 },
            { slug: "capacity-to-ship-packages-within-d-days", title: "Capacity To Ship Packages", difficulty: "Medium", day: 7, order: 1 },
            { slug: "split-array-largest-sum", title: "Split Array Largest Sum", difficulty: "Hard", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 6,
        title: "Linked Lists",
        description: "Master linked list manipulation, reversal, and cycle detection.",
        category: "Linked List",
        problems: [
            { slug: "reverse-linked-list", title: "Reverse Linked List", difficulty: "Easy", day: 1, order: 1 },
            { slug: "merge-two-sorted-lists", title: "Merge Two Sorted Lists", difficulty: "Easy", day: 1, order: 2 },
            { slug: "reorder-list", title: "Reorder List", difficulty: "Medium", day: 2, order: 1 },
            { slug: "remove-nth-node-from-end-of-list", title: "Remove Nth Node From End of List", difficulty: "Medium", day: 2, order: 2 },
            { slug: "copy-list-with-random-pointer", title: "Copy List with Random Pointer", difficulty: "Medium", day: 3, order: 1 },
            { slug: "add-two-numbers", title: "Add Two Numbers", difficulty: "Medium", day: 3, order: 2 },
            { slug: "linked-list-cycle", title: "Linked List Cycle", difficulty: "Easy", day: 4, order: 1 },
            { slug: "linked-list-cycle-ii", title: "Linked List Cycle II", difficulty: "Medium", day: 4, order: 2 },
            { slug: "find-the-duplicate-number", title: "Find the Duplicate Number", difficulty: "Medium", day: 5, order: 1 },
            { slug: "lru-cache", title: "LRU Cache", difficulty: "Medium", day: 5, order: 2 },
            { slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "Hard", day: 6, order: 1 },
            { slug: "reverse-nodes-in-k-group", title: "Reverse Nodes in k-Group", difficulty: "Hard", day: 6, order: 2 },
            { slug: "palindrome-linked-list", title: "Palindrome Linked List", difficulty: "Easy", day: 7, order: 1 },
            { slug: "middle-of-the-linked-list", title: "Middle of the Linked List", difficulty: "Easy", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 7,
        title: "Trees (DFS & BFS)",
        description: "Explore tree traversal, depth calculations, and tree construction.",
        category: "Trees",
        problems: [
            { slug: "invert-binary-tree", title: "Invert Binary Tree", difficulty: "Easy", day: 1, order: 1 },
            { slug: "maximum-depth-of-binary-tree", title: "Maximum Depth of Binary Tree", difficulty: "Easy", day: 1, order: 2 },
            { slug: "diameter-of-binary-tree", title: "Diameter of Binary Tree", difficulty: "Easy", day: 2, order: 1 },
            { slug: "balanced-binary-tree", title: "Balanced Binary Tree", difficulty: "Easy", day: 2, order: 2 },
            { slug: "same-tree", title: "Same Tree", difficulty: "Easy", day: 3, order: 1 },
            { slug: "subtree-of-another-tree", title: "Subtree of Another Tree", difficulty: "Easy", day: 3, order: 2 },
            { slug: "lowest-common-ancestor-of-a-binary-search-tree", title: "Lowest Common Ancestor of BST", difficulty: "Medium", day: 4, order: 1 },
            { slug: "binary-tree-level-order-traversal", title: "Binary Tree Level Order Traversal", difficulty: "Medium", day: 4, order: 2 },
            { slug: "binary-tree-right-side-view", title: "Binary Tree Right Side View", difficulty: "Medium", day: 5, order: 1 },
            { slug: "count-good-nodes-in-binary-tree", title: "Count Good Nodes in Binary Tree", difficulty: "Medium", day: 5, order: 2 },
            { slug: "validate-binary-search-tree", title: "Validate Binary Search Tree", difficulty: "Medium", day: 6, order: 1 },
            { slug: "kth-smallest-element-in-a-bst", title: "Kth Smallest Element in a BST", difficulty: "Medium", day: 6, order: 2 },
            { slug: "construct-binary-tree-from-preorder-and-inorder-traversal", title: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", day: 7, order: 1 },
            { slug: "binary-tree-maximum-path-sum", title: "Binary Tree Maximum Path Sum", difficulty: "Hard", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 8,
        title: "Graphs",
        description: "Master graph traversal, connected components, and topological sort.",
        category: "Graphs",
        problems: [
            { slug: "number-of-islands", title: "Number of Islands", difficulty: "Medium", day: 1, order: 1 },
            { slug: "clone-graph", title: "Clone Graph", difficulty: "Medium", day: 1, order: 2 },
            { slug: "max-area-of-island", title: "Max Area of Island", difficulty: "Medium", day: 2, order: 1 },
            { slug: "pacific-atlantic-water-flow", title: "Pacific Atlantic Water Flow", difficulty: "Medium", day: 2, order: 2 },
            { slug: "surrounded-regions", title: "Surrounded Regions", difficulty: "Medium", day: 3, order: 1 },
            { slug: "rotting-oranges", title: "Rotting Oranges", difficulty: "Medium", day: 3, order: 2 },
            { slug: "course-schedule", title: "Course Schedule", difficulty: "Medium", day: 4, order: 1 },
            { slug: "course-schedule-ii", title: "Course Schedule II", difficulty: "Medium", day: 4, order: 2 },
            { slug: "redundant-connection", title: "Redundant Connection", difficulty: "Medium", day: 5, order: 1 },
            { slug: "number-of-connected-components-in-an-undirected-graph", title: "Number of Connected Components", difficulty: "Medium", day: 5, order: 2 },
            { slug: "graph-valid-tree", title: "Graph Valid Tree", difficulty: "Medium", day: 6, order: 1 },
            { slug: "word-ladder", title: "Word Ladder", difficulty: "Hard", day: 6, order: 2 },
            { slug: "alien-dictionary", title: "Alien Dictionary", difficulty: "Hard", day: 7, order: 1 },
            { slug: "shortest-path-in-binary-matrix", title: "Shortest Path in Binary Matrix", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 9,
        title: "Heap / Priority Queue",
        description: "Learn to use heaps for top-K, merge, and scheduling problems.",
        category: "Heap",
        problems: [
            { slug: "kth-largest-element-in-a-stream", title: "Kth Largest Element in a Stream", difficulty: "Easy", day: 1, order: 1 },
            { slug: "last-stone-weight", title: "Last Stone Weight", difficulty: "Easy", day: 1, order: 2 },
            { slug: "k-closest-points-to-origin", title: "K Closest Points to Origin", difficulty: "Medium", day: 2, order: 1 },
            { slug: "kth-largest-element-in-an-array", title: "Kth Largest Element in an Array", difficulty: "Medium", day: 2, order: 2 },
            { slug: "task-scheduler", title: "Task Scheduler", difficulty: "Medium", day: 3, order: 1 },
            { slug: "design-twitter", title: "Design Twitter", difficulty: "Medium", day: 3, order: 2 },
            { slug: "find-median-from-data-stream", title: "Find Median from Data Stream", difficulty: "Hard", day: 4, order: 1 },
            { slug: "merge-k-sorted-lists", title: "Merge k Sorted Lists", difficulty: "Hard", day: 4, order: 2 },
            { slug: "top-k-frequent-words", title: "Top K Frequent Words", difficulty: "Medium", day: 5, order: 1 },
            { slug: "reorganize-string", title: "Reorganize String", difficulty: "Medium", day: 5, order: 2 },
            { slug: "ugly-number-ii", title: "Ugly Number II", difficulty: "Medium", day: 6, order: 1 },
            { slug: "smallest-range-covering-elements-from-k-lists", title: "Smallest Range Covering K Lists", difficulty: "Hard", day: 6, order: 2 },
            { slug: "ipo", title: "IPO", difficulty: "Hard", day: 7, order: 1 },
            { slug: "meeting-rooms-ii", title: "Meeting Rooms II", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 10,
        title: "Backtracking",
        description: "Master recursive exploration for combinations, permutations, and constraint satisfaction.",
        category: "Backtracking",
        problems: [
            { slug: "subsets", title: "Subsets", difficulty: "Medium", day: 1, order: 1 },
            { slug: "combination-sum", title: "Combination Sum", difficulty: "Medium", day: 1, order: 2 },
            { slug: "permutations", title: "Permutations", difficulty: "Medium", day: 2, order: 1 },
            { slug: "subsets-ii", title: "Subsets II", difficulty: "Medium", day: 2, order: 2 },
            { slug: "combination-sum-ii", title: "Combination Sum II", difficulty: "Medium", day: 3, order: 1 },
            { slug: "word-search", title: "Word Search", difficulty: "Medium", day: 3, order: 2 },
            { slug: "palindrome-partitioning", title: "Palindrome Partitioning", difficulty: "Medium", day: 4, order: 1 },
            { slug: "letter-combinations-of-a-phone-number", title: "Letter Combinations of a Phone Number", difficulty: "Medium", day: 4, order: 2 },
            { slug: "n-queens", title: "N-Queens", difficulty: "Hard", day: 5, order: 1 },
            { slug: "n-queens-ii", title: "N-Queens II", difficulty: "Hard", day: 5, order: 2 },
            { slug: "sudoku-solver", title: "Sudoku Solver", difficulty: "Hard", day: 6, order: 1 },
            { slug: "restore-ip-addresses", title: "Restore IP Addresses", difficulty: "Medium", day: 6, order: 2 },
            { slug: "permutations-ii", title: "Permutations II", difficulty: "Medium", day: 7, order: 1 },
            { slug: "combinations", title: "Combinations", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 11,
        title: "Dynamic Programming I",
        description: "Learn 1D dynamic programming patterns and classic problems.",
        category: "Dynamic Programming",
        problems: [
            { slug: "climbing-stairs", title: "Climbing Stairs", difficulty: "Easy", day: 1, order: 1 },
            { slug: "min-cost-climbing-stairs", title: "Min Cost Climbing Stairs", difficulty: "Easy", day: 1, order: 2 },
            { slug: "house-robber", title: "House Robber", difficulty: "Medium", day: 2, order: 1 },
            { slug: "house-robber-ii", title: "House Robber II", difficulty: "Medium", day: 2, order: 2 },
            { slug: "longest-palindromic-substring", title: "Longest Palindromic Substring", difficulty: "Medium", day: 3, order: 1 },
            { slug: "palindromic-substrings", title: "Palindromic Substrings", difficulty: "Medium", day: 3, order: 2 },
            { slug: "decode-ways", title: "Decode Ways", difficulty: "Medium", day: 4, order: 1 },
            { slug: "coin-change", title: "Coin Change", difficulty: "Medium", day: 4, order: 2 },
            { slug: "maximum-product-subarray", title: "Maximum Product Subarray", difficulty: "Medium", day: 5, order: 1 },
            { slug: "word-break", title: "Word Break", difficulty: "Medium", day: 5, order: 2 },
            { slug: "longest-increasing-subsequence", title: "Longest Increasing Subsequence", difficulty: "Medium", day: 6, order: 1 },
            { slug: "partition-equal-subset-sum", title: "Partition Equal Subset Sum", difficulty: "Medium", day: 6, order: 2 },
            { slug: "maximum-subarray", title: "Maximum Subarray", difficulty: "Medium", day: 7, order: 1 },
            { slug: "jump-game", title: "Jump Game", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
    {
        weekNumber: 12,
        title: "Dynamic Programming II",
        description: "Advanced 2D DP, optimization techniques, and challenging problems.",
        category: "Dynamic Programming",
        problems: [
            { slug: "unique-paths", title: "Unique Paths", difficulty: "Medium", day: 1, order: 1 },
            { slug: "unique-paths-ii", title: "Unique Paths II", difficulty: "Medium", day: 1, order: 2 },
            { slug: "longest-common-subsequence", title: "Longest Common Subsequence", difficulty: "Medium", day: 2, order: 1 },
            { slug: "edit-distance", title: "Edit Distance", difficulty: "Medium", day: 2, order: 2 },
            { slug: "interleaving-string", title: "Interleaving String", difficulty: "Medium", day: 3, order: 1 },
            { slug: "distinct-subsequences", title: "Distinct Subsequences", difficulty: "Hard", day: 3, order: 2 },
            { slug: "best-time-to-buy-and-sell-stock-with-cooldown", title: "Best Time to Buy/Sell Stock with Cooldown", difficulty: "Medium", day: 4, order: 1 },
            { slug: "coin-change-ii", title: "Coin Change II", difficulty: "Medium", day: 4, order: 2 },
            { slug: "target-sum", title: "Target Sum", difficulty: "Medium", day: 5, order: 1 },
            { slug: "burst-balloons", title: "Burst Balloons", difficulty: "Hard", day: 5, order: 2 },
            { slug: "regular-expression-matching", title: "Regular Expression Matching", difficulty: "Hard", day: 6, order: 1 },
            { slug: "wildcard-matching", title: "Wildcard Matching", difficulty: "Hard", day: 6, order: 2 },
            { slug: "minimum-path-sum", title: "Minimum Path Sum", difficulty: "Medium", day: 7, order: 1 },
            { slug: "maximal-square", title: "Maximal Square", difficulty: "Medium", day: 7, order: 2 },
        ],
    },
];

async function seedCurriculum() {
    console.log("🌱 Seeding curriculum...");

    // Clear existing curriculum data
    await prisma.curriculumProblem.deleteMany();
    await prisma.curriculumWeek.deleteMany();
    // Don't delete problems - they may be used elsewhere

    for (const week of curriculum) {
        console.log(`📅 Creating Week ${week.weekNumber}: ${week.title}`);

        // Create the week
        const createdWeek = await prisma.curriculumWeek.create({
            data: {
                weekNumber: week.weekNumber,
                title: week.title,
                description: week.description,
                category: week.category,
            },
        });

        // Create or find problems and link them
        for (const prob of week.problems) {
            // Upsert the problem (create if not exists)
            const problem = await prisma.problem.upsert({
                where: { slug: prob.slug },
                create: {
                    slug: prob.slug,
                    title: prob.title,
                    difficulty: prob.difficulty,
                    category: week.category,
                    externalUrl: `https://leetcode.com/problems/${prob.slug}/`,
                    platform: "leetcode",
                    testCases: (prob as any).testCases || "[]",
                    description: (prob as any).description || "",
                    starterCode: (prob as any).starterCode || "{}",
                },
                update: {
                    testCases: (prob as any).testCases || "[]",
                    description: (prob as any).description || "",
                    starterCode: (prob as any).starterCode || "{}",
                },
            });

            // Link to curriculum
            await prisma.curriculumProblem.create({
                data: {
                    weekId: createdWeek.id,
                    problemId: problem.id,
                    dayNumber: prob.day,
                    order: prob.order,
                },
            });
        }
    }

    console.log("✅ Curriculum seeding complete!");
    console.log(`   📚 ${curriculum.length} weeks created`);
    console.log(`   📝 ${curriculum.reduce((acc, w) => acc + w.problems.length, 0)} problems linked`);
}

seedCurriculum()
    .catch((e) => {
        console.error("❌ Seeding failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
