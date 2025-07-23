# Spotify Playlist Generator - Client

A React-based web application that generates personalized Spotify playlists using AI and the Spotify Web API.

## Features

- **AI-Powered Playlist Generation**: Uses Google Gemini AI to analyze user prompts and create personalized playlists
- **Spotify Integration**: Seamless integration with Spotify Web API for playlist creation and management
- **Modern UI**: Beautiful, responsive design with Spotify-inspired theming
- **Dark/Light Mode**: Theme-aware interface with smooth transitions
- **Real-time Playlist Creation**: Generate and save playlists directly to your Spotify account
- **Cover Art Generation**: AI-powered playlist cover art descriptions

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom Spotify design system
- **State Management**: Zustand
- **HTTP Client**: Axios with automatic token management
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Spotify OAuth 2.0

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Spotify Developer Account
- Google Gemini API Key

### Environment Variables

Create a `.env` file in the client directory:

```env
VITE_BASE_URL=http://localhost:3000
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/callback
```

### Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (theme, auth)
├── hooks/              # Custom React hooks
│   ├── usePlaylistGeneration.ts  # Playlist generation logic
│   ├── useSpotifyAuth.ts         # Spotify authentication
│   └── useSpotifyCallback.ts     # OAuth callback handling
├── pages/              # Page components
│   ├── Home/           # Landing page
│   ├── PlayListGen/    # Playlist generator
│   └── Error/          # Error page
├── services/           # API services
│   ├── Config.ts       # Axios configuration
│   └── CRUD.ts         # HTTP request utilities
├── store/              # Zustand state management
└── assets/             # Static assets
```

## Key Features

### Playlist Generation

The playlist generation process involves several steps:

1. **User Input**: Users provide a text prompt describing their desired playlist
2. **AI Analysis**: Google Gemini AI analyzes the prompt and suggests seed data
3. **Spotify Recommendations**: The app uses Spotify's recommendation API with AI-suggested seeds
4. **Playlist Creation**: Users can save the generated playlist directly to their Spotify account

### Authentication Flow

1. Users click "Login with Spotify" on the homepage
2. They're redirected to Spotify for authorization
3. After authorization, they're redirected back with an authorization code
4. The app exchanges the code for access and refresh tokens
5. Tokens are stored securely and automatically managed

### API Integration

The client communicates with the backend server through:

- **Recommendations**: `POST /api/playlist/recommendations`
- **Cover Art**: `POST /api/playlist/cover-art`
- **Playlist Creation**: `POST /api/playlist/create`

All requests automatically include the user's access token in the Authorization header.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Functional components with hooks
- Named function parameters
- Theme-aware components

## Deployment

The app is configured for deployment on Vercel with:

- Automatic builds from Git
- Environment variable management
- Edge functions for API routes
- CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
