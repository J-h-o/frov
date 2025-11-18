import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { Canvas } from 'react-native-canvas';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CANVAS_WIDTH = SCREEN_WIDTH - 40;
const CANVAS_HEIGHT = SCREEN_HEIGHT * 0.6;

interface PongGameProps {
  onGameOver: (score: number) => void;
}

export const PongGame: React.FC<PongGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<Canvas | null>(null);
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameStateRef = useRef({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballSpeedX: 4,
    ballSpeedY: 4,
    ballRadius: 8,
    paddleHeight: 80,
    paddleWidth: 12,
    playerY: CANVAS_HEIGHT / 2 - 40,
    aiY: CANVAS_HEIGHT / 2 - 40,
    playerScore: 0,
    aiScore: 0,
  });

  const handleCanvasRef = (canvas: Canvas | null) => {
    canvasRef.current = canvas;
    if (canvas) {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    }
  };

  const resetBall = () => {
    const state = gameStateRef.current;
    state.ballX = CANVAS_WIDTH / 2;
    state.ballY = CANVAS_HEIGHT / 2;
    state.ballSpeedX = (Math.random() > 0.5 ? 1 : -1) * 4;
    state.ballSpeedY = (Math.random() - 0.5) * 6;
  };

  const gameLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = gameStateRef.current;

    // Update ball position
    state.ballX += state.ballSpeedX;
    state.ballY += state.ballSpeedY;

    // Ball collision with top/bottom
    if (state.ballY - state.ballRadius < 0 || state.ballY + state.ballRadius > CANVAS_HEIGHT) {
      state.ballSpeedY = -state.ballSpeedY;
    }

    // Ball collision with player paddle
    if (
      state.ballX - state.ballRadius < state.paddleWidth &&
      state.ballY > state.playerY &&
      state.ballY < state.playerY + state.paddleHeight
    ) {
      state.ballSpeedX = Math.abs(state.ballSpeedX);
      state.ballSpeedY += (state.ballY - (state.playerY + state.paddleHeight / 2)) * 0.1;
      state.playerScore++;
      setScore(state.playerScore);
    }

    // Ball collision with AI paddle
    if (
      state.ballX + state.ballRadius > CANVAS_WIDTH - state.paddleWidth &&
      state.ballY > state.aiY &&
      state.ballY < state.aiY + state.paddleHeight
    ) {
      state.ballSpeedX = -Math.abs(state.ballSpeedX);
      state.ballSpeedY += (state.ballY - (state.aiY + state.paddleHeight / 2)) * 0.1;
    }

    // Ball out of bounds
    if (state.ballX < 0) {
      state.aiScore++;
      if (state.aiScore >= 5) {
        setIsPlaying(false);
        onGameOver(state.playerScore);
        return;
      }
      resetBall();
    } else if (state.ballX > CANVAS_WIDTH) {
      resetBall();
    }

    // AI movement (simple following)
    const aiCenter = state.aiY + state.paddleHeight / 2;
    if (aiCenter < state.ballY - 35) {
      state.aiY += 3;
    } else if (aiCenter > state.ballY + 35) {
      state.aiY -= 3;
    }

    // Keep paddles in bounds
    state.playerY = Math.max(0, Math.min(CANVAS_HEIGHT - state.paddleHeight, state.playerY));
    state.aiY = Math.max(0, Math.min(CANVAS_HEIGHT - state.paddleHeight, state.aiY));

    // Clear canvas
    ctx.fillStyle = '#0f0f23';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#2a2a3e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = '#7c3aed';
    ctx.fillRect(0, state.playerY, state.paddleWidth, state.paddleHeight);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(CANVAS_WIDTH - state.paddleWidth, state.aiY, state.paddleWidth, state.paddleHeight);

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, state.ballRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.fillStyle = '#999';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${state.playerScore}`, CANVAS_WIDTH / 4, 40);
    ctx.fillText(`${state.aiScore}`, (CANVAS_WIDTH / 4) * 3, 40);

    requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    if (isPlaying) {
      gameLoop();
    }
  }, [isPlaying]);

  const handlePaddleMove = (direction: 'up' | 'down') => {
    const state = gameStateRef.current;
    if (direction === 'up') {
      state.playerY -= 30;
    } else {
      state.playerY += 30;
    }
  };

  const startGame = () => {
    gameStateRef.current.playerScore = 0;
    gameStateRef.current.aiScore = 0;
    setScore(0);
    resetBall();
    setIsPlaying(true);
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
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handlePaddleMove('up')}
          >
            <Text style={styles.controlText}>▲</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handlePaddleMove('down')}
          >
            <Text style={styles.controlText}>▼</Text>
          </TouchableOpacity>
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
    flexDirection: 'row',
    marginTop: 20,
    gap: 20,
  },
  controlButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlText: {
    fontSize: 32,
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
