"use client";

import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Bitshow } from "@/components/font/font";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Newspaper,
  User,
  CircleDollarSign,
  Users,
  LockKeyhole,
  BrainCircuit,
} from "lucide-react";

const faqs = [
  {
    icon: Newspaper, // Store the component itself, not a rendered instance
    question: "What is hyper-chat?",
    answer:
      "Hyper-chat is a next-generation, AI-powered communication app designed for fast, secure, and intelligent conversations.",
  },
  {
    icon: User, // Store the component itself
    question: "How do I create an account?",
    answer:
      "To create an account, simply click 'Sign Up', and follow the prompts to enter your email, create a username, and set a password.",
  },
  {
    icon: CircleDollarSign, // Store the component itself
    question: "Is hyper-chat free to use?",
    answer:
      "Yes, the core features of hyper-chat are free for everyone. We also developing a premium subscription, 'Hyper-Chat Pro', with advanced features like unlimited cloud storage and a lot more.",
  },
  {
    icon: Users, // Store the component itself
    question: "How do I start a group chat?",
    answer:
      "This feature is still in development we will a announce in the feature",
  },
  {
    icon: LockKeyhole, // Store the component itself
    question: "Are my messages secure?",
    answer:
      "Yes. All messages and calls on hyper-chat are protected by end-to-end encryption (E2EE). This means only you and the person you're communicating with can read or listen to what is sent.",
  },
  {
    icon: BrainCircuit, // Store the component itself
    question: "What is the 'AI Assistant'?",
    answer:
      "The AI Assistant is your personal AI within hyper-chat. You can ask it questions, have it summarize long conversations, set reminders, or even help you draft messages.",
  },
];

export default function FAQ() {
  return (
    <div className="w-full px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-4 inline-flex rounded-full bg-accent/10 p-3"
            aria-hidden="true"
          >
            <HelpCircle
              className="h-20 w-20 text-[var(--muted-foreground)]"
              aria-hidden="true"
            />
          </motion.div>
          <h2
            className={`${Bitshow.className} mb-4 text-3xl font-bold sm:text-4xl md:text-5xl`}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[var(--foreground)]/70 sm:text-base md:text-lg">
            Everything you need to know about our platform
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-md mx-auto space-y-2"
            defaultValue="item-0"
          >
            {faqs.map((faq, index) => {
              const itemId = `item-${index}`;

              return (
                <motion.div
                  key={itemId}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <AccordionItem
                    value={itemId}
                    className="last:border-b border rounded-md"
                  >
                    <AccordionTrigger className="py-3 px-5 text-base items-center">
                      <div className="flex items-center gap-3">
                        <faq.icon className="size-5 text-muted-foreground" />
                        {faq.question}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="relative flex flex-col gap-4 px-5 pl-13">
                      <p className="text-[var(--foreground)]/70">
                        {faq.answer}
                      </p>{" "}
                      <div className="w-px h-full absolute left-7.5 inset-y-0 border-l border-dashed" />
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              );
            })}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
