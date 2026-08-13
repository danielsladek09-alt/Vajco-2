import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export interface TextSegment {
  text: string
  className?: string
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[]
  className?: string
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function WordsPullUpMultiStyle({
  segments,
  className = '',
}: WordsPullUpMultiStyleProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const words = segments.flatMap((segment) =>
    segment.text.split(' ').map((word) => ({ word, className: segment.className })),
  )

  return (
    <span ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {words.map((item, i) => (
        <span key={i} className="overflow-hidden inline-block pb-[0.08em] mr-[0.25em] last:mr-0">
          <motion.span
            className={`inline-block ${item.className ?? ''}`}
            initial={{ y: 20, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.08,
              ease: EASE,
            }}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
