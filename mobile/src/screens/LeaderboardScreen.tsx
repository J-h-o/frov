import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../../src/platform/store/gameStore';

export const LeaderboardScreen = () => {
  const games = useGameStore((state) => state.games);
  const getLeaderboard = useGameStore((state) => state.getLeaderboard);
  const loadLeaderboard = useGameStore((state) => state.loadLeaderboard);

  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedGame) {
      setIsLoading(true);
      loadLeaderboard(selectedGame).finally(() => setIsLoading(false));
    }
  }, [selectedGame, loadLeaderboard]);

  const leaderboard = selectedGame ? getLeaderboard(selectedGame) : null;
  const entries = leaderboard?.entries || [];

  const renderGameSelector = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.gameButton,
        selectedGame === item.id && styles.gameButtonActive,
      ]}
      onPress={() => setSelectedGame(item.id)}
    >
      <Text style={styles.gameEmoji}>{item.icon}</Text>
      <Text
        style={[
          styles.gameButtonText,
          selectedGame === item.id && styles.gameButtonTextActive,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderLeaderboardEntry = ({ item, index }: any) => {
    const medalColors = ['#fbbf24', '#d1d5db', '#cd7f32'];
    const medalColor = index < 3 ? medalColors[index] : '#666';

    return (
      <View style={styles.entryCard}>
        <View style={styles.entryRank}>
          <Text style={[styles.rankText, { color: medalColor }]}>#{index + 1}</Text>
        </View>
        <View style={styles.entryAvatar}>
          <Text style={styles.entryAvatarText}>
            {item.username?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
        <View style={styles.entryInfo}>
          <Text style={styles.entryUsername}>{item.username}</Text>
          <Text style={styles.entryDate}>
            {new Date(item.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.entryScore}>
          <Text style={styles.scoreText}>{item.score}</Text>
          <Text style={styles.scoreLabel}>pts</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <Text style={styles.subtitle}>Select a game to view rankings</Text>
      </View>

      <FlatList
        horizontal
        data={games}
        renderItem={renderGameSelector}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gameSelector}
        showsHorizontalScrollIndicator={false}
      />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7c3aed" />
        </View>
      ) : !selectedGame ? (
        <View style={styles.emptyState}>
          <Ionicons name="trophy-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>Select a game to view leaderboard</Text>
        </View>
      ) : entries.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sad-outline" size={64} color="#666" />
          <Text style={styles.emptyText}>No scores yet</Text>
          <Text style={styles.emptySubtext}>Be the first to play!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          renderItem={renderLeaderboardEntry}
          keyExtractor={(item, index) => `${item.userId}-${index}`}
          contentContainerStyle={styles.leaderboardList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
  },
  gameSelector: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  gameButton: {
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  gameButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  gameEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  gameButtonText: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
  gameButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  leaderboardList: {
    padding: 20,
    paddingTop: 0,
  },
  entryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  entryRank: {
    width: 40,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  entryAvatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  entryInfo: {
    flex: 1,
  },
  entryUsername: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  entryDate: {
    fontSize: 12,
    color: '#999',
  },
  entryScore: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c3aed',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#999',
  },
});
