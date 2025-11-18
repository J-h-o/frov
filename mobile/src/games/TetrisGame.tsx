import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Canvas } from 'react-native-canvas';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = Math.min(SCREEN_WIDTH - 40, 300);
const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.6;
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = CANVAS_WIDTH / COLS;

interface TetrisGameProps {
  onGameOver: (score: number) => void;
}

const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[1, 1, 0], [0, 1, 1]], // S
  [[0, 1, 1], [1, 1, 0]], // Z
];

const COLORS = ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'];

export const TetrisGame: React.FC<TetrisGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<Canvas | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const gameStateRef = useRef({
    board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
    currentPiece: { shape: SHAPES[0], x: 3, y: 0, color: 0 },
    score: 0,
  });

  const handleCanvasRef = (canvas: Canvas | null) => {
    canvasRef.current = canvas;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  };

  const createNewPiece = () => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      x: Math.floor(COLS / 2) - 1,
      y: 0,
      color: shapeIndex,
    };
  };

  const checkCollision = (piece: any, offsetX = 0, offsetY = 0) => {
    const state = gameStateRef.current;
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.x + x + offsetX;
          const newY = piece.y + y + offsetY;
          if (
            newX < 0 ||
            newX >= COLS ||
            newY >= ROWS ||
            (newY >= 0 && state.board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const mergePiece = () => {
    const state = gameStateRef.current;
    const { currentPiece } = state;
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          if (currentPiece.y + y < 0) {
            setIsPlaying(false);
            onGameOver(state.score);
            return;
          }
          state.board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color + 1;
        }
      }
    }
  };

  const clearLines = () => {
    const state = gameStateRef.current;
    let linesCleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (state.board[y].every((cell) => cell !== 0)) {
        state.board.splice(y, 1);
        state.board.unshift(Array(COLS).fill(0));
        linesCleared++;
        y++;
      }
    }
    if (linesCleared > 0) {
      state.score += linesCleared * 100;
      setScore(state.score);
    }
  };

  const gameLoop = () => {
    if (!isPlaying) return;

    const state = gameStateRef.current;
    if (checkCollision(state.currentPiece, 0, 1)) {
      mergePiece();
      clearLines();
      state.currentPiece = createNewPiece();
      if (checkCollision(state.currentPiece)) {
        setIsPlaying(false);
        onGameOver(state.score);
        return;
      }
    } else {
      state.currentPiece.y++;
    }

    draw();
    setTimeout(gameLoop, 500);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw board
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (state.board[y][x]) {
          ctx.fillStyle = COLORS[state.board[y][x] - 1];
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }
    }

    // Draw current piece
    const { currentPiece } = state;
    ctx.fillStyle = COLORS[currentPiece.color];
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          ctx.fillRect(
            (currentPiece.x + x) * BLOCK_SIZE,
            (currentPiece.y + y) * BLOCK_SIZE,
            BLOCK_SIZE - 1,
            BLOCK_SIZE - 1
          );
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#1a1a2e';
    for (let i = 0; i <= COLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * BLOCK_SIZE, 0);
      ctx.lineTo(i * BLOCK_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let i = 0; i <= ROWS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * BLOCK_SIZE);
      ctx.lineTo(CANVAS_WIDTH, i * BLOCK_SIZE);
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (isPlaying) {
      gameLoop();
    }
  }, [isPlaying]);

  const startGame = () => {
    gameStateRef.current = {
      board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
      currentPiece: createNewPiece(),
      score: 0,
    };
    setScore(0);
    setIsPlaying(true);
  };

  const handleMove = (direction: 'left' | 'right' | 'down' | 'rotate') => {
    const state = gameStateRef.current;
    const { currentPiece } = state;

    if (direction === 'left' && !checkCollision(currentPiece, -1, 0)) {
      currentPiece.x--;
    } else if (direction === 'right' && !checkCollision(currentPiece, 1, 0)) {
      currentPiece.x++;
    } else if (direction === 'down' && !checkCollision(currentPiece, 0, 1)) {
      currentPiece.y++;
    } else if (direction === 'rotate') {
      const rotated = currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map((row) => row[i]).reverse()
      );
      const originalShape = currentPiece.shape;
      currentPiece.shape = rotated;
      if (checkCollision(currentPiece)) {
        currentPiece.shape = originalShape;
      }
    }
    draw();
  };

  return (
    <View style={styles.container}>
      <Canvas ref={handleCanvasRef} style={styles.canvas} />

      {!isPlaying && (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      )}

      {isPlaying && (
        <View style={styles.controls}>
          <View style={styles.row}>
            <TouchableOpacity style={styles.controlButton} onPress={() => handleMove('rotate')}>
              <Text style={styles.controlText}>↻</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.controlButton} onPress={() => handleMove('left')}>
              <Text style={styles.controlText}>←</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => handleMove('down')}>
              <Text style={styles.controlText}>↓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={() => handleMove('right')}>
              <Text style={styles.controlText}>→</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f23',
  },
  canvas: {
    borderWidth: 2,
    borderColor: '#2a2a3e',
    borderRadius: 8,
  },
  controls: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 24,
    color: '#fff',
  },
  startButton: {
    position: 'absolute',
    backgroundColor: '#7c3aed',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
