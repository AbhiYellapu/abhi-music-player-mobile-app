import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Filter, ChevronDown, Check, ArrowUpDown, Music, Clock, Calendar, User, Disc } from 'lucide-react-native';
import { SortOption, SortDirection, FilterType } from '@/types/music';
import { useTheme } from '@/contexts/ThemeContext';

interface FilterPanelProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  filterType: FilterType;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
  onFilterChange: (filterType: FilterType) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  sortBy,
  sortDirection,
  filterType,
  onSortChange,
  onFilterChange,
}) => {
  const { colors } = useTheme();
  const [showSortOptions, setShowSortOptions] = useState(false);

  const sortOptions: { key: SortOption; label: string; icon: any }[] = [
    { key: 'title', label: 'Title', icon: Music },
    { key: 'artist', label: 'Artist', icon: User },
    { key: 'album', label: 'Album', icon: Disc },
    { key: 'duration', label: 'Duration', icon: Clock },
    { key: 'dateAdded', label: 'Date Added', icon: Calendar },
  ];

  const filterOptions: { key: FilterType; label: string; color: string }[] = [
    { key: 'all', label: 'All', color: '#6366f1' },
    { key: 'mp3', label: 'MP3', color: '#10b981' },
    { key: 'wav', label: 'WAV', color: '#f59e0b' },
    { key: 'aac', label: 'AAC', color: '#ef4444' },
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      letterSpacing: 0.5,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(30, 215, 96, 0.15)',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 25,
      borderWidth: 1,
      borderColor: 'rgba(30, 215, 96, 0.3)',
    },
    sortButtonText: {
      color: '#1ed760',
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      marginRight: 8,
    },
    filterRow: {
      flexDirection: 'row',
      gap: 12,
    },
    filterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    filterChipActive: {
      backgroundColor: 'rgba(30, 215, 96, 0.2)',
      borderColor: '#1ed760',
    },
    filterChipText: {
      color: 'rgba(255, 255, 255, 0.8)',
      fontFamily: 'Inter-Medium',
      fontSize: 13,
    },
    filterChipTextActive: {
      color: '#1ed760',
    },
    sortOptionsContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      borderRadius: 16,
      padding: 16,
      marginTop: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 12,
      marginBottom: 4,
    },
    sortOptionActive: {
      backgroundColor: 'rgba(30, 215, 96, 0.15)',
    },
    sortOptionIcon: {
      marginRight: 12,
    },
    sortOptionText: {
      flex: 1,
      color: '#fff',
      fontFamily: 'Inter-Medium',
      fontSize: 14,
    },
    sortOptionActiveText: {
      color: '#1ed760',
      fontFamily: 'Inter-SemiBold',
    },
    directionButton: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  });

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    return option?.label || 'Title';
  };

  const toggleSortDirection = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newDirection);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Library</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortOptions(!showSortOptions)}
          activeOpacity={0.8}
        >
          <Text style={styles.sortButtonText}>{getCurrentSortLabel()}</Text>
          <ArrowUpDown size={16} color="#1ed760" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {filterOptions.map(option => {
          const isActive = filterType === option.key;
          
          return (
            <TouchableOpacity
              key={option.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => onFilterChange(option.key)}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.filterChipText,
                isActive && styles.filterChipTextActive
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          {sortOptions.map(option => {
            const IconComponent = option.icon;
            const isActive = sortBy === option.key;
            
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.sortOption, isActive && styles.sortOptionActive]}
                onPress={() => {
                  onSortChange(option.key, sortDirection);
                  setShowSortOptions(false);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.sortOptionIcon}>
                  <IconComponent 
                    size={18} 
                    color={isActive ? '#1ed760' : 'rgba(255, 255, 255, 0.6)'} 
                  />
                </View>
                <Text style={[
                  styles.sortOptionText,
                  isActive && styles.sortOptionActiveText
                ]}>
                  {option.label}
                </Text>
                {isActive && (
                  <TouchableOpacity
                    style={styles.directionButton}
                    onPress={toggleSortDirection}
                    activeOpacity={0.8}
                  >
                    <Text style={{ color: '#1ed760', fontSize: 12 }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};