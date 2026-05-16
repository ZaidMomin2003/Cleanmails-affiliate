import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, doc, updateDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { Zap, Users, DollarSign, ShoppingCart, Wallet, ArrowLeft, Search, ChevronDown, ChevronUp, X } from 'lucide-react'
import './Admin.css'

function Admin() {
  const navigate = useNavigate()
  const [affiliates, setAffiliates] = useState([])
  const [purchases, setPurchases] = useState([])
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedAffiliate, setSelectedAffiliate] = useState(null)
  const [detailTab, setDetailTab] = useState('profile')

  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const [affSnap, purSnap, paySnap] = await Promise.all([
        getDocs(collection(db, 'affiliates')),
        getDocs(collection(db, 'purchases')),
        getDocs(collection(db, 'payouts')),
      ])
      setAffiliates(affSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setPurchases(purSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setPayouts(paySnap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (e) {
      console.error('Admin load error:', e.message)
    }
    setLoading(false)
  }

  async function updatePayoutStatus(payoutId, newStatus) {
    try {
      await updateDoc(doc(db, 'payouts', payoutId), { status: newStatus })
      setPayouts(payouts.map(p => p.id === payoutId ? { ...p, status: newStatus } : p))
    } catch (e) {
      console.error('Failed to update payout:', e.message)
    }
  }

  // Stats
  const totalAffiliates = affiliates.length
  const totalRevenue = purchases.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalCommissions = purchases.reduce((sum, p) => sum + (p.commission || 0), 0)
  const totalPaidOut = payouts.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.amount || 0), 0)
  const pendingPayouts = payouts.filter(p => p.status === 'pending')

  // Filter affiliates
  const filtered = affiliates
    .filter(a => {
      if (!search) return true
      const s = search.toLowerCase()
      return (a.name || '').toLowerCase().includes(s) || (a.email || '').toLowerCase().includes(s)
    })
    .sort((a, b) => (b.totalEarned || 0) - (a.totalEarned || 0))

  // Detail view data
  const detailPurchases = selectedAffiliate ? purchases.filter(p => p.affiliateId === selectedAffiliate.id) : []
  const detailPayouts = selectedAffiliate ? payouts.filter(p => p.affiliateId === selectedAffiliate.id) : []

  if (loading) {
    return (
      <div className="admin-page">
        <div className="admin-nav">
          <div className="admin-nav-inner">
            <div className="admin-logo"><Zap size={18} /> <span>Admin Panel</span></div>
          </div>
        </div>
        <div className="admin-content"><p className="admin-loading">Loading admin data...</p></div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* Nav */}
      <div className="admin-nav">
        <div className="admin-nav-inner">
          <div className="admin-logo"><Zap size={18} /> <span>Admin Panel</span></div>
          <button className="admin-back" onClick={() => navigate('/app/dashboard')}>
            <ArrowLeft size={14} /> Back to App
          </button>
        </div>
      </div>

      <div className="admin-content">
        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat-card">
            <Users size={18} />
            <div>
              <span className="asc-val">{totalAffiliates}</span>
              <span className="asc-label">Affiliates</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <ShoppingCart size={18} />
            <div>
              <span className="asc-val">{purchases.length}</span>
              <span className="asc-label">Total Sales</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <DollarSign size={18} />
            <div>
              <span className="asc-val">${totalCommissions.toLocaleString()}</span>
              <span className="asc-label">Commissions</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <Wallet size={18} />
            <div>
              <span className="asc-val">${totalPaidOut.toLocaleString()}</span>
              <span className="asc-label">Paid Out</span>
            </div>
          </div>
        </div>

        {/* Affiliate Detail Modal */}
        {selectedAffiliate && (
          <div className="admin-detail-overlay" onClick={() => setSelectedAffiliate(null)}>
            <div className="admin-detail" onClick={e => e.stopPropagation()}>
              <div className="admin-detail-header">
                <div>
                  <h2>{selectedAffiliate.name || 'Unnamed'}</h2>
                  <p>{selectedAffiliate.email}</p>
                </div>
                <button onClick={() => setSelectedAffiliate(null)}><X size={20} /></button>
              </div>

              <div className="admin-detail-tabs">
                <button className={detailTab === 'profile' ? 'active' : ''} onClick={() => setDetailTab('profile')}>Profile</button>
                <button className={detailTab === 'purchases' ? 'active' : ''} onClick={() => setDetailTab('purchases')}>Purchases ({detailPurchases.length})</button>
                <button className={detailTab === 'payouts' ? 'active' : ''} onClick={() => setDetailTab('payouts')}>Payouts ({detailPayouts.length})</button>
              </div>

              <div className="admin-detail-body">
                {detailTab === 'profile' && (
                  <div className="admin-profile-grid">
                    <div className="apg-item"><span>Name</span><strong>{selectedAffiliate.name || '—'}</strong></div>
                    <div className="apg-item"><span>Email</span><strong>{selectedAffiliate.email || '—'}</strong></div>
                    <div className="apg-item"><span>Phone</span><strong>{selectedAffiliate.phone || '—'}</strong></div>
                    <div className="apg-item"><span>Country</span><strong>{selectedAffiliate.country || '—'}</strong></div>
                    <div className="apg-item"><span>Social</span><strong>{selectedAffiliate.bestSocial || '—'} — {selectedAffiliate.socialHandle || '—'}</strong></div>
                    <div className="apg-item"><span>Audience</span><strong>{selectedAffiliate.audience || '—'}</strong></div>
                    <div className="apg-item"><span>Wise Email</span><strong>{selectedAffiliate.wiseEmail || 'Not set'}</strong></div>
                    <div className="apg-item"><span>Wise Name</span><strong>{selectedAffiliate.wiseName || 'Not set'}</strong></div>
                    <div className="apg-item"><span>Total Earned</span><strong>${(selectedAffiliate.totalEarned || 0).toFixed(2)}</strong></div>
                    <div className="apg-item"><span>Balance</span><strong>${(selectedAffiliate.balance || 0).toFixed(2)}</strong></div>
                    <div className="apg-item"><span>Total Paid</span><strong>${(selectedAffiliate.totalPaid || 0).toFixed(2)}</strong></div>
                    <div className="apg-item"><span>Joined</span><strong>{formatDate(selectedAffiliate.createdAt)}</strong></div>
                  </div>
                )}
                {detailTab === 'purchases' && (
                  detailPurchases.length === 0 ? <p className="admin-empty">No purchases yet</p> : (
                    <div className="admin-table">
                      <div className="admin-table-head">
                        <span>Date</span><span>Customer</span><span>Amount</span><span>Commission</span><span>Status</span>
                      </div>
                      {detailPurchases.map(p => (
                        <div key={p.id} className="admin-table-row">
                          <span>{formatDate(p.timestamp)}</span>
                          <span>{p.customerEmail || '—'}</span>
                          <span>${(p.amount || 0).toFixed(2)}</span>
                          <span className="green">${(p.commission || 0).toFixed(2)}</span>
                          <span className={`admin-badge ${p.status}`}>{p.status}</span>
                        </div>
                      ))}
                    </div>
                  )
                )}
                {detailTab === 'payouts' && (
                  detailPayouts.length === 0 ? <p className="admin-empty">No payouts yet</p> : (
                    <div className="admin-table">
                      <div className="admin-table-head">
                        <span>Ref</span><span>Amount</span><span>Status</span><span>Action</span>
                      </div>
                      {detailPayouts.map(p => (
                        <div key={p.id} className="admin-table-row">
                          <span className="mono">{p.reference || '—'}</span>
                          <span>${(p.amount || 0).toFixed(2)}</span>
                          <span className={`admin-badge ${p.status}`}>{p.status}</span>
                          <span>
                            {p.status === 'pending' && (
                              <select onChange={(e) => updatePayoutStatus(p.id, e.target.value)} defaultValue="">
                                <option value="" disabled>Change</option>
                                <option value="processing">Processing</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                              </select>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Affiliates List */}
        <div className="admin-section">
          <div className="admin-section-header">
            <h2>All Affiliates</h2>
            <div className="admin-search">
              <Search size={14} />
              <input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          <div className="admin-table">
            <div className="admin-table-head affiliates-grid">
              <span>#</span><span>Name</span><span>Email</span><span>Sales</span><span>Earned</span><span>Balance</span>
            </div>
            {filtered.map((aff, i) => (
              <div key={aff.id} className="admin-table-row affiliates-grid clickable" onClick={() => { setSelectedAffiliate(aff); setDetailTab('profile') }}>
                <span className="rank-col">{i + 1}</span>
                <span className="name-col">{aff.name || 'Unnamed'}</span>
                <span className="email-col">{aff.email || '—'}</span>
                <span className="mono">{Math.floor((aff.totalEarned || 0) / 100)}</span>
                <span className="mono green">${(aff.totalEarned || 0).toFixed(0)}</span>
                <span className="mono">${(aff.balance || 0).toFixed(0)}</span>
              </div>
            ))}
            {filtered.length === 0 && <p className="admin-empty">No affiliates found</p>}
          </div>
        </div>

        {/* Pending Payouts */}
        {pendingPayouts.length > 0 && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Pending Payouts ({pendingPayouts.length})</h2>
            </div>
            <div className="admin-table">
              <div className="admin-table-head payouts-grid">
                <span>Affiliate</span><span>Amount</span><span>Wise Email</span><span>Reference</span><span>Action</span>
              </div>
              {pendingPayouts.map(p => {
                const aff = affiliates.find(a => a.id === p.affiliateId)
                return (
                  <div key={p.id} className="admin-table-row payouts-grid">
                    <span>{aff?.name || p.affiliateId?.slice(0, 8)}</span>
                    <span className="mono">${(p.amount || 0).toFixed(2)}</span>
                    <span>{p.wiseEmail || '—'}</span>
                    <span className="mono">{p.reference || '—'}</span>
                    <span>
                      <select onChange={(e) => updatePayoutStatus(p.id, e.target.value)} defaultValue="">
                        <option value="" disabled>Change status</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="failed">Failed</option>
                      </select>
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default Admin
