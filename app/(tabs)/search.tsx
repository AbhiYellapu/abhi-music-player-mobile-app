import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { SongItem } from '@/components/SongItem';
import { SearchBar } from '@/components/SearchBar';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Song } from '@/types/music';

export default function SearchScreen() {
  const { songs, playSong } = useMusicContext();
  const { colors } = useTheme();
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const searchResults = songs.filter(song => {
    if (!localSearchQuery) return false;
    
    const query = localSearchQuery.toLowerCase();
    return (
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query) ||
      song.album.toLowerCase().includes(query)
    );
  });

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
      marginBottom: 20,
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
    resultsHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    resultsText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
  });

  const renderSongItem = ({ item }: { item: Song }) => (
    <SongItem
      song={item}
      onPlay={() => playSong(item, searchResults)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      {localSearchQuery ? (
        <>
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try searching for a different song, artist, or album
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyText}>Search your music</Text>
          <Text style={styles.emptySubtext}>
            Find songs by title, artist, or album name
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <SearchBar
        value={localSearchQuery}
        onChangeText={setLocalSearchQuery}
        placeholder="What do you want to listen to?"
      />

      {searchResults.length > 0 && localSearchQuery && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsText}>
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{localSearchQuery}"
          </Text>
        </View>
      )}

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
}