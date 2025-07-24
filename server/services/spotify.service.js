import 'dotenv/config';
import SpotifyWebApi from 'spotify-web-api-node';

export function getSpotifyApi({ accessToken, refreshToken } = {}) {
  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: process.env.SPOTIFY_REDIRECT_URI
  });
  if (accessToken) spotifyApi.setAccessToken(accessToken);
  if (refreshToken) spotifyApi.setRefreshToken(refreshToken);
  return spotifyApi;
}
