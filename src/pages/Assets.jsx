import { useState, useEffect } from 'react'
import { Download, Image, FileText, Video, Search } from 'lucide-react'
import { getAssets } from '../lib/database'
import './Assets.css'

function Assets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

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
          <p>Download banners, templates, and promotional materials</p>
        </div>
        <div className="assets-search">
          <Search size={15} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Assets Grid */}
      {loading ? (
        <p className="empty-state">Loading assets...</p>
      ) : filteredAssets.length === 0 ? (
        <p className="empty-state">
          {assets.length === 0
            ? 'No marketing assets available yet. Check back soon.'
            : 'No assets match your search.'}
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
              <a
                href={asset.fileUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="download-btn"
                download
              >
                <Download size={16} />
                <span>Download</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Assets
