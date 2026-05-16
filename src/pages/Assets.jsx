import { useState, useEffect } from 'react'
import { Download, Image, FileText, Video, Search, Mail, PenLine, MessageCircle, Copy, Check, X } from 'lucide-react'
import { getAssets } from '../lib/database'
import './Assets.css'

const emailTemplates = [
  {
    id: 'e1',
    title: 'Cold Outreach — Problem Aware',
    preview: 'Hey {name}, quick question — how much are you paying monthly for cold email tools?',
    full: `Subject: Quick question about your cold email stack

Hey {name},

Quick question — how much are you paying monthly for cold email tools?

I ask because I recently switched to a self-hosted tool called CleanMails and it eliminated my $200/mo bill entirely. One-time payment, I own it forever.

It does everything Instantly and Smartlead do — SMTP rotation, email validation, warmup, automated cadences — but runs on my own server. No contact limits, no sender limits.

Might be worth a look if you're running outbound: {your_referral_link}

No pressure either way. Just thought of you since I know you're doing outreach.

Cheers,
{your_name}`,
  },
  {
    id: 'e2',
    title: 'Follow-up — ROI Angle',
    preview: 'Following up on my last email. Did some quick math on the savings...',
    full: `Subject: Re: Quick question about your cold email stack

Hey {name},

Following up on my last email. Did some quick math:

If you're paying $150-300/mo for cold email tools, that's $1,800-3,600/year.

CleanMails is a one-time $497. So you'd break even in under 3 months, then it's pure savings forever after.

Plus no limits on anything — contacts, emails, senders, domains. All self-hosted on your server so your data never leaves your machine.

Here's the link if you want to check it out: {your_referral_link}

Happy to answer any questions about the setup. They do free white-glove installation too.

{your_name}`,
  },
  {
    id: 'e3',
    title: 'Newsletter Recommendation',
    preview: 'Tool of the week: the cold email platform I switched my whole agency to...',
    full: `Subject: Tool I switched my whole outreach stack to

Hey everyone,

Tool of the week: CleanMails.

What it is: A self-hosted cold email platform. SMTP rotation, email validation, sender warmup, AI auto-reply, and automated cadences.

Why I switched: I was paying $247/mo for Instantly + a validation tool + a warmup tool. CleanMails replaced all three for a one-time $497.

What I like:
- Runs on my own server (my data stays mine)
- Truly unlimited — no contact caps, no sender limits
- Free setup included (they deploy it on your VPS)
- AI auto-reply handles responses while I sleep

What I don't love:
- You need a Linux VPS (but Hetzner is like $5/mo)
- UI is functional, not pretty (who cares though)

If you're doing any cold outreach, this is the best ROI tool I've found this year: {your_referral_link}

{your_name}`,
  },
  {
    id: 'e4',
    title: 'Warm Introduction — For People You Know',
    preview: 'Hey, remember you mentioned you were looking for a better cold email setup?',
    full: `Subject: That cold email tool I mentioned

Hey {name},

Remember you mentioned you were looking for a better cold email setup? Found the one.

It's called CleanMails — self-hosted, one-time payment, does everything:
- SMTP rotation across unlimited senders
- Built-in email validation
- Automated follow-up sequences
- AI auto-reply (this one's wild)

The kicker: $497 once. No monthly fees ever. They even set it up for you for free.

Check it out: {your_referral_link}

Let me know if you have questions — I've been using it for a few weeks now and happy to walk you through it.

{your_name}`,
  },
]

