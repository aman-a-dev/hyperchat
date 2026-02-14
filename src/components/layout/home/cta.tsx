"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useId, useMemo, useRef } from "react";
import { Bitshow } from "@/components/font/font";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { StatusIndicator } from "@/components/ui/status-indicator";

const highlights = [
  { id: "highlight-free", label: "Free Forever" },
  { id: "highlight-credit", label: "No Credit Card" },
  { id: "highlight-oss", label: "Open Source" },
  { id: "highlight-ai", label: "AI powered" },
];

export default function CTA() {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const shouldReduceMotion = useReducedMotion();

  const titleId = useId();
  const descriptionId = useMemo(() => `${titleId}-description`, [titleId]);

  const containerVariants: Variants = useMemo(
    () => ({
      hidden: {
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 16,
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: shouldReduceMotion
          ? { duration: 0 }
          : {
              duration: 0.6,
              ease: "easeOut",
              staggerChildren: 0.18,
              delayChildren: 0.12,
            },
      },
    }),
    [shouldReduceMotion],
  );

  const itemVariants: Variants = useMemo(
    () => ({
      hidden: {
        opacity: shouldReduceMotion ? 1 : 0,
        y: shouldReduceMotion ? 0 : 24,
        filter: shouldReduceMotion ? "none" : "blur(4px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "none",
        transition: shouldReduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 120, damping: 18, mass: 0.9 },
      },
    }),
    [shouldReduceMotion],
  );

  const arrowAnimation = shouldReduceMotion
    ? {}
    : {
        animate: { x: [0, 5, 0] },
        transition: { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <section
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="w-full px-4 py-16 sm:px-6 lg:px-8 bg-cover bg-center bg-fixed bg-[url(/assets/flower-bg.png)] "
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView={isInView ? "visible" : "hidden"}
        >
          <Card className="relative overflow-hidden rounded-sm border border-border/60 bg-card/80 shadow-sm backdrop-blur-md transition-[transform,box-shadow] duration-500 hover:shadow-[0_25px_80px_rgba(15,23,36,0.45)]">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <motion.div
                className="absolute -top-32 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl"
                {...(shouldReduceMotion
                  ? {}
                  : {
                      animate: {
                        opacity: [0.4, 0.75, 0.4],
                        scale: [0.9, 1.05, 0.9],
                      },
                      transition: {
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    })}
              />
              <motion.div
                className="absolute bottom-[-20%] right-[-10%] h-72 w-72 rounded-full bg-primary blur-[120px]"
                {...(shouldReduceMotion
                  ? {}
                  : {
                      animate: {
                        opacity: [0.3, 0.6, 0.3],
                        rotate: [0, 15, 0],
                      },
                      transition: {
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      },
                    })}
              />
            </div>
            <CardContent className="relative z-10 flex flex-col gap-10 p-8 text-center sm:p-12">
              <motion.div
                variants={itemVariants}
                className="mx-auto inline-flex items-center gap-3 rounded-sm border border-border/60 bg-white/5 px-6 py-3 text-sm font-medium text-[var(--muted-foreground)] backdrop-blur-sm"
              >
                <span
                  aria-hidden
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20"
                >
                  <Sparkles className="h-5 w-5 text-primary" aria-hidden />
                </span>
                Limitless Chat
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-4">
                <h2
                  id={titleId}
                  className={`${Bitshow.className} text-3xl font-semibold text-[var(--muted-foreground)] sm:text-4xl md:text-5xl`}
                >
                  Ready to join 1000+ people with ai powered chat?
                </h2>
                <p
                  id={descriptionId}
                  className="mx-auto max-w-2xl text-base text-[var(--muted-foreground)] sm:text-lg"
                >
                  Join thousands of people with AI powered chatting platform
                  hyper-chat start for free now.
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="group gap-2 rounded-full bg-primary px-8 py-6 text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 hover:translate-y-[-2px] hover:shadow-xl"
                  >
                    Get Started
                    <motion.span
                      aria-hidden
                      className="inline-flex"
                      {...(arrowAnimation as Variants)}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </Link>
              </motion.div>

              <motion.ul
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--muted-foreground)]"
              >
                {highlights.map((item, _index) => (
                  <StatusIndicator
                    key={item.label}
                    label={item.label}
                    state="fixing"
                  />
                ))}
              </motion.ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
