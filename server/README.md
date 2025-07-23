# Spotify Playlist Generator - Server

A robust Node.js/Express server that powers an AI-driven Spotify playlist generator. This server combines Google's Gemini AI with Spotify's Web API to create personalized playlists based on natural language prompts.

## 🚀 Features

- **AI-Powered Playlist Generation**: Uses Gemini AI to analyze user prompts and extract seed data for Spotify's recommendation API
- **Smart Fallback System**: Multiple layers of fallback ensure recommendations always work, even if AI fails
- **Spotify Integration**: Full integration with Spotify Web API for playlist creation and management
- **Cover Art Generation**: AI-powered cover art descriptions (ready for image generation APIs)
- **Authentication**: Secure OAuth2 flow with Spotify
- **Token Management**: Automatic token refresh and validation
- **Error Handling**: Comprehensive error handling and logging
- **Modular Architecture**: Clean, scalable code structure

## 📁 Project Structure

```
server/
├── app.js                 # Express app configuration
├── server.js             # Server entry point
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (create this)
├── .gitignore           # Git ignore rules
├── README.md            # This file
├── routes/
│   ├── index.js         # Main router (combines all routes)
│   ├── auth.routes.js   # Spotify OAuth endpoints
│   └── playlist.routes.js # Playlist generation endpoints
├── controllers/
│   ├── auth.controller.js    # OAuth logic
│   └── playlist.controller.js # Playlist generation logic
├── services/
│   ├── spotify.service.js        # Spotify API wrapper
│   └── spotify-search.service.js # Search and seed data service
├── middlewares/
│   ├── auth.middleware.js    # Token verification & CORS
│   └── error.middleware.js   # Global error handler
└── utils/
    └── logger.js         # Logging utilities
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20 or later
- Spotify Developer Account
- Google AI Studio Account (for Gemini API)

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the server root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Spotify API Configuration
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:3000/callback

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### 3. Get API Keys

#### Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add `http://localhost:3000/callback` to Redirect URIs
4. Copy Client ID and Client Secret

#### Google Gemini AI

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 4. Run the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication Endpoints

#### `GET /api/auth/login`

Get Spotify OAuth URL for user login.

**Response:**

```json
{
  "url": "https://accounts.spotify.com/authorize?..."
}
```

#### `POST /api/auth/callback`

Exchange authorization code for access tokens.

**Request Body:**

```json
{
  "code": "authorization_code_from_spotify"
}
```

**Response:**

```json
{
  "accessToken": "spotify_access_token",
  "refreshToken": "spotify_refresh_token",
  "expiresIn": 3600
}
```

#### `POST /api/auth/refresh`

Refresh expired access token.

**Request Body:**

```json
{
  "refreshToken": "spotify_refresh_token"
}
```

**Response:**

```json
{
  "accessToken": "new_spotify_access_token",
  "expiresIn": 3600
}
```

### Playlist Endpoints

#### `POST /api/playlist/recommendations`

Generate song recommendations based on a prompt.

**Headers:**

```
Authorization: Bearer <spotify_access_token>
```

**Request Body:**

```json
{
  "prompt": "I want a playlist for a beach day with friends"
}
```

**Response:**

```json
{
  "songs": [
    {
      "id": "track_id",
      "name": "Song Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "duration_ms": 180000,
      "popularity": 85,
      "preview_url": "https://...",
      "external_url": "https://open.spotify.com/track/...",
      "album_art": "https://..."
    }
  ],
  "playlist_name": "Beach Vibes",
  "playlist_description": "Perfect tunes for a sunny beach day",
  "seed_data": {
    "seed_tracks": ["track_id1", "track_id2"],
    "seed_artists": ["artist_id1"],
    "seed_genres": ["pop"],
    "target_attributes": {
      "energy": 0.8,
      "valence": 0.7,
      "danceability": 0.6,
      "tempo": 120
    }
  }
}
```

#### `POST /api/playlist/cover-art`

Generate cover art description using AI.

**Headers:**

```
Authorization: Bearer <spotify_access_token>
```

**Request Body:**

```json
{
  "prompt": "Beach day playlist",
  "playlistName": "Beach Vibes"
}
```

**Response:**

```json
{
  "cover_description": "A vibrant sunset over ocean waves with musical notes floating in the air...",
  "cover_image_url": null,
  "message": "Cover art description generated. Image generation would be implemented with an image API."
}
```

#### `POST /api/playlist/create`

Create and save playlist to Spotify.

**Headers:**

```
Authorization: Bearer <spotify_access_token>
```

**Request Body:**

```json
{
  "name": "Beach Vibes",
  "description": "Perfect tunes for a sunny beach day",
  "trackIds": ["track_id1", "track_id2", "track_id3"],
  "coverImageUrl": "https://example.com/cover.jpg",
  "isPublic": true
}
```

**Response:**

```json
{
  "success": true,
  "playlist_id": "playlist_id",
  "playlist_url": "https://open.spotify.com/playlist/...",
  "message": "Playlist created successfully!"
}
```

## 🔧 Architecture Details

### AI Integration

The server uses **Google Gemini AI** to:

- Analyze user prompts and extract musical preferences
- Generate seed data for Spotify's recommendation API
- Create cover art descriptions
- Suggest playlist names and descriptions

### Spotify Integration

**Spotify Web API** is used for:

- User authentication via OAuth2
- Getting song recommendations based on seed data
- Creating playlists in user accounts
- Adding tracks to playlists
- Setting playlist cover images

### Fallback System

The server implements a multi-layered fallback system:

1. **Primary**: Gemini AI analysis + Spotify search service
2. **Secondary**: Pre-built seed data based on prompt keywords
3. **Tertiary**: Basic genre-based recommendations

This ensures the service always returns recommendations, even if external APIs fail.

### Seed Data Categories

The server includes pre-built seed data for common scenarios:

- **Workout**: High energy, pop/hip-hop
- **Chill**: Low energy, ambient/acoustic
- **Party**: High energy, dance/electronic
- **Study**: Low energy, ambient/classical
- **Roadtrip**: Medium energy, rock/indie

## 🔒 Security Features

- **Token Verification**: All playlist endpoints require valid Spotify access tokens
- **CORS Protection**: Configured for specific client origins
- **Error Handling**: Comprehensive error handling without exposing sensitive data
- **Input Validation**: All inputs are validated before processing

## 🚀 Deployment

### Environment Variables for Production

```env
PORT=5000
NODE_ENV=production
SPOTIFY_CLIENT_ID=your_production_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_production_spotify_client_secret
SPOTIFY_REDIRECT_URI=https://yourdomain.com/callback
GEMINI_API_KEY=your_production_gemini_api_key
CLIENT_URL=https://yourdomain.com
```

### Build and Deploy

```bash
# Install dependencies
npm install

# Start production server
npm start
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure `CLIENT_URL` is set correctly in `.env`
2. **Spotify Auth Fails**: Verify redirect URI matches exactly in Spotify Dashboard
3. **Gemini API Errors**: Check `GEMINI_API_KEY` is valid and has quota
4. **Token Expired**: Implement token refresh logic in client

### Logs

The server uses structured logging. Check console output for:

- API request/response logs
- Error details
- Spotify API rate limiting
- AI processing status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Related Links

- [Spotify Web API Documentation](https://developer.spotify.com/documentation/web-api)
- [Google Gemini AI Documentation](https://ai.google.dev/docs)
- [Express.js Documentation](https://expressjs.com/)
- [Spotify Web API Node](https://www.npmjs.com/package/spotify-web-api-node)
- [Google Gen AI SDK](https://googleapis.github.io/js-genai/)
