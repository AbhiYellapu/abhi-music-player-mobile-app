import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { X, Music, Play, Trash2 } from 'lucide-react-native';
import { Song } from '@/types/music';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';

interface QueueManagerProps {
  visible: boolean;
  onClose: () => void;
}

export const QueueManager: React.FC<QueueManagerProps> = ({ visible, onClose }) => {
  const { playbackState, playSong, clearQueue } = useMusicContext();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
    },
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
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    clearButton: {
      padding: 8,
    },
    queueInfo: {
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
    },
    queueText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    songItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    currentSongItem: {
      backgroundColor: colors.surfaceElevated,
    },
    songIndex: {
      width: 32,
      alignItems: 'center',
      marginRight: 12,
    },
    indexText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textMuted,
    },
    currentIndexText: {
      color: colors.primary,
      fontFamily: 'Inter-Bold',
    },
    songInfo: {
      flex: 1,
    },
    songTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    currentSongTitle: {
      color: colors.primary,
    },
    songArtist: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    playIcon: {
      marginLeft: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 18,
      fontFamily: 'Inter-Medium',
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textMuted,
      textAlign: 'center',
    },
  });

  const { queue, currentIndex } = playbackState;

  const handleSongPress = (song: Song, index: number) => {
    playSong(song, queue);
    onClose();
  };

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => {
    const isCurrentSong = index === currentIndex;
    
    return (
      <TouchableOpacity
        style={[styles.songItem, isCurrentSong && styles.currentSongItem]}
        onPress={() => handleSongPress(item, index)}
        activeOpacity={0.7}
      >
        <View style={styles.songIndex}>
          <Text style={[styles.indexText, isCurrentSong && styles.currentIndexText]}>
            {index + 1}
          </Text>
        </View>
        
        <View style={styles.songInfo}>
          <Text 
            style={[styles.songTitle, isCurrentSong && styles.currentSongTitle]} 
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={styles.songArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>

        {isCurrentSong && (
          <View style={styles.playIcon}>
            <Play size={16} color={colors.primary} fill={colors.primary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const EmptyQueue = () => (
    <View style={styles.emptyContainer}>
      <Music size={48} color={colors.textMuted} />
      <Text style={styles.emptyText}>No songs in queue</Text>
      <Text style={styles.emptySubtext}>
        Start playing music to see your queue here
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Queue</Text>
          
          {queue.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton} 
              onPress={clearQueue} 
              activeOpacity={0.7}
            >
              <Trash2 size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {queue.length > 0 && (
          <View style={styles.queueInfo}>
            <Text style={styles.queueText}>
              {queue.length} song{queue.length !== 1 ? 's' : ''} in queue
            </Text>
          </View>
        )}

        <FlatList
          data={queue}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderSongItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyQueue}
        />
      </SafeAreaView>
    </Modal>
  );
};