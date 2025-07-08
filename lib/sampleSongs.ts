import * as MediaLibrary from 'expo-media-library';
import { Song } from '@/types/music';

export const loadDeviceSongs = async (): Promise<Song[]> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Permission to access media library denied');
    return [];
  }

  const media = await MediaLibrary.getAssetsAsync({
    mediaType: ['audio'],
    first: 1000,
    sortBy: MediaLibrary.SortBy.creationTime,
  });

  const songAssets = media.assets.filter(asset =>
    asset.filename.toLowerCase().endsWith('.mp3') ||
    asset.filename.toLowerCase().endsWith('.wav') ||
    asset.filename.toLowerCase().endsWith('.aac')
  );

  const songs: Song[] = songAssets.map(asset => ({
    id: asset.id,
    title: asset.filename,
    artist: 'Unknown',
    album: 'Local Storage',
    duration: asset.duration || 0,
    size: asset.duration * 160000 || 0, // rough size approximation
    fileType: asset.filename.split('.').pop() || 'mp3',
    dateAdded: new Date(asset.creationTime || Date.now()).toISOString(),
    artwork: '',
    url: asset.uri,
  }));

  return songs;
};
