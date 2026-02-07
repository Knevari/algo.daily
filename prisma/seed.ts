import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { curriculum } from "./curriculum-data";

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
