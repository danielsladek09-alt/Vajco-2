import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Navbar from './Navbar'
import WordsPullUp from './WordsPullUp'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const HERO_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4'

export default function Hero() {
  return (
    <section className="h-screen w-full p-4 md:p-6">
      <div className="relative h-full w-full rounded-2xl md:rounded-[2rem] overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={HERO_VIDEO_URL}
          autoPlay
          loop
          muted
          playsInline
        />

        <div className="noise-overlay absolute inset-0 opacity-[0.7] mix-blend-overlay pointer-events-none" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        <Navbar />

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-10">
          <div className="grid grid-cols-12 gap-4 md:gap-6 items-end">
            <div className="col-span-12 md:col-span-8" style={{ color: '#E1E0CC' }}>
              <WordsPullUp
                text="Prisma"
                showAsterisk
                className="font-medium leading-[0.85] tracking-[-0.07em] text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw]"
                delayOffset={0.2}
              />
            </div>

            <div className="col-span-12 md:col-span-4 flex flex-col gap-4 md:gap-6 pb-2 md:pb-3">
              <motion.p
                className="text-primary/70 text-xs sm:text-sm md:text-base"
                style={{ lineHeight: 1.2 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              >
                Prisma is a worldwide network of visual artists, filmmakers and storytellers
                bound not by place, status or labels but by passion and hunger to unlock
                potential through our unique perspectives.
              </motion.p>

              <motion.a
                href="#"
                className="group inline-flex w-fit items-center gap-2 hover:gap-3 transition-all duration-300 bg-primary rounded-full pl-5 pr-1.5 py-1.5 sm:pl-6 sm:pr-2 sm:py-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.7, ease: EASE }}
              >
                <span className="text-black font-medium text-sm sm:text-base">Join the lab</span>
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black transition-transform duration-300 group-hover:scale-110">
                  <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: '#E1E0CC' }} />
                </span>
              </motion.a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
