import type { GetServerSideProps } from "next";
import { getProviders, signIn } from "next-auth/react";
import { motion } from "framer-motion";
import Head from "next/head";

interface SignInProps {
    providers: Awaited<ReturnType<typeof getProviders>>;
}

export default function SignIn({ providers }: SignInProps) {
    return (
        <>
            <Head>
                <title>Sign In - AlgoDaily</title>
            </Head>
            <div className="min-h-screen flex items-center justify-center p-lg relative overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-primary/30 blur-[120px] rounded-full animate-blob pointer-events-none" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-primary/20 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />

                <motion.div
                    className="w-full max-w-[400px] p-2xl glass-card relative z-10 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-xl">
                        <span className="text-5xl block mb-md">🦉</span>
                        <h1 className="text-3xl font-bold mb-xs bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Welcome Back</h1>
                        <p className="text-text-secondary text-base">Sign in to continue your streak</p>
                    </div>

                    <div className="flex flex-col gap-md">
                        {Object.values(providers ?? {}).map((provider) => (
                            <button
                                key={provider.name}
                                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                                className="flex items-center justify-center gap-md p-md bg-white/5 border border-white/10 rounded-lg text-base font-medium transition-all hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                            >
                                <img
                                    src={`/icons/${provider.id}.svg`}
                                    alt={`${provider.name} logo`}
                                    className="w-5 h-5"
                                    onError={(e) => {
                                        // Fallback if icon missing
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                                <span>Sign in with {provider.name}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const providers = await getProviders();
    return {
        props: { providers },
    };
};
