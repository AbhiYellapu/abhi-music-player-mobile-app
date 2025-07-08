import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, SkipForward, Heart, List } from 'lucide-react-native';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { QueueManager } from './QueueManager';

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
      backgroundColor: colors.surfaceElevated,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    artwork: {
      width: 48,
      height: 48,
      borderRadius: 6,
      marginRight: 12,
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
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
      <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
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
      </TouchableOpacity>
      
      <QueueManager 
        visible={showQueue} 
        onClose={() => setShowQueue(false)} 
      />
    </>
  );
};