const blogIdeas = [
  {
    id: 'b1',
    title: 'Why I Ditched Instantly for a Self-Hosted Cold Email Tool',
    preview: 'Comparison post — monthly costs vs one-time payment, feature breakdown, and the real reason I switched.',
    full: `# Why I Ditched Instantly for a Self-Hosted Cold Email Tool

## The Problem
I was paying $234/month for my cold email stack: Instantly ($97), an email validation tool ($47), and a warmup service ($90). That's $2,808/year just to send cold emails.

## What I Switched To
CleanMails — a self-hosted cold email platform that does all three jobs for a one-time payment of $497.

## Feature Comparison
| Feature | Instantly | CleanMails |
|---------|-----------|------------|
| Price | $97-297/mo | $497 once |
| SMTP Rotation | ✅ | ✅ |
| Email Validation | ❌ (extra) | ✅ Built-in |
| Warmup | ✅ | ✅ Built-in |
| AI Auto-Reply | ❌ | ✅ |
| Contact Limits | Yes | None |
| Self-Hosted | ❌ | ✅ |

## The Setup
They did free white-glove installation. I gave them a $5/mo Hetzner VPS, they deployed everything in under 24 hours. DKIM, SPF, DMARC — all configured.

## Results After 30 Days
- Deliverability: Same as before (97%+ inbox rate)
- Cost: $5/mo for the VPS vs $234/mo before
- Savings year 1: $2,311

## Who This Is For
If you're running cold outreach and you're tired of monthly subscriptions, this is the move: {your_referral_link}

---
*Disclosure: This contains an affiliate link. I earn a commission if you purchase through it.*`,
  },
  {
    id: 'b2',
    title: 'The Real Cost of Cold Email Tools in 2025 (And How to Cut It by 90%)',
    preview: 'Break down the typical cold email stack costs and show a self-hosted alternative.',
    full: `# The Real Cost of Cold Email Tools in 2025

## The Typical Stack
Most agencies and founders running outbound are paying for:
- Sequencer (Instantly/Smartlead): $97-297/mo
- Email validation (Millionverifier/Zerobounce): $30-100/mo
- Warmup tool: $50-90/mo
- Inbox provider (Google Workspace): $7/inbox/mo

**Total: $200-500/month** just for infrastructure.

## The Self-Hosted Alternative
CleanMails bundles all of the above into one self-hosted tool:
- One-time payment: $497
- Monthly cost after: ~$5 (just the VPS)
- Break-even: Month 2-3

## What You Get
Everything runs on YOUR server. No data leaves your machine. No limits on anything. And they set it up for you for free.

## The Math
| | Traditional | CleanMails |
|---|---|---|
| Year 1 | $2,400-6,000 | $557 |
| Year 2 | $2,400-6,000 | $60 |
| Year 3 | $2,400-6,000 | $60 |

Over 3 years, you save $7,000-18,000.

Link: {your_referral_link}`,
  },
  {
    id: 'b3',
    title: 'My Complete Cold Email Setup (Self-Hosted, $5/mo)',
    preview: 'Step-by-step walkthrough of a self-hosted cold email infrastructure.',
    full: `# My Complete Cold Email Setup That Costs $5/mo

## Overview
I run all my cold outreach from a single Hetzner VPS running CleanMails. Here's the full setup.

## The Stack
- **Server**: Hetzner CX22 ($5/mo) — 2 vCPU, 4GB RAM
- **Software**: CleanMails (one-time $497)
- **Domains**: 5 sending domains ($12/yr each)

## What It Does
1. **SMTP Rotation** — rotates across all my sending domains automatically
2. **Email Validation** — validates lists before sending (built-in)
3. **Warmup** — warms new inboxes automatically
4. **Cadences** — multi-step follow-up sequences
5. **AI Auto-Reply** — handles positive replies with context

## Setup Process
Took about 24 hours. I provided the VPS, CleanMails team deployed everything:
- Installed the platform
- Set up Postfix + Dovecot (built-in mail server)
- Configured DKIM/SPF/DMARC for my domains
- Created initial mailboxes

## Results
- Sending 150-200 cold emails/day across 5 domains
- 94% inbox placement rate
- 3.2% reply rate
- Total monthly cost: $5

If you want the same setup: {your_referral_link}`,
  },
  {
    id: 'b4',
    title: 'CleanMails vs Smartlead vs Instantly: Honest Comparison',
    preview: 'Detailed comparison from someone who has used all three platforms.',
    full: `# CleanMails vs Smartlead vs Instantly: Which One Should You Use?

## I've Used All Three
I spent 6 months on Instantly, 3 months on Smartlead, and now I'm on CleanMails. Here's my honest take.

## Pricing
- **Instantly**: $97-297/mo depending on plan
- **Smartlead**: $94-174/mo depending on plan  
- **CleanMails**: $497 one-time (that's it, forever)

## Features

### Instantly
✅ Great UI, easy to use
✅ Good warmup network
❌ Contact limits on lower plans
❌ No built-in validation
❌ Monthly cost adds up

### Smartlead
✅ Unlimited email accounts
✅ Good deliverability
❌ UI can be clunky
❌ Still a monthly subscription
❌ No built-in validation

### CleanMails
✅ Truly unlimited everything
✅ Built-in validation + warmup
✅ AI auto-reply
✅ Self-hosted (your data, your server)
✅ One-time payment
❌ Requires a VPS (but they set it up for you)
❌ Less polished UI

## My Verdict
If you want the easiest setup and don't mind monthly payments: Instantly.
If you want the best long-term value and full control: CleanMails.

Link: {your_referral_link}`,
  },
]

