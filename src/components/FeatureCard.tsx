import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface FeatureCardProps {
  index: number
  number: string
  title: string
  icon: string
  items: string[]
}

export default function FeatureCard({ index, number, title, icon, items }: FeatureCardProps) {
  return (
    <motion.div
      className="flex min-h-[280px] flex-col justify-between rounded-2xl bg-[#212121] p-5 sm:min-h-[320px] sm:p-6 lg:h-full lg:min-h-0"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: EASE }}
    >
      <div>
        <img
          src={icon}
          alt=""
          className="mb-6 h-10 w-10 rounded-md object-cover sm:mb-8 sm:h-12 sm:w-12"
        />
        <div className="mb-4 flex items-baseline gap-2 sm:mb-5">
          <h3 className="text-base font-medium text-primary sm:text-lg">{title}</h3>
          <span className="text-xs text-gray-500">({number})</span>
        </div>
        <ul className="flex flex-col gap-2 sm:gap-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-gray-400 sm:text-sm">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary sm:h-4 sm:w-4" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <a
        href="#"
        className="group mt-6 inline-flex w-fit items-center gap-1.5 text-xs text-primary sm:text-sm"
      >
        Learn more
        <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 group-hover:translate-x-0.5" />
      </a>
    </motion.div>
  )
}
