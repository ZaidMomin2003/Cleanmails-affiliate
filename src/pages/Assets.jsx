import { useState, useEffect } from 'react'
import { Download, Image, FileText, Video, Search, Mail, PenLine, MessageCircle, Copy, Check } from 'lucide-react'
import { getAssets } from '../lib/database'
import './Assets.css'

const emailTemplates = [
  { id: 'e1', title: 'Cold Outreach — Introduction', preview: 'Hey {name}, I came across your...' },
  { id: 'e2', title: 'Follow-up — Value Add', preview: 'Quick follow-up on my last email...' },
  { id: 'e3', title: 'Case Study Share', preview: 'Thought you\'d find this interesting...' },
  { id: 'e4', title: 'Newsletter Recommendation', preview: 'I\'ve been using this tool for...' },
]

const blogIdeas = [
  { id: 'b1', title: 'Why I Switched from Instantly to CleanMails', preview: 'Comparison post highlighting cost, features, and self-hosting benefits.' },
  { id: 'b2', title: 'The True Cost of Cold Email Tools in 2025', preview: 'Break down monthly costs vs one-time payment. ROI calculator angle.' },
  { id: 'b3', title: 'How to Set Up a Cold Email Stack for $0/mo', preview: 'Self-hosted approach, CleanMails as the core tool, VPS setup guide.' },
  { id: 'b4', title: 'CleanMails Review: Honest Take After 30 Days', preview: 'Personal experience, pros/cons, who it\'s for.' },
]

const tweets = [
  { id: 't1', content: 'Stopped paying $200/mo for cold email tools.\n\nSwitched to @cleanmails — self-hosted, one-time payment, unlimited everything.\n\nSMTP rotation, email validation, AI auto-reply, cadences.\n\nBest decision I made this year. 🔥' },
  { id: 't2', content: 'The cold email tool market is broken:\n\n→ $150-300/mo for basic features\n→ Contact limits\n→ Sender limits\n→ Your data on their servers\n\nCleanMails fixes all of this.\nOne payment. Own it forever.\n\nLink in bio.' },
  { id: 't3', content: 'If you\'re still paying monthly for cold email infrastructure, you\'re leaving money on the table.\n\nCleanMails = self-hosted, unlimited, one-time $497.\n\nDoes everything Instantly + Smartlead do. On YOUR server.' },
]

const redditPosts = [
  { id: 'r1', title: 'Found a self-hosted alternative to Instantly/Smartlead', subreddit: 'r/coldoutreach', preview: 'Been looking for something that doesn\'t cost $200/mo and found this tool called CleanMails...' },
  { id: 'r2', title: 'My cold email setup that costs $0/mo after initial purchase', subreddit: 'r/SaaS', preview: 'Just wanted to share my setup for anyone tired of monthly subscriptions...' },
  { id: 'r3', title: 'Comparison: CleanMails vs Instantly vs Smartlead', subreddit: 'r/Emailmarketing', preview: 'I\'ve used all three. Here\'s my honest comparison for agency owners...' },
]

function Assets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [activeSection, setActiveSection] = useState('files')

  useEffect(() => {
    loadAssets()
  }, [])

  async function loadAssets() {
    setLoading(true)
    try {
      const data = await getAssets()
      setAssets(data)
    } catch (e) {
      console.warn('Failed to load assets:', e.message)
    }
    setLoading(false)
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image size={18} />
      case 'document': return <FileText size={18} />
      case 'video': return <Video size={18} />
      default: return <FileText size={18} />
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case 'image': return 'type-image'
      case 'document': return 'type-document'
      case 'video': return 'type-video'
      default: return ''
    }
  }

  const filteredAssets = assets.filter((asset) => {
    const matchesFilter = filter === 'all' || asset.type === filter
    const matchesSearch = !search || asset.name?.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="assets-page">
      <div className="page-header">
        <div>
          <h1>Marketing Assets</h1>
          <p>Everything you need to promote CleanMails</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="assets-section-tabs">
        <button className={`ast-tab ${activeSection === 'files' ? 'active' : ''}`} onClick={() => setActiveSection('files')}>
          <Image size={15} /> Files & Media
        </button>
        <button className={`ast-tab ${activeSection === 'emails' ? 'active' : ''}`} onClick={() => setActiveSection('emails')}>
          <Mail size={15} /> Email Templates
        </button>
        <button className={`ast-tab ${activeSection === 'blogs' ? 'active' : ''}`} onClick={() => setActiveSection('blogs')}>
          <PenLine size={15} /> Blog Ideas
        </button>
        <button className={`ast-tab ${activeSection === 'tweets' ? 'active' : ''}`} onClick={() => setActiveSection('tweets')}>
          <MessageCircle size={15} /> Tweets
        </button>
        <button className={`ast-tab ${activeSection === 'reddit' ? 'active' : ''}`} onClick={() => setActiveSection('reddit')}>
          <MessageCircle size={15} /> Reddit
        </button>
      </div>

      {/* Files Section */}
      {activeSection === 'files' && (
        <>
          <div className="assets-toolbar">
            <div className="filter-tabs">
              {['all', 'image', 'document', 'video'].map((f) => (
                <button
                  key={f}
                  className={`filter-tab ${filter === f ? 'active' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                </button>
              ))}
            </div>
            <div className="assets-search">
              <Search size={15} />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <p className="empty-state">Loading assets...</p>
          ) : filteredAssets.length === 0 ? (
            <p className="empty-state">
              {assets.length === 0 ? 'No files available yet. Check back soon.' : 'No assets match your search.'}
            </p>
          ) : (
            <div className="assets-grid">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="asset-card">
                  <div className={`asset-preview ${getTypeColor(asset.type)}`}>
                    <span className="asset-emoji">
                      {asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎬' : '📄'}
                    </span>
                  </div>
                  <div className="asset-info">
                    <h3 className="asset-name">{asset.name}</h3>
                    <div className="asset-meta">
                      <span className={`asset-type ${getTypeColor(asset.type)}`}>
                        {getTypeIcon(asset.type)}
                        {asset.format || asset.type?.toUpperCase()}
                      </span>
                      <span className="asset-size">{asset.size || ''}</span>
                    </div>
                  </div>
                  <a href={asset.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="download-btn" download>
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Email Templates */}
      {activeSection === 'emails' && (
        <div className="content-list">
          <p className="content-list-desc">Copy-paste email templates for cold outreach, follow-ups, and newsletters.</p>
          {emailTemplates.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.preview, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Blog Ideas */}
      {activeSection === 'blogs' && (
        <div className="content-list">
          <p className="content-list-desc">Blog post ideas and outlines you can write or adapt for your audience.</p>
          {blogIdeas.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(`${item.title}\n\n${item.preview}`, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tweets */}
      {activeSection === 'tweets' && (
        <div className="content-list">
          <p className="content-list-desc">Ready-to-post tweets. Copy, customize, and share on X/Twitter.</p>
          {tweets.map((item) => (
            <div key={item.id} className="content-card tweet-card">
              <div className="content-card-body">
                <p className="tweet-content">{item.content}</p>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.content, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Reddit */}
      {activeSection === 'reddit' && (
        <div className="content-list">
          <p className="content-list-desc">Reddit post ideas for relevant subreddits. Adapt the tone to each community.</p>
          {redditPosts.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <span className="reddit-sub">{item.subreddit}</span>
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(`${item.title}\n\n${item.preview}`, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Assets