const tweets = [
  {
    id: 't1',
    content: `I was paying $234/mo for my cold email stack.

Instantly: $97
Validation tool: $47
Warmup: $90

Switched to CleanMails — one self-hosted tool that does all three.

Cost: $497. Once. Forever.

That's a 2-month payback period. Then it's free.`
  },
  {
    id: 't2',
    content: `The cold email tool market is broken:

→ $150-300/mo for basic sending
→ Artificial contact limits
→ Your data on their servers
→ Features split across 3-4 tools

Self-hosted alternative: one payment, unlimited everything, your server.

Been using it for a month. Never going back.`
  },
  {
    id: 't3',
    content: `Hot take: You don't need Instantly or Smartlead.

You need:
- A $5/mo VPS
- CleanMails ($497 once)
- 5 domains ($60/yr)

That gives you:
✅ Unlimited senders
✅ Built-in validation
✅ Auto warmup
✅ AI auto-reply
✅ Automated cadences

Total monthly cost: $5. Not $300.`
  },
  {
    id: 't4',
    content: `My cold email infrastructure costs $5/month.

Here's exactly what I'm running:

• Hetzner VPS: $5/mo
• CleanMails: $497 one-time (already paid off)
• 5 sending domains: $60/year

That's it. No subscriptions. No limits.

Sending 200 emails/day with 94% inbox rate.`
  },
]

