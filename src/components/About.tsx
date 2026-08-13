import { useRef } from 'react'
import { useScroll } from 'framer-motion'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import AnimatedLetter from './AnimatedLetter'

const BODY_TEXT =
  'Over the last seven years, I have worked with Parallax, a Berlin-based production house that crafts cinema, series, and Noir Studio in Paris. Together, we have created work that has earned international acclaim at several major festivals.'

export default function About() {
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({
    target: paragraphRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  const chars = BODY_TEXT.split('')

  return (
    <section className="bg-black px-4 py-20 sm:py-28 md:py-32">
      <div className="mx-auto max-w-6xl rounded-2xl md:rounded-[2rem] bg-[#101010] px-6 py-16 text-center sm:px-10 sm:py-20 md:px-16 md:py-24">
        <p className="mb-6 text-[10px] text-primary sm:mb-8 sm:text-xs">Visual arts</p>

        <WordsPullUpMultiStyle
          className="mx-auto max-w-3xl text-3xl leading-[0.95] sm:text-4xl sm:leading-[0.9] md:text-5xl lg:text-6xl xl:text-7xl"
          segments={[
            { text: 'I am Marcus Chen,', className: 'font-normal text-primary' },
            { text: 'a self-taught director.', className: 'font-serif italic text-primary' },
            {
              text: 'I have skills in color grading, visual effects, and narrative design.',
              className: 'font-normal text-primary',
            },
          ]}
        />

        <p
          ref={paragraphRef}
          className="mx-auto mt-8 max-w-2xl text-xs text-[#DEDBC8] sm:mt-10 sm:text-sm md:text-base"
        >
          {chars.map((char, i) => (
            <AnimatedLetter
              key={i}
              char={char}
              index={i}
              total={chars.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </p>
      </div>
    </section>
  )
}
