import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";

// Mock data for demo - will be replaced with real API calls
const mockProblems = [
  {
    id: "1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy" as const,
    category: "Arrays",
    externalUrl: "https://leetcode.com/problems/two-sum/",
  },
  {
    id: "2",
    title: "Group Anagrams",
    slug: "group-anagrams",
    difficulty: "Medium" as const,
    category: "Hash Table",
    externalUrl: "https://leetcode.com/problems/group-anagrams/",
  },
];

function TypingText({ text, delay = 0 }: { text: string, delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i === text.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span className="font-mono text-accent-primary">{displayedText}<span className="animate-pulse">_</span></span>;
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-purple-primary/20 opacity-20 blur-[100px]"></div>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-xl overflow-hidden bg-bg-primary text-text-primary selection:bg-accent-primary selection:text-white">
      <GridBackground />

      <div className="relative z-10 text-center max-w-[900px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            className="text-7xl mb-lg filter drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            🦉
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-md tracking-tight font-mono">
            <span className="bg-gradient-to-r from-text-primary via-text-primary to-text-secondary bg-clip-text text-transparent">
              AlgoDaily
            </span>
            <span className="text-accent-primary">.init()</span>
          </h1>

          <div className="h-20 flex items-center justify-center mb-xl">
            <p className="text-xl md:text-2xl text-text-secondary font-mono">
              <span className="text-accent-secondary">const</span> goal = <TypingText text='"Master Interviews";' delay={1000} />
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg w-full mb-2xl">
            {[
              { icon: "🔥", title: "Streak System", code: "streak++" },
              { icon: "⚡", title: "Instant Verify", code: "verify(O(1))" },
              { icon: "🏆", title: "Leaderboards", code: "rank < 10" }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + (i * 0.2) }}
                className="group p-lg rounded-md border border-border bg-bg-tertiary/50 backdrop-blur-sm hover:border-accent-primary/50 hover:bg-bg-tertiary transition-all hover:-translate-y-1"
              >
                <div className="text-3xl mb-sm">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-xs">{feature.title}</h3>
                <code className="text-xs font-mono text-accent-cyan opacity-0 group-hover:opacity-100 transition-opacity block bg-black/30 p-1 rounded">
                  {feature.code}
                </code>
              </motion.div>
            ))}
          </div>

          <motion.button
            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-md transition-all hover:scale-105"
            onClick={() => signIn("github")}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border border-accent-primary/50 rounded-md group-hover:border-accent-primary transition-colors" />
            <div className="absolute inset-0 bg-accent-primary/10 group-hover:bg-accent-primary/20 transition-colors blur-xl" />
            <span className="relative flex items-center gap-md font-mono font-bold text-lg text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:rotate-12">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              ./login_with_github
            </span>
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}

import type { GetServerSideProps } from "next";
import { getLeaderboard, type LeaderboardEntry } from "@/actions/leaderboard";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
// verifyProblem import removed
import { sounds } from "@/lib/sounds";

interface CurriculumInfo {
  currentWeek: number;
  weekTitle: string;
  weekProgress: number;
  totalProgress: number;
}

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: string;
  externalUrl: string;
}

interface HomeProps {
  leaderboard: LeaderboardEntry[];
  user?: any;
  curriculum?: CurriculumInfo;
  bonusProblems?: Problem[];
  todaysProblems?: Problem[];
  completedProblemIds?: string[];
  isDailyGoalComplete?: boolean;
}

