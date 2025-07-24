import { useUserStore } from '../store';
import { servicePoster, serviceFetcher } from '../services/CRUD';

interface Track {
  name: string;
  artists: string;
  uri: string;
  image: string;
  preview_url: string | null;
  is_playable: boolean;
}

interface PlaylistRecommendationsAPI {
data: {
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
}

interface UserPlaylist {
  id: string;
  name: string;
  image: string | null;
  tracks: number;
  owner: string;
}

interface SavePlaylistRequest {
  playlistName: string;
  description?: string;
  trackUris: string[];
  coverImageUrl?: string;
  isPublic?: boolean;
  existingPlaylistId?: string | null;
}

interface SavePlaylistResponse {
  success: boolean;
  playlist: {
    id: string;
    name: string;
    url: string;
    image: string | null;
    totalTracks: number;
  };
  isNew: boolean;
}

export function usePlaylistGeneration() {
  const { user } = useUserStore();
  const accessToken = user?.accessToken;

  // Get user's existing playlists
  const getUserPlaylists = async (): Promise<UserPlaylist[]> => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await serviceFetcher<UserPlaylist[]>('/api/playlist/');
    return response;
  };

  // Generate playlist recommendations
  const generateRecommendations = async (prompt: string, playlistLenght: number): Promise<PlaylistRecommendationsAPI> => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await servicePoster<
        PlaylistRecommendationsAPI,
        { prompt: string, playlistLenght: number }
    >('/api/playlist/recommendations', { prompt, playlistLenght });
    return response;
  };

  // Create or update playlist
  const savePlaylist = async (
      playlistData: SavePlaylistRequest
  ): Promise<SavePlaylistResponse> => {
    if (!accessToken) {
      throw new Error('No access token available');
    }

    const response = await servicePoster<
        SavePlaylistResponse,
        SavePlaylistRequest
    >('/api/playlist/save', playlistData);
    return response;
  };

  return {
    getUserPlaylists,
    generateRecommendations,
    savePlaylist,
    accessToken,
    isAuthenticated: Boolean(accessToken),
  };
}