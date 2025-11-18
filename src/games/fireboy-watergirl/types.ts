export type PlayerType = 'fireboy' | 'watergirl';

export type ElementType = 'fire' | 'water' | 'neutral';

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Player {
  type: PlayerType;
  position: Position;
  velocity: Velocity;
  width: number;
  height: number;
  isGrounded: boolean;
  isJumping: boolean;
}

export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: ElementType;
}

export interface Door {
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlayerType;
}

export interface Level {
  platforms: Platform[];
  doors: Door[];
  hazards: Platform[]; // Pools of fire/water that are deadly
  startPositions: {
    fireboy: Position;
    watergirl: Position;
  };
}

export interface GameState {
  fireboy: Player;
  watergirl: Player;
  level: Level;
  gameStatus: 'waiting' | 'playing' | 'won' | 'lost';
  isHost: boolean;
}

export interface KeyState {
  ArrowUp: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;
  ArrowRight: boolean;
  KeyW: boolean;
  KeyA: boolean;
  KeyS: boolean;
  KeyD: boolean;
}

export interface MultiplayerMessage {
  type: 'state' | 'input' | 'start' | 'reset';
  data: any;
}

export interface PlayerInput {
  playerId: PlayerType;
  keys: Partial<KeyState>;
  timestamp: number;
}