export default function Home({ leaderboard, user: initialUser, curriculum, bonusProblems = [], todaysProblems = [], completedProblemIds = [], isDailyGoalComplete = false }: HomeProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const { mock_success, plan } = router.query;
    if (mock_success && plan && session?.user?.id) {
      // Simple client-side update for local testing (in production this is done via Webhook)
      fetch("/api/user/update-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: plan === 'lifetime' ? 'LIFETIME' : 'PRO' })
      }).then(() => {
        router.replace("/", undefined, { shallow: true });
        router.reload();
      });
    }
  }, [router.query, session, router]);


  // Use session user merged with db user if available
  const user = initialUser ? {
    ...initialUser,
    image: session?.user?.image ?? initialUser.image,
  } : {
    id: session?.user?.id ?? "guest",
    name: session?.user?.name,
    image: session?.user?.image,
    streak: 0,
    maxStreak: 0,
    streakFreezes: 0,
    xp: 0,
    gems: 0,
    lastStudiedAt: null,
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/10 border-t-accent-primary rounded-full animate-spin" />
        <p className="ml-md text-text-secondary font-medium">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <Head>
          <title>AlgoDaily - Master Technical Interviews</title>
          <meta name="description" content="Build your coding streak and ace technical interviews with just 2 problems a day." />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <LandingPage />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>AlgoDaily - Dashboard</title>
        <meta name="description" content="Your daily coding practice dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard
        user={user}
        todaysProblems={todaysProblems}
        completedProblemIds={completedProblemIds}
        leaderboard={leaderboard}
        curriculum={curriculum}
        bonusProblems={bonusProblems}
        isDailyGoalComplete={isDailyGoalComplete}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.id) {
    return {
      props: {
        leaderboard: [],
      },
    };
  }

  const [leaderboard, user, curriculumProgress, allWeeks, completedProblemIds] = await Promise.all([
    getLeaderboard(),
    db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        image: true,
        streak: true,
        maxStreak: true,
        streakFreezes: true,
        xp: true,
        gems: true,
        lastStudiedAt: true,
        leetcodeUsername: true,
        plan: true,
      },
    }),
    db.userCurriculumProgress.findUnique({
      where: { userId: session.user.id },
    }),
    db.curriculumWeek.findMany({
      include: {
        problems: {
          include: { problem: true }
        }
      },
      orderBy: { weekNumber: "asc" },
    }),
    db.userProblem.findMany({
      where: { userId: session.user.id },
      select: { problemId: true },
    }),
  ]);

  // Calculate curriculum info
  const currentWeekNum = curriculumProgress?.currentWeek ?? 1;
  const currentWeekData = allWeeks.find(w => w.weekNumber === currentWeekNum);
  const completedIds = completedProblemIds.map(p => p.problemId);

  // Calculate "Today's Problems" (Daily Duo)
  // Logic: Find the first day in the current week that isn't fully completed.
  const currentWeekProblems = currentWeekData ? currentWeekData.problems : [];
  let targetDay = 1;
  const daysInWeek = 7;
  let isDailyGoalComplete = false;

  // We need to fetch completion times to enforce the daily cap
  // Fetch completed user problems with timestamps
  const completedUserProblems = await db.userProblem.findMany({
    where: { userId: session.user.id },
    select: { problemId: true, completedAt: true },
  });

  const completedMap = new Map(completedUserProblems.map(p => [p.problemId, p.completedAt]));

  for (let d = 1; d <= daysInWeek; d++) {
    const daysProblems = currentWeekProblems.filter(p => p.dayNumber === d);
    if (daysProblems.length === 0) continue;

    // Check if all problems for this day are completed
    const allCompleted = daysProblems.every(p => completedIds.includes(p.problemId));

    if (!allCompleted) {
      targetDay = d;

      // Linear Progression / Daily Cap Logic:
      // If we are looking at a day > 1, strictly check if the PREVIOUS day was completed TODAY.
      // If previous day was completed TODAY, then the user has reached their daily limit (unless they are catching up multiple days in the past, but the requirement implies a strict "one day per day" once caught up).
      // Actually, a simpler interpretation of "linear program, only extra credits available" is:
      // If I finish Day X *today*, I cannot start Day X+1 until tomorrow.

      if (d > 1) {
        // Check previous day completion time
        const prevDayProblems = currentWeekProblems.filter(p => p.dayNumber === d - 1);

        // When was the LAST problem of the previous day completed?
        let lastCompletionTime = 0;
        prevDayProblems.forEach(p => {
          const t = completedMap.get(p.problemId);
          if (t && t.getTime() > lastCompletionTime) {
            lastCompletionTime = t.getTime();
          }
        });

        if (lastCompletionTime > 0) {
          const completionDate = new Date(lastCompletionTime);
          const today = new Date();

          // Check if same day (UTC or local? Server is UTC usually, let's stick to simple date comparison)
          if (completionDate.toDateString() === today.toDateString()) {
            // Previous day was finished today. Cap reached.
            isDailyGoalComplete = true;
          }
        }
      }

      break;
    }
    // If it's the last day and it's completed, we still show the last day (or empty?)
    if (d === daysInWeek) targetDay = daysInWeek;
  }

  // If daily goal is complete, we DO NOT return today's problems.
  const todaysProblemRecords = isDailyGoalComplete
    ? []
    : currentWeekProblems.filter(p => p.dayNumber === targetDay);

  const weekProgress = currentWeekData
    ? (currentWeekData.problems.filter(p => completedIds.includes(p.problemId)).length / currentWeekData.problems.length) * 100
    : 0;

  const totalProblems = allWeeks.reduce((acc, w) => acc + w.problems.length, 0);
  const totalCompleted = allWeeks.reduce((acc, w) =>
    acc + w.problems.filter(p => completedIds.includes(p.problemId)).length, 0);
  const totalProgress = totalProblems > 0 ? (totalCompleted / totalProblems) * 100 : 0;

  // Get bonus problems (fetch a larger set of uncompleted problems for "Extra Credit")
  // Filter by the current week's category to be contextually relevant
  // Get bonus problems (fetch a larger set of uncompleted problems for "Extra Credit")
  // Filter by the current week's category to be contextually relevant
  const currentCategory = currentWeekData?.category || 'Arrays & Hashing';

  const bonusProblemRecords = await db.problem.findMany({
    where: {
      id: { notIn: completedIds },
      category: currentCategory, // Filter by current week's category
    },
    take: 20,
    orderBy: { difficulty: 'asc' },
  });

  // Fallback: If no problems found in category (e.g. they finished them all), fetch any uncompleted
  if (bonusProblemRecords.length === 0) {
    const fallbackProblems = await db.problem.findMany({
      where: {
        id: { notIn: completedIds },
      },
      take: 20,
    });
    bonusProblemRecords.push(...fallbackProblems);
  }

  const bonusProblems = bonusProblemRecords.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty as "Easy" | "Medium" | "Hard",
    category: p.category,
    externalUrl: p.externalUrl,
  }));

  // Convert Date objects to strings for serialization
  const serializedUser = user ? {
    ...user,
    lastStudiedAt: user.lastStudiedAt?.toISOString() ?? null,
    leetcodeUsername: user.leetcodeUsername ?? null,
  } : null;

  return {
    props: {
      leaderboard,
      user: serializedUser,
      curriculum: {
        currentWeek: currentWeekNum,
        weekTitle: currentWeekData?.title ?? "Arrays & Hashing",
        weekProgress: Math.round(weekProgress),
        totalProgress: Math.round(totalProgress),
      },
      todaysProblems: todaysProblemRecords.map(cp => ({
        id: (cp as any).problem.id,
        title: (cp as any).problem.title,
        slug: (cp as any).problem.slug,
        difficulty: (cp as any).problem.difficulty,
        category: (cp as any).problem.category,
        externalUrl: (cp as any).problem.externalUrl,
      })),
      completedProblemIds: completedIds, // Pass real completed IDs
      bonusProblems,
      isDailyGoalComplete,
    },
  };
};
