"use client";

import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Question {
    question: string;
    options: string[];
}

const QUESTIONS: Question[] = [
    {
        question: "How comfortable are you with Rust?",
        options: [
            "Never used Rust",
            "Know basics (syntax, ownership)",
            "Comfortable writing programs",
            "Confident with advanced Rust concepts",
        ],
    },
    {
        question: "What's your experience with blockchain development?",
        options: [
            "Complete beginner",
            "Understand basic concepts (wallets, transactions)",
            "Built on other chains (Ethereum, etc.)",
            "Have Solana development experience",
        ],
    },
    {
        question: "What do you want to build on Solana?",
        options: [
            "DeFi protocols",
            "NFT / digital collectible platforms",
            "DAOs & governance tools",
            "Infrastructure & developer tools",
        ],
    },
    {
        question: "How do you prefer to learn?",
        options: [
            "Step-by-step tutorials",
            "Project-based learning",
            "Reading documentation",
            "Code examples and exercises",
        ],
    },
    {
        question: "How comfortable are you with TypeScript?",
        options: [
            "Never used it",
            "Know JavaScript, learning TypeScript",
            "Comfortable with TypeScript",
            "Advanced TypeScript user",
        ],
    },
];

export function AssessmentSection() {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});

    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

    const totalSteps = QUESTIONS.length;
    const question = QUESTIONS[currentStep];
    const progress = ((currentStep + 1) / totalSteps) * 100;

    function selectOption(optionIndex: number) {
        setAnswers((prev) => ({ ...prev, [currentStep]: optionIndex }));
    }

    return (
        <section className="w-full bg-primary/[0.03] py-20">
            <div className="mx-auto max-w-2xl px-6">
                <motion.div
                    ref={sectionRef}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <p className="mb-2 text-sm font-medium tracking-widest text-accent uppercase">
                        Assessment
                    </p>
                    <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                        Find the right course for yourself
                    </h2>
                    <p className="mt-3 text-sm text-muted-foreground">
                        Answer {totalSteps} questions to figure out which course to start
                        with
                    </p>
                </motion.div>

                {/* Progress bar */}
                <div className="mt-10 h-2 overflow-hidden rounded-full bg-border">
                    <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>

                {/* Question */}
                <div className="mt-10">
                    <p className="mb-6 text-base font-medium text-foreground">
                        <span className="mr-2 text-primary">{currentStep + 1}.</span>
                        {question.question}
                    </p>

                    <div className="flex flex-col gap-3">
                        {question.options.map((option, i) => {
                            const isSelected = answers[currentStep] === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => selectOption(i)}
                                    className={`rounded-lg border px-4 py-3 text-left text-sm transition-all ${isSelected
                                            ? "border-primary bg-primary/10 font-medium text-primary"
                                            : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-primary/[0.03]"
                                        }`}
                                >
                                    {option}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep((s) => s - 1)}
                    >
                        <ArrowLeft className="size-3.5" />
                        Back
                    </Button>
                    <Button
                        size="sm"
                        disabled={answers[currentStep] === undefined}
                        onClick={() => {
                            if (currentStep < totalSteps - 1) {
                                setCurrentStep((s) => s + 1);
                            }
                        }}
                    >
                        {currentStep === totalSteps - 1 ? "See Results" : "Next"}
                        <ArrowRight className="size-3.5" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
