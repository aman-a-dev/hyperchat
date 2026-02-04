"use client";
import {
  Timeline,
  TimelineItem,
  TimelineItemTitle,
  TimelineItemDescription,
} from "@/components/ui/time-line";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bitshow } from "@/components/font/font";
import { motion } from "motion/react";

const timelineData = [
  {
    title: "1: Account Setup",
    description:
      "Create Account with username, email (with Google or manually) password or login.",

    variant: "default" as const,
  },
  {
    title: "2: Profile Setup",
    description: "(optional) put a profile picture bio and others.",

    variant: "secondary" as const,
  },
  {
    title: "3: AI powered Chat",
    description:
      "Now you can use ai in your chat for example generate ai profile analysis text and a lot more.",
    variant: "default" as const,
  },
  {
    title: "4: Start Chatting 😄",
    description:
      "Start chatting with friend and family world wide with out limitations 😄. ",

    variant: "secondary" as const,
  },
];

export default function QuickStart() {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col overflow-x-hidden pt-3">
      <motion.h1
        initial={{ scale: 2, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, type: "spring" }}
        className={`${Bitshow.className} text-center text-4xl font-extrabold tracking-tight text-balance  md:text-5xl`}
      >
        Quick Start
      </motion.h1>
      <Timeline orientation={isMobile ? "horizontal" : "vertical"}>
        {timelineData.map((item, _idx) => (
          <TimelineItem key={item.title} variant={item.variant}>
            <TimelineItemTitle>{item.title}</TimelineItemTitle>
            <TimelineItemDescription>
              {item.description}
            </TimelineItemDescription>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
}
