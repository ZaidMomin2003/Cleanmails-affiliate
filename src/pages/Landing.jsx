import { useNavigate } from 'react-router-dom'
import { Zap, ArrowRight, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import './Landing.css'

const faqs = [
  {
    q: 'How much do I earn per sale?',
    a: '$100. Flat. Every sale. No tiers, no percentages that change based on volume. One sale = one hundred dollars in your pocket.',
  },
  {
    q: 'When do I get paid?',
    a: 'Twice a month. Sales from the 1st–15th get paid by the 25th. Sales from the 15th–30th get paid by the 10th of next month. We use Wise, so it hits your account fast.',
  },
  {
    q: 'Are there any limits?',
    a: 'Nope. No cap on sales, no cap on payouts, no minimum activity requirements. Refer 3 people or 300 — you get paid for all of them.',
  },
  {
    q: 'What exactly is CleanMails?',
    a: 'It\'s a self-hosted cold email tool. SMTP rotation, email validation, automated follow-ups — the whole stack. People pay once and own it forever. No subscriptions, no sending limits. That\'s why it sells well.',
  },
  {
    q: 'Do I need to be a customer?',
    a: 'No, but it helps. If you\'ve used the product, your recommendations will be way more convincing. Up to you though.',
  },
  {
    q: 'How do I get paid?',
    a: 'Wise (formerly TransferWise). You add your Wise email in your dashboard settings, and payments land there automatically on payout days.',
  },
  {
    q: 'What can I use to promote?',
    a: 'Whatever works for you. Twitter threads, YouTube videos, blog posts, newsletters, Reddit, paid ads — we don\'t restrict any channel. We also give you banners, swipe copy, and other assets in your dashboard.',
  },
  {
    q: 'Is there an approval process?',
    a: 'No. Sign up, get your link, start sharing. Takes about 2 minutes.',
  },
]

function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="landing">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Zap size={18} />
            <span>CleanMails</span>
          </div>
          <button className="nav-cta" onClick={() => navigate(user ? '/app/dashboard' : '/login')}>
            {user ? 'Go to app' : 'Join'}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">CleanMails Affiliate Program</p>
          <h1>You send people our way.<br />We send you <span className="hero-amt">$100</span> per sale.</h1>
          <p className="hero-desc">
            That's it. No complicated tiers. No waiting months for approval. 
            Sign up, grab your link, and earn $100 every time someone buys through it. 
            Unlimited sales, unlimited payouts, paid twice a month via Wise.
          </p>

          <div className="hero-schedule">
            <div className="schedule-block">
              <span className="schedule-range">Sales from 1st → 15th</span>
              <span className="schedule-paid">paid by the 25th</span>
            </div>
            <div className="schedule-block">
              <span className="schedule-range">Sales from 15th → 30th</span>
              <span className="schedule-paid">paid by next month 10th</span>
            </div>
          </div>

          <div className="hero-cta-row">
            <button className="btn-main" onClick={() => navigate(user ? '/app/dashboard' : '/login')}>
              {user ? 'Go to dashboard' : 'Get started'} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="video-section">
        <div className="video-inner">
          <div className="video-wrapper">
            <iframe
              src="https://player.vimeo.com/video/1192806733?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              title="Cleanmails affiliate"
            ></iframe>
          </div>
        </div>
      </section>

      {/* About the product */}
      <section className="about-section" id="about">
        <div className="about-inner">
          <p className="about-label">What you're promoting</p>
          <h2>CleanMails is a self-hosted cold email tool.</h2>
          <p className="about-desc">
            SMTP rotation, email validation, sender warmup, automated cadences — 
            everything someone needs to run cold outreach from their own server. 
            One-time payment, no monthly fees, no sending limits. It's an easy sell 
            because people are tired of paying $200/mo for email tools.
          </p>
          <div className="about-points">
            <div className="about-point">
              <span className="point-bullet"></span>
              <span>SMTP rotation across unlimited senders</span>
            </div>
            <div className="about-point">
              <span className="point-bullet"></span>
              <span>Built-in email list validation</span>
            </div>
            <div className="about-point">
              <span className="point-bullet"></span>
              <span>Multi-step automated follow-ups</span>
            </div>
            <div className="about-point">
              <span className="point-bullet"></span>
              <span>Self-hosted — they own it forever</span>
            </div>
          </div>
          <a href="https://cleanmails.online" target="_blank" rel="noopener noreferrer" className="about-link">
            Check out CleanMails <ExternalLink size={14} />
          </a>
        </div>
      </section>

      {/* How it works */}
      <section className="how-section" id="how">
        <div className="how-inner">
          <h2>How it works</h2>
          <div className="how-steps">
            <div className="how-step">
              <div className="step-num">1</div>
              <div className="step-content">
                <h4>Create an account</h4>
                <p>Takes 2 minutes. No approval, no interview, no waiting period.</p>
              </div>
            </div>
            <div className="how-step">
              <div className="step-num">2</div>
              <div className="step-content">
                <h4>Grab your referral link + assets</h4>
                <p>Your dashboard has your unique link, plus banners, copy templates, and other stuff you can use.</p>
              </div>
            </div>
            <div className="how-step">
              <div className="step-num">3</div>
              <div className="step-content">
                <h4>Share it wherever</h4>
                <p>Twitter, YouTube, your blog, newsletter, Slack groups, Reddit — anywhere your audience hangs out. No restrictions.</p>
              </div>
            </div>
            <div className="how-step">
              <div className="step-num">4</div>
              <div className="step-content">
                <h4>Get $100 per sale</h4>
                <p>Every purchase through your link = $100 in your Wise account. Automatically. Twice a month.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <h2>Questions</h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <button className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === i && (
                  <div className="faq-a">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discord Support */}
      <section className="discord-section">
        <div className="discord-inner">
          <div className="discord-card">
            <div className="discord-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </div>
            <div className="discord-text">
              <h3>Need help? Join our Discord</h3>
              <p>Get support, ask questions, and connect with other affiliates.</p>
            </div>
            <a href="https://discord.gg/a275pvX3EV" target="_blank" rel="noopener noreferrer" className="discord-link">
              Join Discord
            </a>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bottom-cta">
        <div className="bottom-cta-inner">
          <h2>$100 per sale. No limits. Paid twice a month.</h2>
          <button className="btn-main" onClick={() => navigate(user ? '/app/dashboard' : '/login')}>
            {user ? 'Go to dashboard' : 'Join the program'} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-brand">
            <Zap size={14} /> CleanMails Affiliates
          </span>
          <div className="footer-links">
            <a href="https://cleanmails.online" target="_blank" rel="noopener noreferrer">Main site</a>
            <a href="#faq">FAQ</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
