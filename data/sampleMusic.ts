import * as MediaLibrary from 'expo-media-library';
import { Song } from '@/types/music';

export const loadDeviceSongs = async (): Promise<Song[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Media library permissions not granted.');
    return [];
  }

  const media = await MediaLibrary.getAssetsAsync({
    mediaType: 'audio',
    first: 1000,
    sortBy: [[MediaLibrary.SortBy.creationTime, false]],
  });

  const songs: Song[] = media.assets.map((asset, index) => ({
    id: asset.id || `${index + 1}`,
    title: asset.filename.replace(/\.[^/.]+$/, ''), // remove extension
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    duration: Math.floor(asset.duration ?? 0),
    size: asset.duration ? Math.floor(asset.duration * 16000) : 0, // estimated size
    fileType: asset.filename.split('.').pop() ?? 'mp3',
    dateAdded: new Date(asset.modificationTime ?? Date.now()).toISOString().split('T')[0],
    artwork: 'https://via.placeholder.com/300x300.png?text=No+Artwork',
    url: asset.uri,
  }));

  return songs;
};
