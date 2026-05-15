import { useState, useEffect } from 'react'
import { Trophy, Medal, TrendingUp, Crown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import './Leaderboard.css'

// Placeholder data — replace with Firestore query later
const placeholderLeaderboard = [
  { uid: '1', name: 'Alex Turner', sales: 47, earned: 4700 },
  { uid: '2', name: 'Sarah Chen', sales: 38, earned: 3800 },
  { uid: '3', name: 'Marcus Johnson', sales: 31, earned: 3100 },
  { uid: '4', name: 'Priya Patel', sales: 28, earned: 2800 },
  { uid: '5', name: 'James Wilson', sales: 24, earned: 2400 },
  { uid: '6', name: 'Emma Rodriguez', sales: 19, earned: 1900 },
  { uid: '7', name: 'David Kim', sales: 15, earned: 1500 },
  { uid: '8', name: 'Lisa Thompson', sales: 12, earned: 1200 },
  { uid: '9', name: 'Omar Hassan', sales: 9, earned: 900 },
  { uid: '10', name: 'Nina Kowalski', sales: 7, earned: 700 },
  { uid: '11', name: 'Ryan Mitchell', sales: 5, earned: 500 },
  { uid: '12', name: 'Aisha Begum', sales: 3, earned: 300 },
]

function Leaderboard() {
  const { user, profile } = useAuth()
  const [leaderboard, setLeaderboard] = useState([])
  const [myRank, setMyRank] = useState(null)

  useEffect(() => {
    // For now use placeholder — later fetch from Firestore
    // sorted by sales descending
    const sorted = [...placeholderLeaderboard].sort((a, b) => b.sales - a.sales)

    // Insert current user into leaderboard if not already there
    const mySales = profile?.totalEarned ? Math.floor(profile.totalEarned / 100) : 0
    const myEntry = {
      uid: user?.uid || 'me',
      name: profile?.name || 'You',
      sales: mySales,
      earned: profile?.totalEarned || 0,
      isMe: true,
    }

    // Find where user would rank
    let inserted = false
    const withUser = []
    for (let i = 0; i < sorted.length; i++) {
      if (!inserted && mySales >= sorted[i].sales) {
        withUser.push(myEntry)
        inserted = true
      }
      withUser.push(sorted[i])
    }
    if (!inserted) withUser.push(myEntry)

    setLeaderboard(withUser)
    const rank = withUser.findIndex(e => e.isMe) + 1
    setMyRank(rank)
  }, [user, profile])

  const topUser = leaderboard[0]
  const salesToFirst = topUser ? Math.max(0, topUser.sales - (profile?.totalEarned ? Math.floor(profile.totalEarned / 100) : 0)) : 0

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
            <p>{profile?.name || 'You'} • {profile?.totalEarned ? Math.floor(profile.totalEarned / 100) : 0} sales</p>
          </div>
        </div>
        <div className="rank-card-right">
          <div className="rank-to-first">
            <TrendingUp size={16} />
            <span>
              {salesToFirst === 0
                ? "You're #1!"
                : `${salesToFirst} more sale${salesToFirst === 1 ? '' : 's'} to reach #1`}
            </span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="podium">
        {leaderboard.length >= 3 && (
          <>
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
          </>
        )}
      </div>

      {/* Full List */}
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
    </div>
  )
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

export default Leaderboard
