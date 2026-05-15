import { useNavigate } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="notfound-page">
      <div className="notfound-content">
        <div className="notfound-logo" onClick={() => navigate('/')}>
          <Zap size={18} />
          <span>CleanMails</span>
        </div>
        <h1 className="notfound-code">404</h1>
        <h2>Page not found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div className="notfound-actions">
          <button onClick={() => navigate(-1)} className="nf-btn-secondary">
            <ArrowLeft size={16} />
            Go back
          </button>
          <button onClick={() => navigate('/')} className="nf-btn-primary">
            Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
