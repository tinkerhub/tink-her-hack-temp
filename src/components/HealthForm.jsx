import { useState } from 'react'

const HealthForm = ({ onSubmit, loading }) => {
  const [moodScore, setMoodScore] = useState(3)
  const [sleepHours, setSleepHours] = useState(6)
  const [bleedingLevel, setBleedingLevel] = useState(2)
  const [painScore, setPainScore] = useState(4)
  const [ironIntake, setIronIntake] = useState(false)
  const [supportLevel, setSupportLevel] = useState(2)

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      moodScore: Number(moodScore),
      sleepHours: Number(sleepHours),
      bleedingLevel: Number(bleedingLevel),
      painScore: Number(painScore),
      ironIntake,
      supportLevel: Number(supportLevel),
    })
  }

  return (
    <div className="card">
      <h2>Daily Health Check-in</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Mood (1-5)
          <select value={moodScore} onChange={(event) => setMoodScore(event.target.value)}>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Sleep Hours
          <input
            type="number"
            min="0"
            max="12"
            step="0.5"
            value={sleepHours}
            onChange={(event) => setSleepHours(event.target.value)}
            required
          />
        </label>

        <label className="field">
          Bleeding Level (1-3)
          <select
            value={bleedingLevel}
            onChange={(event) => setBleedingLevel(event.target.value)}
          >
            {[1, 2, 3].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          Pain Score (1-10)
          <input
            type="number"
            min="1"
            max="10"
            value={painScore}
            onChange={(event) => setPainScore(event.target.value)}
            required
          />
        </label>

        <label className="field checkbox">
          <input
            type="checkbox"
            checked={ironIntake}
            onChange={(event) => setIronIntake(event.target.checked)}
          />
          Iron intake today
        </label>

        <label className="field">
          Support Level (1-3)
          <select
            value={supportLevel}
            onChange={(event) => setSupportLevel(event.target.value)}
          >
            {[1, 2, 3].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Saving…' : 'Save Daily Record'}
        </button>
      </form>
    </div>
  )
}

export default HealthForm
