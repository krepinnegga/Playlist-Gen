import { getSpotifyApi } from '../services/spotify.service.js';

export const handleLogin = async (req, res, next) => {
  try {
    const scopes = [
      'playlist-modify-public',
      'playlist-modify-private',
      'ugc-image-upload',
      'user-read-private',
      'user-read-email',
    ];
    const spotifyApi = getSpotifyApi();
    const authorizeURL = spotifyApi.createAuthorizeURL(scopes, null, true);
    res.json({ url: authorizeURL });
  } catch (err) {
    next(err);
  }
};

export const handleCallback = async (req, res, next) => {
  const { code } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }
  try {
    const spotifyApi = getSpotifyApi();
    const data = await spotifyApi.authorizationCodeGrant(code);
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    next(error);
  }
};

export const handleRefreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  try {
    const spotifyApi = getSpotifyApi({ refreshToken });
    const data = await spotifyApi.refreshAccessToken();
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    next(error);
  }
};
