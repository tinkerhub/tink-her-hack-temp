import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Journal = ({ session }) => {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchPosts = async () => {
    setLoading(true)
    setError('')

    const { data, error: fetchError } = await supabase
      .from('posts')
      .select('id, content, image_url, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError(fetchError.message)
      setPosts([])
      setLoading(false)
      return
    }

    setPosts(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!content.trim()) return

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('posts').insert({
      user_id: session.user.id,
      content: content.trim(),
      image_url: imageUrl.trim() || null,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setContent('')
    setImageUrl('')
    await fetchPosts()
    setSaving(false)
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div>
          <h1>Postpartum Journal</h1>
          <p className="muted">Share thoughts, memories, or photos from your recovery journey.</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </header>

      <div className="journal-grid">
        <div className="card journal-card">
          <h2>New Entry</h2>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              Notes
              <textarea
                className="text-area"
                rows="5"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="Write something comforting or memorable..."
                required
              />
            </label>
            <label className="field">
              Photo URL (optional)
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            </label>

            {error && <div className="error-banner">{error}</div>}

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? 'Posting…' : 'Post Entry'}
            </button>
          </form>
        </div>

        <div className="card journal-card">
          <h2>Your Entries</h2>
          {loading ? (
            <p className="muted">Loading entries…</p>
          ) : posts.length === 0 ? (
            <p className="muted">No entries yet. Your first note will appear here.</p>
          ) : (
            <div className="journal-feed">
              {posts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-meta">
                    {new Date(post.created_at).toLocaleString()}
                  </div>
                  <p className="post-content">{post.content}</p>
                  {post.image_url && (
                    <img
                      className="post-image"
                      src={post.image_url}
                      alt="Journal"
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Journal
