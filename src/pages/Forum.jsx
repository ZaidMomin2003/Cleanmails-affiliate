import { useState, useEffect } from 'react'
import { Plus, ExternalLink, X, Heart, MessageCircle } from 'lucide-react'
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import './Forum.css'

const platforms = [
  'Twitter / X',
  'Reddit',
  'LinkedIn',
  'YouTube',
  'Medium',
  'Facebook',
  'Instagram',
  'TikTok',
  'Hacker News',
  'IndieHackers',
  'Product Hunt',
  'Quora',
  'Discord',
  'Substack',
  'Blog',
  'Other',
]

function Forum() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [platform, setPlatform] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const snapshot = await getDocs(collection(db, 'forumPosts'))
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
      data.sort((a, b) => {
        const aT = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
        const bT = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
        return bT - aT
      })
      setPosts(data)
    } catch (e) {
      console.warn('Failed to load forum:', e.message)
    }
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!linkUrl || !platform) return
    setSubmitting(true)
    try {
      await addDoc(collection(db, 'forumPosts'), {
        url: linkUrl,
        platform,
        authorId: user.uid,
        authorName: profile?.name || 'Anonymous',
        likes: 0,
        createdAt: serverTimestamp(),
      })
      setLinkUrl('')
      setPlatform('')
      setShowModal(false)
      await loadPosts()
    } catch (e) {
      console.warn('Failed to post:', e.message)
    }
    setSubmitting(false)
  }

  async function handleLike(postId) {
    try {
      await updateDoc(doc(db, 'forumPosts', postId), {
        likes: increment(1),
      })
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p))
    } catch (e) {
      console.warn('Like failed:', e.message)
    }
  }

  return (
    <div className="forum-page">
      <div className="page-header">
        <div>
          <h1>Community Forum</h1>
          <p>Share your posts and support fellow affiliates. Like, comment, and help each other go viral.</p>
        </div>
        <button className="forum-add-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Share a Post
        </button>
      </div>

      <div className="forum-info-bar">
        Drop your links here so other affiliates can engage with your content. The more we support each other, the more reach we all get.
      </div>

      {/* Post List */}
      {loading ? (
        <p className="empty-state">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="empty-state">No posts shared yet. Be the first to drop a link.</p>
      ) : (
        <div className="forum-list">
          {posts.map((post) => (
            <div key={post.id} className="forum-card">
              <div className="forum-card-left">
                <span className="forum-platform">{post.platform}</span>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="forum-link">
                  {post.url.length > 60 ? post.url.slice(0, 60) + '...' : post.url}
                  <ExternalLink size={12} />
                </a>
                <span className="forum-author">by {post.authorName} · {formatTime(post.createdAt)}</span>
              </div>
              <div className="forum-card-actions">
                <button className="forum-like-btn" onClick={() => handleLike(post.id)}>
                  <Heart size={14} />
                  <span>{post.likes || 0}</span>
                </button>
                <a href={post.url} target="_blank" rel="noopener noreferrer" className="forum-engage-btn">
                  <MessageCircle size={14} />
                  Engage
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showModal && (
        <div className="forum-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="forum-modal" onClick={e => e.stopPropagation()}>
            <div className="forum-modal-header">
              <h3>Share a Post</h3>
              <button onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="forum-modal-body">
                <div className="forum-field">
                  <label>Platform</label>
                  <select value={platform} onChange={e => setPlatform(e.target.value)} required>
                    <option value="">Select platform</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="forum-field">
                  <label>Post URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={linkUrl}
                    onChange={e => setLinkUrl(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="forum-modal-footer">
                <button type="button" className="forum-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="forum-submit" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default Forum
