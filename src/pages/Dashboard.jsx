import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, ShoppingCart, Link2, Copy, Check, Plus, ExternalLink, Calendar, Maximize2, MoreVertical, Trophy } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useAuth } from '../context/AuthContext'
import { getReferralLinks, getPurchases, createReferralLink } from '../lib/database'
import './Dashboard.css'

function MiniSparkline({ data, color }) {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 80
  const height = 36
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((val - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="mini-sparkline">
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-label">{label}</p>
        <p className="tooltip-value">${payload[0].value.toFixed(2)}</p>
      </div>
    )
  }
  return null
}

function Dashboard() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [links, setLinks] = useState([])
  const [purchases, setPurchases] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [myRank, setMyRank] = useState(null)
  const [salesToFirst, setSalesToFirst] = useState(0)
  const [showLinkModal, setShowLinkModal] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const [linkExpiry, setLinkExpiry] = useState('')

  useEffect(() => {
    if (user) loadData()
  }, [user])

  async function loadData() {
    setLoading(true)
    try {
      const [linksData, purchasesData] = await Promise.all([
        getReferralLinks(user.uid),
        getPurchases(user.uid),
      ])
      setLinks(linksData)
      setPurchases(purchasesData)

      // Load rank
      const lbQuery = query(collection(db, 'affiliates'), orderBy('totalEarned', 'desc'), limit(50))
      const lbSnap = await getDocs(lbQuery)
      const ranked = lbSnap.docs.map(d => d.id)
      const rank = ranked.indexOf(user.uid)
      setMyRank(rank >= 0 ? rank + 1 : null)
      if (rank > 0) {
        const topEarned = lbSnap.docs[0].data().totalEarned || 0
        const myEarned = profile?.totalEarned || 0
        setSalesToFirst(Math.max(0, Math.floor((topEarned - myEarned) / 100)))
      }
    } catch (e) {
      console.warn('Failed to load data:', e.message)
    }
    setLoading(false)
  }

  async function handleGenerateLink() {
    if (generating) return
    setGenerating(true)
    try {
      const expiresAt = linkExpiry ? new Date(linkExpiry).toISOString() : null
      const newLink = await createReferralLink(user.uid, customCode.trim(), expiresAt)
      setLinks([newLink, ...links])
      setShowLinkModal(false)
      setCustomCode('')
      setLinkExpiry('')
    } catch (e) {
      console.warn('Failed to create link:', e.message)
    }
    setGenerating(false)
  }

  const handleCopy = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Compute stats from real data
  const totalEarned = profile?.totalEarned || 0
  const totalPaid = profile?.totalPaid || 0
  const balance = profile?.balance || 0
  const totalPurchases = purchases.length
  const totalClicks = links.reduce((sum, l) => sum + (l.clicks || 0), 0)
  const conversionRate = totalClicks > 0 ? ((totalPurchases / totalClicks) * 100).toFixed(1) : '0.0'

  // Build chart data from purchases
  const chartData = buildChartData(purchases)

  // Sparkline data from purchases (last 12 data points)
  const earningsSparkline = chartData.slice(-12).map(d => d.earnings)
  const purchaseSparkline = chartData.slice(-12).map(d => d.count || 0)

  return (
    <div className="dashboard">
      <div className="page-header">
        <div className="page-title-section">
          <div className="page-title-row">
            <h1>Dashboard</h1>
            {links.length > 0 && <span className="title-badge">●{links.length}</span>}
          </div>
          <p>Track and manage your affiliate performance</p>
        </div>
      </div>

      {/* Overview */}
      <div className="overview-header">
        <h2>Overview</h2>
        <div className="overview-actions">
          <span className="time-badge"><Calendar size={12} /> All time</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <h3>Total Earnings</h3>
            <p>Your commission from referrals</p>
          </div>
          <div className="stat-card-bottom">
            <div className="stat-card-value-section">
              <span className="stat-value-large">${totalEarned.toFixed(0)}<span className="stat-value-decimal">.{(totalEarned % 1).toFixed(2).slice(2)}</span></span>
              <span className="stat-change-label">Balance: ${balance.toFixed(2)}</span>
            </div>
            <MiniSparkline data={earningsSparkline} color="#ef4444" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <h3>Total Purchases</h3>
            <p>Conversions from your links</p>
          </div>
          <div className="stat-card-bottom">
            <div className="stat-card-value-section">
              <span className="stat-value-large">{totalPurchases}</span>
              <span className="stat-change-label">{conversionRate}% conversion</span>
            </div>
            <MiniSparkline data={purchaseSparkline} color="#f97316" />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <h3>Active Links</h3>
            <p>Your referral links</p>
          </div>
          <div className="stat-card-bottom">
            <div className="stat-card-value-section">
              <span className="stat-value-large">{links.length}</span>
              <span className="stat-change-label">{totalClicks} total clicks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rank Card */}
      <div className="dashboard-rank-card" onClick={() => navigate('/app/leaderboard')}>
        <div className="drc-left">
          <div className="drc-icon"><Trophy size={18} /></div>
          <div className="drc-info">
            <span className="drc-label">Your Rank</span>
            <span className="drc-rank">#{myRank || '—'}</span>
          </div>
        </div>
        <div className="drc-right">
          <span className="drc-gap">{salesToFirst > 0 ? `${salesToFirst} more sale${salesToFirst === 1 ? '' : 's'} to reach #1` : totalPurchases > 0 ? "You're leading!" : 'Make your first sale!'}</span>
          <span className="drc-link">View Leaderboard →</span>
        </div>
      </div>

      {/* Chart + Quick Stats */}
      {chartData.length > 1 && (
        <div className="chart-section">
          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3>Earnings Chart</h3>
                <p>Commission earned over time</p>
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickFormatter={(val) => `$${val}`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="earnings" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" dot={false} activeDot={{ r: 5, fill: '#ef4444', stroke: '#ffffff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="quick-stats-card">
            <div className="quick-stats-header">
              <h3>Quick Stats</h3>
              <p>Your performance metrics</p>
            </div>
            <div className="quick-stats-list">
              <div className="quick-stat-item">
                <div className="quick-stat-dot" style={{ background: '#ef4444' }}></div>
                <span className="quick-stat-name">Available Balance</span>
                <span className="quick-stat-val">${balance.toFixed(2)}</span>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-dot" style={{ background: '#f97316' }}></div>
                <span className="quick-stat-name">Total Paid Out</span>
                <span className="quick-stat-val">${totalPaid.toFixed(2)}</span>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-dot" style={{ background: '#6366f1' }}></div>
                <span className="quick-stat-name">Total Clicks</span>
                <span className="quick-stat-val">{totalClicks}</span>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-dot" style={{ background: '#10b981' }}></div>
                <span className="quick-stat-name">Conversion Rate</span>
                <span className="quick-stat-val">{conversionRate}%</span>
              </div>
              <div className="quick-stat-item">
                <div className="quick-stat-dot" style={{ background: '#eab308' }}></div>
                <span className="quick-stat-name">Avg. Commission</span>
                <span className="quick-stat-val">${totalPurchases > 0 ? (totalEarned / totalPurchases).toFixed(2) : '0.00'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Links */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2>Referral Links</h2>
            <p className="section-subtitle">Your active referral links</p>
          </div>
          <button className="btn-primary-sm" onClick={() => setShowLinkModal(true)}>
            <Plus size={14} />
            Generate Link
          </button>
        </div>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : links.length === 0 ? (
          <p className="empty-state">No referral links yet. Generate your first one above.</p>
        ) : (
          <div className="table-wrapper">
            <div className="table-header">
              <span>Link</span>
              <span>Clicks</span>
              <span>Conversions</span>
              <span>Expires</span>
              <span>Action</span>
            </div>
            {links.map((link) => {
              const isExpired = link.expiresAt && new Date(link.expiresAt) < new Date()
              return (
                <div key={link.id} className={`table-row ${isExpired ? 'expired-row' : ''}`}>
                  <span className="link-url">
                    <Link2 size={13} />
                    {link.url?.replace('https://', '') || link.code}
                  </span>
                  <span className="mono-value">{link.clicks || 0}</span>
                  <span className="mono-value">{link.conversions || 0}</span>
                  <span className="date-value">
                    {link.expiresAt ? formatDate({ toDate: () => new Date(link.expiresAt) }) : 'Never'}
                    {isExpired && <span className="expired-tag">Expired</span>}
                  </span>
                  <span className="link-actions">
                    <button
                      className={`copy-btn ${copiedId === link.id ? 'copied' : ''}`}
                      onClick={() => handleCopy(link.url, link.id)}
                    >
                      {copiedId === link.id ? <Check size={13} /> : <Copy size={13} />}
                      {copiedId === link.id ? 'Copied' : 'Copy'}
                    </button>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Generate Link Modal */}
      {showLinkModal && (
        <div className="link-modal-overlay" onClick={() => setShowLinkModal(false)}>
          <div className="link-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Generate Referral Link</h3>
            <p className="link-modal-sub">Create a custom or auto-generated referral link</p>

            <div className="link-modal-field">
              <label>Custom Code (optional)</label>
              <div className="link-modal-input-row">
                <span className="link-prefix">cleanmails.online/?ref=</span>
                <input
                  type="text"
                  placeholder="my-custom-code"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ''))}
                  maxLength={30}
                />
              </div>
              <span className="link-modal-hint">Leave empty for auto-generated. Letters, numbers, dashes only.</span>
            </div>

            <div className="link-modal-field">
              <label>Expiry Date (optional)</label>
              <input
                type="date"
                value={linkExpiry}
                onChange={(e) => setLinkExpiry(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <span className="link-modal-hint">Leave empty for no expiration.</span>
            </div>

            <div className="link-modal-actions">
              <button className="link-modal-cancel" onClick={() => setShowLinkModal(false)}>Cancel</button>
              <button className="link-modal-create" onClick={handleGenerateLink} disabled={generating}>
                {generating ? 'Creating...' : 'Create Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Purchases */}
      <div className="section-card">
        <div className="section-header">
          <div>
            <h2>Recent Purchases</h2>
            <p className="section-subtitle">Latest conversions from your referrals</p>
          </div>
          {purchases.length > 0 && <span className="count-badge">{purchases.length} total</span>}
        </div>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : purchases.length === 0 ? (
          <p className="empty-state">No purchases yet. Share your referral link to start earning.</p>
        ) : (
          <div className="table-wrapper">
            <div className="table-header purchases-grid">
              <span>Date</span>
              <span>Customer</span>
              <span>Amount</span>
              <span>Commission</span>
              <span>Status</span>
            </div>
            {purchases.slice(0, 10).map((purchase) => (
              <div key={purchase.id} className="table-row purchases-grid">
                <span className="date-value">{formatDate(purchase.timestamp)}</span>
                <span className="mono-value dim">{purchase.customerEmail || '—'}</span>
                <span className="mono-value">${(purchase.amount || 0).toFixed(2)}</span>
                <span className="mono-value success">${(purchase.commission || 0).toFixed(2)}</span>
                <span>
                  <span className={`status-badge ${purchase.status || 'pending'}`}>
                    {purchase.status || 'pending'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Helpers
function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function buildChartData(purchases) {
  if (purchases.length === 0) return []
  const grouped = {}
  purchases.forEach((p) => {
    const date = p.timestamp?.toDate ? p.timestamp.toDate() : new Date(p.timestamp)
    const key = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    if (!grouped[key]) grouped[key] = { earnings: 0, count: 0 }
    grouped[key].earnings += p.commission || 0
    grouped[key].count += 1
  })
  return Object.entries(grouped).map(([date, data]) => ({
    date,
    earnings: data.earnings,
    count: data.count,
  }))
}

export default Dashboard