const redditPosts = [
  {
    id: 'r1',
    title: 'Switched from Instantly to a self-hosted alternative — here\'s my experience after 30 days',
    subreddit: 'r/coldoutreach',
    preview: 'Was paying $97/mo for Instantly. Found a self-hosted tool that does the same thing for a one-time payment. Sharing my honest experience.',
    full: `**TL;DR**: Switched from Instantly ($97/mo) to CleanMails ($497 one-time, self-hosted). Same results, no monthly cost. Here's what happened.

**Background**: I run cold outreach for my agency. Was on Instantly for 6 months, spending $97/mo plus $47/mo for a separate validation tool. That's $1,728/year.

**Why I switched**: Saw CleanMails mentioned in a thread here. Self-hosted, one-time payment, does validation + warmup + sending in one tool. Figured worst case I'm out $497 which is less than 3 months of my current stack.

**Setup**: They did it for me. Gave them access to my Hetzner VPS ($5/mo), they deployed everything in ~20 hours. DKIM, SPF, DMARC all configured. Created mailboxes on my domains.

**Results after 30 days**:
- Deliverability: 94% inbox rate (was 93% on Instantly, so basically same)
- Sending: 150-200/day across 5 domains
- Reply rate: 3.1% (was 2.8% on Instantly)
- Bounces: <1% (built-in validation catches them before sending)

**What I like**:
- No monthly bill
- Truly unlimited everything
- Built-in validation saves me $47/mo
- AI auto-reply handles positive responses
- My data never leaves my server

**What I don't like**:
- UI isn't as polished as Instantly
- Need basic VPS knowledge (but they handle setup)
- No mobile app

**Would I recommend?** Yes, if you're comfortable with the idea of self-hosting (even though they do the work). The ROI math is a no-brainer.

Link for anyone interested: {your_referral_link}

Happy to answer questions about the setup.`,
  },
  {
    id: 'r2',
    title: 'My cold email stack costs $5/mo total (breakdown inside)',
    subreddit: 'r/SaaS',
    preview: 'Built a cold email infrastructure that costs virtually nothing monthly. Here\'s exactly what I\'m running and how I set it up.',
    full: `For everyone asking how to do outbound without spending $200-500/mo on tools, here's my setup:

**Monthly costs:**
- Hetzner VPS: $5/mo
- That's it.

**One-time costs:**
- CleanMails license: $497
- 5 domains: $60/year

**What CleanMails gives me:**
- Built-in mail server (no external SMTP needed)
- SMTP rotation across all domains
- Email validation before sending
- Automatic warmup
- Multi-step cadences
- AI auto-reply

**How it works:**
Everything runs on one VPS. CleanMails includes its own mail server (Postfix + Dovecot) so I don't even need Google Workspace for sending. I create mailboxes directly on my domains.

**My results:**
- 200 cold emails/day
- 94% inbox placement
- 3.2% reply rate
- $5/month operating cost

**Setup:**
I'm not technical. They offer free installation — I just gave them VPS access and they deployed everything. Took about a day.

**vs my old stack:**
Before this I was paying Instantly ($97) + Millionverifier ($30) + warmup tool ($50) = $177/mo = $2,124/year.

CleanMails paid for itself in month 3.

Link: {your_referral_link}`,
  },
  {
    id: 'r3',
    title: 'Honest comparison: CleanMails vs Instantly vs Smartlead for agency cold outreach',
    subreddit: 'r/Emailmarketing',
    preview: 'Used all three for my agency. Here\'s what actually matters and which one I stuck with.',
    full: `I've been running cold email for clients for 2 years. Used Instantly for 8 months, Smartlead for 4 months, and CleanMails for 2 months. Here's my take.

**Instantly:**
- Pros: Beautiful UI, easy onboarding, solid warmup
- Cons: Contact limits, expensive at scale, no built-in validation
- Cost: $97-297/mo (I was on the $177 plan)

**Smartlead:**
- Pros: Unlimited email accounts, decent API
- Cons: Clunky interface, occasional bugs, still monthly
- Cost: $94-174/mo

**CleanMails:**
- Pros: One-time payment, unlimited everything, built-in validation + warmup, AI auto-reply, self-hosted
- Cons: Need a VPS, less polished UI, newer product
- Cost: $497 once + $5/mo VPS

**Which I recommend:**

For beginners who want ease: Instantly.
For agencies who want value: CleanMails, no contest.

The math: At agency scale (multiple clients, hundreds of emails/day), CleanMails saves $2,000-5,000/year and has zero limits.

The self-hosting part sounds scary but they literally set it up for you. I'm not a dev and I was sending emails within 24 hours.

{your_referral_link} if anyone wants to check it out.`,
  },
  {
    id: 'r4',
    title: 'PSA: You don\'t need to pay $200/mo for cold email infrastructure anymore',
    subreddit: 'r/EntrepreneurRideAlong',
    preview: 'Self-hosted cold email tools exist now. One-time payment, no limits. Sharing what I found.',
    full: `I see a lot of people here spending $150-300/month on cold email tools (Instantly, Smartlead, Apollo, etc).

Just wanted to share that self-hosted alternatives exist now. I switched to one called CleanMails about a month ago.

**What it is:** A self-hosted cold email platform. Runs on your own VPS.

**What it includes:** SMTP rotation, email validation, warmup, automated sequences, AI auto-reply.

**Cost:** $497 one-time. Then just your VPS cost (~$5/mo on Hetzner).

**My experience:** Works great. Same deliverability I had on Instantly. No limits on contacts, emails, or senders. My data stays on my server.

Not saying this is for everyone — if you want the most polished UI and don't mind subscriptions, Instantly is great. But if you care about long-term cost and data ownership, worth looking at.

{your_referral_link}

Not affiliated with the company (edit: I am an affiliate, disclosure). Just genuinely saved me a lot of money.`,
  },
]

