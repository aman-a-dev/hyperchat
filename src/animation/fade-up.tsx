"use client";
import { motion } from "motion/react";

export default function FadeUp({ children }) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: false }}
      transition={{ duration: 1, type: "spring" }}
      className="mt-20"
    >
      {children}
    </motion.div>
  );
}
