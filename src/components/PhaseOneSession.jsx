import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import BreathingGame from './BreathingGame'
import GratitudeGarden from './GratitudeGarden'
import CalmButton from './CalmButton'

const PhaseOneSession = ({ session }) => {
  const [moodBefore, setMoodBefore] = useState(3)
  const [moodAfter, setMoodAfter] = useState(3)
  const [moodBeforeTouched, setMoodBeforeTouched] = useState(false)
  const [moodAfterTouched, setMoodAfterTouched] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [completedToday, setCompletedToday] = useState(false)
  const [sessions, setSessions] = useState([])

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const fetchSessions = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select('id, created_at')
      .eq('user_id', session.user.id)
      .eq('phase', 'Phase 1')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setSessions(data ?? [])
    setCompletedToday((data ?? []).some((item) => item.created_at === today))
  }, [session.user.id, today])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const handleComplete = async () => {
    setSaving(true)
    setError('')

    const { data: existing, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', 'Phase 1')
      .eq('created_at', today)
      .limit(1)

    if (checkError) {
      setError(checkError.message)
      setSaving(false)
      return
    }

    if (existing && existing.length > 0) {
      setCompletedToday(true)
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('sessions').insert({
      user_id: session.user.id,
      phase: 'Phase 1',
      mood_before: moodBefore,
      mood_after: moodAfter,
      completed: true,
      created_at: today,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setCompletedToday(true)
    await fetchSessions()
    setSaving(false)
  }

  const getMoodLabel = (value) => {
    const labels = { 1: 'Very Low', 2: 'Low', 3: 'Neutral', 4: 'Good', 5: 'Excellent' }
    return labels[value] || 'Neutral'
  }

  return (
    <div className="phase-content">
      {completedToday ? (
        <div className="phase-complete">
          <p className="phase-complete-icon">🌸</p>
          <p className="phase-complete-title">Session Completed</p>
          <p className="phase-complete-text">
            Great job! Consistency builds recovery. Your garden is growing.
          </p>
        </div>
      ) : (
        <>
          <div className="breathing-mood-section">
            <label className="mood-label">
              How are you feeling right now?
            </label>
            <input
              type="range"
              className="mood-slider"
              min="1"
              max="5"
              value={moodBefore}
              onChange={(event) => {
                setMoodBefore(Number(event.target.value))
                setMoodBeforeTouched(true)
              }}
            />
            <div className="mood-values">
              <span>Overwhelmed</span>
              <span className="mood-highlight">{getMoodLabel(moodBefore)}</span>
              <span>Calm</span>
            </div>
          </div>

          <BreathingGame
            disabled={completedToday}
            canStart={moodBeforeTouched}
            onComplete={() => setTimerDone(true)}
          />

          <div className="breathing-mood-section">
            <label className="mood-label">
              How do you feel after breathing?
            </label>
            <input
              type="range"
              className="mood-slider"
              min="1"
              max="5"
              value={moodAfter}
              onChange={(event) => {
                setMoodAfter(Number(event.target.value))
                setMoodAfterTouched(true)
              }}
            />
            <div className="mood-values">
              <span>Overwhelmed</span>
              <span className="mood-highlight">{getMoodLabel(moodAfter)}</span>
              <span>Calm</span>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          <CalmButton
            variant="primary"
            size="lg"
            fullWidth
            disabled={!timerDone || !moodAfterTouched || saving}
            onClick={handleComplete}
          >
            {saving ? 'Saving…' : 'Complete Session'}
          </CalmButton>
        </>
      )}

      <GratitudeGarden sessions={sessions} />
    </div>
  )
}

export default PhaseOneSession
