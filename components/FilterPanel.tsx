import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Filter, ChevronDown, Check } from 'lucide-react-native';
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
  const [isVisible, setIsVisible] = useState(false);

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'title', label: 'Title' },
    { key: 'artist', label: 'Artist' },
    { key: 'album', label: 'Album' },
    { key: 'duration', label: 'Duration' },
    { key: 'size', label: 'File Size' },
    { key: 'dateAdded', label: 'Date Added' },
  ];

  const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Files' },
    { key: 'mp3', label: 'MP3' },
    { key: 'wav', label: 'WAV' },
    { key: 'aac', label: 'AAC' },
  ];

  const styles = StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    triggerText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      fontFamily: 'Inter-Medium',
      marginLeft: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: colors.background,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      maxHeight: '70%',
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      textAlign: 'center',
    },
    section: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 12,
    },
    optionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 8,
    },
    optionText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    directionButtons: {
      flexDirection: 'row',
      marginTop: 8,
    },
    directionButton: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: 4,
      alignItems: 'center',
    },
    directionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    directionButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.text,
    },
    directionButtonTextActive: {
      color: colors.background,
    },
    closeButton: {
      margin: 20,
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.background,
    },
  });

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.key === sortBy);
    const direction = sortDirection === 'asc' ? '↑' : '↓';
    return `${option?.label} ${direction}`;
  };

  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.key === filterType);
    return option?.label || 'All Files';
  };

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsVisible(true)}
        activeOpacity={0.7}
      >
        <Filter size={20} color={colors.textMuted} />
        <Text style={styles.triggerText}>
          {getCurrentSortLabel()} • {getCurrentFilterLabel()}
        </Text>
        <ChevronDown size={20} color={colors.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
            </View>

            <ScrollView>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sort By</Text>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionRow,
                      sortBy === option.key && { backgroundColor: colors.surface }
                    ]}
                    onPress={() => onSortChange(option.key, sortDirection)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                    {sortBy === option.key && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}

                <View style={styles.directionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.directionButton,
                      sortDirection === 'asc' && styles.directionButtonActive
                    ]}
                    onPress={() => onSortChange(sortBy, 'asc')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.directionButtonText,
                      sortDirection === 'asc' && styles.directionButtonTextActive
                    ]}>
                      Ascending
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.directionButton,
                      sortDirection === 'desc' && styles.directionButtonActive
                    ]}
                    onPress={() => onSortChange(sortBy, 'desc')}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.directionButtonText,
                      sortDirection === 'desc' && styles.directionButtonTextActive
                    ]}>
                      Descending
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Filter by File Type</Text>
                {filterOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      styles.optionRow,
                      filterType === option.key && { backgroundColor: colors.surface }
                    ]}
                    onPress={() => onFilterChange(option.key)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                    {filterType === option.key && (
                      <Check size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setIsVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};