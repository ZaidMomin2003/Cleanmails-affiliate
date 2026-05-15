import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Globe, MessageCircle, ChevronRight, ChevronLeft, Check, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { completeOnboarding } from '../lib/database'
import './Onboarding.css'

const steps = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Contact', icon: Phone },
  { id: 3, title: 'Social Media', icon: Globe },
  { id: 4, title: 'Promotion', icon: MessageCircle },
]

function Onboarding() {
  const [currentStep, setCurrentStep] = useState(1)
  const { user, refreshProfile } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    displayName: '',
    country: '',
    phone: '',
    whatsapp: '',
    telegram: '',
    bestSocial: '',
    socialHandle: '',
    website: '',
    audience: '',
    promotionMethod: '',
    niche: '',
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const nextStep = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // Save onboarding data to Firestore
      if (user) {
        await completeOnboarding(user.uid, {
          displayName: formData.displayName,
          country: formData.country,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          telegram: formData.telegram,
          bestSocial: formData.bestSocial,
          socialHandle: formData.socialHandle,
          website: formData.website,
          audience: formData.audience,
          promotionMethod: formData.promotionMethod,
          niche: formData.niche,
        })
        await refreshProfile()
      }
      navigate('/app/dashboard')
    }
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <div className="onboarding-logo">
            <Zap size={24} />
            <span>CleanMails</span>
          </div>
          <h1>Complete Your Profile</h1>
          <p>Tell us a bit about yourself so we can personalize your experience</p>
        </div>

        {/* Progress Steps */}
        <div className="steps-indicator">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={`step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              >
                <div className="step-circle">
                  {currentStep > step.id ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <span className="step-label">{step.title}</span>
                {step.id < 4 && <div className="step-line" />}
              </div>
            )
          })}
        </div>

        {/* Form Steps */}
        <div className="onboarding-form">
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <p className="step-description">Let's start with the basics</p>
              <div className="form-fields">
                <div className="field-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    name="displayName"
                    placeholder="How should we call you?"
                    value={formData.displayName}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-group">
                  <label>Country *</label>
                  <select name="country" value={formData.country} onChange={handleChange} required>
                    <option value="">Select your country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="in">India</option>
                    <option value="ca">Canada</option>
                    <option value="au">Australia</option>
                    <option value="de">Germany</option>
                    <option value="fr">France</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="form-step">
              <h3>Contact Details</h3>
              <p className="step-description">How can we reach you?</p>
              <div className="form-fields">
                <div className="field-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>WhatsApp Number</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    placeholder="Same as phone or different"
                    value={formData.whatsapp}
                    onChange={handleChange}
                  />
                </div>
                <div className="field-group">
                  <label>Telegram Username</label>
                  <input
                    type="text"
                    name="telegram"
                    placeholder="@yourusername"
                    value={formData.telegram}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-step">
              <h3>Social Media Presence</h3>
              <p className="step-description">Where do you have the most influence?</p>
              <div className="form-fields">
                <div className="field-group">
                  <label>Best Social Media Platform *</label>
                  <select name="bestSocial" value={formData.bestSocial} onChange={handleChange} required>
                    <option value="">Select platform</option>
                    <option value="youtube">YouTube</option>
                    <option value="twitter">Twitter / X</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="facebook">Facebook</option>
                    <option value="blog">Blog / Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Social Handle / URL *</label>
                  <input
                    type="text"
                    name="socialHandle"
                    placeholder="https://twitter.com/you or @handle"
                    value={formData.socialHandle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="field-group">
                  <label>Website (if any)</label>
                  <input
                    type="url"
                    name="website"
                    placeholder="https://yourwebsite.com"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="form-step">
              <h3>Promotion Strategy</h3>
              <p className="step-description">Help us understand how you'll promote CleanMails</p>
              <div className="form-fields">
                <div className="field-group">
                  <label>Estimated Audience Size *</label>
                  <select name="audience" value={formData.audience} onChange={handleChange} required>
                    <option value="">Select range</option>
                    <option value="0-1k">0 - 1,000</option>
                    <option value="1k-10k">1,000 - 10,000</option>
                    <option value="10k-50k">10,000 - 50,000</option>
                    <option value="50k-100k">50,000 - 100,000</option>
                    <option value="100k+">100,000+</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>How will you promote? *</label>
                  <select name="promotionMethod" value={formData.promotionMethod} onChange={handleChange} required>
                    <option value="">Select method</option>
                    <option value="content">Content / Reviews</option>
                    <option value="social">Social Media Posts</option>
                    <option value="email">Email Newsletter</option>
                    <option value="video">Video Content</option>
                    <option value="ads">Paid Ads</option>
                    <option value="community">Community / Forums</option>
                  </select>
                </div>
                <div className="field-group">
                  <label>Your Niche / Industry</label>
                  <input
                    type="text"
                    name="niche"
                    placeholder="e.g., SaaS, Productivity, Marketing"
                    value={formData.niche}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="onboarding-actions">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={prevStep}>
              <ChevronLeft size={18} />
              <span>Back</span>
            </button>
          )}
          <button className="btn-primary" onClick={nextStep}>
            <span>{currentStep === 4 ? 'Complete Setup' : 'Continue'}</span>
            {currentStep === 4 ? <Check size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        {/* Step counter */}
        <p className="step-counter">Step {currentStep} of 4</p>
      </div>
    </div>
  )
}

export default Onboarding
