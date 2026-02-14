import { useState } from 'react'
import { supabase } from '../supabaseClient'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [weeksPostpartum, setWeeksPostpartum] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [deliveryType, setDeliveryType] = useState('Normal')
  const [deliveryLocation, setDeliveryLocation] = useState('')
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('signin')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    const authCall =
      mode === 'signin'
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                weeks_postpartum: weeksPostpartum,
                delivery_date: deliveryDate,
                delivery_type: deliveryType,
                delivery_location: deliveryLocation,
                delivery_notes: deliveryNotes,
              },
            },
          })

    const { error: authError } = await authCall

    if (authError) {
      setError(authError.message)
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 style={{ 
          background: 'linear-gradient(135deg, #c084fc 0%, #f97316 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2rem',
          marginBottom: '8px'
        }}>
          Postpartum Recovery
        </h2>
        <p className="muted" style={{ marginBottom: '28px' }}>Secure access to your recovery dashboard.</p>

        <form className="form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label className="field">
              Full name
              <input
                type="text"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}
          <label className="field">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="field">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
          </label>

          {mode === 'signup' && (
            <>
              <label className="field">
                Weeks postpartum
                <input
                  type="number"
                  min="0"
                  value={weeksPostpartum}
                  onChange={(event) => setWeeksPostpartum(event.target.value)}
                  placeholder="e.g. 6"
                  required
                />
              </label>

              <label className="field">
                Delivery date
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  required
                />
              </label>

              <label className="field">
                Delivery type
                <select
                  value={deliveryType}
                  onChange={(event) => setDeliveryType(event.target.value)}
                  required
                >
                  <option value="Normal">Normal</option>
                  <option value="C-section">C-section</option>
                  <option value="Assisted">Assisted</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              <label className="field">
                Hospital / clinic
                <input
                  type="text"
                  value={deliveryLocation}
                  onChange={(event) => setDeliveryLocation(event.target.value)}
                  placeholder="Hospital or clinic name"
                  required
                />
              </label>

              <label className="field">
                Delivery notes (optional)
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(event) => setDeliveryNotes(event.target.value)}
                  placeholder="Complications, medications, etc."
                />
              </label>
            </>
          )}

          {error && <div className="error-banner">{error}</div>}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          type="button"
          className="link-btn"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
        >
          {mode === 'signin'
            ? "Don't have an account? Create one"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

export default Login
