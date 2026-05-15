import { useNavigate } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import './Legal.css'

function Privacy() {
  const navigate = useNavigate()

  return (
    <div className="legal-page">
      <nav className="legal-nav">
        <div className="legal-nav-inner">
          <div className="legal-logo" onClick={() => navigate('/')}>
            <Zap size={18} />
            <span>CleanMails</span>
          </div>
          <button className="legal-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            Back
          </button>
        </div>
      </nav>

      <div className="legal-content">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated: May 15, 2025</p>

        <section>
          <h2>1. Introduction</h2>
          <p>
            CleanMails ("we", "us", "our") operates the CleanMails Affiliate Program at affiliate.cleanmails.online. 
            This Privacy Policy explains how we collect, use, and protect your personal information when you use our 
            affiliate portal.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>When you register and use the affiliate portal, we collect:</p>
          <ul>
            <li><strong>Account information:</strong> Name, email address, password (hashed)</li>
            <li><strong>Profile information:</strong> Phone number, country, social media handles, website, audience size, promotion methods</li>
            <li><strong>Payment information:</strong> Wise email address and recipient name for payouts</li>
            <li><strong>Usage data:</strong> Referral link clicks, conversions, earnings, and payout history</li>
            <li><strong>Technical data:</strong> Browser type, IP address, and device information for security purposes</li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Manage your affiliate account and authenticate your identity</li>
            <li>Track referrals, calculate commissions, and process payouts</li>
            <li>Communicate with you about your account, payouts, and program updates</li>
            <li>Prevent fraud and ensure the security of our platform</li>
            <li>Improve our services and affiliate experience</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Sharing</h2>
          <p>
            We do not sell your personal information. We share data only with:
          </p>
          <ul>
            <li><strong>Wise:</strong> Your payment details (email, name) to process payouts</li>
            <li><strong>Firebase (Google):</strong> Authentication and database hosting</li>
            <li><strong>Law enforcement:</strong> If required by law or to protect our rights</li>
          </ul>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We use industry-standard security measures including encrypted connections (HTTPS), 
            secure authentication via Firebase Auth, and access-controlled database rules. 
            Passwords are never stored in plain text.
          </p>
        </section>

        <section>
          <h2>6. Data Retention</h2>
          <p>
            We retain your data for as long as your account is active. If you request account deletion, 
            we will remove your personal data within 30 days, except where we are required to retain it 
            for legal or financial record-keeping purposes.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and download your personal data</li>
            <li>Correct inaccurate information in your profile</li>
            <li>Request deletion of your account and data</li>
            <li>Withdraw consent for marketing communications</li>
          </ul>
        </section>

        <section>
          <h2>8. Cookies</h2>
          <p>
            We use essential cookies for authentication and session management. 
            We use referral tracking cookies to attribute purchases to affiliates. 
            These cookies are necessary for the service to function and cannot be disabled.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant 
            changes via email or through the affiliate portal. Continued use of the service after 
            changes constitutes acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>10. Contact</h2>
          <p>
            For privacy-related questions or requests, contact us at hello@cleanmails.online 
            or through our Discord community.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Privacy
