import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Moon, Sun, Info, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 16,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    section: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      marginBottom: 20,
      borderRadius: 12,
      overflow: 'hidden',
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingIcon: {
      marginRight: 12,
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? colors.primary : colors.border,
      borderRadius: 16,
      padding: 2,
      width: 52,
      height: 32,
    },
    switchButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.background,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isDark ? 20 : 0,
    },
    infoSection: {
      backgroundColor: colors.surface,
      marginHorizontal: 16,
      borderRadius: 12,
      padding: 20,
    },
    infoTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity
          style={[styles.settingItem, styles.settingItemLast]}
          onPress={toggleTheme}
          activeOpacity={0.7}
        >
          <View style={styles.settingIcon}>
            {isDark ? (
              <Moon size={24} color={colors.primary} />
            ) : (
              <Sun size={24} color={colors.primary} />
            )}
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Theme</Text>
            <Text style={styles.settingDescription}>
              {isDark ? 'Dark mode enabled' : 'Light mode enabled'}
            </Text>
          </View>
          <View style={styles.switchContainer}>
            <View style={styles.switchButton}>
              {isDark ? (
                <Moon size={16} color={colors.primary} />
              ) : (
                <Sun size={16} color={colors.textMuted} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
          <View style={styles.settingIcon}>
            <HelpCircle size={24} color={colors.textMuted} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Help Center</Text>
            <Text style={styles.settingDescription}>
              Get help and find answers to common questions
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]} activeOpacity={0.7}>
          <View style={styles.settingIcon}>
            <Info size={24} color={colors.textMuted} />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>About</Text>
            <Text style={styles.settingDescription}>
              Version information and legal notices
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Abhi's Music Player</Text>
        <Text style={styles.infoText}>
          This is a music player.
        </Text>
      </View>
    </SafeAreaView>
  );
}