import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Heart, ChevronDown, MoveHorizontal as MoreHorizontal, List } from 'lucide-react-native';
import { router } from 'expo-router';
import Slider from '@react-native-community/slider';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { QueueManager } from '@/components/QueueManager';

const { width: screenWidth } = Dimensions.get('window');

export default function PlayerScreen() {
  const {
    playbackState,
    pausePlayback,
    resumePlayback,
    skipToNext,
    skipToPrevious,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    favorites,
    toggleFavorite,
  } = useMusicContext();
  const { colors } = useTheme();
  const [showQueue, setShowQueue] = React.useState(false);

  const { currentSong, isPlaying, position, duration, shuffle, repeat } = playbackState;

  if (!currentSong) {
    router.back();
    return null;
  }

  const isFavorite = favorites.some(f => f.id === currentSong.id);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getRepeatIcon = () => {
    switch (repeat) {
      case 'one':
        return { icon: Repeat, text: '1' };
      case 'all':
        return { icon: Repeat, text: null };
      default:
        return { icon: Repeat, text: null };
    }
  };

  const RepeatIconComponent = getRepeatIcon().icon;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    headerButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    artworkContainer: {
      alignItems: 'center',
      paddingHorizontal: 40,
      marginBottom: 40,
    },
    artwork: {
      width: screenWidth - 80,
      height: screenWidth - 80,
      borderRadius: 20,
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    songInfo: {
      alignItems: 'center',
      paddingHorizontal: 40,
      marginBottom: 40,
    },
    songTitle: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    songArtist: {
      fontSize: 18,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      textAlign: 'center',
    },
    progressContainer: {
      paddingHorizontal: 40,
      marginBottom: 40,
    },
    progressBar: {
      height: 4,
      marginBottom: 12,
    },
    progressLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    progressLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    controlsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      marginBottom: 20,
    },
    controlButton: {
      padding: 12,
      marginHorizontal: 12,
    },
    playButton: {
      backgroundColor: colors.primary,
      borderRadius: 40,
      padding: 20,
      marginHorizontal: 20,
    },
    secondaryControls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 60,
    },
    secondaryButton: {
      padding: 12,
    },
    repeatButtonContainer: {
      position: 'relative',
    },
    repeatBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 8,
      minWidth: 16,
      height: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    repeatBadgeText: {
      fontSize: 10,
      fontFamily: 'Inter-Bold',
      color: colors.background,
    },
  });

  return (
    <>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ChevronDown size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity 
            style={styles.headerButton} 
            onPress={() => setShowQueue(true)}
            activeOpacity={0.7}
          >
            <List size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          <Image source={{ uri: currentSong.artwork }} style={styles.artwork} />
        </View>

        <View style={styles.songInfo}>
          <Text style={styles.songTitle} numberOfLines={2}>
            {currentSong.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {currentSong.artist}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <Slider
            style={styles.progressBar}
            value={position}
            minimumValue={0}
            maximumValue={duration}
            onValueChange={seekTo}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbStyle={{ backgroundColor: colors.primary }}
          />
          <View style={styles.progressLabels}>
            <Text style={styles.progressLabel}>{formatTime(position)}</Text>
            <Text style={styles.progressLabel}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToPrevious}
            activeOpacity={0.7}
          >
            <SkipBack size={32} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.playButton}
            onPress={isPlaying ? pausePlayback : resumePlayback}
            activeOpacity={0.8}
          >
            {isPlaying ? (
              <Pause size={32} color={colors.background} />
            ) : (
              <Play size={32} color={colors.background} fill={colors.background} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={skipToNext}
            activeOpacity={0.7}
          >
            <SkipForward size={32} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryControls}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={toggleShuffle}
            activeOpacity={0.7}
          >
            <Shuffle 
              size={20} 
              color={shuffle ? colors.primary : colors.textMuted} 
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => toggleFavorite(currentSong.id)}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={isFavorite ? colors.error : colors.textMuted}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, styles.repeatButtonContainer]}
            onPress={toggleRepeat}
            activeOpacity={0.7}
          >
            <RepeatIconComponent 
              size={20} 
              color={repeat !== 'off' ? colors.primary : colors.textMuted} 
            />
            {repeat === 'one' && (
              <View style={styles.repeatBadge}>
                <Text style={styles.repeatBadgeText}>1</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      
      <QueueManager 
        visible={showQueue} 
        onClose={() => setShowQueue(false)} 
      />
    </>
  );
}