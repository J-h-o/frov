import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '../../../src/platform/store/userStore';

export const ProfileScreen = () => {
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const isAnonymous = user?.isAnonymous;

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const stats = user?.stats || [];
  const totalGamesPlayed = stats.length;
  const totalScore = stats.reduce((sum, stat) => sum + (stat.highScore || 0), 0);
  const averageScore = totalGamesPlayed > 0 ? Math.round(totalScore / totalGamesPlayed) : 0;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#7c3aed', '#5b21b6']}
        style={styles.profileHeader}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user?.username?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <Text style={styles.username}>{user?.username || 'Guest User'}</Text>
        {!isAnonymous && user?.email && (
          <Text style={styles.email}>{user.email}</Text>
        )}
        {isAnonymous && (
          <View style={styles.guestBadge}>
            <Text style={styles.guestText}>Guest Account</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="game-controller" size={32} color="#7c3aed" />
          <Text style={styles.statValue}>{totalGamesPlayed}</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="trophy" size={32} color="#fbbf24" />
          <Text style={styles.statValue}>{totalScore}</Text>
          <Text style={styles.statLabel}>Total Score</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="star" size={32} color="#10b981" />
          <Text style={styles.statValue}>{averageScore}</Text>
          <Text style={styles.statLabel}>Avg Score</Text>
        </View>
      </View>

      {stats.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Statistics</Text>
          {stats.map((stat) => (
            <View key={stat.gameId} style={styles.gameStatCard}>
              <View style={styles.gameStatInfo}>
                <Text style={styles.gameStatName}>{stat.gameId}</Text>
                <Text style={styles.gameStatDetails}>
                  Played {stat.timesPlayed || 0} times
                </Text>
              </View>
              <View style={styles.gameStatScore}>
                <Text style={styles.scoreValue}>{stat.highScore || 0}</Text>
                <Text style={styles.scoreLabel}>Best Score</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Frov Mobile v1.0.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  profileHeader: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#e0e0e0',
  },
  guestBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  guestText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  gameStatCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  gameStatInfo: {
    flex: 1,
  },
  gameStatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  gameStatDetails: {
    fontSize: 12,
    color: '#999',
  },
  gameStatScore: {
    alignItems: 'flex-end',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a2e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    padding: 20,
  },
  footerText: {
    color: '#666',
    fontSize: 12,
  },
});
