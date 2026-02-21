"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function HeroSection() {
    return (
        <section className="relative w-full overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 py-8">
                <div className="relative overflow-hidden rounded-2xl">
                    {/* Background image */}
                    <Image
                        src="/hero-bg.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                        aria-hidden
                    />

                    {/* Gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

                    {/* Content */}
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="relative z-10 flex min-h-[340px] flex-col justify-center px-8 py-16 sm:px-12 md:min-h-[400px] md:px-16"
                    >
                        <motion.p
                            variants={item}
                            className="mb-3 text-sm font-medium tracking-widest text-white/70 uppercase"
                        >
                            Superteam Academy
                        </motion.p>

                        <motion.h1
                            variants={item}
                            className="max-w-2xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl"
                        >
                            Master Solana development
                        </motion.h1>

                        <motion.p
                            variants={item}
                            className="mt-4 max-w-lg text-base text-white/80 sm:text-lg"
                        >
                            Quickstart your Solana development journey with us
                        </motion.p>

                        <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
                            <Button
                                variant="outline"
                                className="border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
                            >
                                Get Certified
                            </Button>
                            <Button className="bg-[#14F195] text-[#1b231d] hover:bg-[#14F195]/90">
                                Explore Learning Tracks
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
