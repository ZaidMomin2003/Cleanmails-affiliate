import { useState, useEffect } from 'react'
import { Trophy, Medal, TrendingUp, Crown } from 'lucide-react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import './Leaderboard.css'

function Leaderboard() {
  const { user, profile } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()
  }, [user, profile])

  async function loadLeaderboard() {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'affiliates'),
        orderBy('totalEarned', 'desc'),
        limit(50)
      )
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map((doc) => ({
        uid: doc.id,
        name: doc.data().name || 'Anonymous',
        sales: Math.floor((doc.data().totalEarned || 0) / 100),
        earned: doc.data().totalEarned || 0,
        isMe: doc.id === user?.uid,
      }))
      setLeaderboard(data)

      const rank = data.findIndex(e => e.uid === user?.uid)
      setMyRank(rank >= 0 ? rank + 1 : null)
    } catch (e) {
      console.warn('Failed to load leaderboard:', e.message)
    }
    setLoading(false)
  }

  const mySales = profile?.totalEarned ? Math.floor(profile.totalEarned / 100) : 0
  const topUser = leaderboard[0]
  const salesToFirst = topUser && !topUser.isMe ? Math.max(0, topUser.sales - mySales) : 0

  if (loading) {
    return (
      <div className="leaderboard-page">
        <div className="page-header">
          <div className="page-title-row"><h1>Leaderboard</h1></div>
          <p>See how you rank against other affiliates</p>
        </div>
        <p className="empty-state">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="leaderboard-page">
      <div className="page-header">
        <div className="page-title-row">
          <h1>Leaderboard</h1>
        </div>
        <p>See how you rank against other affiliates</p>
      </div>

      {/* Your Rank Card */}
      <div className="rank-card">
        <div className="rank-card-left">
          <div className="rank-position">
            <span className="rank-hash">#</span>
            <span className="rank-number">{myRank || '—'}</span>
          </div>
          <div className="rank-info">
            <h3>Your Rank</h3>
            <p>{profile?.name || 'You'} • {mySales} sale{mySales !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="rank-card-right">
          <div className="rank-to-first">
            <TrendingUp size={16} />
            <span>
              {salesToFirst === 0
                ? myRank === 1 ? "You're #1!" : "Make your first sale!"
                : `${salesToFirst} more sale${salesToFirst === 1 ? '' : 's'} to reach #1`}
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="podium">
          <div className="podium-item second">
            <div className="podium-avatar">{getInitials(leaderboard[1].name)}</div>
            <span className="podium-name">{leaderboard[1].name}{leaderboard[1].isMe ? ' (You)' : ''}</span>
            <span className="podium-sales">{leaderboard[1].sales} sales</span>
            <div className="podium-medal"><Medal size={18} /></div>
            <span className="podium-rank">2</span>
          </div>
          <div className="podium-item first">
            <div className="podium-crown"><Crown size={20} /></div>
            <div className="podium-avatar gold">{getInitials(leaderboard[0].name)}</div>
            <span className="podium-name">{leaderboard[0].name}{leaderboard[0].isMe ? ' (You)' : ''}</span>
            <span className="podium-sales">{leaderboard[0].sales} sales</span>
            <div className="podium-medal gold"><Trophy size={18} /></div>
            <span className="podium-rank">1</span>
          </div>
          <div className="podium-item third">
            <div className="podium-avatar">{getInitials(leaderboard[2].name)}</div>
            <span className="podium-name">{leaderboard[2].name}{leaderboard[2].isMe ? ' (You)' : ''}</span>
            <span className="podium-sales">{leaderboard[2].sales} sales</span>
            <div className="podium-medal"><Medal size={18} /></div>
            <span className="podium-rank">3</span>
          </div>
        </div>
      )}

      {/* Full List */}
      {leaderboard.length === 0 ? (
        <p className="empty-state">No affiliates on the leaderboard yet. Be the first to make a sale!</p>
      ) : (
        <div className="leaderboard-list">
          <div className="lb-header">
            <span>Rank</span>
            <span>Affiliate</span>
            <span>Sales</span>
            <span>Earned</span>
          </div>
          {leaderboard.map((entry, i) => (
            <div key={entry.uid} className={`lb-row ${entry.isMe ? 'is-me' : ''}`}>
              <span className="lb-rank">
                {i === 0 && <span className="rank-icon gold">🥇</span>}
                {i === 1 && <span className="rank-icon silver">🥈</span>}
                {i === 2 && <span className="rank-icon bronze">🥉</span>}
                {i > 2 && <span className="rank-num">{i + 1}</span>}
              </span>
              <span className="lb-name">
                <span className="lb-avatar">{getInitials(entry.name)}</span>
                {entry.name}
                {entry.isMe && <span className="you-badge">You</span>}
              </span>
              <span className="lb-sales">{entry.sales}</span>
              <span className="lb-earned">${entry.earned.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default Leaderboard
