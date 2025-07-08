import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Alert, TextInput } from 'react-native';
import { Heart, MoveHorizontal as MoreHorizontal, Play, Plus, Music } from 'lucide-react-native';
import { Song } from '@/types/music';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';

interface SongItemProps {
  song: Song;
  onPlay: () => void;
  onMore?: () => void;
  showIndex?: boolean;
  index?: number;
}

export const SongItem: React.FC<SongItemProps> = ({ 
  song, 
  onPlay, 
  onMore, 
  showIndex = false, 
  index 
}) => {
  const { favorites, toggleFavorite, playbackState, playlists, addToPlaylist, createPlaylist } = useMusicContext();
  const { colors } = useTheme();
  const [showPlaylistModal, setShowPlaylistModal] = React.useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = React.useState(false);
  const [newPlaylistName, setNewPlaylistName] = React.useState('');
  
  const isFavorite = favorites.some(f => f.id === song.id);
  const isCurrentSong = playbackState.currentSong?.id === song.id;
  const isPlaying = isCurrentSong && playbackState.isPlaying;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    const mb = (bytes / (1024 * 1024)).toFixed(1);
    return `${mb} MB`;
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, song);
    setShowPlaylistModal(false);
    Alert.alert('Success', `Added "${song.title}" to playlist`);
  };

  const handleCreateAndAddToPlaylist = () => {
    if (newPlaylistName.trim()) {
      const playlistId = createPlaylist(newPlaylistName.trim());
      addToPlaylist(playlistId, song);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      setShowPlaylistModal(false);
      Alert.alert('Success', `Created playlist "${newPlaylistName}" and added "${song.title}"`);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: isCurrentSong ? colors.surfaceElevated : 'transparent',
      borderRadius: 8,
      marginHorizontal: 16,
      marginVertical: 2,
    },
    indexContainer: {
      width: 32,
      alignItems: 'center',
      marginRight: 12,
    },
    indexText: {
      color: colors.textMuted,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
    },
    artwork: {
      width: 48,
      height: 48,
      borderRadius: 6,
      marginRight: 12,
    },
    playIconContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.overlay,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: isCurrentSong ? colors.primary : colors.text,
      marginBottom: 4,
    },
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    detailText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontFamily: 'Inter-Regular',
    },
    separator: {
      color: colors.textMuted,
      marginHorizontal: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    actionButton: {
      padding: 8,
      marginLeft: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: 20,
      width: '85%',
      maxWidth: 400,
      maxHeight: '70%',
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
      backgroundColor: colors.surface,
    },
    playlistIcon: {
      width: 40,
      height: 40,
      backgroundColor: colors.accent,
      borderRadius: 6,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    playlistInfo: {
      flex: 1,
    },
    playlistName: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    playlistCount: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    createPlaylistButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.primary,
      marginBottom: 16,
    },
    createPlaylistText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.background,
      marginLeft: 8,
    },
    closeButton: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      backgroundColor: colors.surface,
      alignItems: 'center',
      marginTop: 16,
    },
    closeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    modalInput: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      fontFamily: 'Inter-Regular',
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginHorizontal: 8,
    },
    cancelButton: {
      backgroundColor: colors.surface,
    },
    createButton: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
    cancelButtonText: {
      color: colors.text,
    },
    createButtonText: {
      color: colors.background,
    },
  });

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={onPlay} activeOpacity={0.7}>
        {showIndex && (
          <View style={styles.indexContainer}>
            <Text style={styles.indexText}>{index! + 1}</Text>
          </View>
        )}
        
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: song.artwork }} style={styles.artwork} />
          {isPlaying && (
            <View style={styles.playIconContainer}>
              <Play size={20} color={colors.primary} fill={colors.primary} />
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {song.title}
          </Text>
          <View style={styles.details}>
            <Text style={styles.detailText} numberOfLines={1}>
              {song.artist}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {song.album}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detailText}>
              {formatDuration(song.duration)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detailText}>
              {formatFileSize(song.size)}
            </Text>
            <Text style={styles.separator}>•</Text>
            <Text style={styles.detailText}>
              {song.fileType.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavorite(song.id)}
            activeOpacity={0.7}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.error : colors.textMuted}
              fill={isFavorite ? colors.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowPlaylistModal(true)}
            activeOpacity={0.7}
          >
            <Plus size={20} color={colors.textMuted} />
          </TouchableOpacity>
          {onMore && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onMore}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={showPlaylistModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlaylistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add to Playlist</Text>
            
            <TouchableOpacity
              style={styles.createPlaylistButton}
              onPress={() => setShowCreatePlaylist(true)}
              activeOpacity={0.8}
            >
              <Plus size={20} color={colors.background} />
              <Text style={styles.createPlaylistText}>Create New Playlist</Text>
            </TouchableOpacity>

            <ScrollView showsVerticalScrollIndicator={false}>
              {playlists.map((playlist) => (
                <TouchableOpacity
                  key={playlist.id}
                  style={styles.playlistItem}
                  onPress={() => handleAddToPlaylist(playlist.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.playlistIcon}>
                    <Music size={20} color={colors.background} />
                  </View>
                  <View style={styles.playlistInfo}>
                    <Text style={styles.playlistName}>{playlist.name}</Text>
                    <Text style={styles.playlistCount}>
                      {playlist.songs.length} song{playlist.songs.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPlaylistModal(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.closeButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showCreatePlaylist}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreatePlaylist(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Playlist</Text>
            <TextInput
              style={styles.modalInput}
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              placeholder="Enter playlist name"
              placeholderTextColor={colors.textMuted}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCreatePlaylist(false);
                  setNewPlaylistName('');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={handleCreateAndAddToPlaylist}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, styles.createButtonText]}>
                  Create & Add
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};