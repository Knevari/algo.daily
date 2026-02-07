import { useRetention } from "@/hooks/useRetention";
import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Dashboard } from "@/components/Dashboard";

// Next.js & Auth
import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";

// Hexagonal Architecture
import { Registry } from "@/infrastructure/Registry";
import { GetDashboardUseCase } from "@/core/application/use-cases/GetDashboardUseCase";

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

interface HomeProps {
  leaderboard: any[];
  user?: any;
  curriculum?: any;
  bonusProblems?: any[];
  todaysProblems?: any[];
  completedProblemIds?: string[];
  isDailyGoalComplete?: boolean;
}

export default function Home({ leaderboard, user: initialUser, curriculum, bonusProblems = [], todaysProblems = [], completedProblemIds = [], isDailyGoalComplete = false }: HomeProps) {
  const { data: session, status } = useSession();
  useRetention(isDailyGoalComplete, status);
  const router = useRouter();

  useEffect(() => {
    const { mock_success, plan } = router.query;
    if (mock_success && plan && session?.user?.id) {
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

  const user = initialUser ? {
    ...initialUser,
    image: session?.user?.image ?? initialUser.image,
  } : {
    id: session?.user?.id ?? "guest",
    name: session?.user?.name,
    image: session?.user?.image,
    streak: 0,
    maxStreak: 0,
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

  try {
    const userRepository = Registry.getUserRepository();
    const problemRepository = Registry.getProblemRepository();
    const curriculumRepository = Registry.getCurriculumRepository();

    const useCase = new GetDashboardUseCase(
      userRepository,
      problemRepository,
      curriculumRepository
    );

    const result = await useCase.execute({ userId: session.user.id });

    return {
      props: {
        ...result,
        user: result.user ? {
          ...result.user,
          lastStudiedAt: result.user.lastStudiedAt ? new Date(result.user.lastStudiedAt).toISOString() : null,
        } : null
      }
    };
  } catch (error) {
    console.error("Dashboard SSR error:", error);
    return {
      props: {
        leaderboard: [],
        error: "Failed to load dashboard data"
      }
    };
  }
};

