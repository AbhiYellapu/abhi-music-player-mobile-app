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
  const { colors } = useTheme();
  const [showQueue, setShowQueue] = React.useState(false);

  if (!playbackState.currentSong) return null;

  const { currentSong, isPlaying } = playbackState;
  const isFavorite = favorites.some(f => f.id === currentSong.id);

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderTopWidth: 0,
      borderRadius: 18,
      marginHorizontal: 16,
      marginBottom: 12,
      shadowColor: colors.text,
      shadowOpacity: 0.10,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 2 },
      elevation: 8,
      minHeight: 64,
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      borderRadius: 18,
      zIndex: -1,
    },
    artwork: {
      width: 48,
      height: 48,
      borderRadius: 10,
      marginRight: 12,
      shadowColor: colors.primary,
      shadowOpacity: 0.18,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 2 },
      elevation: 6,
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 2,
    },
    artist: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    controlButton: {
      padding: 8,
      marginHorizontal: 4,
    },
  });

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={['#23244d', colors.surfaceElevated, '#181a2a']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {currentSong.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setShowQueue(true)}
            activeOpacity={0.7}
          >
            <List size={18} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => toggleFavorite(currentSong.id)}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.error : colors.textMuted}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={isPlaying ? pausePlayback : resumePlayback}
            activeOpacity={0.7}
          >
            {isPlaying ? (
              <Pause size={24} color={colors.text} />
            ) : (
              <Play size={24} color={colors.text} fill={colors.text} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <SkipForward size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
      </View>
      <QueueManager 
        visible={showQueue} 
        onClose={() => setShowQueue(false)} 
      />
    </>
  );
};