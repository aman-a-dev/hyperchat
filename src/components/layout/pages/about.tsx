// src/components/layout/pages/about.tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "@/components/font/text/count-up";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Zap,
  Sparkles,
  Building,
  LineChart,
  CheckCircle,
  Brain,
} from "lucide-react";
import React from "react";

interface StatItemProps {
  value?: number;
  label: string;
  icon: React.ReactNode;
  delay?: number;
  decimalPlaces?: number;
  color?: string;
}

const StatItem = ({
  value,
  label,
  icon,
  delay = 0,
  decimalPlaces = 0,
  color = "from-primary to-primary/70",
}: StatItemProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: delay, ease: "easeOut" }}
      className={cn(
        "group border-border/30 bg-card relative overflow-hidden rounded-xl border p-6",
        resolvedTheme === "dark"
          ? "shadow-xl shadow-black/5"
          : "shadow-lg shadow-black/[0.03]",
      )}
    >
      <div
        className={cn(
          "absolute -top-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-all duration-500 group-hover:opacity-30 group-hover:blur-3xl",
          color,
        )}
      />
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white",
            color,
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col">
          <h3 className="flex items-baseline text-3xl font-bold tracking-tight">
            <CountUp to={value || 0} />
            <span className="ml-1 text-sm font-medium opacity-70">+</span>
          </h3>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function About() {
  const aboutRef = useRef(null);
  const statsRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, amount: 0.3 });

  const stats = [
    {
      value: 5000,
      label: "Happy Users",
      icon: <Users className="h-5 w-5" />,
      delay: 0,
      color: "from-yellow-500 to-yellow-300",
      decimalPlaces: 0,
    },
    {
      value: 15,
      label: "AI powered",
      icon: <Brain className="h-5 w-5" />,
      delay: 0.1,
      color: "from-amber-500 to-amber-200",
      decimalPlaces: 0,
    },
    {
      value: 100,
      label: "Projects Completed",
      icon: <CheckCircle className="h-5 w-5" />,
      delay: 0.2,
      color: "from-yellow-500 to-yellow-800",
      decimalPlaces: 0,
    },
    {
      value: 24,
      label: "Cool Chat",
      icon: <Zap className="h-5 w-5" />,
      delay: 0.3,
      color: "from-amber-500 to-amber-400",
      decimalPlaces: 0,
    },
  ];

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24">
      {/* Background pattern */}
      <div className=" absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <title>Background pattern</title>
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative z-10 container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header Section with Badge */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-4 flex justify-center"
          >
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 rounded-full px-4 py-1 text-sm font-medium"
            >
              <Sparkles className="text-primary mr-1 h-3.5 w-3.5" />
              About Us
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="from-foreground to-foreground/70 bg-gradient-to-b bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl"
          >
            About Our Platform{" "}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-muted-foreground mt-4 text-xl"
          >
            The first ai based communication platform.
          </motion.p>
        </div>
        {/* Stats Section */}
        <div ref={statsRef} className="mb-20">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                delay={stat.delay || index * 0.1}
                decimalPlaces={stat.decimalPlaces}
                color={stat.color}
              />
            ))}
          </div>
        </div>
        {/* About Content Section - commented out */}
      </div>
    </section>
  );
}
