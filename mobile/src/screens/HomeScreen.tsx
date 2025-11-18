import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useGameStore } from '../../../src/platform/store/gameStore';

const CATEGORY_ICONS: Record<string, string> = {
  Arcade: 'game-controller',
  Puzzle: 'extension-puzzle',
  Strategy: 'bulb',
  Racing: 'car-sport',
};

export const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const games = useGameStore((state) => state.games);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(games.map((g) => g.category)));

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || game.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderGameCard = ({ item }: any) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('Game', { gameId: item.id })}
    >
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.cardGradient}
      >
        <View style={styles.gameIcon}>
          <Text style={styles.gameEmoji}>{item.icon}</Text>
        </View>
        <View style={styles.gameInfo}>
          <Text style={styles.gameName}>{item.name}</Text>
          <Text style={styles.gameCategory}>{item.category}</Text>
          <View style={styles.gameStats}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.statText}>{item.rating || 'N/A'}</Text>
            <Ionicons name="play" size={14} color="#7c3aed" style={{ marginLeft: 12 }} />
            <Text style={styles.statText}>{item.plays || 0}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 FROV Games</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search games..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categories}>
        <TouchableOpacity
          style={[styles.categoryButton, !selectedCategory && styles.categoryButtonActive]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={[styles.categoryText, !selectedCategory && styles.categoryTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
            onPress={() => setSelectedCategory(category)}
          >
            <Ionicons
              name={CATEGORY_ICONS[category] as any || 'game-controller'}
              size={16}
              color={selectedCategory === category ? '#fff' : '#666'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredGames}
        renderItem={renderGameCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.gameList}
        showsVerticalScrollIndicator={false}
      />
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
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    color: '#fff',
    fontSize: 16,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  categoryButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#fff',
  },
  gameList: {
    padding: 20,
    paddingTop: 0,
  },
  gameCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 16,
    flexDirection: 'row',
  },
  gameIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#0f0f23',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gameEmoji: {
    fontSize: 32,
  },
  gameInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  gameName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  gameCategory: {
    fontSize: 14,
    color: '#7c3aed',
    marginBottom: 8,
  },
  gameStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#999',
    fontSize: 12,
    marginLeft: 4,
  },
});
