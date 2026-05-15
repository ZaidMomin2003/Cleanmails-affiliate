import { useState, useEffect } from 'react'
import { User, Mail, Phone, Globe, MapPin, Camera, Save, Shield, Bell, Key } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateAffiliateProfile } from '../lib/database'
import './Profile.css'

function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('general')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    email: '',
    phone: '',
    country: '',
    website: '',
    bestSocial: '',
    socialHandle: '',
    telegram: '',
    whatsapp: '',
    audience: '',
    niche: '',
    promotionMethod: '',
    wiseEmail: '',
    wiseName: '',
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        displayName: profile.displayName || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        country: profile.country || '',
        website: profile.website || '',
        bestSocial: profile.bestSocial || '',
        socialHandle: profile.socialHandle || '',
        telegram: profile.telegram || '',
        whatsapp: profile.whatsapp || '',
        audience: profile.audience || '',
        niche: profile.niche || '',
        promotionMethod: profile.promotionMethod || '',
        wiseEmail: profile.wiseEmail || '',
        wiseName: profile.wiseName || '',
      })
    }
  }, [profile, user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setSaved(false)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    try {
      await updateAffiliateProfile(user.uid, formData)
      await refreshProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      console.warn('Failed to save:', e.message)
    }
    setSaving(false)
  }

  const totalEarned = profile?.totalEarned || 0
  const totalPurchases = profile?.totalPurchases || 0
  const initials = formData.name
    ? formData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="profile-page">
      <div className="page-header">
        <div className="page-title-row">
          <h1>Profile</h1>
        </div>
        <p>Manage your account settings and preferences</p>
      </div>

      {/* Profile Header Card */}
      <div className="profile-hero">
        <div className="profile-avatar-section">
          <div className="profile-avatar">
            <span>{initials}</span>
          </div>
          <div className="profile-identity">
            <h2>{formData.name || 'Affiliate'}</h2>
            <p>{user?.email || ''}</p>
            <div className="profile-badges">
              <span className="profile-badge active">Active Affiliate</span>
              {profile?.createdAt && (
                <span className="profile-badge">
                  Joined {new Date(profile.createdAt.toDate ? profile.createdAt.toDate() : profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="profile-quick-stats">
          <div className="pq-stat">
            <span className="pq-val">${totalEarned.toFixed(0)}</span>
            <span className="pq-label">Earned</span>
          </div>
          <div className="pq-stat">
            <span className="pq-val">{profile?.balance?.toFixed(0) || '0'}</span>
            <span className="pq-label">Balance</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button className={`profile-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
          <User size={15} /> General
        </button>
        <button className={`profile-tab ${activeTab === 'social' ? 'active' : ''}`} onClick={() => setActiveTab('social')}>
          <Globe size={15} /> Social & Promotion
        </button>
        <button className={`profile-tab ${activeTab === 'payout' ? 'active' : ''}`} onClick={() => setActiveTab('payout')}>
          <Key size={15} /> Payout Settings
        </button>
      </div>

      {/* Tab Content */}
      <form onSubmit={handleSave}>
        {activeTab === 'general' && (
          <div className="profile-form-card">
            <div className="form-card-header">
              <h3>Personal Information</h3>
              <p>Update your personal details</p>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Full Name</label>
                <div className="field-input-wrap">
                  <User size={15} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Display Name</label>
                <div className="field-input-wrap">
                  <span className="field-prefix">@</span>
                  <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Email Address</label>
                <div className="field-input-wrap">
                  <Mail size={15} />
                  <input type="email" name="email" value={formData.email} onChange={handleChange} disabled />
                </div>
              </div>
              <div className="form-field">
                <label>Phone Number</label>
                <div className="field-input-wrap">
                  <Phone size={15} />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Country</label>
                <div className="field-input-wrap">
                  <MapPin size={15} />
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="in">India</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Website</label>
                <div className="field-input-wrap">
                  <Globe size={15} />
                  <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="profile-form-card">
            <div className="form-card-header">
              <h3>Social Media & Promotion</h3>
              <p>Your social presence and promotion strategy</p>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Best Social Platform</label>
                <div className="field-input-wrap">
                  <Globe size={15} />
                  <select name="bestSocial" value={formData.bestSocial} onChange={handleChange}>
                    <option value="">Select platform</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Social Handle / URL</label>
                <div className="field-input-wrap">
                  <span className="field-prefix">@</span>
                  <input type="text" name="socialHandle" value={formData.socialHandle} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Telegram</label>
                <div className="field-input-wrap">
                  <span className="field-prefix">@</span>
                  <input type="text" name="telegram" value={formData.telegram} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>WhatsApp</label>
                <div className="field-input-wrap">
                  <Phone size={15} />
                  <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} />
                </div>
              </div>
              <div className="form-field">
                <label>Audience Size</label>
                <div className="field-input-wrap">
                  <User size={15} />
                  <select name="audience" value={formData.audience} onChange={handleChange}>
                    <option value="">Select range</option>
                    <option value="0-1k">0 - 1,000</option>
                    <option value="1k-10k">1,000 - 10,000</option>
                    <option value="10k-50k">10,000 - 50,000</option>
                    <option value="50k-100k">50,000 - 100,000</option>
                    <option value="100k+">100,000+</option>
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Promotion Method</label>
                <div className="field-input-wrap">
                  <Globe size={15} />
                  <select name="promotionMethod" value={formData.promotionMethod} onChange={handleChange}>
                    <option value="">Select method</option>
                    <option value="content">Content / Reviews</option>
                    <option value="social">Social Media Posts</option>
                    <option value="email">Email Newsletter</option>
                    <option value="video">Video Content</option>
                    <option value="ads">Paid Ads</option>
                  </select>
                </div>
              </div>
              <div className="form-field full-width">
                <label>Niche / Industry</label>
                <div className="field-input-wrap">
                  <input type="text" name="niche" value={formData.niche} onChange={handleChange} placeholder="e.g., SaaS, Marketing" />
                </div>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'payout' && (
          <div className="profile-form-card">
            <div className="form-card-header">
              <h3>Payout Settings</h3>
              <p>Configure your Wise payment details</p>
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label>Wise Email</label>
                <div className="field-input-wrap">
                  <Mail size={15} />
                  <input type="email" name="wiseEmail" value={formData.wiseEmail} onChange={handleChange} placeholder="your@wise-email.com" />
                </div>
              </div>
              <div className="form-field">
                <label>Recipient Name (as on Wise)</label>
                <div className="field-input-wrap">
                  <User size={15} />
                  <input type="text" name="wiseName" value={formData.wiseName} onChange={handleChange} placeholder="Full name on Wise" />
                </div>
              </div>
            </div>
            <div className="payout-info-box">
              <Shield size={16} />
              <div>
                <strong>Secure Payments</strong>
                <p>All payouts are processed securely through Wise. Minimum payout amount is $10.00. Payouts happen on the 10th and 25th.</p>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="save-btn" disabled={saving}>
                <Save size={15} />
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

export default Profile
