import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipForward, Heart, List } from 'lucide-react-native';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { QueueManager } from './QueueManager';
import { LinearGradient } from 'expo-linear-gradient';

interface MiniPlayerProps {
  onPress: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({ onPress }) => {
  const { playbackState, pausePlayback, resumePlayback, skipToNext, favorites, toggleFavorite } = useMusicContext();
  const { colors, isDark } = useTheme();
  const [showQueue, setShowQueue] = React.useState(false);

  if (!playbackState.currentSong) return null;

  const { currentSong, isPlaying } = playbackState;
  const isFavorite = favorites.some(f => f.id === currentSong.id);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 0,
      marginHorizontal: 0,
      marginBottom: 0,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: -4 },
      elevation: 12,
      minHeight: 68,
    },
    artwork: {
      width: 52,
      height: 52,
      borderRadius: 12,
      marginRight: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    content: {
      flex: 1,
      marginRight: 16,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      marginBottom: 4,
      letterSpacing: -0.2,
    },
    artist: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    controlButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    playButton: {
      backgroundColor: '#1ed760',
      borderRadius: 24,
      padding: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <>
      <TouchableOpacity style={styles.container} activeOpacity={0.85} onPress={onPress}>
        <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <View style={styles.controls} pointerEvents="box-none">
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => { e.stopPropagation(); setShowQueue(true); }}
            activeOpacity={0.7}
          >
            <List size={20} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => { e.stopPropagation(); toggleFavorite(currentSong.id); }}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? '#1ed760' : 'rgba(255, 255, 255, 0.7)'}
              fill={isFavorite ? '#1ed760' : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={(e) => { e.stopPropagation(); isPlaying ? pausePlayback() : resumePlayback(); }}
            activeOpacity={0.7}
          >
            {isPlaying ? (
              <Pause size={24} color="#000" />
            ) : (
              <Play size={24} color="#000" fill="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={(e) => { e.stopPropagation(); skipToNext(); }}
            activeOpacity={0.7}
          >
            <SkipForward size={20} color="rgba(255, 255, 255, 0.7)" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      <QueueManager 
        visible={showQueue} 
        onClose={() => setShowQueue(false)} 
      />
    </>
  );
};