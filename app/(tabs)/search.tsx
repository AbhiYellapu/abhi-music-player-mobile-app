import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { SongItem } from '@/components/SongItem';
import { SearchBar } from '@/components/SearchBar';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Song } from '@/types/music';
import { LinearGradient } from 'expo-linear-gradient';

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
      backgroundColor: '#0a0a0a',
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 16,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      marginBottom: 20,
      letterSpacing: -0.5,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    emptyText: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: 'rgba(255, 255, 255, 0.8)',
      textAlign: 'center',
      marginBottom: 12,
    },
    emptySubtext: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.6)',
      textAlign: 'center',
      lineHeight: 24,
    },
    resultsHeader: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    resultsText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={{ flex: 1 }}>
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
          contentContainerStyle={{ paddingBottom: 160, paddingTop: 20 }}
          ListEmptyComponent={EmptyState}
        />
      </View>
    </View>
  );
}