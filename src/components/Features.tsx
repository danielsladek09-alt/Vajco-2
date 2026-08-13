import { motion } from 'framer-motion'
import WordsPullUpMultiStyle from './WordsPullUpMultiStyle'
import FeatureCard from './FeatureCard'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const CARD_VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4'

const ICON_STORYBOARD =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85'
const ICON_CRITIQUES =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85'
const ICON_CAPSULE =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85'

export default function Features() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black px-4 py-20 sm:py-28 md:py-32">
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-[0.15]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-16 md:mb-20">
          <WordsPullUpMultiStyle
            className="justify-center text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[
              {
                text: 'Studio-grade workflows for visionary creators.',
                className: 'text-primary',
              },
            ]}
          />
          <WordsPullUpMultiStyle
            className="mt-1 justify-center text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl"
            segments={[{ text: 'Built for pure vision. Powered by art.', className: 'text-gray-500' }]}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2 lg:h-[480px] lg:grid-cols-4 lg:gap-1">
          <motion.div
            className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[320px] lg:h-full lg:min-h-0"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0, ease: EASE }}
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={CARD_VIDEO_URL}
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <p
              className="absolute bottom-5 left-5 text-sm font-medium sm:bottom-6 sm:left-6 sm:text-base"
              style={{ color: '#E1E0CC' }}
            >
              Your creative canvas.
            </p>
          </motion.div>

          <FeatureCard
            index={1}
            number="01"
            title="Project Storyboard."
            icon={ICON_STORYBOARD}
            items={[
              'Drag-and-drop scene sequencing',
              'Shot-by-shot annotation tools',
              'Real-time collaborator comments',
              'Version history & rollbacks',
            ]}
          />

          <FeatureCard
            index={2}
            number="02"
            title="Smart Critiques."
            icon={ICON_CRITIQUES}
            items={[
              'AI-powered visual analysis',
              'Contextual creative notes',
              'Seamless tool integrations',
            ]}
          />

          <FeatureCard
            index={3}
            number="03"
            title="Immersion Capsule."
            icon={ICON_CAPSULE}
            items={['Notification silencing', 'Ambient soundscapes', 'Schedule syncing']}
          />
        </div>
      </div>
    </section>
  )
}
