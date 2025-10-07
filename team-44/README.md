# LearnBridge v2

LearnBridge v2 is a kid-friendly, interactive learning app built with Next.js and TypeScript. It focuses on short lessons and topics, supports multiple languages, includes audio navigation and voice features, and provides accessibility-focused options such as dyslexia-friendly support and adjustable audio controls.

Key features
- Short, card-based lessons and topic browsing
- Multi-language support with a language selector
- Audio navigation and enhanced audio controls (play/pause/skip)
- Voice/recording utilities and a voice-test helper
- Progress tracking and simple user settings
- Dyslexia-friendly presentation options

Built with
- Next.js (app router)
- TypeScript
- React components in the `components/` folder
- Lightweight state/context helpers in `lib/` (language, audio navigation, dyslexia, auth helpers)

Quick start (development)
1. Install dependencies (requires Node 18+ and pnpm):

	```powershell
	pnpm install
	```

2. Start the dev server:

	```powershell
	pnpm dev
	```

3. Open http://localhost:3000 in your browser.

Build and run (production)

```powershell
pnpm build
pnpm start
```

Project layout (important files/folders)
- `app/` - Next.js app routes and pages (uses the app router)
- `components/` - Reusable UI components (cards, UI primitives, audio/selector components)
- `lib/` - Application contexts and helpers (audio navigation, language, dyslexia support, lessons data)
- `public/` - Static assets and placeholders
- `styles/` - Global styles

Notable modules
- `lib/audio-navigation-context.tsx` — audio navigation state and helpers
- `lib/language-context.tsx` — language selection and persistence
- `lib/dyslexia-context.tsx` — dyslexia-friendly UI options
- `components/language-selector.tsx` — language picker component

Contributing
- Feel free to open issues or PRs. Keep changes small and focused.
- Follow existing code style in components and use TypeScript types from `lib/types` when available.

Notes
- This README is intended as a quick orientation. See the source files under `app/`, `components/`, and `lib/` for implementation details.

License
- MIT (or specify your preferred license)

Contact
- For questions about the project structure or to propose changes, open an issue in this repository.
