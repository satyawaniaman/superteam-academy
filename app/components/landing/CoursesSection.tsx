"use client";

import { motion, useInView, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, BarChart3, Clock, ArrowRight } from "lucide-react";

type Category = "fundamentals" | "security" | "advanced" | "tools";

interface Course {
    title: string;
    category: Category;
    tags: { label: string; variant: "default" | "secondary" | "outline" }[];
    description: string;
    stats: { lessons: number; level: string; duration: string };
    image: string;
}

const CATEGORIES: { key: Category; label: string }[] = [
    { key: "fundamentals", label: "Fundamentals" },
    { key: "security", label: "Security" },
    { key: "advanced", label: "Advanced" },
    { key: "tools", label: "Tools" },
];

const COURSES: Course[] = [
    // — Fundamentals (3) —
    {
        title: "Solana & Rust Foundations",
        category: "fundamentals",
        tags: [
            { label: "Fundamentals", variant: "default" },
            { label: "Popular", variant: "secondary" },
        ],
        description:
            "Start your Solana journey from zero. Learn Rust ownership, lifetimes, and borrows. Understand how Solana's runtime, accounts model, and transactions work under the hood.",
        stats: { lessons: 24, level: "Beginner", duration: "4 Weeks" },
        image: "/courses/solana-fundamentals.png",
    },
    {
        title: "Anchor Program Development",
        category: "fundamentals",
        tags: [{ label: "Fundamentals", variant: "default" }],
        description:
            "Build production-ready Solana programs with Anchor. Master PDAs, CPIs, token extensions, and on-chain state management with the most popular Solana framework.",
        stats: { lessons: 20, level: "Beginner – Inter.", duration: "3 Weeks" },
        image: "/courses/solana-fundamentals.png",
    },
    {
        title: "Token-2022 & NFT Standards",
        category: "fundamentals",
        tags: [
            { label: "Fundamentals", variant: "default" },
            { label: "New", variant: "secondary" },
        ],
        description:
            "Master Solana's token ecosystem — SPL tokens, Token-2022 extensions (transfer hooks, confidential transfers), and Metaplex Core NFTs. Build minting, staking, and marketplace programs.",
        stats: { lessons: 18, level: "Intermediate", duration: "3 Weeks" },
        image: "/courses/defi-protocols.png",
    },
    // — Security (3) —
    {
        title: "Smart Contract Security",
        category: "security",
        tags: [
            { label: "Security", variant: "outline" },
            { label: "New", variant: "secondary" },
        ],
        description:
            "Find your inner auditor. Learn about common Solana vulnerabilities, attack vectors, re-entrancy, and best practices. Explore fuzzing with Trident and formal verification.",
        stats: { lessons: 18, level: "Advanced", duration: "5 Weeks" },
        image: "/courses/smart-contracts.png",
    },
    {
        title: "Program Security Auditing",
        category: "security",
        tags: [{ label: "Security", variant: "outline" }],
        description:
            "Learn the full audit workflow — from threat modeling to writing findings reports. Practice on real vulnerable programs and develop your eye for exploits.",
        stats: { lessons: 14, level: "Advanced", duration: "4 Weeks" },
        image: "/courses/smart-contracts.png",
    },
    {
        title: "Fuzz Testing with Trident",
        category: "security",
        tags: [
            { label: "Security", variant: "outline" },
            { label: "Popular", variant: "secondary" },
        ],
        description:
            "Deep-dive into property-based fuzz testing for Solana programs. Write invariants, generate edge-case inputs, and catch bugs before attackers do using the Trident framework.",
        stats: { lessons: 12, level: "Inter. – Adv.", duration: "3 Weeks" },
        image: "/courses/smart-contracts.png",
    },
    // — Advanced (3) —
    {
        title: "Assembly & Formal Verification",
        category: "advanced",
        tags: [{ label: "Advanced", variant: "outline" }],
        description:
            "Join the top 1% of Solana devs. Master SBF/SBPFv2 assembly, write native Solana programs, and apply formal methods with Certora for mathematical correctness proofs.",
        stats: { lessons: 16, level: "Expert", duration: "6 Weeks" },
        image: "/courses/defi-protocols.png",
    },
    {
        title: "DeFi Protocol Engineering",
        category: "advanced",
        tags: [
            { label: "Advanced", variant: "outline" },
            { label: "Popular", variant: "secondary" },
        ],
        description:
            "Design and build DeFi primitives — AMMs, lending protocols, and vaults. Learn token economics, oracle integration, and liquidation mechanics on Solana.",
        stats: { lessons: 22, level: "Inter. – Adv.", duration: "5 Weeks" },
        image: "/courses/defi-protocols.png",
    },
    {
        title: "Cross-Program Invocations",
        category: "advanced",
        tags: [{ label: "Advanced", variant: "outline" }],
        description:
            "Master complex CPI patterns — composability across programs, re-entrancy guards, PDA signing, and building modular program architectures that interoperate safely.",
        stats: { lessons: 14, level: "Advanced", duration: "4 Weeks" },
        image: "/courses/defi-protocols.png",
    },
    // — Tools (3) —
    {
        title: "Solana CLI & Dev Tooling",
        category: "tools",
        tags: [{ label: "Tools", variant: "default" }],
        description:
            "Master the Solana CLI, Anchor workspace, local validators, and testing frameworks. Set up CI/CD pipelines for program deployments and verifiable builds.",
        stats: { lessons: 12, level: "Beginner", duration: "2 Weeks" },
        image: "/courses/solana-fundamentals.png",
    },
    {
        title: "TypeScript SDK & Frontend",
        category: "tools",
        tags: [{ label: "Tools", variant: "default" }],
        description:
            "Build frontend dApps with @solana/web3.js, Anchor client, and wallet adapters. Learn PDA derivation client-side, transaction building, and error handling.",
        stats: { lessons: 16, level: "Intermediate", duration: "3 Weeks" },
        image: "/courses/solana-fundamentals.png",
    },
    {
        title: "Testing with Mollusk & LiteSVM",
        category: "tools",
        tags: [
            { label: "Tools", variant: "default" },
            { label: "New", variant: "secondary" },
        ],
        description:
            "Write bulletproof tests for Solana programs using Mollusk for unit tests and LiteSVM for integration tests. Learn CU profiling, snapshot testing, and test-driven development.",
        stats: { lessons: 14, level: "Intermediate", duration: "3 Weeks" },
        image: "/courses/smart-contracts.png",
    },
];

