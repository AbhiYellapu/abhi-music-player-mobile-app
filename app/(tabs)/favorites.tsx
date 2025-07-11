import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { SongItem } from '@/components/SongItem';
import { useMusicContext } from '@/contexts/MusicContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Song } from '@/types/music';
import { LinearGradient } from 'expo-linear-gradient';

export default function FavoritesScreen() {
  const { favorites, playSong } = useMusicContext();
  const { colors } = useTheme();

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
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: 'rgba(255, 255, 255, 0.7)',
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

  const renderSongItem = ({ item, index }: { item: Song; index: number }) => (
    <SongItem
      song={item}
      onPlay={() => playSong(item, favorites)}
      showIndex
      index={index}
    />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No favorite songs yet</Text>
      <Text style={styles.emptySubtext}>
        Tap the heart icon on any song to add it to your favorites
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
        <View style={styles.header}>
          <Text style={styles.title}>Favorites</Text>
          <Text style={styles.subtitle}>
            {favorites.length} song{favorites.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <FlatList
          data={favorites}
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