# RightsCard - Your Pocket Legal Defense

A production-ready, mobile-first Base Mini App that provides immediate access to legal rights and recording capabilities during police interactions. Built with Next.js 15, TypeScript, and integrated with Base blockchain.

## 🚀 Features

### Core Functionality
- **📋 On-Demand Rights Guides**: State-specific legal rights and 'dos and don'ts' for common interactions
- **🎥 Real-Time Incident Recorder**: Quick audio/video recording with secure local storage
- **🌍 Multilingual Support**: Full internationalization in English and Spanish
- **🤖 AI-Generated Summaries**: Automatic summarization of interactions and rights using OpenAI/OpenRouter
- **📤 Shareable Cards**: Easy sharing of rights information via social platforms and clipboard

### Advanced Features
- **🏛️ State-Specific Variations**: Customized rights information for different US states
- **💾 Persistent Storage**: Client-side data persistence with Zustand
- **🎨 Modern UI/UX**: Glass morphism design with smooth animations
- **📱 Mobile-First**: Optimized for mobile devices with responsive design
- **🔗 Base Integration**: Built as a Base Mini App with OnchainKit
- **🔒 Privacy-Focused**: Local storage with optional cloud sync

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 18** - UI library with hooks and context
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling with custom design system
- **Framer Motion** - Smooth animations and transitions

### State Management & Data
- **Zustand** - Lightweight state management with persistence
- **React Query** - Server state management and caching
- **Zod** - Runtime type validation and schema validation

### Integrations
- **OnchainKit** - Base blockchain integration
- **OpenAI/OpenRouter** - AI content generation
- **React i18next** - Internationalization framework
- **React Hot Toast** - Toast notifications

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Husky** - Git hooks for quality assurance

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn
- **OpenAI or OpenRouter API key** for AI features
- **OnchainKit API key** for Base integration (optional)

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd rightscard-base-miniapp
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
```env
# Required for AI features
OPENROUTER_API_KEY=your_openrouter_api_key_here
# OR
OPENAI_API_KEY=your_openai_api_key_here

# Optional for Base integration
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# Optional for enhanced features
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
PINATA_API_KEY=your_pinata_api_key_here
PINATA_SECRET_API_KEY=your_pinata_secret_key_here
```

4. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── generate-card/ # AI card generation
│   │   ├── generate-summary/ # AI summary generation
│   │   ├── health/        # Health check endpoint
│   │   └── rights/        # Rights data API
│   ├── globals.css        # Global styles and design tokens
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main application page
│   └── providers.tsx      # React Query and other providers
├── components/            # Reusable React components
│   ├── AppShell.tsx       # Main app layout and navigation
│   ├── Button.tsx         # Customizable button component
│   ├── Icon.tsx           # Icon component with variants
│   ├── Modal.tsx          # Modal dialog component
│   ├── RecordButton.tsx   # Audio/video recording functionality
│   ├── RecordingViewer.tsx # Media playback and management
│   ├── RightsCard.tsx     # Interactive rights display
│   └── Settings.tsx       # App settings and preferences
├── lib/                   # Utility libraries and configurations
│   ├── ai.ts             # AI integration (OpenAI/OpenRouter)
│   ├── constants.ts      # App constants and rights data
│   ├── i18n.ts           # Internationalization setup
│   ├── store.ts          # Zustand state management
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # Utility functions
│   └── validation.ts     # Zod schemas and validation
├── public/               # Static assets
│   └── favicon.ico       # App favicon
├── tailwind.config.ts    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/health` - Application health check and status
- `GET /api/rights` - Fetch state-specific rights information
- `POST /api/rights` - Generate custom rights cards

### AI Endpoints
- `POST /api/generate-summary` - Generate AI-powered interaction summaries
- `POST /api/generate-card` - Create shareable rights cards

### Example API Usage

```javascript
// Fetch rights for a specific state
const response = await fetch('/api/rights?state=CA&interactionType=traffic_stop&language=en');
const { card } = await response.json();

// Generate AI summary
const summary = await fetch('/api/generate-summary', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    interactionType: 'traffic_stop',
    duration: 300,
    location: 'Los Angeles, CA'
  })
});
```

## 🌍 Internationalization

The app supports multiple languages with full translation coverage:

- **English (en)** - Default language
- **Spanish (es)** - Complete translation

### Adding New Languages

1. Add translations to `lib/i18n.ts`
2. Update language constants in `lib/constants.ts`
3. Add language option to Settings component

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-blue-500 to-purple-600`)
- **Secondary**: White with opacity for glass effect
- **Success**: Green (`#10b981`)
- **Error**: Red (`#ef4444`)
- **Background**: Dark gradient with glass morphism

### Typography
- **Display**: Large headings with gradient text
- **Heading**: Section titles and important text
- **Body**: Regular content text
- **Caption**: Small descriptive text

### Components
All components follow the design system with consistent:
- Border radius (4px, 8px, 12px)
- Spacing scale (4px increments)
- Shadow system for depth
- Animation timing and easing

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub:**
```bash
git push origin main
```

2. **Deploy to Vercel:**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Configure Environment Variables:**
   - Add all required API keys in Vercel dashboard
   - Ensure `NEXT_PUBLIC_` variables are properly set

### Alternative Platforms

The app can be deployed to any platform supporting Next.js:
- **Netlify** - Static site generation
- **Railway** - Full-stack deployment
- **DigitalOcean App Platform** - Container deployment
- **AWS Amplify** - Serverless deployment

### Build Commands
```bash
# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Rights cards display correctly for different states
- [ ] Audio/video recording works on mobile devices
- [ ] AI summaries generate successfully
- [ ] Language switching works properly
- [ ] Settings persist across sessions
- [ ] Sharing functionality works
- [ ] Responsive design on various screen sizes

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:**
```bash
git checkout -b feature/amazing-feature
```

3. **Make your changes and commit:**
```bash
git commit -m 'Add amazing feature'
```

4. **Push to your branch:**
```bash
git push origin feature/amazing-feature
```

5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use the existing component patterns
- Add proper error handling
- Include JSDoc comments for complex functions
- Test on mobile devices
- Follow the established design system

## 📄 Legal Disclaimer

**Important**: RightsCard provides general legal information and should not replace professional legal advice. The information provided is for educational purposes only and may not reflect the most current legal developments. Always consult with a qualified attorney for specific legal matters and jurisdiction-specific advice.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Base** - For providing the blockchain infrastructure
- **OpenAI/OpenRouter** - For AI capabilities
- **Coinbase OnchainKit** - For seamless Base integration
- **Legal Rights Organizations** - For guidance on rights information
- **Open Source Community** - For the amazing tools and libraries

---

**Built with ❤️ for civil rights and digital empowerment**
