// src/components/layout/home/show-case.tsx
"use client";

import { ReactLenis } from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Message from "@/components/layout/chat/message";
import { Bitshow } from "@/components/font/font";
import React from "react";

const demoMessages = [
  { id: 1, msg: "Hi bro ☺️", sender: "other" },
  { id: 2, msg: "How are you my friend 👋", sender: "user" },
  { id: 3, msg: "Very well 👌", sender: "other" },
  { id: 4, msg: "Ok what's wrong", sender: "user" },
  { id: 5, msg: "Can I ask  you some thing", sender: "other" },
  { id: 6, msg: "Now 😩", sender: "user" },
  { id: 7, msg: "a detailed report about todays job 🚨", sender: "other" },
];

export default function ShowCase() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    damping: 45,
    stiffness: 180,
  });

  // Progress sections
  const messagesProgress = useTransform(smoothProgress, [0, 0.38], [0, 1]);
  const thinkingProgress = useTransform(smoothProgress, [0.38, 0.52], [0, 1]);
  const happyProgress = useTransform(smoothProgress, [0.52, 0.64], [0, 1]);
  const clickSectionProg = useTransform(smoothProgress, [0.64, 0.82], [0, 1]);
  const coolEndProgress = useTransform(smoothProgress, [0.82, 1.0], [0, 1]);

  // For finger click timing
  const fingerClickProgress = useTransform(
    clickSectionProg,
    [0.35, 0.65],
    [0, 5],
  );
  const textReaction = useTransform(
    fingerClickProgress,
    [0, 0, 0.6, 1],
    [1, 1.18, 0.72, 0.68],
  );
  const aiTextGlow = useTransform(fingerClickProgress, (v: number) =>
    v > 0.4 && v < 0.7 ? 1 : 0,
  );

  return (
    <ReactLenis
      root
      options={{
        duration: 1.65,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
        lerp: 0.065,
      }}
    >
      <div
        ref={containerRef}
        className="min-h-[420vh] py-16 px-4 sm:px-6 lg:px-8 bg-background"
      >
        {/* ── 1. Centered stacking messages ── */}
        <div className="relative h-[200vh] flex items-start justify-center">
          <div className="sticky top-[18vh] w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
            {demoMessages.map((item, i) => {
              const start = i * 0.085;
              const prog = useTransform(
                messagesProgress,
                [start, start + 0.14, start + 0.24],
                [0, 1, 1],
              );

              const y = useTransform(prog, [0, 1], [140 + i * 50, i * -22]);
              const scale = useTransform(prog, [0, 1], [0.84, 1]);
              const opacity = useTransform(prog, [0, 0.35, 1], [0, 0.4, 1]);
              const rotate = useTransform(
                prog,
                [0, 1],
                [i % 2 === 0 ? 5 : -5, 0],
              );

              return (
                <motion.div
                  key={item.id}
                  style={{
                    y,
                    scale,
                    opacity,
                    rotate,
                    zIndex: i + 0,
                    marginTop: "40%",
                  }}
                  className={`absolute left-1/2 -translate-x-1/2 origin-top w-full`}
                >
                  <div className="mx-auto">
                    <Message
                      id={String(item.id)} // Convert number to string
                      sender={item.sender as "user" | "other"}
                      url={"#"}
                      content={item.msg}
                      timestamp={new Date()}
                      demo={true}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── 2. Thinking & Happy emojis ── */}
        <div className="relative h-[110vh] flex flex-col items-center justify-center gap-32">
          <motion.div
            style={{
              scale: useTransform(
                thinkingProgress,
                [0, 0.5, 0.85, 1],
                [0.5, 1.22, 0.92, 1],
              ),
              opacity: useTransform(thinkingProgress, [0, 0.3], [0, 1]),
              y: useTransform(thinkingProgress, [0, 0.6], [90, 0]),
            }}
            className="text-8xl sm:text-9xl md:text-[14rem] drop-shadow-2xl"
          >
            <span>🤔</span>
          </motion.div>
          <h1 className={`${Bitshow.className} text-2xl font-black`}>
            How can I answer it
          </h1>

          <motion.div
            style={{
              scale: useTransform(
                happyProgress,
                [0, 0.45, 0.8, 1],
                [0.4, 1.25, 0.95, 1],
              ),
              opacity: useTransform(happyProgress, [0, 0.35], [0, 1]),
              rotate: useTransform(happyProgress, [0, 0.6, 1], [-18, 12, 0]),
            }}
            className="text-8xl sm:text-9xl md:text-[14rem] drop-shadow-2xl"
          >
            😃
          </motion.div>
        </div>

        {/* ── 3. 👆 Click → AI text reaction → zoom out ── */}
        <div className="relative flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            {/* Finger pointing & clicking */}
            <motion.div
              style={{
                x: useTransform(
                  clickSectionProg,
                  [0, 0.4, 0.7, 1],
                  [-220, -60, 30, 0],
                ),
                y: useTransform(
                  clickSectionProg,
                  [0, 0.45, 0.75, 1],
                  [140, 50, -20, -40],
                ),
                scale: useTransform(
                  fingerClickProgress,
                  [0, 0.35, 0.55, 1],
                  [0.7, 1.15, 0.88, 0.8],
                ),
                rotate: useTransform(
                  clickSectionProg,
                  [0, 0.5, 0.8, 1],
                  [35, -8, 5, 0],
                ),
                opacity: useTransform(clickSectionProg, [0, 0.25], [0, 1]),
              }}
              className="text-8xl sm:text-9xl md:text-[12rem] absolute z-20 pointer-events-none"
            >
              👆
            </motion.div>

            {/* AI powered Chat text with reaction */}
            <motion.h2
              style={{
                scale: textReaction,
                opacity: useTransform(clickSectionProg, [0.15, 0.4], [0, 1]),
              }}
              className={`${Bitshow.className} text-5xl sm:text-6xl md:text-8xl lg:text-9xl z-10 text-center tracking-tight`}
            >
              <motion.span
                style={{
                  scale: textReaction,
                  textShadow: useTransform(aiTextGlow, (v: number) =>
                    v
                      ? "0 0 60px var(--primary), 0 0 120px var(--primary)"
                      : "none",
                  ),
                }}
                className="bg-gradient-to-r from-primary via-primary/30 to-primary/70 bg-clip-text text-transparent inline-block"
              >
                AI
              </motion.span>{" "}
              powered Chat
            </motion.h2>
          </div>
        </div>

        {/* ── 4. Cool 😎 ending ── */}
        <div className="relative h-[80vh] flex flex-col items-center justify-center">
          <motion.div
            style={{
              scale: useTransform(
                coolEndProgress,
                [0, 0.35, 0.65, 1],
                [0.2, 1.45, 0.92, 1.18],
              ),
              rotate: useTransform(
                coolEndProgress,
                [0, 0.4, 0.75, 1],
                [-40, 25, -8, 0],
              ),
              opacity: useTransform(coolEndProgress, [0, 0.25], [0, 1]),
              y: useTransform(coolEndProgress, [0, 0.5], [80, 0]),
            }}
            className="text-8xl sm:text-9xl md:text-[16rem] drop-shadow-[0_0_50px_var(--primary)] mb-8"
          >
            😎
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: [0, 1, 0.85, 1], y: 0 }}
            transition={{
              duration: 2.4,
              times: [0, 0.4, 0.7, 1],
              repeat: Infinity,
              repeatDelay: 3,
            }}
            className={`${Bitshow.className} text-4xl sm:text-5xl md:text-6xl font-black tracking-wider drop-shadow-lg`}
          >
            COOL
          </motion.p>
        </div>
      </div>
    </ReactLenis>
  );
}
