import { useNavigate } from 'react-router-dom'
import { Zap, ArrowLeft } from 'lucide-react'
import './Legal.css'

function Terms() {
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
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated: May 15, 2025</p>

        <section>
          <h2>1. Agreement</h2>
          <p>
            By creating an account on the CleanMails Affiliate Portal, you agree to these Terms of Service. 
            If you do not agree, do not use the service. These terms constitute a binding agreement between 
            you ("Affiliate") and CleanMails ("Company").
          </p>
        </section>

        <section>
          <h2>2. Affiliate Program</h2>
          <p>
            The CleanMails Affiliate Program allows you to earn commissions by referring customers 
            to CleanMails. By joining, you agree to promote CleanMails ethically and in accordance 
            with these terms.
          </p>
        </section>

        <section>
          <h2>3. Commission Structure</h2>
          <ul>
            <li>You earn a flat <strong>$100 commission</strong> for each qualifying sale made through your referral link</li>
            <li>A qualifying sale is a completed purchase where the customer arrived via your unique referral link</li>
            <li>Refunded or disputed purchases will not earn commission</li>
            <li>There is no limit on the number of commissions you can earn</li>
          </ul>
        </section>

        <section>
          <h2>4. Payout Schedule</h2>
          <ul>
            <li>Sales made between the <strong>1st and 15th</strong> of the month are paid by the <strong>25th</strong></li>
            <li>Sales made between the <strong>15th and 30th</strong> are paid by the <strong>10th of the following month</strong></li>
            <li>Minimum payout threshold is <strong>$10.00</strong></li>
            <li>Payouts are processed via <strong>Wise</strong> (TransferWise)</li>
            <li>You are responsible for providing accurate Wise payment details</li>
          </ul>
        </section>

        <section>
          <h2>5. Acceptable Promotion</h2>
          <p>You may promote CleanMails through:</p>
          <ul>
            <li>Social media posts and content</li>
            <li>Blog posts, articles, and reviews</li>
            <li>YouTube videos and podcasts</li>
            <li>Email newsletters (to your own subscribers)</li>
            <li>Online communities and forums</li>
            <li>Paid advertising (with accurate claims)</li>
          </ul>
        </section>

        <section>
          <h2>6. Prohibited Activities</h2>
          <p>You may NOT:</p>
          <ul>
            <li>Make false, misleading, or exaggerated claims about CleanMails</li>
            <li>Send unsolicited spam emails using your referral link</li>
            <li>Use cookie stuffing, ad injection, or other deceptive techniques</li>
            <li>Bid on CleanMails branded keywords in paid search ads</li>
            <li>Create fake accounts or self-refer purchases</li>
            <li>Impersonate CleanMails or claim to be an official representative</li>
            <li>Promote on websites containing illegal, adult, or hateful content</li>
          </ul>
        </section>

        <section>
          <h2>7. Termination</h2>
          <p>
            We reserve the right to terminate your affiliate account at any time for violation of these terms. 
            Upon termination, pending commissions for legitimate sales will still be paid. Commissions earned 
            through fraudulent activity will be forfeited.
          </p>
          <p>
            You may close your account at any time by contacting support. Outstanding commissions above the 
            minimum threshold will be paid in the next payout cycle.
          </p>
        </section>

        <section>
          <h2>8. Intellectual Property</h2>
          <p>
            Marketing assets provided in the affiliate portal are licensed for promotional use only. 
            You may not modify the CleanMails logo or brand materials beyond what is provided. 
            You may not register domain names containing "cleanmails" or similar variations.
          </p>
        </section>

        <section>
          <h2>9. Liability</h2>
          <p>
            CleanMails is not liable for any indirect, incidental, or consequential damages arising from 
            your participation in the affiliate program. Our total liability is limited to the unpaid 
            commissions in your account at the time of any claim.
          </p>
        </section>

        <section>
          <h2>10. Modifications</h2>
          <p>
            We may modify these terms, the commission structure, or the payout schedule with 30 days notice. 
            Continued participation after changes take effect constitutes acceptance. Material changes will 
            be communicated via email.
          </p>
        </section>

        <section>
          <h2>11. Contact</h2>
          <p>
            For questions about these terms, contact us at hello@cleanmails.online or through our 
            Discord community.
          </p>
        </section>
      </div>
    </div>
  )
}

export default Terms
