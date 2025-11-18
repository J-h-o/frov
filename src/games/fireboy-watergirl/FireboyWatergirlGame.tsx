import { useEffect, useRef, useState, useCallback } from 'react';
import { useCanvas } from '../../shared/hooks/useCanvas';
import { useGameLoop } from '../../shared/game-engine/useGameLoop';
import { useMultiplayer } from './useMultiplayer';
import {
  createInitialState,
  updateGame,
  resetGame,
  startGame,
} from './gameLogic';
import type { GameState, KeyState, MultiplayerMessage } from './types';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from './config';

export function FireboyWatergirlGame() {
  const { canvasRef } = useCanvas({
    width: GAME_WIDTH,
    height: GAME_HEIGHT
  });
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [inputRoomCode, setInputRoomCode] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);

  const keysRef = useRef<KeyState>({
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    KeyW: false,
    KeyA: false,
    KeyS: false,
    KeyD: false,
  });

  const {
    peerId,
    isConnected,
    isHost,
    error,
    createRoom,
    joinRoom,
    sendMessage,
  } = useMultiplayer({
    onMessage: handleMultiplayerMessage,
    onConnected: handleConnected,
    onDisconnected: handleDisconnected,
  });

  function handleMultiplayerMessage(message: MultiplayerMessage) {
    if (message.type === 'state' && !isHost) {
      // Guest receives state updates from host
      setGameState(message.data);
    } else if (message.type === 'input' && isHost) {
      // Host receives input from guest
      // This will be processed in the game loop
    } else if (message.type === 'start') {
      // Start game
      if (gameState) {
        setGameState(startGame(gameState));
        setShowInstructions(false);
      }
    } else if (message.type === 'reset') {
      // Reset game
      if (gameState) {
        setGameState(resetGame(gameState));
        setShowInstructions(false);
      }
    }
  }

  function handleConnected() {
    console.log('Connected to peer');
  }

  function handleDisconnected() {
    console.log('Disconnected from peer');
    // Reset to lobby
    setGameState(null);
    setRoomCode('');
    setShowInstructions(true);
  }

  const handleCreateRoom = () => {
    const code = createRoom();
    if (code) {
      setRoomCode(code);
      setGameState(createInitialState(true));
    }
  };

  const handleJoinRoom = () => {
    if (inputRoomCode.trim()) {
      joinRoom(inputRoomCode.trim());
      setRoomCode(inputRoomCode.trim());
      setGameState(createInitialState(false));
    }
  };

  const handleStartGame = () => {
    if (gameState && isConnected) {
      const newState = startGame(gameState);
      setGameState(newState);
      setShowInstructions(false);
      sendMessage({ type: 'start', data: null });
    }
  };

  const handleReset = () => {
    if (gameState) {
      const newState = resetGame(gameState);
      setGameState(newState);
      setShowInstructions(false);
      sendMessage({ type: 'reset', data: null });
    }
  };

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code in keysRef.current) {
        e.preventDefault();
        keysRef.current[e.code as keyof KeyState] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keysRef.current) {
        e.preventDefault();
        keysRef.current[e.code as keyof KeyState] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  const updateGameState = useCallback(() => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    // Host updates game state and sends to guest
    if (isHost) {
      const newState = updateGame(gameState, keysRef.current);
      setGameState(newState);

      // Send state to guest
      if (isConnected) {
        sendMessage({ type: 'state', data: newState });
      }
    } else {
      // Guest sends input to host
      if (isConnected) {
        sendMessage({
          type: 'input',
          data: {
            keys: keysRef.current,
            timestamp: Date.now(),
          },
        });
      }
    }
  }, [gameState, isHost, isConnected, sendMessage]);

  useGameLoop({
    onUpdate: () => {
      updateGameState();
    },
    onRender: () => {
      // Render is handled by the useEffect below
    },
    isPlaying: gameState?.gameStatus === 'playing',
  });

  // Render
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Render platforms
    gameState.level.platforms.forEach((platform) => {
      ctx.fillStyle =
        platform.type === 'fire'
          ? COLORS.fire
          : platform.type === 'water'
            ? COLORS.water
            : COLORS.platform;
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Render hazards (with pulsing effect)
    gameState.level.hazards.forEach((hazard) => {
      const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
      ctx.globalAlpha = pulse;
      ctx.fillStyle = hazard.type === 'fire' ? COLORS.fire : COLORS.water;
      ctx.fillRect(hazard.x, hazard.y, hazard.width, hazard.height);
      ctx.globalAlpha = 1;
    });

    // Render doors
    gameState.level.doors.forEach((door) => {
      ctx.fillStyle =
        door.type === 'fireboy' ? COLORS.fireboy : COLORS.watergirl;
      ctx.fillRect(door.x, door.y, door.width, door.height);

      // Draw door indicator
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        door.type === 'fireboy' ? 'F' : 'W',
        door.x + door.width / 2,
        door.y + door.height / 2 + 4
      );
    });

    // Render players
    renderPlayer(ctx, gameState.fireboy, COLORS.fireboy);
    renderPlayer(ctx, gameState.watergirl, COLORS.watergirl);

    // Render UI
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    if (gameState.gameStatus === 'won') {
      ctx.fillStyle = '#0F0';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('YOU WIN!', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.font = '16px Arial';
      ctx.fillText(
        'Press R to restart',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 40
      );
    } else if (gameState.gameStatus === 'lost') {
      ctx.fillStyle = '#F00';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER!', GAME_WIDTH / 2, GAME_HEIGHT / 2);
      ctx.font = '16px Arial';
      ctx.fillText(
        'Press R to restart',
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 40
      );
    }

    // Connection status
    ctx.fillStyle = isConnected ? '#0F0' : '#F00';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(
      isConnected ? 'Connected' : 'Disconnected',
      GAME_WIDTH - 10,
      20
    );
  }, [gameState, isConnected, canvasRef]);

  function renderPlayer(
    ctx: CanvasRenderingContext2D,
    player: GameState['fireboy'],
    color: string
  ) {
    ctx.fillStyle = color;
    ctx.fillRect(
      player.position.x,
      player.position.y,
      player.width,
      player.height
    );

    // Add a simple face
    ctx.fillStyle = '#000';
    const eyeY = player.position.y + player.height * 0.3;
    const eyeSize = 3;
    ctx.fillRect(
      player.position.x + player.width * 0.3,
      eyeY,
      eyeSize,
      eyeSize
    );
    ctx.fillRect(
      player.position.x + player.width * 0.6,
      eyeY,
      eyeSize,
      eyeSize
    );
  }

  // Handle R key for reset
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key === 'r' &&
        gameState &&
        (gameState.gameStatus === 'won' || gameState.gameStatus === 'lost')
      ) {
        handleReset();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [gameState]);

  // Lobby UI
  if (!gameState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Fireboy & Watergirl
            </h1>
            <p className="text-gray-400">Multiplayer Platformer</p>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded p-3 text-center">
              {error}
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-4">Create Room</h2>
              <button
                onClick={handleCreateRoom}
                disabled={!peerId}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded font-semibold transition"
              >
                {peerId ? 'Create New Room' : 'Connecting...'}
              </button>
            </div>

            <div className="text-center text-gray-500">OR</div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Join Room</h2>
              <input
                type="text"
                placeholder="Enter room code"
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-4 mb-3 text-white placeholder-gray-400"
              />
              <button
                onClick={handleJoinRoom}
                disabled={!inputRoomCode.trim() || !peerId}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed py-3 px-4 rounded font-semibold transition"
              >
                Join Room
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-2">How to Play</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p>
                <strong>Fireboy (Red):</strong> Arrow keys to move
              </p>
              <p>
                <strong>Watergirl (Blue):</strong> WASD to move
              </p>
              <p className="mt-2">
                Work together to reach your respective doors!
              </p>
              <p>Avoid hazards: Fireboy can't touch water, Watergirl can't touch fire</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting room
  if (gameState.gameStatus === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              Fireboy & Watergirl
            </h1>
            <p className="text-gray-400">Multiplayer Platformer</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 space-y-4">
            {isHost ? (
              <>
                <h2 className="text-xl font-semibold">Room Created!</h2>
                <div className="bg-gray-700 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">
                    Share this code:
                  </p>
                  <p className="text-2xl font-mono font-bold text-center">
                    {roomCode}
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
                  ></div>
                  <span>
                    {isConnected
                      ? 'Player 2 connected!'
                      : 'Waiting for player 2...'}
                  </span>
                </div>
                {isConnected && (
                  <button
                    onClick={handleStartGame}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-3 px-4 rounded font-semibold transition"
                  >
                    Start Game
                  </button>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold">Joining Room...</h2>
                <div className="bg-gray-700 rounded p-4">
                  <p className="text-sm text-gray-400 mb-2">Room code:</p>
                  <p className="text-2xl font-mono font-bold text-center">
                    {roomCode}
                  </p>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}
                  ></div>
                  <span>
                    {isConnected
                      ? 'Connected! Waiting for host to start...'
                      : 'Connecting...'}
                  </span>
                </div>
              </>
            )}
          </div>

          {showInstructions && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-2">Controls</h3>
              <div className="text-sm text-gray-300 space-y-1">
                <p>
                  <strong className="text-red-400">
                    Fireboy (Player 1):
                  </strong>{' '}
                  Arrow keys
                </p>
                <p>
                  <strong className="text-blue-400">
                    Watergirl (Player 2):
                  </strong>{' '}
                  WASD
                </p>
                <p className="mt-2">
                  Reach your colored door to win!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Game UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-8">
      <canvas ref={canvasRef} className="border-4 border-gray-700 rounded" />
      <div className="mt-4 text-white text-center">
        <p className="text-sm">
          <span className="text-red-400">Fireboy: Arrow Keys</span>
          {' | '}
          <span className="text-blue-400">Watergirl: WASD</span>
        </p>
      </div>
    </div>
  );
}