const prompts = [
  {
    id: 'p1',
    type: 'X / Twitter Post',
    title: 'Generate a viral tweet about cold email infrastructure',
    preview: 'Produces a casual, human-sounding tweet sharing your cold email setup with a soft mention of CleanMails.',
    full: `Write me a tweet (under 280 characters or a short thread of 3-4 tweets) about cold email infrastructure in 2025.

PRODUCT CONTEXT:
CleanMails is a self-hosted cold email tool. One-time payment of $497. Includes SMTP rotation, email validation, warmup, automated cadences, and AI auto-reply. Runs on a Linux VPS. No monthly fees, no limits on contacts or sending.

WRITING RULES:
- Do NOT use bullet points with dashes or hyphens
- Do NOT use bold formatting or markdown
- Write like a real person typing casually, not a marketer
- Include 1-2 minor spelling quirks or informal grammar (like "dont" instead of "don't" or starting sentence with "ngl")
- No bold claims like "best tool ever" or "game changer"
- The post should be 99% genuinely helpful information about cold email setup/costs/infrastructure
- Mention CleanMails only once, casually, as one option among others (mention Instantly, Smartlead, or accellemails too as context)
- The CTA should be soft and buried in the middle, not at the end — something like "been using cleanmails for this" in passing
- Sound like someone sharing their personal experience, not selling
- No emojis except maybe one at most
- No hashtags`,
  },
  {
    id: 'p2',
    type: 'Reddit Post',
    title: 'Generate a Reddit post about switching email tools',
    preview: 'Creates an authentic Reddit-style post sharing a tool switch experience for r/coldoutreach or r/SaaS.',
    full: `Write me a Reddit post for r/coldoutreach or r/Entrepreneur about my experience switching cold email tools.

PRODUCT CONTEXT:
CleanMails is a self-hosted cold email platform. $497 one-time, runs on your own VPS ($5/mo on Hetzner). Features: SMTP rotation across unlimited domains, built-in email validation, auto warmup, multi-step cadences, AI auto-reply. Free installation included. No contact limits, no monthly fees.

WRITING RULES:
- Do NOT use dashes (-) for lists. Use numbers or just write in paragraphs
- Do NOT use markdown bold or headers excessively
- Write like a real Reddit user, slightly informal, conversational
- Include occasional typos or casual grammar ("tbh", "ngl", "kinda", "idk")
- No exaggerated claims. Be balanced, mention at least one downside
- The post should be 99% useful information about cold email infrastructure, costs, deliverability, setup
- Mention CleanMails naturally in the middle as "what i ended up going with" alongside mentions of Instantly, Smartlead, or Apollo as things you tried before
- Do NOT make it sound like an ad. Sound like someone genuinely sharing their journey
- Include some specific numbers (reply rates, inbox placement, daily sends) to make it feel real
- Keep the affiliate link mention casual at the end like "happy to share link if anyone wants"
- Add a "disclaimer: this has my referral link" at the very end`,
  },
  {
    id: 'p3',
    type: 'Medium / Blog Post',
    title: 'Generate a comparison blog post',
    preview: 'Produces a detailed, SEO-friendly blog post comparing cold email tools with CleanMails mentioned naturally.',
    full: `Write me a 1000-1200 word blog post comparing cold email tools available in 2025 for agencies and founders doing outbound.

PRODUCT CONTEXT:
CleanMails is a self-hosted cold email tool. One-time $497. Self-hosted on Linux VPS. Includes: SMTP rotation, email validation, sender warmup, automated multi-step cadences, AI auto-reply that reads and responds to prospect replies. Free white-glove installation. No limits. Runs entirely on your server (privacy focused).

TOOLS TO COMPARE:
Include at least 4 tools: Instantly ($97-297/mo), Smartlead ($94-174/mo), Apollo.io (freemium + paid), accellemails, and CleanMails. Give honest pros and cons for each.

WRITING RULES:
- Do NOT use dash/hyphen bullet points anywhere. Use numbered lists or flowing paragraphs
- Do NOT overuse bold text. Max 3-4 bold words in the entire post
- Write in first person like a practitioner sharing experience, not a content marketer writing SEO copy
- Include small imperfections: occasional informal phrases, maybe one "tbh" or "honestly"
- No superlatives like "best", "amazing", "incredible", "game-changing"
- 99% of the post should be genuinely useful comparison info that helps the reader decide
- CleanMails should be positioned as one option among many, not the clear winner. Let the reader decide based on facts
- Mention it naturally around the 60% mark of the post, not at the beginning or end
- Include real-looking numbers: monthly costs, payback periods, deliverability rates
- End with a balanced conclusion like "depends on your situation" not "you should definitely use X"
- Add your referral link only once, inline, naturally`,
  },
  {
    id: 'p4',
    type: 'X / Twitter Thread',
    title: 'Generate a value thread about cold email deliverability',
    preview: 'Creates a 5-7 tweet thread about email deliverability tips with CleanMails mentioned once as a tool.',
    full: `Write me a Twitter/X thread (5-7 tweets) about cold email deliverability in 2025. What actually works, what doesnt, and how to get emails into inbox.

PRODUCT CONTEXT (mention only once, casually):
CleanMails is a self-hosted cold email tool with built-in validation and warmup. One-time payment, self-hosted. I use it for my own outreach.

WRITING RULES:
- Do NOT use dashes for lists. Write in flowing sentences or use "1." "2." numbered format
- Write like a real person sharing what they learned, not a thread bro optimizing for engagement
- No "🧵 Thread:" or "THREAD:" opener. Just start with the content
- Include typos or casual grammar in 1-2 tweets (like "dont" or "ive")
- No bold claims. Share specific things you learned/tested
- 99% deliverability knowledge: DNS setup, warmup strategy, volume management, content tips, domain reputation
- Mention CleanMails only in tweet 4 or 5, casually, like "i use cleanmails for this but theres other tools too"
- Also mention other tools naturally: "whether you use instantly, smartlead, or whatever"
- No emojis except maybe one in the whole thread
- No "follow me for more" or engagement bait at the end
- Last tweet should be a genuine tip, not a CTA`,
  },
  {
    id: 'p5',
    type: 'Reddit Comment',
    title: 'Generate helpful Reddit comments that mention the tool',
    preview: 'Produces 3 short Reddit comment replies to common cold email questions with subtle tool mentions.',
    full: `Write me 3 short Reddit comments (each 3-5 sentences) that I can post as replies to common questions in cold email subreddits.

PRODUCT CONTEXT (mention very subtly):
CleanMails is a self-hosted cold email tool. $497 one-time. SMTP rotation, validation, warmup, cadences. Self-hosted.

COMMON QUESTIONS TO REPLY TO:
1. "What's the best cold email tool for agencies?" (in r/coldoutreach)
2. "How do I improve my cold email deliverability?" (in r/Emailmarketing)
3. "Is Instantly worth it at $200/mo?" (in r/SaaS)

WRITING RULES:
- Short, helpful, sounds like a quick genuine reply
- Do NOT use any formatting. Plain text only, like how real redditors type
- Casual tone, maybe one "tbh" or "imo"
- Answer the actual question first with real advice
- Mention CleanMails as one option among 2-3 others, not as THE answer
- Say something like "ive been using cleanmails lately and its decent for the price" not "you should use CleanMails"
- Include one slightly negative thing about it to sound authentic ("ui could be better but it works")
- No links in the comment. If asked, say "can dm you the link"
- Sound like you're being helpful, not promotional`,
  },
]

