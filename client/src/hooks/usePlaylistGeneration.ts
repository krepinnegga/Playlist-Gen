import { useUserStore } from '../store';
import { servicePoster } from '../services/CRUD';

interface Track {
  name: string;
  artists: string;
  uri: string;
  image: string;
  preview_url: string | null;
  is_playable: boolean;
}

interface PlaylistRecommendations {
  generated_playlist: {
    name: string;
    description: string;
    matched_category: string;
  };
  tracks: Track[];
  source_playlist: {
    id: string;
    name: string;
  };
}

interface CoverArtResponse {
  cover_description: string;
  cover_image_url: string | null;
  message: string;
}

interface CreatePlaylistRequest {
  name: string;
  description: string;
  trackIds: string[];
  coverImageUrl?: string;
  isPublic?: boolean;
}

interface CreatePlaylistResponse {
  success: boolean;
  playlist_id: string;
  playlist_url: string;
  message: string;
}

export function usePlaylistGeneration() {
  const { user } = useUserStore();

  const accessToken = user?.accessToken;

  // Generate playlist recommendations
  const generateRecommendations = async (prompt: string) => {
    if (!user?.accessToken) {
      throw new Error('No access token available');
    }

    const response = await servicePoster<
      PlaylistRecommendations,
      { prompt: string }
    >('/api/playlist/recommendations', { prompt });
    return response.data;
  };

  // Generate cover art
  const generateCoverArt = async (prompt: string, playlistName: string) => {
    if (!user?.accessToken) {
      throw new Error('No access token available');
    }

    const response = await servicePoster<
      CoverArtResponse,
      { prompt: string; playlistName: string }
    >('/api/playlist/cover-art', { prompt, playlistName });
    return response.data;
  };

  // Create playlist
  const createPlaylist = async (playlistData: CreatePlaylistRequest) => {
    if (!user?.accessToken) {
      throw new Error('No access token available');
    }

    const response = await servicePoster<
      CreatePlaylistResponse,
      CreatePlaylistRequest
    >('/api/playlist/create', playlistData);
    return response.data;
  };

  return {
    generateRecommendations,
    generateCoverArt,
    createPlaylist,
    accessToken,
    isAuthenticated: Boolean(user?.accessToken),
  };
}
