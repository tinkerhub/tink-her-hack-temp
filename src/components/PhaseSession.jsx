import PhaseOneSession from './PhaseOneSession'
import VideoSession from './VideoSession'
import PhaseCard from './PhaseCard'

const PhaseSession = ({ session }) => {
  const metadata = session?.user?.user_metadata ?? {}
  const weeksPostpartum = Number(metadata.weeks_postpartum ?? 0)

  let phase = 'Phase 1'
  let phaseNum = 1
  let title = 'Emotional Stabilization'
  let description = 'Ground yourself with gentle breathing and gratitude practices. These short, focused sessions help calm your nervous system and stabilize your mood during early recovery.'
  let duration = '3–5 minutes'

  if (weeksPostpartum > 8 && weeksPostpartum <= 17) {
    phase = 'Phase 2'
    phaseNum = 2
    title = 'Mind-Body Reconnection'
    description = 'Reconnect with your body through gentle meditation and mindful movement. Restore balance and confidence as you transition into active recovery.'
    duration = '10–15 minutes'
  } else if (weeksPostpartum > 17) {
    phase = 'Phase 3'
    phaseNum = 3
    title = 'Gentle Strength & Stretch'
    description = 'Rebuild strength with soft, controlled movements. Support your physical recovery while honoring the unique journey of your postpartum body.'
    duration = '10–15 minutes'
  }

  return (
    <PhaseCard
      phaseNumber={phaseNum}
      title={title}
      description={description}
      duration={duration}
    >
      {phase === 'Phase 1' ? (
        <PhaseOneSession session={session} />
      ) : (
        <VideoSession
          session={session}
          phase={phase}
          title={title}
          duration={duration}
          videoUrl={
            phase === 'Phase 2'
              ? 'https://www.youtube.com/embed/6p_yaNFSYao'
              : 'https://www.youtube.com/embed/2L2lnxIcNmo'
          }
          benefits={
            phase === 'Phase 2'
              ? ['Reduces stress and anxiety', 'Improves emotional clarity', 'Enhances body awareness']
              : ['Builds core stability', 'Increases flexibility', 'Boosts energy levels']
          }
        />
      )}
    </PhaseCard>
  )
}

export default PhaseSession
