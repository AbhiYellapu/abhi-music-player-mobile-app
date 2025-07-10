import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { Song, Playlist, PlaybackState, SortOption, SortDirection, FilterType } from '@/types/music';
import { loadDeviceSongs } from '@/lib/loadDeviceSongs';

interface MusicContextType {
  songs: Song[];
  playlists: Playlist[];
  favorites: Song[];
  playbackState: PlaybackState;
  sound: Audio.Sound | null;
  searchQuery: string;
  sortBy: SortOption;
  sortDirection: SortDirection;
  filterType: FilterType;
  filteredSongs: Song[];
  playSong: (song: Song, queue?: Song[]) => Promise<void>;
  pausePlayback: () => Promise<void>;
  resumePlayback: () => Promise<void>;
  skipToNext: () => Promise<void>;
  skipToPrevious: () => Promise<void>;
  seekTo: (position: number) => Promise<void>;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFavorite: (songId: string) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption, direction: SortDirection) => void;
  setFilterType: (filterType: FilterType) => void;
  createPlaylist: (name: string) => Promise<string>;
  addToPlaylist: (playlistId: string, song: Song) => void;
  removeFromPlaylist: (playlistId: string, songId: string) => void;
  deletePlaylist: (playlistId: string) => void;
  clearQueue: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);
