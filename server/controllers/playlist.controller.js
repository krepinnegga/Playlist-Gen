import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { cleanAndParseJSON } from '../utils/index.js';

const GeminiSecret = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GeminiSecret);

export const generatePlaylistRecommendations = async (req, res, next) => {
  const { prompt } = req.body;

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

    // Step 3: Search for playlists in this category
    const searchResults = await spotifyApi.searchPlaylists(
      `genre:${matchedCategoryName}`,
      {
        limit: 1,
        market: 'GH', // Ghana market
      }
    );

    if (!searchResults?.body?.playlists?.items?.length) {
      return res
        .status(404)
        .json({ error: 'No playlists found in this category' });
    }

    const playlistId = searchResults.body?.playlists?.items[0]?.id;

    // Step 4: Get tracks from the found playlist
    const tracksResponse = await spotifyApi.getPlaylistTracks(playlistId, {
      limit: 20,
      fields:
        'items(track(name,artists(name),uri,album(images),is_playable,preview_url))',
    });

    // Format tracks data
    const tracks = tracksResponse.body.items.map(item => ({
      name: item?.track?.name,
      artists: item?.track?.artists.map(artist => artist.name).join(', '),
      uri: item?.track?.uri,
      image: item?.track?.album?.images[0]?.url || null,
      is_playable: item?.track?.is_playable ?? false,
      preview_url: item?.track?.preview_url || null,
    }));

    // Final response
    res.json({
      generated_playlist: {
        name: playlist_name,
        description: playlist_description,
        matched_category: matchedCategoryName,
      },
      tracks,
      source_playlist: {
        id: playlistId,
        name: searchResults.body.playlists.items[0].name,
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

export const generateCoverArt = async (req, res, next) => {
  res.json({ data: '' });
};

export const createPlaylist = async (req, res, next) => {
  res.json({ data: 'Playlist created' });
};
