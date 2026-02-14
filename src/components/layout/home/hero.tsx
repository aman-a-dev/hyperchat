"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { Bitshow } from "@/components/font/font";
import { TextEffect } from "@/components/font/text/text-effect";
import { Button } from "@/components/ui/button";
import Image from "next/image";
const headlineVariants = {
  container: {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: {
      opacity: 0,
      rotateX: 90,
      y: 10,
    },
    visible: {
      opacity: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.2,
      },
    },
  },
};

export default function Hero() {
  return (
    <DotGridBg>
      <div className="flex flex-col items-center pt-20 z-1 relative">
        <Image
          src="/assets/girl.png"
          alt="girl image"
          width={200}
          height={300}
          className="animate-wiggle absolute left-2 -bottom-5 md:w-64 md:left-1/4"
        />
        <TextEffect
          className={`${Bitshow.className} scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance md:w-[70%] lg:text-8xl space-y-2`}
          as="h1"
          per="char"
          delay={0.5}
          variants={headlineVariants}
        >
          Chat with Friend
        </TextEffect>
        <TextEffect
          className={`${Bitshow.className} z-10 scroll-m-20 text-center text-5xl font-extrabold tracking-tight text-balance md:w-[70%] lg:text-8xl space-y-2`}
          as="h1"
          per="char"
          delay={0.5}
          variants={headlineVariants}
        >
          World Wide.
        </TextEffect>
        <TextEffect
          per="word"
          as="p"
          preset="slide"
          className="z-10 text-center font-black leading-7 [&:not(:first-child)]:mt-6 md:w-[50%]"
        >
          Enjoy seamless, private, and lightning‑fast chats. From quick updates
          to deep discussions, our platform makes every message count.
        </TextEffect>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        ></motion.div>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 2.5, type: "spring" }}
          className="flex gap-3 mt-3"
        >
          <Link href="/sign-up" className="z-10">
            <Button
              size="lg"
              className="group gap-2 rounded-sm bg-primary px-8 py-6 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-xl lg:w-52"
            >
              <TextEffect as="b" per="char" delay={2.8} preset="blur">
                Start Chatting
              </TextEffect>
            </Button>
          </Link>
        </motion.div>
      </div>
    </DotGridBg>
  );
}

function DotGridBg({ children }) {
  return (
    <div className="min-h-screen w-full relative">
      {/* Dashed Top Fade Grid */}
      <span className="from-primary/20 absolute inset-x-0 top-0 left-0 -z-10 h-1/3 w-full bg-gradient-to-b" />

      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--foreground) 1px, transparent 1px),
        linear-gradient(to bottom, var(--foreground)  1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
          maskImage: `
        repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          WebkitMaskImage: `
 repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)
      `,
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      {children}
    </div>
  );
}