export const useMusicContext = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error('useMusicContext must be used within a MusicProvider');
  return context;
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Song[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortByState] = useState<SortOption>('dateAdded');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterType, setFilterType] = useState<FilterType>('mp3');
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentSong: null,
    position: 0,
    duration: 0,
    queue: [],
    currentIndex: 0,
    shuffle: false,
    repeat: 'off'
  });

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const deviceSongs = await loadDeviceSongs();
        setSongs(deviceSongs || []);
      } catch (error) {
        console.error('Error loading device songs:', error);
        setSongs([]);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
      });
    }
    loadSavedData();
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, []);

  useEffect(() => {
    if (playbackState.isPlaying && sound) {
      const interval = setInterval(async () => {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setPlaybackState(prev => ({
            ...prev,
            position: status.positionMillis || 0,
            duration: status.durationMillis || 0
          }));
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [playbackState.isPlaying, sound]);

  const loadSavedData = async () => {
    try {
      const [savedFavorites, savedPlaylists, savedPlaybackState] = await Promise.all([
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('playlists'),
        AsyncStorage.getItem('playbackState')
      ]);
      
      // Parse favorites with error handling
      let parsedFavorites: Song[] = [];
      if (savedFavorites) {
        try {
          const parsed = JSON.parse(savedFavorites);
          parsedFavorites = Array.isArray(parsed) ? parsed : [];
        } catch {
          parsedFavorites = [];
        }
      }
      setFavorites(parsedFavorites);
      
      // Parse playlists with error handling
      let parsedPlaylists: Playlist[] = [];
      if (savedPlaylists) {
        try {
          const parsed = JSON.parse(savedPlaylists);
          parsedPlaylists = Array.isArray(parsed) ? parsed : [];
        } catch {
          parsedPlaylists = [];
        }
      }
      setPlaylists(parsedPlaylists);
      
      // Parse playback state with error handling
      if (savedPlaybackState) {
        try {
          const state = JSON.parse(savedPlaybackState);
          setPlaybackState(prev => ({ ...prev, ...state }));
        } catch (error) {
          console.error('Error parsing playback state:', error);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
      setFavorites([]);
      setPlaylists([]);
    }
  };

  const savePlaylists = async (playlists: Playlist[]) => {
    setPlaylists(playlists);
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
  };

  
  const savePlaybackState = async (state: Partial<PlaybackState>) => {
    try {
      await AsyncStorage.setItem('playbackState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving playback state:', error);
    }
  };

  const playSong = async (song: Song, queue: Song[] = songs) => {
    try {
      if (sound) await sound.unloadAsync();
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: song.url }, { shouldPlay: true });
      setSound(newSound);
      const currentIndex = queue.findIndex(s => s.id === song.id);
      const newState = { isPlaying: true, currentSong: song, queue, currentIndex, position: 0 };
      setPlaybackState(prev => ({ ...prev, ...newState }));
      await savePlaybackState(newState);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          if (playbackState.repeat === 'one') {
            playSong(playbackState.currentSong!, playbackState.queue);
          } else {
            skipToNext();
          }
        }
      });
      
      
    } catch (error) {
      console.error('Error playing song:', error);
    }
  };

  const pausePlayback = async () => { if (sound) { await sound.pauseAsync(); setPlaybackState(prev => ({ ...prev, isPlaying: false })); } };
  const resumePlayback = async () => { if (sound) { await sound.playAsync(); setPlaybackState(prev => ({ ...prev, isPlaying: true })); } };
  const skipToNext = async () => {
    const { queue, currentIndex, shuffle, repeat } = playbackState;
    let nextIndex = shuffle ? Math.floor(Math.random() * queue.length) : currentIndex + 1;
    if (nextIndex >= queue.length && repeat === 'all') nextIndex = 0;
    if (queue[nextIndex]) await playSong(queue[nextIndex], queue);
  };
  const skipToPrevious = async () => {
    const { queue, currentIndex } = playbackState;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    if (queue[prevIndex]) await playSong(queue[prevIndex], queue);
  };
  const seekTo = async (position: number) => { if (sound) { await sound.setPositionAsync(position); setPlaybackState(prev => ({ ...prev, position })); } };
  const toggleShuffle = () => setPlaybackState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  const toggleRepeat = () => setPlaybackState(prev => ({ ...prev, repeat: prev.repeat === 'off' ? 'all' : prev.repeat === 'all' ? 'one' : 'off' }));

  const toggleFavorite = async (songId: string) => {
    const song = songs.find(s => s.id === songId);
    if (!song) return;
    const isFavorite = favorites.some(f => f.id === songId);
    const newFavorites = isFavorite ? favorites.filter(f => f.id !== songId) : [...favorites, song];
    setFavorites(newFavorites);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const setSortBy = (newSortBy: SortOption, direction: SortDirection) => {
    setSortByState(newSortBy);
    setSortDirection(direction);
  };

  const createPlaylist = async (name: string) => {
    const newPlaylist: Playlist = { 
      id: Date.now().toString(), 
      name, 
      songs: [], 
      createdAt: new Date().toISOString() 
    };
    const newPlaylists = [...playlists, newPlaylist];
    setPlaylists(newPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists));
    return newPlaylist.id;
  };

  const addToPlaylist = async (playlistId: string, song: Song) => {
    const newPlaylists = playlists.map(playlist =>
      playlist.id === playlistId && !playlist.songs.some(s => s.id === song.id)
        ? { ...playlist, songs: [...playlist.songs, song] }
        : playlist
    );
    setPlaylists(newPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const removeFromPlaylist = async (playlistId: string, songId: string) => {
    const newPlaylists = playlists.map(playlist =>
      playlist.id === playlistId ? { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) } : playlist
    );
    setPlaylists(newPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const deletePlaylist = async (playlistId: string) => {
    const newPlaylists = playlists.filter(p => p.id !== playlistId);
    setPlaylists(newPlaylists);
    await AsyncStorage.setItem('playlists', JSON.stringify(newPlaylists));
  };

  const clearQueue = () => setPlaybackState(prev => ({ ...prev, queue: [], currentIndex: 0 }));

  const filteredSongs = React.useMemo(() => {
    let filtered: Song[] = [];
    if (filterType === 'queue') {
      // Show only songs in the current queue after the current song (playing next)
      const { queue, currentIndex } = playbackState;
      filtered = queue.slice(currentIndex + 1);
    } else {
      filtered = (songs ?? []).filter(song => {
        const matchesSearch = !searchQuery ||
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterType === 'all' || song.fileType === filterType;
        return matchesSearch && matchesFilter;
      });
      filtered.sort((a, b) => {
        let aValue: any = a[sortBy];
        let bValue: any = b[sortBy];
        if (sortBy === 'dateAdded') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        return sortDirection === 'asc' ? (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) : (aValue > bValue ? -1 : aValue < bValue ? 1 : 0);
      });
    }
    return filtered;
  }, [songs, searchQuery, sortBy, sortDirection, filterType, playbackState]);

  return <MusicContext.Provider value={{ songs, playlists, favorites, playbackState, sound, searchQuery, sortBy, sortDirection, filterType, filteredSongs, playSong, pausePlayback, resumePlayback, skipToNext, skipToPrevious, seekTo, toggleShuffle, toggleRepeat, toggleFavorite, setSearchQuery, setSortBy, setFilterType, createPlaylist, addToPlaylist, removeFromPlaylist, deletePlaylist, clearQueue }}>{children}</MusicContext.Provider>;
};