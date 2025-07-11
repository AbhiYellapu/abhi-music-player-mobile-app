import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { SongItem } from '@/components/SongItem';
import { SearchBar } from '@/components/SearchBar';
import { FilterPanel } from '@/components/FilterPanel';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Song } from '@/types/music';
import { LinearGradient } from 'expo-linear-gradient';

export default function LibraryScreen() {
  const {
    filteredSongs,
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    filterType,
    setSortBy,
    setFilterType,
    playSong,
  } = useMusicContext();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0a0a0a',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      marginHorizontal: 20,
      opacity: 0.3,
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
  });

  const renderSongItem = ({ item }: { item: Song }) => (
    <SongItem
      song={item}
      onPlay={() => playSong(item, filteredSongs)}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No songs found</Text>
      <Text style={styles.emptySubtext}>
        Try adjusting your search or filter settings
      </Text>
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
        {/* FilterPanel at the top */}
        <FilterPanel
          sortBy={sortBy}
          sortDirection={sortDirection}
          filterType={filterType}
          onSortChange={setSortBy}
          onFilterChange={setFilterType}
        />
        {/* Song list fills the rest */}
        <FlatList
          style={{ flex: 1 }}
          data={filteredSongs}
          keyExtractor={(item) => item.id}
          renderItem={renderSongItem}
          ItemSeparatorComponent={() => <View style={styles.divider} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160, paddingTop: 20 }}
          ListEmptyComponent={EmptyState}
        />
      </View>
    </View>
  );
}