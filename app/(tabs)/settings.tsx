import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Moon, Sun, Info, CircleHelp as HelpCircle } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0a0a0a',
    },
    header: {
      paddingTop: 20,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      letterSpacing: -0.5,
    },
    section: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginHorizontal: 20,
      marginBottom: 20,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 12,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
      color: '#fff',
      marginBottom: 2,
    },
    settingDescription: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDark ? '#1ed760' : 'rgba(255, 255, 255, 0.2)',
      borderRadius: 16,
      padding: 2,
      width: 52,
      height: 32,
    },
    switchButton: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: isDark ? 20 : 0,
    },
    infoSection: {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      marginHorizontal: 20,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    infoTitle: {
      fontSize: 16,
      fontFamily: 'Inter-Bold',
      color: '#fff',
      marginBottom: 8,
    },
    infoText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: 'rgba(255, 255, 255, 0.7)',
      lineHeight: 20,
    },
  });

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
                <Moon size={24} color="#1ed760" />
              ) : (
                <Sun size={24} color="#1ed760" />
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
                  <Moon size={16} color="#1ed760" />
                ) : (
                  <Sun size={16} color="rgba(255, 255, 255, 0.6)" />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
            <View style={styles.settingIcon}>
              <HelpCircle size={24} color="rgba(255, 255, 255, 0.6)" />
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
              <Info size={24} color="rgba(255, 255, 255, 0.6)" />
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
            A modern music player with a futuristic design.
          </Text>
        </View>
      </View>
    </View>
  );
}