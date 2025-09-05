# RightsCard - Your Pocket Legal Defense

A mobile-first Base Mini App that provides immediate access to legal rights and recording capabilities during police interactions.

## Features

### 🛡️ On-Demand Rights Guides
- State-specific legal rights information
- Easy-to-read mobile-optimized cards
- Do's and Don'ts for common interactions
- Multilingual support (English/Spanish)

### 🎥 Real-Time Incident Recorder
- One-tap audio/video recording
- Timestamped recordings
- Secure local storage
- AI-generated summaries

### 🌐 Multilingual Scripting & Guides
- Pre-written scripts in multiple languages
- Clear communication templates
- High-stress situation guidance

### 🤖 Auto-Generated Shareable Cards (AI)
- AI-powered interaction summaries
- Shareable legal rights cards
- Social media friendly formats
- Quick sharing to trusted contacts

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Blockchain**: Base (via OnchainKit & MiniKit)
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI/OpenRouter integration
- **Recording**: Web MediaRecorder API
- **TypeScript**: Full type safety

## Getting Started

1. **Clone and install dependencies**:
```bash
git clone <repository-url>
cd rightscard-base-miniapp
npm install
```

2. **Set up environment variables**:
```bash
cp .env.example .env.local
```

Fill in your API keys:
- `OPENROUTER_API_KEY` or `OPENAI_API_KEY` for AI features
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY` for Base integration

3. **Run the development server**:
```bash
npm run dev
```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Project Structure

```
├── app/
│   ├── api/                 # API routes for AI features
│   ├── globals.css         # Global styles and design system
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main application page
│   └── providers.tsx       # MiniKit and OnchainKit providers
├── components/
│   ├── AppShell.tsx        # Main app layout and navigation
│   ├── RightsCard.tsx      # Interactive rights information cards
│   ├── RecordButton.tsx    # Recording functionality component
│   ├── Modal.tsx           # Reusable modal component
│   ├── Button.tsx          # Styled button component
│   └── Icon.tsx            # Icon component wrapper
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── constants.ts        # App constants and sample data
│   └── utils.ts            # Utility functions
```

## Key Components

### RightsCard
Interactive cards displaying state-specific legal rights with tabbed navigation for Do's, Don'ts, and Scripts.

### RecordButton
One-tap recording functionality with audio/video options, duration tracking, and automatic AI summary generation.

### AppShell
Main application layout with floating background animations and responsive navigation.

## Design System

The app uses a custom design system with:
- **Colors**: Purple/blue gradient theme with glass morphism effects
- **Typography**: Clean, readable fonts optimized for mobile
- **Spacing**: Consistent 8px grid system
- **Animations**: Smooth transitions and floating background elements
- **Mobile-first**: Responsive design optimized for mobile devices

## API Integration

### AI Features
- **OpenAI/OpenRouter**: Generates summaries and shareable cards
- **Model**: google/gemini-2.0-flash-001 for optimal performance

### Base Integration
- **MiniKitProvider**: Handles wallet connections and Base chain integration
- **OnchainKit**: Identity and wallet components

## Legal Disclaimer

RightsCard is a community resource and educational tool. It does not constitute legal advice. Always consult with a qualified attorney for specific legal situations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
