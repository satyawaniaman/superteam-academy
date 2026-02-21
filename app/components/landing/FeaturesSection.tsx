"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import Image from "next/image";

interface Feature {
    title: string;
    description: string;
    image: string;
}

const FEATURES_TOP: Feature[] = [
    {
        title: "Hands-On Program Labs",
        description:
            "Build and deploy real Solana programs with guided exercises. Write Rust, test locally, and ship to devnet — all within structured lessons.",
        image: "/features/hands-on-labs.png",
    },
    {
        title: "Soulbound Credentials",
        description:
            "Earn on-chain Metaplex Core NFT certificates that prove your skills. Non-transferable, wallet-visible, and verifiable by any employer.",
        image: "/features/credentials.png",
    },
    {
        title: "XP & Leaderboard",
        description:
            "Earn soulbound XP tokens as you complete lessons. Climb the leaderboard and unlock achievements as you progress through courses.",
        image: "/features/xp-leaderboard.png",
    },
];

const FEATURES_BOTTOM: Feature[] = [
    {
        title: "Community & Mentorship",
        description:
            "Connect with Solana builders through forums, live sessions, and peer reviews. Get expert guidance from experienced developers in the ecosystem.",
        image: "/features/community.png",
    },
    {
        title: "Production-Ready Projects",
        description:
            "Capstone projects that mirror real-world Solana development. Build DeFi protocols, NFT platforms, and DAOs that you can deploy to mainnet.",
        image: "/features/production-projects.png",
    },
];

function FeatureCard({
    feature,
    index,
    className,
}: {
    feature: Feature;
    index: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" as const }}
            className={`group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md ${className ?? ""}`}
        >
            {/* Image area */}
            <div className="relative mx-4 mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-primary/[0.03]">
                <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                </p>
            </div>
        </motion.div>
    );
}

export function FeaturesSection() {
    const headerRef = useRef<HTMLDivElement>(null);
    const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

    return (
        <section className="w-full bg-primary/[0.03] py-20">
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 16 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <p className="mb-2 text-sm font-medium tracking-widest text-accent uppercase">
                        Build · Learn · Earn
                    </p>
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        More than just a Course
                    </h2>
                </motion.div>

                {/* Top row — 3 cards */}
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES_TOP.map((feature, i) => (
                        <FeatureCard key={feature.title} feature={feature} index={i} />
                    ))}
                </div>

                {/* Bottom row — 2 wider cards */}
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {FEATURES_BOTTOM.map((feature, i) => (
                        <FeatureCard
                            key={feature.title}
                            feature={feature}
                            index={i + 3}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
