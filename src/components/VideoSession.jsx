import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import CalmButton from './CalmButton'

const VideoSession = ({ session, phase, title, duration, videoUrl, description = '', benefits = [], sideImage = null }) => {
  const [started, setStarted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [completedToday, setCompletedToday] = useState(false)

  const today = useMemo(() => new Date().toISOString().split('T')[0], [])

  const checkCompletion = useCallback(async () => {
    const { data, error: fetchError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', phase)
      .eq('created_at', today)
      .limit(1)

    if (fetchError) {
      setError(fetchError.message)
      return
    }

    setCompletedToday((data ?? []).length > 0)
  }, [phase, session.user.id, today])

  useEffect(() => {
    checkCompletion()
  }, [checkCompletion])

  const handleComplete = async () => {
    setSaving(true)
    setError('')

    const { data: existing, error: checkError } = await supabase
      .from('sessions')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('phase', phase)
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
      phase,
      mood_before: null,
      mood_after: null,
      completed: true,
      created_at: today,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setCompletedToday(true)
    setSaving(false)
  }

  const defaultDescription = phase === 'Phase 2' 
    ? 'Gentle guided meditation and mindful movement for emotional balance'
    : 'Soft stretching exercises to support physical recovery'

  const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm7LzuGoTOH25Rw6W8GJnNsXWnqGyq_Bzbqw&s'

  const phaseClass = phase === 'Phase 2' ? 'phase-2' : 'phase-3'

  return (
    <div className={`video-card ${phaseClass}`}>
      <div className="video-player-wrapper">
        <div>
          <h3>{title}</h3>
          <p className="session-duration">⏱ {duration}</p>
        </div>
        <div className="video-frame">
          <iframe
            src={videoUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {error && <p className="error-banner">{error}</p>}
        <div className="video-actions">
          {completedToday ? (
            <p className="session-complete">✓ Session completed today!</p>
          ) : (
            <>
              <CalmButton 
                variant={!started ? 'primary' : 'outline'}
                onClick={() => setStarted(true)}
                disabled={started}
                fullWidth
              >
                {started ? 'Session Started' : 'Start Session'}
              </CalmButton>
              {started && (
                <CalmButton 
                  variant="secondary"
                  onClick={handleComplete}
                  disabled={saving}
                  fullWidth
                >
                  {saving ? 'Saving...' : 'Mark as Completed'}
                </CalmButton>
              )}
            </>
          )}
        </div>
      </div>

      <div className="video-side-content">
        <div>
          <img 
            src={sideImage || defaultImage} 
            alt={title} 
            className="side-image" 
          />
        </div>
        <div>
          <p className="video-description">
            {description || defaultDescription}
          </p>
          {benefits.length > 0 && (
            <div className="video-benefits">
              {benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">✨</span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoSession
