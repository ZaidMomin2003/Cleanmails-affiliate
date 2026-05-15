import { useState, useEffect } from 'react'
import { Wallet, DollarSign, Clock, CheckCircle, AlertCircle, Send, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getPayouts, requestPayout } from '../lib/database'
import './Payouts.css'

function Payouts() {
  const { user, profile, refreshProfile } = useAuth()
  const [payouts, setPayouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [payoutAmount, setPayoutAmount] = useState('')
  const [wiseEmail, setWiseEmail] = useState('')
  const [wiseName, setWiseName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) loadPayouts()
  }, [user])

  useEffect(() => {
    if (profile) {
      setWiseEmail(profile.wiseEmail || '')
      setWiseName(profile.wiseName || '')
    }
  }, [profile])

  async function loadPayouts() {
    setLoading(true)
    try {
      const data = await getPayouts(user.uid)
      setPayouts(data)
    } catch (e) {
      console.warn('Failed to load payouts:', e.message)
    }
    setLoading(false)
  }

  async function handleRequestPayout(e) {
    e.preventDefault()
    setError('')
    const amount = parseFloat(payoutAmount)
    const balance = profile?.balance || 0

    if (amount < 10) {
      setError('Minimum payout is $10.00')
      return
    }
    if (amount > balance) {
      setError('Amount exceeds available balance')
      return
    }
    if (!wiseEmail || !wiseName) {
      setError('Please provide Wise email and name')
      return
    }

    setSubmitting(true)
    try {
      await requestPayout(user.uid, amount, wiseEmail, wiseName)
      await refreshProfile()
      await loadPayouts()
      setShowModal(false)
      setPayoutAmount('')
    } catch (e) {
      setError('Failed to submit request. Try again.')
    }
    setSubmitting(false)
  }

  const balance = profile?.balance || 0
  const totalEarned = profile?.totalEarned || 0
  const totalPaid = profile?.totalPaid || 0

  return (
    <div className="payouts-page">
      <div className="page-header">
        <div>
          <h1>Payouts</h1>
          <p>Manage your earnings and request withdrawals via Wise</p>
        </div>
        <button className="request-payout-btn" onClick={() => setShowModal(true)}>
          <Send size={18} />
          <span>Request Payout</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="balance-grid">
        <div className="balance-card available">
          <div className="balance-card-header">
            <Wallet size={20} />
            <span>Available Balance</span>
          </div>
          <div className="balance-amount">${balance.toFixed(2)}</div>
          <p className="balance-note">Minimum payout: $10.00</p>
        </div>

        <div className="balance-card earned">
          <div className="balance-card-header">
            <DollarSign size={20} />
            <span>Total Earned</span>
          </div>
          <div className="balance-amount">${totalEarned.toFixed(2)}</div>
          <p className="balance-note">Lifetime earnings</p>
        </div>

        <div className="balance-card paid">
          <div className="balance-card-header">
            <CheckCircle size={20} />
            <span>Total Paid Out</span>
          </div>
          <div className="balance-amount">${totalPaid.toFixed(2)}</div>
          <p className="balance-note">{payouts.filter(p => p.status === 'completed').length} payouts completed</p>
        </div>
      </div>

      {/* Wise Account Info */}
      <div className="section-card wise-info">
        <div className="section-header">
          <h2>Wise Account Details</h2>
        </div>
        <div className="wise-details">
          <div className="wise-field">
            <span className="wise-label">Recipient Name</span>
            <span className="wise-value">{profile?.wiseName || 'Not set'}</span>
          </div>
          <div className="wise-field">
            <span className="wise-label">Wise Email</span>
            <span className="wise-value">{profile?.wiseEmail || 'Not set'}</span>
          </div>
          <div className="wise-field">
            <span className="wise-label">Status</span>
            <span className={`wise-status ${profile?.wiseEmail ? 'verified' : ''}`}>
              {profile?.wiseEmail ? <><CheckCircle size={14} /> Set up</> : 'Not configured'}
            </span>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="section-card">
        <div className="section-header">
          <h2>Payout History</h2>
          {payouts.length > 0 && <span className="badge">{payouts.length} payouts</span>}
        </div>
        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : payouts.length === 0 ? (
          <p className="empty-state">No payouts yet. Request your first payout when your balance reaches $10.</p>
        ) : (
          <div className="payouts-table">
            <div className="table-header">
              <span>Reference</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Method</span>
              <span>Status</span>
            </div>
            {payouts.map((payout) => (
              <div key={payout.id} className="table-row">
                <span className="payout-ref">{payout.reference || '—'}</span>
                <span>{formatDate(payout.createdAt)}</span>
                <span className="payout-amount">${(payout.amount || 0).toFixed(2)}</span>
                <span className="payout-method">Wise</span>
                <span>
                  <span className={`status-badge ${payout.status || 'pending'}`}>
                    {payout.status === 'completed' && <CheckCircle size={12} />}
                    {payout.status === 'pending' && <Clock size={12} />}
                    {payout.status === 'failed' && <AlertCircle size={12} />}
                    {payout.status || 'pending'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Payout</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRequestPayout}>
              <div className="modal-body">
                <div className="modal-balance">
                  <span>Available Balance</span>
                  <span className="modal-balance-amount">${balance.toFixed(2)}</span>
                </div>

                {error && <div className="modal-error">{error}</div>}

                <div className="modal-field">
                  <label>Payout Amount ($)</label>
                  <input
                    type="number"
                    min="10"
                    max={balance}
                    step="0.01"
                    placeholder="Enter amount (min $10.00)"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Wise Email</label>
                  <input
                    type="email"
                    value={wiseEmail}
                    onChange={(e) => setWiseEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-field">
                  <label>Recipient Name</label>
                  <input
                    type="text"
                    value={wiseName}
                    onChange={(e) => setWiseName(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-info">
                  <AlertCircle size={16} />
                  <span>Payouts are processed on the 10th and 25th of each month via Wise.</span>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  <Send size={16} />
                  {submitting ? 'Submitting...' : 'Request Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(timestamp) {
  if (!timestamp) return '—'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default Payouts
