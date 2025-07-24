import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { usePlaylistGeneration } from '../../hooks/usePlaylistGeneration';
import { Wand2, Music, Save, Sparkles, ExternalLink, ListMusic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Switch } from '@headlessui/react';
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

interface UserPlaylist {
  id: string;
  name: string;
  image: string | null;
  tracks: number;
  owner: string;
}

const PlaylistGen = () => {
  const [prompt, setPrompt] = useState('');
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [playbackActive, setPlaybackActive] = useState(false);
  const [savingPlaylist, setSavingPlaylist] = useState(false);
  const [savedPlaylistUrl, setSavedPlaylistUrl] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [userPlaylists, setUserPlaylists] = useState<UserPlaylist[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [saveOption, setSaveOption] = useState<'new' | 'existing'>('new');
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [playlistLength, setPlaylistLength] = useState(10);

  const {
    generateRecommendations,
    savePlaylist,
    getUserPlaylists,
    isAuthenticated,
    accessToken,
  } = usePlaylistGeneration();

  useEffect(() => {
    if (isAuthenticated && showSaveModal) {
      fetchUserPlaylists();
    }
  }, [isAuthenticated, showSaveModal]);

  const fetchUserPlaylists = async () => {
    try {
      setLoadingPlaylists(true);
      const playlists = await getUserPlaylists();
      setUserPlaylists(playlists.playlists);
    } catch (err) {
      console.error('Failed to fetch user playlists:', err);
    } finally {
      setLoadingPlaylists(false);
    }
  };

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
    setPlaybackActive(false);

    try {
      const result = await generateRecommendations(prompt, playlistLength);
      setPlaylistData(result?.data as PlaylistData);
    } catch (err: unknown) {
      const errorMessage =
          err instanceof Error ? err.message : 'Failed to generate playlist';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlaylist = async () => {
    if (!playlistData?.generated_playlist.name.trim()) {
      setError('Please enter a playlist name');
      return;
    }

    setSavingPlaylist(true);
    setError('');

    try {
      const result = await savePlaylist({
        playlistName: playlistData.generated_playlist.name,
        description: playlistData.generated_playlist.description,
        trackUris: playlistData.tracks.map(track => track.uri),
        coverImageUrl: playlistData.tracks[0]?.image,
        isPublic: isPublic,
        existingPlaylistId: saveOption === 'existing' ? selectedPlaylistId : null,
      });

      setSavedPlaylistUrl(result.data.playlist.url);
      setShowSaveModal(false);

      setTimeout(() => {
        setSavedPlaylistUrl(null);
      }, 10000);
    } catch (err: unknown) {
      const errorMessage =
          err instanceof Error ? err.message : 'Failed to save playlist';
      setError(errorMessage);
    } finally {
      setSavingPlaylist(false);
    }
  };

  const openTrackInSpotify = (uri: string) => {
    const trackId = uri.split(':')[2];
    window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
  };

  return (
      <Layout>
        <section className='relative max-w-7xl mx-auto px-6 py-12'>
          {/* Spotify Web Playback */}
          {accessToken && playbackActive && playlistData?.tracks && (
              <div className='fixed bottom-0 left-0 right-0 z-50'>
                <SpotifyPlayer
                    token={accessToken}
                    uris={playlistData?.tracks?.map(track => track.uri)}
                    play={playbackActive}
                    callback={state => {
                      if (!state.isPlaying) {
                        setPlaybackActive(false);
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
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2}}
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
                  <Sparkles className='w-5 h-5 text-spotify-gray-500'/>
                </div>
              </div>
              <motion.button
                  onClick={generatePlaylist}
                  disabled={isLoading || !isAuthenticated}
                  whileHover={{scale: 1.05}}
                  whileTap={{scale: 0.95}}
                  className='bg-gradient-to-r from-spotify-brand to-spotify-green-light hover:from-spotify-green-light hover:to-spotify-brand text-spotify-black font-bold rounded-xl px-8 py-4 flex items-center gap-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg'
              >
                {isLoading ? (
                    <>
                      <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-spotify-black'></div>
                      Generating...
                    </>
                ) : (
                    <>
                      <Wand2 className='w-6 h-6'/>
                      Generate Playlist
                    </>
                )}
              </motion.button>
            </div>


            <div className='mb-6'>
              <label className='block text-spotify-gray-400 mb-3 font-medium'>
                Playlist Length: <span className='text-spotify-brand'>{playlistLength}</span> tracks
              </label>
              <div className='relative'>
                {/* Custom styled track */}
                <div className='h-1.5 w-full bg-spotify-gray-700 rounded-full overflow-hidden'>
                  {/* Progress fill */}
                  <div
                      className='h-full bg-spotify-brand rounded-full'
                      style={{width: `${((playlistLength - 5) / 15) * 100}%`}}
                  ></div>
                </div>

                {/* Custom thumb */}
                <input
                    type='range'
                    min='5'
                    max='20'
                    value={playlistLength}
                    onChange={(e) => setPlaylistLength(parseInt(e.target.value))}
                    className='absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer'
                />

                {/* Markers */}
                <div className='flex justify-between mt-2'>
                  {[5, 10, 15, 20].map((value) => (
                      <button
                          key={value}
                          onClick={() => setPlaylistLength(value)}
                          className={`text-xs ${
                              playlistLength === value
                                  ? 'text-spotify-brand font-bold'
                                  : 'text-spotify-gray-400 hover:text-spotify-gray-300'
                          }`}
                      >
                        {value}
                      </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
                    className='text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4'
                >
                  {error}
                </motion.div>
            )}

            {!isAuthenticated && (
                <motion.div
                    initial={{opacity: 0, y: -10}}
                    animate={{opacity: 1, y: 0}}
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
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -20}}
                    className='bg-gradient-to-br from-spotify-gray-800 to-spotify-gray-900 rounded-2xl p-8 mb-8 border border-spotify-gray-700'
                >
                  <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4'>
                    <div>
                      <h2 className='text-2xl font-bold text-spotify-white mb-2'>
                        {playlistData?.generated_playlist?.name}
                      </h2>
                      <p className='text-spotify-gray-400 mb-1'>
                        {playlistData?.generated_playlist?.description}
                      </p>
                      <p className='text-spotify-gray-500 text-sm'>
                        Matched category: {playlistData?.generated_playlist?.matched_category} • Source: {playlistData?.source_playlist?.name}
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
                    {playlistData?.tracks?.map((track, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className='bg-spotify-gray-700 hover:bg-spotify-gray-600 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all duration-200 group cursor-pointer'
                            onClick={() => openTrackInSpotify(track.uri)}
                        >
                          <div className='relative flex-shrink-0'>
                            {track?.image ? (
                                <img
                                    src={track?.image}
                                    alt={`Album cover for ${track?.name}`}
                                    className='w-10 h-10 sm:w-12 sm-h-12 rounded-lg object-cover'
                                />
                            ) : (
                                <div className='bg-gradient-to-br from-spotify-gray-600 to-spotify-gray-700 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center'>
                                  <Music className='w-5 h-5 sm:w-6 sm:h-6 text-spotify-gray-300' />
                                </div>
                            )}
                          </div>

                          <div className='flex-1 min-w-0 w-full sm:w-auto'>
                            <h3 className='font-semibold text-spotify-white truncate text-sm sm:text-base'>
                              {track?.name}
                            </h3>
                            <p className='text-xs sm:text-sm text-spotify-gray-400 truncate'>
                              {track?.artists}
                            </p>
                          </div>

                          <div className='flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end'>
                            <div className='flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity'>
                              <ExternalLink className='w-3 h-3 sm:w-4 sm:h-4 text-spotify-gray-400' />
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
                      <div className='flex items-center gap-4 mb-4'>
                        <button
                            onClick={() => setSaveOption('new')}
                            className={`flex-1 py-2 rounded-lg transition-colors ${
                                saveOption === 'new'
                                    ? 'bg-spotify-brand text-spotify-black font-medium'
                                    : 'bg-spotify-gray-700 text-spotify-gray-300 hover:bg-spotify-gray-600'
                            }`}
                        >
                          Create New Playlist
                        </button>
                        <button
                            onClick={() => setSaveOption('existing')}
                            className={`flex-1 py-2 rounded-lg transition-colors ${
                                saveOption === 'existing'
                                    ? 'bg-spotify-brand text-spotify-black font-medium'
                                    : 'bg-spotify-gray-700 text-spotify-gray-300 hover:bg-spotify-gray-600'
                            }`}
                        >
                          Add to Existing
                        </button>
                      </div>

                      {saveOption === 'new' ? (
                          <>
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

                            <div className='flex items-center justify-between pt-2'>
                              <label className='block text-spotify-gray-400 font-medium'>
                                Playlist Visibility
                              </label>
                              <div className='flex items-center gap-3'>
                          <span
                              className={`text-sm ${
                                  isPublic
                                      ? 'text-spotify-white'
                                      : 'text-spotify-gray-500'
                              }`}
                          >
                            Public
                          </span>
                                <Switch
                                    checked={isPublic}
                                    onChange={setIsPublic}
                                    className={`${
                                        isPublic ? 'bg-spotify-brand' : 'bg-spotify-gray-600'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-spotify-brand focus:ring-offset-2 focus:ring-offset-spotify-gray-900`}
                                >
                            <span
                                className={`${
                                    isPublic ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                                </Switch>
                                <span
                                    className={`text-sm ${
                                        !isPublic
                                            ? 'text-spotify-white'
                                            : 'text-spotify-gray-500'
                                    }`}
                                >
                            Private
                          </span>
                              </div>
                            </div>
                          </>
                      ) : (
                          <div>
                            <label className='block text-spotify-gray-400 mb-2 font-medium'>
                              Select Playlist
                            </label>
                            {loadingPlaylists ? (
                                <div className='flex justify-center py-8'>
                                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-spotify-brand'></div>
                                </div>
                            ) : userPlaylists.length > 0 ? (
                                <div className='max-h-64 overflow-y-auto'>
                                  {userPlaylists.map(playlist => (
                                      <div
                                          key={playlist.id}
                                          onClick={() => setSelectedPlaylistId(playlist.id)}
                                          className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                                              selectedPlaylistId === playlist.id
                                                  ? 'bg-spotify-brand/20 border border-spotify-brand'
                                                  : 'bg-spotify-gray-700 hover:bg-spotify-gray-600'
                                          }`}
                                      >
                                        <div className='flex items-center gap-3'>
                                          {playlist.image ? (
                                              <img
                                                  src={playlist.image}
                                                  alt={playlist.name}
                                                  className='w-10 h-10 rounded-md object-cover'
                                              />
                                          ) : (
                                              <div className='w-10 h-10 rounded-md bg-spotify-gray-600 flex items-center justify-center'>
                                                <ListMusic className='w-5 h-5 text-spotify-gray-400' />
                                              </div>
                                          )}
                                          <div>
                                            <h3 className='font-medium text-spotify-white'>
                                              {playlist.name}
                                            </h3>
                                            <p className='text-xs text-spotify-gray-400'>
                                              {playlist.tracks} tracks • {playlist.owner}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                  ))}
                                </div>
                            ) : (
                                <div className='bg-spotify-gray-800 rounded-lg p-4 text-center text-spotify-gray-400'>
                                  No playlists found
                                </div>
                            )}
                          </div>
                      )}

                      <div>
                        <label className='block text-spotify-gray-400 mb-3 font-medium'>
                          Cover Image (using first track's album art)
                        </label>
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
                          onClick={() => {
                            setShowSaveModal(false);
                            setSelectedPlaylistId(null);
                          }}
                          disabled={savingPlaylist}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className='bg-spotify-gray-700 hover:bg-spotify-gray-600 text-spotify-white rounded-xl px-6 py-3 transition-colors disabled:opacity-50'
                      >
                        Cancel
                      </motion.button>
                      <motion.button
                          onClick={handleSavePlaylist}
                          disabled={savingPlaylist || (saveOption === 'existing' && !selectedPlaylistId)}
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
                              {saveOption === 'new' ? 'Create Playlist' : 'Add to Playlist'}
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