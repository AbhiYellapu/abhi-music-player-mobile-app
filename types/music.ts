export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  size: number;
  fileType: string;
  dateAdded: string;
  artwork?: string;
  url: string;
  isFavorite?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  createdAt: string;
  artwork?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentSong: Song | null;
  position: number;
  duration: number;
  queue: Song[];
  currentIndex: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}

export type SortOption = 'title' | 'artist' | 'album' | 'duration' | 'size' | 'dateAdded';
export type SortDirection = 'asc' | 'desc';
export type FilterType = 'mp3' | 'wav' | 'aac' | 'all' | 'queue';