function Assets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState(null)
  const [activeSection, setActiveSection] = useState('files')
  const [expandedItem, setExpandedItem] = useState(null)

  useEffect(() => { loadAssets() }, [])

  async function loadAssets() {
    setLoading(true)
    try { setAssets(await getAssets()) } catch (e) { console.warn(e.message) }
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

  const filteredAssets = assets.filter((a) => {
    const matchF = filter === 'all' || a.type === filter
    const matchS = !search || a.name?.toLowerCase().includes(search.toLowerCase())
    return matchF && matchS
  })

  return (
    <div className="assets-page">
      <div className="page-header">
        <div>
          <h1>Marketing Assets</h1>
          <p>Everything you need to promote CleanMails</p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="assets-disclaimer">
        ⚠️ These are templates and inspiration. Don't use them as-is — personalize, adapt to your voice, and make them your own.
      </div>

      {/* Section Tabs */}
      <div className="assets-section-tabs">
        <button className={`ast-tab ${activeSection === 'files' ? 'active' : ''}`} onClick={() => setActiveSection('files')}>
          <Image size={15} /> Files
        </button>
        <button className={`ast-tab ${activeSection === 'emails' ? 'active' : ''}`} onClick={() => setActiveSection('emails')}>
          <Mail size={15} /> Emails
        </button>
        <button className={`ast-tab ${activeSection === 'blogs' ? 'active' : ''}`} onClick={() => setActiveSection('blogs')}>
          <PenLine size={15} /> Blogs
        </button>
        <button className={`ast-tab ${activeSection === 'tweets' ? 'active' : ''}`} onClick={() => setActiveSection('tweets')}>
          <MessageCircle size={15} /> Tweets
        </button>
        <button className={`ast-tab ${activeSection === 'reddit' ? 'active' : ''}`} onClick={() => setActiveSection('reddit')}>
          <MessageCircle size={15} /> Reddit
        </button>
        <button className={`ast-tab ${activeSection === 'prompts' ? 'active' : ''}`} onClick={() => setActiveSection('prompts')}>
          <PenLine size={15} /> Prompts
        </button>
      </div>

      {/* Expanded Modal */}
      {expandedItem && (
        <div className="expand-overlay" onClick={() => setExpandedItem(null)}>
          <div className="expand-modal" onClick={e => e.stopPropagation()}>
            <div className="expand-header">
              <h3>{expandedItem.title || 'Full Content'}</h3>
              <button onClick={() => setExpandedItem(null)}><X size={18} /></button>
            </div>
            <div className="expand-body">
              <pre>{expandedItem.full || expandedItem.content}</pre>
            </div>
            <div className="expand-footer">
              <button className={`copy-content-btn ${copiedId === expandedItem.id + '-full' ? 'copied' : ''}`} onClick={() => handleCopy(expandedItem.full || expandedItem.content, expandedItem.id + '-full')}>
                {copiedId === expandedItem.id + '-full' ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === expandedItem.id + '-full' ? 'Copied' : 'Copy Full Text'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Files */}
      {activeSection === 'files' && (
        <>
          <div className="assets-toolbar">
            <div className="filter-tabs">
              {['all', 'image', 'document', 'video'].map((f) => (
                <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
                </button>
              ))}
            </div>
            <div className="assets-search">
              <Search size={15} />
              <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          {loading ? <p className="empty-state">Loading...</p> : filteredAssets.length === 0 ? (
            <p className="empty-state">{assets.length === 0 ? 'No files yet.' : 'No match.'}</p>
          ) : (
            <div className="assets-grid">
              {filteredAssets.map((asset) => (
                <div key={asset.id} className="asset-card">
                  <div className={`asset-preview ${getTypeColor(asset.type)}`}>
                    <span className="asset-emoji">{asset.type === 'image' ? '🖼️' : asset.type === 'video' ? '🎬' : '📄'}</span>
                  </div>
                  <div className="asset-info">
                    <h3 className="asset-name">{asset.name}</h3>
                    <div className="asset-meta">
                      <span className={`asset-type ${getTypeColor(asset.type)}`}>{getTypeIcon(asset.type)}{asset.format || asset.type?.toUpperCase()}</span>
                      <span className="asset-size">{asset.size || ''}</span>
                    </div>
                  </div>
                  <a href={asset.fileUrl || '#'} target="_blank" rel="noopener noreferrer" className="download-btn" download>
                    <Download size={16} /><span>Download</span>
                  </a>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Emails */}
      {activeSection === 'emails' && (
        <div className="content-list">
          <p className="content-list-desc">Cold outreach and newsletter templates. Replace {'{your_referral_link}'} with your link.</p>
          {emailTemplates.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
                <button className="read-more-btn" onClick={() => setExpandedItem(item)}>Read full email →</button>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.full, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Blogs */}
      {activeSection === 'blogs' && (
        <div className="content-list">
          <p className="content-list-desc">Blog post drafts and outlines. Adapt for your audience and writing style.</p>
          {blogIdeas.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
                <button className="read-more-btn" onClick={() => setExpandedItem(item)}>Read full post →</button>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.full, item.id)}>
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
          <p className="content-list-desc">Tweet templates for X/Twitter. Rewrite in your voice before posting.</p>
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
          <p className="content-list-desc">Reddit post templates. Adapt tone to each subreddit. Always disclose affiliate links.</p>
          {redditPosts.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <span className="reddit-sub">{item.subreddit}</span>
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
                <button className="read-more-btn" onClick={() => setExpandedItem(item)}>Read full post →</button>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.full, item.id)}>
                {copiedId === item.id ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === item.id ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Prompts */}
      {activeSection === 'prompts' && (
        <div className="content-list">
          <p className="content-list-desc">AI prompts to generate posts. Paste into ChatGPT/Claude. Each prompt includes product context and writing rules for human-sounding output.</p>
          {prompts.map((item) => (
            <div key={item.id} className="content-card">
              <div className="content-card-body">
                <span className="prompt-type">{item.type}</span>
                <h4>{item.title}</h4>
                <p>{item.preview}</p>
                <button className="read-more-btn" onClick={() => setExpandedItem(item)}>View full prompt →</button>
              </div>
              <button className={`copy-content-btn ${copiedId === item.id ? 'copied' : ''}`} onClick={() => handleCopy(item.full, item.id)}>
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
