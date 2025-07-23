import { useState } from 'react';
import Layout from '../../components/Layout';
import { usePlaylistGeneration } from '../../hooks/usePlaylistGeneration';
import {
  Wand2,
  Music,
  Save,
  Sparkles,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotifyPlayer from 'react-spotify-web-playback';

interface Track {
  name: string;
  artists: string;
  uri: string;
  image: string;
  preview_url: string | null;
  is_playable: boolean;
}

interface PlaylistData {
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

const PlaylistGen = () => {
  const [prompt, setPrompt] = useState('');
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [useAICover, setUseAICover] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const [savedPlaylistUrl, setSavedPlaylistUrl] = useState<string | null>(null);
  const [playbackActive, setPlaybackActive] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<HTMLAudioElement | null>(
    null
  );

  const {
    generateRecommendations,
    generateCoverArt,
    createPlaylist,
    isAuthenticated,
    accessToken,
  } = usePlaylistGeneration();

  const generatePlaylist = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    if (!isAuthenticated) {
      setError('Please log in to Spotify first');
      return;
    }

    setIsLoading(true);
    setError('');
    setPlaylistData(null);
    stopAllPlayback();

    try {
      const result = await generateRecommendations(prompt);
      setPlaylistData(result);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate playlist';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const stopAllPlayback = () => {
    if (currentPreview) {
      currentPreview.pause();
      setCurrentPreview(null);
    }
    setIsPlaying(false);
    setCurrentSong(null);
    setPlaybackActive(false);
  };

  const handleSavePlaylist = async () => {
    if (!playlistData?.generated_playlist.name.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    setSavingPlaylist(true);
    setError('');

    try {
      const result = await createPlaylist({
        name: playlistData.generated_playlist.name,
        description: playlistData.generated_playlist.description,
        trackIds: playlistData.tracks.map(track => track.uri),
        coverImageUrl: playlistData.tracks[0]?.image,
        isPublic: true,
      });

      setSavedPlaylistUrl(result.playlist_url);
      setShowSaveModal(false);

      setTimeout(() => {
        setSavedPlaylistUrl(null);
      }, 5000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to save playlist';
      setError(errorMessage);
    } finally {
      setSavingPlaylist(false);
    }
  };

  const generateAICover = async () => {
    if (!playlistData?.generated_playlist.name.trim()) {
      setError('Please generate a playlist first');
      return;
    }

    try {
      const result = await generateCoverArt(
        prompt,
        playlistData.generated_playlist.name
      );
      console.log('Generated cover art:', result);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to generate cover art';
      setError(errorMessage);
    }
  };

  const togglePlay = (index: number) => {
    if (currentSong === index) {
      // Toggle play/pause for the current track
      if (isPlaying) {
        if (currentPreview) {
          currentPreview.pause();
        }
        setPlaybackActive(false);
      } else {
        if (currentPreview) {
          currentPreview.play();
        }
        setPlaybackActive(true);
      }
      setIsPlaying(!isPlaying);
    } else {
      // Stop any current playback and start new track
      stopAllPlayback();

      const track = playlistData?.tracks[index];
      if (!track) return;

      if (track.preview_url) {
        // Play 30-second preview
        const audio = new Audio(track.preview_url);
        audio
          .play()
          .then(() => {
            setCurrentPreview(audio);
            setCurrentSong(index);
            setIsPlaying(true);
            setPlaybackActive(true);

            audio.onended = () => {
              setIsPlaying(false);
              setPlaybackActive(false);
            };
          })
          .catch(err => {
            console.error('Failed to play preview:', err);
            setError('Could not play preview - try opening in Spotify instead');
          });
      } else {
        setError(
          'No preview available for this track try opening in Spotify instead'
        );
      }
    }
  };

  return (
    <Layout>
      <section className='relative max-w-7xl mx-auto px-6 py-12'>
        {/* Spotify Web Playback (for premium users) */}
        {accessToken && playbackActive && playlistData?.tracks && (
          <div className='fixed bottom-0 left-0 right-0 z-50'>
            <SpotifyPlayer
              token={accessToken}
              uris={playlistData.tracks.map(track => track.uri)}
              play={playbackActive}
              callback={state => {
                if (!state.isPlaying) {
                  setPlaybackActive(false);
                  setIsPlaying(false);
                }
              }}
              styles={{
                bgColor: '#181818',
                color: '#ffffff',
                sliderColor: '#1db954',
                sliderHandleColor: '#ffffff',
                trackArtistColor: '#b3b3b3',
                trackNameColor: '#ffffff',
              }}
            />
          </div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-12 mt-20 text-center'
        >
          <div className='inline-flex items-center gap-2 bg-spotify-gray-800 text-spotify-brand px-4 py-2 rounded-full text-sm font-medium mb-4'>
            <Sparkles className='w-4 h-4' /> AI-Powered Playlist Generator
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-spotify-white mb-4'>
            Create Your Perfect Playlist
          </h1>
          <p className='text-xl text-spotify-gray-400 max-w-2xl mx-auto'>
            Describe your mood, activity, or music preference and watch AI
            create a custom playlist just for you
          </p>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {savedPlaylistUrl && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-green-900/20 border border-green-800 rounded-lg p-4 mb-6 text-center'
            >
              <div className='flex items-center justify-center gap-2 text-green-400'>
                <Sparkles className='w-5 h-5' />
                <span>Playlist saved successfully!</span>
                <a
                  href={savedPlaylistUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1 text-spotify-brand hover:text-spotify-green-light transition-colors'
                >
                  Open in Spotify
                  <ExternalLink className='w-4 h-4' />
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prompt Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-gradient-to-r from-spotify-gray-800 to-spotify-gray-900 rounded-2xl p-8 mb-8 border border-spotify-gray-700'
        >
          <div className='flex flex-col lg:flex-row gap-4 mb-6'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='I want a playlist for a beach day with friends...'
                className='w-full bg-spotify-gray-700 text-spotify-white rounded-xl px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-spotify-brand focus:border-transparent placeholder-spotify-gray-500'
              />
              <div className='absolute right-4 top-1/2 transform -translate-y-1/2'>
                <Sparkles className='w-5 h-5 text-spotify-gray-500' />
              </div>
            </div>
            <motion.button
              onClick={generatePlaylist}
              disabled={isLoading || !isAuthenticated}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className='bg-gradient-to-r from-spotify-brand to-spotify-green-light hover:from-spotify-green-light hover:to-spotify-brand text-spotify-black font-bold rounded-xl px-8 py-4 flex items-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
            >
              {isLoading ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-spotify-black'></div>
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className='w-6 h-6' />
                  Generate Playlist
                </>
              )}
            </motion.button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4'
            >
              {error}
            </motion.div>
          )}

          {!isAuthenticated && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className='text-yellow-400 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4'
            >
              Please log in to Spotify to generate playlists
            </motion.div>
          )}

          {/* Example Prompts */}
          <div className='flex flex-wrap gap-2'>
            <span className='text-spotify-gray-400 text-sm'>Try:</span>
            {[
              'Workout motivation',
              'Chill evening vibes',
              'Road trip energy',
              'Study focus',
              'Party mood',
            ].map((example, index) => (
              <button
                key={index}
                onClick={() => setPrompt(example)}
                className='text-spotify-gray-300 hover:text-spotify-brand text-sm bg-spotify-gray-700 hover:bg-spotify-gray-600 px-3 py-1 rounded-full transition-colors'
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Generated Playlist Section */}
        <AnimatePresence>
          {playlistData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className='bg-gradient-to-br from-spotify-gray-800 to-spotify-gray-900 rounded-2xl p-8 mb-8 border border-spotify-gray-700'
            >
              <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4'>
                <div>
                  <h2 className='text-2xl font-bold text-spotify-white mb-2'>
                    {playlistData.generated_playlist.name}
                  </h2>
                  <p className='text-spotify-gray-400 mb-1'>
                    {playlistData.generated_playlist.description}
                  </p>
                  <p className='text-spotify-gray-500 text-sm'>
                    Matched category:{' '}
                    {playlistData.generated_playlist.matched_category} • Source:{' '}
                    {playlistData.source_playlist.name}
                  </p>
                </div>
                <motion.button
                  onClick={() => setShowSaveModal(true)}
                  disabled={!isAuthenticated}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-gradient-to-r from-spotify-brand to-spotify-green-light hover:from-spotify-green-light hover:to-spotify-brand text-spotify-black font-bold rounded-xl px-6 py-3 flex items-center gap-3 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <Save className='w-5 h-5' />
                  Save to Spotify
                </motion.button>
              </div>

              <div className='grid gap-3'>
                {playlistData.tracks.map((track, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className='bg-spotify-gray-700 hover:bg-spotify-gray-600 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all duration-200 group'
                  >
                    <div className='relative flex-shrink-0'>
                      {track.image ? (
                        <img
                          src={track.image}
                          alt={`Album cover for ${track.name}`}
                          className='w-10 h-10 sm:w-12 sm-h-12 rounded-lg object-cover'
                        />
                      ) : (
                        <div className='bg-gradient-to-br from-spotify-gray-600 to-spotify-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center'>
                          <Music className='w-5 h-5 sm:w-6 sm:h-6 text-spotify-gray-300' />
                        </div>
                      )}
                      <button
                        onClick={() => togglePlay(index)}
                        disabled={!track.preview_url && !isAuthenticated}
                        className={`absolute inset-0 rounded-lg flex items-center justify-center ${
                          track.preview_url || isAuthenticated
                            ? 'bg-spotify-brand/90 opacity-0 group-hover:opacity-100 transition-opacity'
                            : 'bg-gray-800/90 cursor-not-allowed'
                        }`}
                      >
                        {currentSong === index && isPlaying ? (
                          <Pause className='w-3 h-3 sm:w-4 sm:h-4 text-spotify-black' />
                        ) : (
                          <>
                            {track.preview_url || isAuthenticated ? (
                              <Play className='w-3 h-3 sm:w-4 sm:h-4 text-spotify-black' />
                            ) : (
                              <span className='text-xs text-white'>
                                No preview
                              </span>
                            )}
                          </>
                        )}
                      </button>
                    </div>

                    <div className='flex-1 min-w-0 w-full sm:w-auto'>
                      <h3 className='font-semibold text-spotify-white truncate text-sm sm:text-base'>
                        {track.name}
                      </h3>
                      <p className='text-xs sm:text-sm text-spotify-gray-400 truncate'>
                        {track.artists}
                      </p>
                      {track.preview_url && (
                        <p className='text-xs text-spotify-gray-500 mt-1'>
                          30-sec preview available
                        </p>
                      )}
                    </div>

                    <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end'>
                      <div className='flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity'>
                        <a
                          href={`https://open.spotify.com/track/${
                            track.uri.split(':')[2]
                          }`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='p-1.5 sm:p-2 hover:bg-spotify-gray-600 rounded-lg transition-colors'
                        >
                          <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-spotify-gray-400 hover:text-spotify-brand' />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Save Modal */}
        <AnimatePresence>
          {showSaveModal && playlistData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className='bg-spotify-gray-900 rounded-2xl p-8 w-full max-w-lg border border-spotify-gray-700'
              >
                <h2 className='text-2xl font-bold text-spotify-white mb-6'>
                  Save Playlist to Spotify
                </h2>

                <div className='space-y-6'>
                  <div>
                    <label className='block text-spotify-gray-400 mb-2 font-medium'>
                      Playlist Name
                    </label>
                    <input
                      type='text'
                      value={playlistData.generated_playlist.name}
                      onChange={e =>
                        setPlaylistData({
                          ...playlistData,
                          generated_playlist: {
                            ...playlistData.generated_playlist,
                            name: e.target.value,
                          },
                        })
                      }
                      className='w-full bg-spotify-gray-700 text-spotify-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-spotify-brand'
                    />
                  </div>

                  <div>
                    <label className='block text-spotify-gray-400 mb-2 font-medium'>
                      Description
                    </label>
                    <textarea
                      value={playlistData.generated_playlist.description}
                      onChange={e =>
                        setPlaylistData({
                          ...playlistData,
                          generated_playlist: {
                            ...playlistData.generated_playlist,
                            description: e.target.value,
                          },
                        })
                      }
                      rows={3}
                      className='w-full bg-spotify-gray-700 text-spotify-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-spotify-brand resize-none'
                    />
                  </div>

                  <div>
                    <label className='block text-spotify-gray-400 mb-3 font-medium'>
                      Cover Image
                    </label>
                    <div className='flex gap-3 mb-4'>
                      <button
                        onClick={() => setUseAICover(true)}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          useAICover
                            ? 'bg-spotify-brand text-spotify-black font-semibold'
                            : 'bg-spotify-gray-700 text-spotify-white hover:bg-spotify-gray-600'
                        }`}
                      >
                        Generate AI Cover
                      </button>
                      <button
                        onClick={() => setUseAICover(false)}
                        className={`flex-1 py-3 rounded-xl transition-all ${
                          !useAICover
                            ? 'bg-spotify-brand text-spotify-black font-semibold'
                            : 'bg-spotify-gray-700 text-spotify-white hover:bg-spotify-gray-600'
                        }`}
                      >
                        Upload Image
                      </button>
                    </div>

                    {useAICover ? (
                      <motion.button
                        onClick={generateAICover}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className='bg-spotify-gray-700 hover:bg-spotify-gray-600 text-spotify-white rounded-xl px-4 py-3 w-full transition-colors'
                      >
                        Generate Cover Art
                      </motion.button>
                    ) : (
                      <input
                        type='file'
                        accept='image/*'
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = event => {
                              console.log(
                                'Selected image:',
                                event.target?.result
                              );
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className='w-full bg-spotify-gray-700 text-spotify-white rounded-xl px-4 py-3'
                      />
                    )}

                    <div className='mt-4 flex justify-center'>
                      <img
                        src={
                          playlistData.tracks[0]?.image ||
                          'https://via.placeholder.com/400x400.png?text=No+Image'
                        }
                        alt='Playlist cover'
                        className='w-32 h-32 rounded-xl object-cover'
                      />
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-3 mt-8'>
                  <motion.button
                    onClick={() => setShowSaveModal(false)}
                    disabled={savingPlaylist}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-spotify-gray-700 hover:bg-spotify-gray-600 text-spotify-white rounded-xl px-6 py-3 transition-colors disabled:opacity-50'
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={handleSavePlaylist}
                    disabled={savingPlaylist}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className='bg-gradient-to-r from-spotify-brand to-spotify-green-light hover:from-spotify-green-light hover:to-spotify-brand text-spotify-black font-bold rounded-xl px-6 py-3 transition-all duration-300 disabled:opacity-50 flex items-center gap-2'
                  >
                    {savingPlaylist ? (
                      <>
                        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-spotify-black'></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className='w-4 h-4' />
                        Save to Spotify
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </Layout>
  );
};

export default PlaylistGen;
