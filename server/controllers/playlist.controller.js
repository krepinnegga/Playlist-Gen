import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cleanAndParseJSON } from '../utils/index.js';


const GeminiSecret = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GeminiSecret);

export const generatePlaylistRecommendations = async (req, res, next) => {
  const { prompt, playlistLenght = 10 } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const { spotifyApi } = req;
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: { temperature: 0.8 },
    });

    // Step 1: Generate playlist name and description using Gemini
    const namingPrompt = `Create a creative name and short description for a Spotify playlist based on this theme: "${prompt}". 
      Return ONLY JSON in this format: 
      {
        "playlist_name": "Creative Name",
        "playlist_description": "Brief description"
      }`;

    const namingResult = await model.generateContent(namingPrompt);
    const namingResponse = await namingResult.response;
    const { playlist_name, playlist_description } = cleanAndParseJSON(
        namingResponse.text()
    );

    // Step 2: Find the most relevant Spotify category
    const categoriesResponse = await spotifyApi.getCategories({ limit: 50 });
    const availableCategories = categoriesResponse.body.categories.items.map(
        c => c.name
    );

    const categoryPrompt = `From these Spotify categories: ${availableCategories.join(
        ', '
    )}, 
      select the SINGLE most relevant category for: "${prompt}". 
      Return ONLY the category name.`;

    const categoryResult = await model.generateContent(categoryPrompt);
    const categoryResponse = await categoryResult.response;
    const matchedCategoryName = categoryResponse.text().trim();

    // Step 3: Search for multiple playlists in this category
    const searchResults = await spotifyApi.searchPlaylists(
        `genre:${matchedCategoryName}`,
        {
          limit: 10, // Get more playlists
          market: 'GH', // Ghana market
        }
    );

    if (!searchResults?.body?.playlists?.items?.length) {
      return res
          .status(404)
          .json({ error: 'No playlists found in this category' });
    }

    // Get tracks from multiple playlists and shuffle them
    const tracks = await getShuffledTracksFromPlaylists(
        spotifyApi,
        searchResults.body.playlists.items
    );

    // Select a random source playlist for reference
    const randomSourcePlaylist = searchResults.body.playlists.items[
        Math.floor(Math.random() * searchResults.body.playlists.items.length)
        ];

    // Final response
    res.json({
      generated_playlist: {
        name: playlist_name,
        description: playlist_description,
        matched_category: matchedCategoryName,
      },
      tracks: tracks.slice(0, playlistLenght), // Return max 20 tracks
      source_playlist: {
        id: randomSourcePlaylist.id,
        name: randomSourcePlaylist.name,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Failed to generate recommendations',
      details: error.message,
    });
  }
};

// Helper function to get shuffled tracks from multiple playlists
async function getShuffledTracksFromPlaylists(spotifyApi, playlists) {
  try {
    // Get tracks from all playlists
    const allTracksPromises = playlists.map(async playlist => {
      const tracksResponse = await spotifyApi.getPlaylistTracks(playlist.id, {
        limit: 20,
        fields:
            'items(track(name,artists(name),uri,album(images),is_playable,preview_url))',
      });
      return tracksResponse.body.items.map(item => ({
        name: item?.track?.name,
        artists: item?.track?.artists.map(artist => artist.name).join(', '),
        uri: item?.track?.uri,
        image: item?.track?.album?.images[0]?.url || null,
        is_playable: item?.track?.is_playable ?? false,
        preview_url: item?.track?.preview_url || null,
      }));
    });

    const allTracksArrays = await Promise.all(allTracksPromises);
    const combinedTracks = allTracksArrays.flat();

    // Remove duplicate tracks (based on URI)
    const uniqueTracks = combinedTracks.filter(
        (track, index, self) =>
            index === self.findIndex(t => t.uri === track.uri)
    );

    // Shuffle the tracks
    return shuffleArray(uniqueTracks);
  } catch (error) {
    console.error('Error fetching tracks from playlists:', error);
    return [];
  }
}

// Helper function to shuffle an array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to get user's playlists
const getUserPlaylists = async (spotifyApi) => {
  const playlists = [];
  let offset = 0;
  const limit = 50;

  while (true) {
    const response = await spotifyApi.getUserPlaylists({ limit, offset });
    playlists.push(...response.body.items);
    if (response.body.items.length < limit) break;
    offset += limit;
  }

  return playlists.map(playlist => ({
    id: playlist.id,
    name: playlist.name,
    image: playlist.images[0]?.url,
    tracks: playlist.tracks.total
  }));
};

export const getUserSpotifyPlaylists = async (req, res) => {
  try {
    const playlists = await getUserPlaylists(req.spotifyApi);
    res.json({
      success: true,
      playlists: playlists
    });
  } catch (error) {
    console.error('Failed to get playlists:', error);
    res.status(500).json({
      error: 'Failed to fetch playlists',
      details: error.message
    });
  }
};

export const createOrUpdatePlaylist = async (req, res) => {
  const {
    playlistName,
    description,
    trackUris,
    coverImageUrl,
    isPublic = true,
    existingPlaylistId = null // Optional: if updating existing playlist
  } = req.body;

  if (!playlistName || !trackUris?.length) {
    return res.status(400).json({
      error: 'Playlist name and tracks are required'
    });
  }

  try {
    const { spotifyApi } = req;
    const { id: userId } = (await spotifyApi.getMe()).body;

    let playlistId;
    let isNewPlaylist = false;

    if (existingPlaylistId) {
      // Add tracks to existing playlist
      playlistId = existingPlaylistId;
      await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    } else {
      // Create new playlist
      const playlist = await spotifyApi.createPlaylist(userId, {
        name: playlistName,
        description: description || '',
        public: isPublic
      });
      playlistId = playlist.body.id;
      isNewPlaylist = true;
      await spotifyApi.addTracksToPlaylist(playlistId, trackUris);
    }

    // Set cover image if provided (only works for new playlists or playlist owner)
    if (coverImageUrl && isNewPlaylist) {
      try {
        await spotifyApi.uploadCustomPlaylistCoverImage(playlistId, coverImageUrl);
      } catch (error) {
        console.warn('Failed to set cover image:', error.message);
      }
    }

    // Get the final playlist details
    const playlist = await spotifyApi.getPlaylist(playlistId);

    res.json({
      success: true,
      playlist: {
        id: playlistId,
        name: playlist.body.name,
        url: playlist.body.external_urls.spotify,
        image: playlist.body.images[0]?.url || coverImageUrl,
        totalTracks: playlist.body.tracks.total
      },
      isNew: isNewPlaylist
    });

  } catch (error) {
    console.error('Playlist operation failed:', error);
    res.status(500).json({
      error: 'Playlist operation failed',
      details: error.message,
      spotifyError: error.body?.error
    });
  }
};
