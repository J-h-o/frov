import React, { useRef, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Alert } from 'react-native';
import { Canvas } from 'react-native-canvas';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = Math.min(SCREEN_WIDTH - 40, 350);
const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.5;
const COLS = 7;
const ROWS = 6;
const CELL_SIZE = CANVAS_WIDTH / COLS;

interface Connect4GameProps {
  onGameOver: (score: number) => void;
}

export const Connect4Game: React.FC<Connect4GameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<Canvas | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);

  const gameStateRef = useRef({
    board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
    moves: 0,
  });

  const handleCanvasRef = (canvas: Canvas | null) => {
    canvasRef.current = canvas;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  };

  const checkWin = (board: number[][], row: number, col: number, player: number): boolean => {
    // Check horizontal
    let count = 0;
    for (let c = 0; c < COLS; c++) {
      count = board[row][c] === player ? count + 1 : 0;
      if (count >= 4) return true;
    }

    // Check vertical
    count = 0;
    for (let r = 0; r < ROWS; r++) {
      count = board[r][col] === player ? count + 1 : 0;
      if (count >= 4) return true;
    }

    // Check diagonals
    const directions = [[1, 1], [1, -1]];
    for (const [dr, dc] of directions) {
      count = 1;
      for (let i = 1; i < 4; i++) {
        const r = row + dr * i;
        const c = col + dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
        } else break;
      }
      for (let i = 1; i < 4; i++) {
        const r = row - dr * i;
        const c = col - dc * i;
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
          count++;
        } else break;
      }
      if (count >= 4) return true;
    }

    return false;
  };

  const dropPiece = (col: number) => {
    if (!isPlaying) return;

    const state = gameStateRef.current;
    // Find the lowest empty row in this column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (state.board[r][col] === 0) {
        row = r;
        break;
      }
    }

    if (row === -1) return; // Column is full

    // Place the piece
    state.board[row][col] = currentPlayer;
    state.moves++;

    draw();

    // Check for win
    if (checkWin(state.board, row, col, currentPlayer)) {
      const score = currentPlayer === 1 ? state.moves * 10 : 0;
      setIsPlaying(false);
      setTimeout(() => {
        Alert.alert(
          currentPlayer === 1 ? 'You Win!' : 'AI Wins!',
          `Game over in ${state.moves} moves`,
          [{ text: 'OK' }]
        );
        onGameOver(score);
      }, 300);
      return;
    }

    // Check for draw
    if (state.moves >= ROWS * COLS) {
      setIsPlaying(false);
      setTimeout(() => {
        Alert.alert('Draw!', 'The board is full', [{ text: 'OK' }]);
        onGameOver(0);
      }, 300);
      return;
    }

    // Switch player
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1);

    // AI move
    if (currentPlayer === 1) {
      setTimeout(() => {
        aiMove();
      }, 500);
    }
  };

  const aiMove = () => {
    const state = gameStateRef.current;
    // Simple AI: try to block player or make a random move
    let bestCol = -1;

    // Try to win
    for (let col = 0; col < COLS; col++) {
      let row = -1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (state.board[r][col] === 0) {
          row = r;
          break;
        }
      }
      if (row !== -1) {
        state.board[row][col] = 2;
        if (checkWin(state.board, row, col, 2)) {
          bestCol = col;
          state.board[row][col] = 0;
          break;
        }
        state.board[row][col] = 0;
      }
    }

    // Try to block
    if (bestCol === -1) {
      for (let col = 0; col < COLS; col++) {
        let row = -1;
        for (let r = ROWS - 1; r >= 0; r--) {
          if (state.board[r][col] === 0) {
            row = r;
            break;
          }
        }
        if (row !== -1) {
          state.board[row][col] = 1;
          if (checkWin(state.board, row, col, 1)) {
            bestCol = col;
            state.board[row][col] = 0;
            break;
          }
          state.board[row][col] = 0;
        }
      }
    }

    // Random move
    if (bestCol === -1) {
      const availableCols = [];
      for (let col = 0; col < COLS; col++) {
        if (state.board[0][col] === 0) {
          availableCols.push(col);
        }
      }
      if (availableCols.length > 0) {
        bestCol = availableCols[Math.floor(Math.random() * availableCols.length)];
      }
    }

    if (bestCol !== -1) {
      dropPiece(bestCol);
    }
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#0a47a3';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw cells
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        const centerX = x + CELL_SIZE / 2;
        const centerY = y + CELL_SIZE / 2;
        const radius = CELL_SIZE * 0.4;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        if (state.board[row][col] === 0) {
          ctx.fillStyle = '#0f0f23';
        } else if (state.board[row][col] === 1) {
          ctx.fillStyle = '#f0f000';
        } else {
          ctx.fillStyle = '#f00000';
        }
        ctx.fill();
      }
    }
  };

  const startGame = () => {
    gameStateRef.current = {
      board: Array(ROWS).fill(null).map(() => Array(COLS).fill(0)),
      moves: 0,
    };
    setCurrentPlayer(1);
    setIsPlaying(true);
    draw();
  };

  return (
    <View style={styles.container}>
      <Canvas ref={handleCanvasRef} style={styles.canvas} />

      {!isPlaying ? (
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.columnButtons}>
          {Array.from({ length: COLS }).map((_, col) => (
            <TouchableOpacity
              key={col}
              style={[styles.columnButton, { width: CELL_SIZE }]}
              onPress={() => dropPiece(col)}
              disabled={currentPlayer !== 1}
            >
              <Text style={styles.columnText}>↓</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isPlaying && (
        <Text style={styles.turnText}>
          {currentPlayer === 1 ? 'Your Turn (Yellow)' : 'AI Turn (Red)'}
        </Text>
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
  columnButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  columnButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7c3aed',
  },
  columnText: {
    color: '#fff',
    fontSize: 20,
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
  turnText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
    fontWeight: '600',
  },
});
