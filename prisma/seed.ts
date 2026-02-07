import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

const phase1Problems = [
  // Week 1: Arrays & Hashing
  { title: "Two Sum", slug: "two-sum", difficulty: "Easy", category: "Arrays" },
  { title: "Contains Duplicate", slug: "contains-duplicate", difficulty: "Easy", category: "Arrays" },
  { title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy", category: "Arrays" },
  { title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium", category: "Arrays" },
  { title: "Top K Frequent Elements", slug: "top-k-frequent-elements", difficulty: "Medium", category: "Arrays" },
  { title: "Product of Array Except Self", slug: "product-of-array-except-self", difficulty: "Medium", category: "Arrays" },
  { title: "Valid Sudoku", slug: "valid-sudoku", difficulty: "Medium", category: "Arrays" },
  { title: "Longest Consecutive Sequence", slug: "longest-consecutive-sequence", difficulty: "Medium", category: "Arrays" },
  
  // Week 2: Two Pointers
  { title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy", category: "Two Pointers" },
  { title: "Two Sum II", slug: "two-sum-ii-input-array-is-sorted", difficulty: "Medium", category: "Two Pointers" },
  { title: "3Sum", slug: "3sum", difficulty: "Medium", category: "Two Pointers" },
  { title: "Container With Most Water", slug: "container-with-most-water", difficulty: "Medium", category: "Two Pointers" },
  { title: "Trapping Rain Water", slug: "trapping-rain-water", difficulty: "Hard", category: "Two Pointers" },
  
  // Week 3: Sliding Window
  { title: "Best Time to Buy and Sell Stock", slug: "best-time-to-buy-and-sell-stock", difficulty: "Easy", category: "Sliding Window" },
  { title: "Longest Substring Without Repeating Characters", slug: "longest-substring-without-repeating-characters", difficulty: "Medium", category: "Sliding Window" },
  { title: "Longest Repeating Character Replacement", slug: "longest-repeating-character-replacement", difficulty: "Medium", category: "Sliding Window" },
  { title: "Permutation in String", slug: "permutation-in-string", difficulty: "Medium", category: "Sliding Window" },
  { title: "Minimum Window Substring", slug: "minimum-window-substring", difficulty: "Hard", category: "Sliding Window" },
  
  // Week 4: Stack
  { title: "Valid Parentheses", slug: "valid-parentheses", difficulty: "Easy", category: "Stack" },
  { title: "Min Stack", slug: "min-stack", difficulty: "Medium", category: "Stack" },
  { title: "Evaluate Reverse Polish Notation", slug: "evaluate-reverse-polish-notation", difficulty: "Medium", category: "Stack" },
  { title: "Daily Temperatures", slug: "daily-temperatures", difficulty: "Medium", category: "Stack" },
  { title: "Car Fleet", slug: "car-fleet", difficulty: "Medium", category: "Stack" },
  { title: "Largest Rectangle in Histogram", slug: "largest-rectangle-in-histogram", difficulty: "Hard", category: "Stack" },
];

async function main() {
  console.log("🌱 Seeding database...");

  for (const p of phase1Problems) {
    await prisma.problem.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        category: p.category,
        externalUrl: `https://leetcode.com/problems/${p.slug}/`,
        platform: "leetcode",
      },
    });
  }

  console.log("✅ Seeding complete.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
