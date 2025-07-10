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
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 32,
      paddingHorizontal: 20,
      paddingBottom: 8,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 32,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 2,
      letterSpacing: -1,
    },
    subtitle: {
      fontSize: 15,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginBottom: 12,
      letterSpacing: 0.2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginHorizontal: 20,
      opacity: 0.12,
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
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={[colors.background, '#1e215d', '#181a2a']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <Text style={styles.subtitle}>
          {filteredSongs.length} song{filteredSongs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search your music library..."
      />

      <FilterPanel
        sortBy={sortBy}
        sortDirection={sortDirection}
        filterType={filterType}
        onSortChange={setSortBy}
        onFilterChange={setFilterType}
      />

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        renderItem={renderSongItem}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={EmptyState}
      />
    </SafeAreaView>
  );
}