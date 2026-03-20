import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface MotionSectionProps {
  children: ReactNode;
  direction?: "left" | "right";
  amount?: number;
  duration?: number;
}

const MotionSection = ({
  children,
  direction = "left",
  amount = 0.1,
  duration = 0.8,
}: MotionSectionProps) => {
  const initial = direction === "left"
    ? { x: -60, opacity: 0 }
    : { x: 60, opacity: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ x: 0, opacity: 1 }}
      transition={{ duration, ease: "easeOut" }}
      viewport={{ once: true, amount, margin: "0px 0px -50px 0px" }}
    >
      {children}
    </motion.div>
  );
};

export default MotionSection;