import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import { Plus, Music, MoveHorizontal as MoreHorizontal, Trash2, CreditCard as Edit3 } from 'lucide-react-native';
import { SongItem } from '@/components/SongItem';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Playlist, Song } from '@/types/music';

export default function PlaylistsScreen() {
  const { playlists, createPlaylist, deletePlaylist, playSong, removeFromPlaylist } = useMusicContext();
  const { colors } = useTheme();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    createButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 20,
    },
    createButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.background,
      marginLeft: 8,
    },
    playlistItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      borderRadius: 12,
    },
    playlistIcon: {
      width: 48,
      height: 48,
      backgroundColor: colors.accent,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    playlistInfo: {
      flex: 1,
    },
    playlistName: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 4,
    },
    playlistCount: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    playlistActions: {
      padding: 8,
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
      width: '80%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 20,
      textAlign: 'center',
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
    createButtonModal: {
      backgroundColor: colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
    },
    cancelButtonText: {
      color: colors.text,
    },
    createButtonModalText: {
      color: colors.background,
    },
    playlistDetailHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      marginBottom: 20,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    playlistDetailTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      flex: 1,
    },
    playlistDetailActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerActionButton: {
      padding: 8,
      marginLeft: 8,
    },
  });

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setIsCreateModalVisible(false);
    }
  };

  const handlePlaylistOptions = (playlist: Playlist) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete Playlist'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: playlist.name,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            deletePlaylist(playlist.id);
          }
        }
      );
    } else {
      Alert.alert(
        'Playlist Options',
        `What would you like to do with "${playlist.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deletePlaylist(playlist.id),
          },
        ]
      );
    }
  };

  const handleSongOptions = (song: Song, playlistId: string) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Remove from Playlist'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
          title: song.title,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            removeFromPlaylist(playlistId, song.id);
          }
        }
      );
    } else {
      Alert.alert(
        'Song Options',
        `Remove "${song.title}" from this playlist?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => removeFromPlaylist(playlistId, song.id),
          },
        ]
      );
    }
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => setSelectedPlaylist(item)}
      activeOpacity={0.7}
    >
      <View style={styles.playlistIcon}>
        <Music size={24} color={colors.background} />
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistCount}>
          {item.songs.length} song{item.songs.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.playlistActions}
        onPress={() => handlePlaylistOptions(item)}
        activeOpacity={0.7}
      >
        <MoreHorizontal size={20} color={colors.textMuted} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
    <SongItem
      song={item}
      onPlay={() => playSong(item, selectedPlaylist!.songs)}
      onMore={() => handleSongOptions(item, selectedPlaylist!.id)}
      showIndex
      index={index}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No playlists yet</Text>
      <Text style={styles.emptySubtext}>
        Create your first playlist to organize your favorite songs
      </Text>
    </View>
  );

  if (selectedPlaylist) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.playlistDetailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedPlaylist(null)}
            activeOpacity={0.7}
          >
            <Text style={{ color: colors.primary, fontSize: 16, fontFamily: 'Inter-Medium' }}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={styles.playlistDetailTitle}>{selectedPlaylist.name}</Text>
          <View style={styles.playlistDetailActions}>
            <TouchableOpacity
              style={styles.headerActionButton}
              onPress={() => handlePlaylistOptions(selectedPlaylist)}
              activeOpacity={0.7}
            >
              <MoreHorizontal size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={selectedPlaylist.songs}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>This playlist is empty</Text>
              <Text style={styles.emptySubtext}>
                Add songs to this playlist from your library
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Playlists</Text>
        <Text style={styles.subtitle}>
          {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Plus size={20} color={colors.background} />
        <Text style={styles.createButtonText}>Create New Playlist</Text>
      </TouchableOpacity>

      <FlatList
        data={playlists}
        keyExtractor={(item) => item.id}
        renderItem={renderPlaylistItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={EmptyState}
      />

      <Modal
        visible={isCreateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreateModalVisible(false)}
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
                  setIsCreateModalVisible(false);
                  setNewPlaylistName('');
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButtonModal]}
                onPress={handleCreatePlaylist}
                activeOpacity={0.7}
              >
                <Text style={[styles.modalButtonText, styles.createButtonModalText]}>
                  Create
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}