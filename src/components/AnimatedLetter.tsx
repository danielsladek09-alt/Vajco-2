import { motion, useTransform, type MotionValue } from 'framer-motion'

interface AnimatedLetterProps {
  char: string
  index: number
  total: number
  scrollProgress: MotionValue<number>
}

export default function AnimatedLetter({
  char,
  index,
  total,
  scrollProgress,
}: AnimatedLetterProps) {
  const charProgress = index / total
  const start = Math.max(0, charProgress - 0.1)
  const end = Math.min(1, charProgress + 0.05)
  const opacity = useTransform(scrollProgress, [start, end], [0.2, 1])

  return (
    <motion.span style={{ opacity }}>{char === ' ' ? ' ' : char}</motion.span>
  )
}
