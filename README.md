# RightsCard - Your Pocket Legal Defense

A Next.js Base Mini App that provides immediate access to legal rights and recording capabilities during police interactions.

## Features

### 🛡️ On-Demand Rights Guides
- State-specific legal rights and guidelines
- Easy-to-read mobile-optimized cards
- Do's and don'ts for common interactions
- Helpful phrases and scripts

### 🎥 Real-Time Incident Recorder
- One-tap audio/video recording
- Timestamped recordings with location data
- Local storage with cloud backup options
- AI-generated summaries

### 🌐 Multilingual Support
- Pre-written scripts in multiple languages
- Clear communication guides
- Accessibility across language barriers

### 🤖 AI-Generated Shareable Cards
- Auto-generated summaries of rights and interactions
- Shareable content for social media
- Quick communication to support networks

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI API (via OpenRouter)
- **Recording**: Web MediaRecorder API
- **Storage**: Local storage with IPFS integration (Pinata)

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Copy `.env.local` and add your API keys:
   ```bash
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_key
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Core Components

### AppShell
Main layout component with navigation and floating background elements.

### RightsCard
Interactive component displaying legal rights with tabbed interface for do's/don'ts and legal rights.

### RecordButton
Recording interface supporting both audio and video capture with real-time duration tracking.

### Modal
Reusable modal component for displaying rights cards and AI-generated summaries.

## API Integration

### OpenAI (via OpenRouter)
- Generates AI summaries of interactions
- Creates shareable social media content
- Uses `google/gemini-2.0-flash-001` model

### OnchainKit & MiniKit
- Base blockchain integration
- Wallet connectivity
- Frame-ready for Farcaster

### Future Integrations
- **Supabase**: Backend as a Service for user data
- **Pinata**: IPFS storage for recordings
- **Neynar**: Farcaster social features

## Design System

### Colors
- Primary: `hsl(217.9, 82.9%, 36.5%)`
- Accent: `hsl(217.9, 82.9%, 56.5%)`
- Success: `hsl(158.4, 44.7%, 43.7%)`
- Error: `hsl(0, 72.3%, 50%)`

### Components
- Glass morphism cards with backdrop blur
- Gradient buttons with hover effects
- Mobile-first responsive design
- Smooth animations and transitions

## Legal Disclaimer

RightsCard provides general legal information and should not replace professional legal advice. Always consult with a qualified attorney for specific legal matters.

## License

This project is licensed under the MIT License.
