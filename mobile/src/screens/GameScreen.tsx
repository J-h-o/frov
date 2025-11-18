import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../../src/platform/store/gameStore';
import { useUserStore } from '../../../src/platform/store/userStore';
import { PongGame } from '../games/PongGame';
import { TetrisGame } from '../games/TetrisGame';
import { Connect4Game } from '../games/Connect4Game';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const GameScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { gameId } = route.params;

  const games = useGameStore((state) => state.games);
  const user = useUserStore((state) => state.user);
  const updateStats = useUserStore((state) => state.updateStats);

  const game = games.find((g) => g.id === gameId);
  const [isGameReady, setIsGameReady] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setIsGameReady(true);
  }, []);

  const handleGameOver = (finalScore: number) => {
    setScore(finalScore);
    if (user) {
      updateStats(gameId, finalScore);
    }
    Alert.alert(
      'Game Over!',
      `Your score: ${finalScore}`,
      [
        { text: 'Play Again', onPress: () => setIsGameReady(false) },
        { text: 'Exit', onPress: () => navigation.goBack() },
      ]
    );
    setTimeout(() => setIsGameReady(true), 100);
  };

  if (!game) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Game not found</Text>
      </View>
    );
  }

  const renderGame = () => {
    switch (gameId) {
      case 'pong':
        return <PongGame onGameOver={handleGameOver} />;
      case 'tetris':
        return <TetrisGame onGameOver={handleGameOver} />;
      case 'connect4':
        return <Connect4Game onGameOver={handleGameOver} />;
      default:
        return (
          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonEmoji}>{game.icon}</Text>
            <Text style={styles.comingSoonTitle}>{game.name}</Text>
            <Text style={styles.comingSoonText}>
              This game is being optimized for mobile.
              {'\n'}Check back soon!
            </Text>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.gameInfo}>
          <Text style={styles.gameTitle}>{game.icon} {game.name}</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
        </View>
      </View>

      <View style={styles.gameContainer}>
        {isGameReady ? renderGame() : <ActivityIndicator size="large" color="#7c3aed" />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  backButton: {
    padding: 8,
  },
  gameInfo: {
    flex: 1,
    marginLeft: 12,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  scoreText: {
    fontSize: 14,
    color: '#7c3aed',
    marginTop: 2,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  comingSoon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  comingSoonEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});
