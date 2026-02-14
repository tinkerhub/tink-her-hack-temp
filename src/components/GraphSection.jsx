import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const GraphSection = ({ records, loading, error }) => {
  const chartData = (records || []).map((record) => ({
    date: new Date(record.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    recoveryScore: record.recovery_score,
    moodScore: record.mood_score,
  }))

  return (
    <>
      {loading ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="loader" style={{ margin: '0 auto' }}></div>
          <p className="muted" style={{ marginTop: '16px' }}>Loading trends…</p>
        </div>
      ) : error ? (
        <div className="error-banner">{error}</div>
      ) : chartData.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <p style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</p>
          <p className="muted">No data yet. Add your first health record to see trends.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '28px' }}>
          <div className="card card--blue">
            <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>Recovery Score</h3>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '16px', lineHeight: '1.6' }}>
              Your overall wellness score based on mood, sleep, pain, and support levels.
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '0.85rem' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  stroke="#6B7280"
                  style={{ fontSize: '0.85rem' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.15)'
                  }}
                  formatter={(value) => [Math.round(value), 'Score']}
                />
                <Line
                  type="monotone"
                  dataKey="recoveryScore"
                  stroke="#4F46E5"
                  strokeWidth={3}
                  dot={{ fill: '#4F46E5', r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card card--green">
            <h3 style={{ marginBottom: '20px', color: '#1F2937' }}>Mood Trend</h3>
            <p style={{ fontSize: '0.9rem', color: '#6B7280', marginBottom: '16px', lineHeight: '1.6' }}>
              Track your emotional state throughout your recovery journey.
            </p>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#66BB6A" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#66BB6A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="#6B7280"
                  style={{ fontSize: '0.85rem' }}
                />
                <YAxis 
                  domain={[1, 5]} 
                  stroke="#6B7280"
                  style={{ fontSize: '0.85rem' }}
                  label={{ value: '(1-5)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{
                    background: '#FFFFFF',
                    border: '2px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(102, 187, 106, 0.15)'
                  }}
                  formatter={(value) => [value.toFixed(1), 'Mood']}
                />
                <Line
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#66BB6A"
                  strokeWidth={3}
                  dot={{ fill: '#66BB6A', r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  )
}

export default GraphSection

