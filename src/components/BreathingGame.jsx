import { useEffect, useMemo, useState } from 'react'

const TOTAL_SECONDS = 180

const BreathingGame = ({ onComplete, disabled, canStart }) => {
  const [isRunning, setIsRunning] = useState(false)
  const [remaining, setRemaining] = useState(TOTAL_SECONDS)
  const [breathText, setBreathText] = useState('Inhale')

  useEffect(() => {
    if (!isRunning) return undefined

    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsRunning(false)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, onComplete])

  useEffect(() => {
    if (!isRunning) return undefined

    const phaseTimer = setInterval(() => {
      setBreathText((prev) => (prev === 'Inhale' ? 'Exhale' : 'Inhale'))
    }, 4000)

    return () => clearInterval(phaseTimer)
  }, [isRunning])

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(remaining / 60)).padStart(2, '0')
    const seconds = String(remaining % 60).padStart(2, '0')
    return `${minutes}:${seconds}`
  }, [remaining])

  const handleStart = () => {
    if (disabled || !canStart) return
    setRemaining(TOTAL_SECONDS)
    setBreathText('Inhale')
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    setRemaining(TOTAL_SECONDS)
    setBreathText('Inhale')
  }

  return (
    <div className="breathing-container phase-1">
      <div className="breathing-circle-wrapper">
        <div className={`breathing-circle ${isRunning ? 'active' : ''}`}>
          <div className="breathing-text">{breathText}</div>
          <div className="breathing-timer">{formattedTime}</div>
        </div>

        <div className="breathing-controls">
          {isRunning ? (
            <button className="calm-btn calm-btn--primary calm-btn--lg calm-btn--full" onClick={handleStop}>
              Pause Session
            </button>
          ) : (
            <button
              className="calm-btn calm-btn--primary calm-btn--lg calm-btn--full"
              type="button"
              onClick={handleStart}
              disabled={disabled || !canStart}
            >
              {disabled ? 'Already Completed Today' : 'Start Breathing Session'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default BreathingGame
