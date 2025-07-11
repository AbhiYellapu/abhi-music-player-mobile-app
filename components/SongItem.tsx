import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, ScrollView, Alert, TextInput, Animated } from 'react-native';
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
  const [showActions, setShowActions] = React.useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
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

  const handleCreateAndAddToPlaylist = async () => {
    if (newPlaylistName.trim()) {
      const playlistId = await createPlaylist(newPlaylistName.trim());
      addToPlaylist(playlistId, song);
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
      setShowPlaylistModal(false);
      Alert.alert('Success', `Created playlist "${newPlaylistName}" and added "${song.title}"`);
    }
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const styles = StyleSheet.create({
    animatedContainer: {
      marginHorizontal: 16,
      marginVertical: 4,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      paddingHorizontal: 12,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      minHeight: 72,
    },
    containerPlaying: {
      backgroundColor: 'rgba(30, 215, 96, 0.15)',
      borderColor: 'rgba(30, 215, 96, 0.3)',
    },
    indexContainer: {
      width: 28,
      alignItems: 'center',
      marginRight: 8,
      justifyContent: 'center',
    },
    indexText: {
      color: 'rgba(255, 255, 255, 0.6)',
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
    indexTextPlaying: {
      color: '#1ed760',
    },
    emptyIndex: {
      width: 28,
      height: 28,
    },
    artwork: {
      width: 44,
      height: 44,
      borderRadius: 10,
      marginRight: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    playIconContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.4)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    artworkShadowWrap: {
      marginRight: 0,
      backgroundColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      borderRadius: 12,
    },
    content: {
      flex: 1,
      marginRight: 6,
    },
    title: {
      fontSize: 15,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      marginBottom: 3,
      letterSpacing: -0.2,
    },
    titlePlaying: {
      color: '#1ed760',
    },
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    detailText: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.6)',
      fontFamily: 'Inter-Medium',
    },
    detailTextPlaying: {
      color: 'rgba(30, 215, 96, 0.8)',
    },
    separator: {
      color: 'rgba(255, 255, 255, 0.3)',
      marginHorizontal: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionButton: {
      padding: 6,
      borderRadius: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
      <Animated.View style={[styles.animatedContainer, { transform: [{ scale: scaleAnim }] }]}> 
        <TouchableOpacity
          style={[styles.container, isCurrentSong && styles.containerPlaying]}
          onPress={onPlay}
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={styles.indexContainer}>
            {showIndex && index !== undefined ? (
              <Text style={[styles.indexText, isCurrentSong && styles.indexTextPlaying]}>
                {index + 1}
              </Text>
            ) : (
              <View style={styles.emptyIndex} />
            )}
          </View>
          <View style={styles.artworkShadowWrap}>
            <Image source={{ uri: song.artwork }} style={styles.artwork} />
            {isPlaying && (
              <View style={styles.playIconContainer}>
                <Play size={20} color="#1ed760" fill="#1ed760" />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <Text style={[styles.title, isCurrentSong && styles.titlePlaying]} numberOfLines={1}>
              {song.title}
            </Text>
            <View style={styles.details}>
              <Text style={[styles.detailText, isCurrentSong && styles.detailTextPlaying]} numberOfLines={1}>
                {song.artist}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={[styles.detailText, isCurrentSong && styles.detailTextPlaying]} numberOfLines={1}>
                {song.album}
              </Text>
              <Text style={styles.separator}>•</Text>
              <Text style={[styles.detailText, isCurrentSong && styles.detailTextPlaying]}>
                {formatDuration(song.duration)}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            {/* Removed favorite icon button for more space */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowActions(true)}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={20} color={'rgba(255, 255, 255, 0.6)'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
      {/* Three-dot menu modal for actions */}
      <Modal
        visible={showActions}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActions(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#222', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 20 }}>
            <TouchableOpacity
              style={{ paddingVertical: 16 }}
              onPress={() => {
                setShowPlaylistModal(true);
                setShowActions(false);
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 16 }}
              onPress={() => {
                toggleFavorite(song.id);
                setShowActions(false);
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16 }}>{isFavorite ? 'Remove from Favorites' : 'Mark as Favorite'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ paddingVertical: 16 }}
              onPress={() => setShowActions(false)}
            >
              <Text style={{ color: '#b3b3b3', fontSize: 16, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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