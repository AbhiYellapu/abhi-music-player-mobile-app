import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Music, Search, Heart, List, Settings } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { MiniPlayer } from '@/components/MiniPlayer';
import { router } from 'expo-router';
import LibraryScreen from './index';
import SearchScreen from './search';
import FavoritesScreen from './favorites';
import PlaylistsScreen from './playlists';
import SettingsScreen from './settings';

type TabType = 'library' | 'search' | 'favorites' | 'playlists' | 'settings';

export default function TabLayout() {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('library');

  const tabs = [
    { id: 'library' as TabType, title: 'Library', icon: Music },
    { id: 'search' as TabType, title: 'Search', icon: Search },
    { id: 'favorites' as TabType, title: 'Favorites', icon: Heart },
    { id: 'playlists' as TabType, title: 'Playlists', icon: List },
    { id: 'settings' as TabType, title: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'library':
        return <LibraryScreen />;
      case 'search':
        return <SearchScreen />;
      case 'favorites':
        return <FavoritesScreen />;
      case 'playlists':
        return <PlaylistsScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <LibraryScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Content Area */}
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
      
      {/* Bottom Mini Player */}
      <MiniPlayer onPress={() => router.push('/player')} />
      
      {/* Bottom Navigation Tabs */}
      <SafeAreaView style={styles.bottomTabsContainer}>
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isActive && styles.tabButtonActive
                ]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.8}
              >
                <IconComponent 
                  size={24} 
                  color={isActive ? colors.primary : 'rgba(255, 255, 255, 0.6)'} 
                />
                <Text style={[
                  styles.tabLabel,
                  { color: isActive ? colors.primary : 'rgba(255, 255, 255, 0.6)' }
                ]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 15,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: 'rgba(30, 215, 96, 0.15)',
  },
  tabLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginTop: 4,
    letterSpacing: 0.2,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});