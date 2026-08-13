import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface WordsPullUpProps {
  text: string
  className?: string
  showAsterisk?: boolean
  delayOffset?: number
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function WordsPullUp({
  text,
  className = '',
  showAsterisk = false,
  delayOffset = 0,
}: WordsPullUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1
        return (
          <span
            key={i}
            className={`overflow-hidden inline-block pb-[0.08em] mr-[0.2em] last:mr-0 ${
              isLastWord && showAsterisk ? 'pr-[0.35em]' : ''
            }`}
          >
            <motion.span
              className="relative inline-block"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{
                duration: 0.6,
                delay: delayOffset + i * 0.08,
                ease: EASE,
              }}
            >
              {word}
              {isLastWord && showAsterisk && (
                <sup className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</sup>
              )}
            </motion.span>
          </span>
        )
      })}
    </span>
  )
}