function CourseCard({ course, index }: { course: Course; index: number }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" as const }}
            className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
            {/* Header: tags */}
            <div className="flex items-center gap-2 px-5 pt-5">
                {course.tags.map((tag) => (
                    <Badge key={tag.label} variant={tag.variant} className="text-[10px]">
                        {tag.label}
                    </Badge>
                ))}
            </div>

            {/* Title */}
            <h3 className="mt-3 px-5 text-lg font-semibold leading-snug text-foreground">
                {course.title}
            </h3>

            {/* Description */}
            <p className="mt-2 flex-1 px-5 text-sm leading-relaxed text-muted-foreground">
                {course.description}
            </p>

            {/* CTAs */}
            <div className="mt-4 flex gap-2 px-5">
                <Button size="sm">Enroll Now</Button>
                <Button variant="outline" size="sm">
                    Learn More
                </Button>
            </div>

            {/* Stats */}
            <div className="mt-4 flex gap-5 border-t border-border px-5 py-3">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="size-3.5" />
                    {course.stats.lessons} lessons
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BarChart3 className="size-3.5" />
                    {course.stats.level}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {course.stats.duration}
                </span>
            </div>

            {/* Illustration */}
            <div className="relative mx-4 mb-4 aspect-[16/10] overflow-hidden rounded-2xl bg-primary/[0.03]">
                <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>
        </motion.div>
    );
}

export function CoursesSection() {
    const [activeCategory, setActiveCategory] = useState<Category>("fundamentals");
    const headerRef = useRef<HTMLDivElement>(null);
    const headerInView = useInView(headerRef, { once: true, margin: "-40px" });

    const filtered = COURSES.filter((c) => c.category === activeCategory);

    return (
        <section className="w-full py-20">
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    ref={headerRef}
                    initial={{ opacity: 0, y: 16 }}
                    animate={headerInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="mb-10 text-center"
                >
                    <p className="mb-2 text-sm font-medium tracking-widest text-accent uppercase">
                        Start Learning
                    </p>
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        Choose Your Learning Path
                    </h2>
                </motion.div>

                {/* Tab filters */}
                <div className="mb-10 flex justify-center">
                    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1 shadow-sm">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.key}
                                onClick={() => setActiveCategory(cat.key)}
                                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeCategory === cat.key
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course grid */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                    >
                        {filtered.map((course, i) => (
                            <CourseCard key={course.title} course={course} index={i} />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* View All */}
                <div className="mt-10 flex justify-center">
                    <Button variant="default" className="gap-1.5">
                        View All Courses
                        <ArrowRight className="size-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
