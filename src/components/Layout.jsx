import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Image, Wallet, LogOut, Zap, User, Search, Trophy, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { logOut } from '../lib/auth'
import './Layout.css'

function Layout() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    await logOut()
    navigate('/login')
  }

  const closeSidebar = () => setSidebarOpen(false)

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U'

  return (
    <div className="layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={22} />
        </button>
        <div className="landing-logo" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={16} /> CleanMails
        </div>
        <div style={{ width: 38 }}></div>
      </div>

      {/* Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <Zap size={18} />
            </div>
            <div className="logo-text">
              <span className="logo-name">CleanMails</span>
              <span className="logo-sub">Affiliate Portal</span>
            </div>
          </div>
        </div>

        <div className="sidebar-search">
          <Search size={15} />
          <input type="text" placeholder="Search" />
        </div>

        <div className="nav-section">
          <span className="nav-section-title">General</span>
          <nav className="sidebar-nav">
            <NavLink to="/app/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink to="/app/assets" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <Image size={18} />
              <span>Assets</span>
            </NavLink>
            <NavLink to="/app/payouts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <Wallet size={18} />
              <span>Payouts</span>
            </NavLink>
            <NavLink to="/app/leaderboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <Trophy size={18} />
              <span>Leaderboard</span>
            </NavLink>
          </nav>
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Account</span>
          <nav className="sidebar-nav">
            <NavLink to="/app/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={closeSidebar}>
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{initials}</div>
            <div className="user-details">
              <span className="user-name">{profile?.name || 'Affiliate'}</span>
              <span className="user-email">{user?.email || ''}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
