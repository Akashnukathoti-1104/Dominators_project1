# People's Priorities — AI-Powered Civic Governance Platform

**Company:** CODTECH IT SOLUTIONS PVT. LTD.
**Name:** Akash Nukathoti
**Intern ID:** CITS2003
**Domain:** Cybersecurity & Ethical Hacking
**Duration:** 6 Weeks
**Mentor:** _[Add mentor name]_

---

## Overview

**People's Priorities** is a citizen-to-representative civic governance web app. Citizens report local issues (roads, water, electricity, sanitation, etc.) by form, voice, or photo; an AI-assisted engine clusters and ranks these reports by urgency, frequency, and recency; and the elected MP/representative reviews the ranked dashboard, runs the analysis, and manages each report through to resolution — notifying the citizen once it's fixed.

The goal is to close the loop between citizens raising problems and representatives acting on them, with transparency at every step: what was reported, what category it falls under, how long it's expected to take, and proof once it's resolved.

## Key Features

- **Role-based access** — separate Citizen and MP/Representative views (email, phone-OTP, or Google Sign-In)
- **Priority submission form** — name, ward, category, urgency, and description
- **Voice Assist** — multi-language (English / Hindi / Telugu) guided voice flow for citizens who can't read or write; listens for each answer, confirms it, and speaks back the recorded issue and its estimated resolution time
- **Photo upload with AI category detection** — citizens can attach a photo of the issue; a lightweight on-device heuristic analyzes it and suggests the most likely category, which the citizen can accept or correct
- **AI clustering & ranking engine** — groups submissions by category and scores them by frequency, average urgency, and recency to produce a ranked priority dashboard with charts and an auto-generated action plan (budget, timeline, department)
- **Estimated resolution time (ETA)** — every submission gets an expected number of days to resolution based on urgency, shown to the citizen throughout
- **MP submission management** — the representative can update any report's status (Pending → In Progress → Resolved) from a live table
- **Resolution photo + citizen notifications** — when a report is marked Resolved, the citizen who filed it is notified in-app (bell icon with unread badge); the MP can also attach a "proof of work" photo, which updates that notification
- **Rule-based AI chat assistant** — floating chat widget ("Priya") that answers questions about the app and reads live stats, with voice input/output support
- **Live feed & stats dashboard** — real-time view of all incoming reports with category, ward, and status breakdowns

## Technology Stack

- **Frontend:** HTML5, Tailwind CSS, vanilla JavaScript (no framework/build step)
- **Charts:** Chart.js
- **Voice:** Web Speech API (SpeechRecognition + SpeechSynthesis)
- **Auth:** Google Identity Services (OAuth), plus demo email/password and phone-OTP flows
- **Icons/Fonts:** Font Awesome, Google Fonts (Space Grotesk, DM Sans)
- **Storage:** Browser `localStorage` for cross-session notifications (no backend/database — this is a client-only demo)

## Project Structure

```
├── index.html      # Markup — auth, dashboard, submit form, voice assist, chat, MP panels
├── style.css       # All styling (dark theme, cards, modals, notifications, forms)
├── script.js       # App logic — auth, submissions, AI clustering, voice flow, notifications
└── README.md
```

## How It Works

1. **Citizen** signs in, submits a priority (by form, voice, or photo), and can track it under "My Reports."
2. **MP/Representative** signs in, reviews the live feed, and runs the AI analysis once at least 3 submissions exist.
3. The AI engine clusters submissions by category, ranks them by a weighted urgency/frequency/recency score, and generates a ranked dashboard + action plan.
4. The MP updates individual report statuses; marking one **Resolved** instantly notifies the citizen who filed it, optionally with a photo of the completed work.

## Setup / Running Locally

No build step required.

```
1. Clone/download the repository
2. Open index.html directly in a browser (Chrome recommended for voice features)
   — or serve the folder with any static server, e.g.:
   npx serve .
```

To enable real Google Sign-In, replace `GOOGLE_CLIENT_ID` in `script.js` with your own OAuth Client ID from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Known Limitations (by design, for a hackathon/demo scope)

- No real backend — all data is in-memory and resets on page reload (notifications persist via `localStorage` as a workaround)
- The chatbot is a rule-based assistant, not a live LLM
- Photo category detection is a color-based heuristic, not a trained vision model
- Phone OTP is simulated locally (no real SMS gateway)

## Live Demo

_[Add your deployed Render/GitHub Pages link here]_

## Repository

_[Add your GitHub repo link here]_

---
*Submitted as part of the CodTech IT Solutions Pvt. Ltd. Cybersecurity & Ethical Hacking Internship — Task Submission.*
