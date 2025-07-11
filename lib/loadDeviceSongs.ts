import MusicFiles from 'react-native-get-music-files';

export const loadDeviceSongsWithArtwork = async () => {
  const songs = await MusicFiles.getAll({
    blured: false,
    artist: true,
    duration: true,
    cover: true, // This gets the artwork
    genre: true,
    title: true,
    minimumSongDuration: 10000,
    fields: ['title', 'album', 'genre', 'lyrics', 'artwork', 'duration'] // artwork is the key
  });

  // Each song.artwork is a file URI to the image
  return songs.map(song => ({
    id: song.id,
    title: song.title,
    artist: song.author,
    album: song.album,
    duration: song.duration,
    artwork: song.cover, // This is a file URI
    url: song.path,
    // ...other fields
  }));
}; 