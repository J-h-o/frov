import { Level } from './types';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const PLAYER_WIDTH = 24;
export const PLAYER_HEIGHT = 32;

export const GRAVITY = 0.6;
export const MAX_FALL_SPEED = 12;
export const MOVE_SPEED = 4;
export const JUMP_FORCE = -12;

export const COLORS = {
  fireboy: '#FF4444',
  watergirl: '#4444FF',
  neutral: '#888888',
  fire: '#FF6600',
  water: '#0066FF',
  background: '#1a1a2e',
  platform: '#333333',
} as const;

// Level 1: Tutorial level
export const LEVEL_1: Level = {
  platforms: [
    // Floor
    { x: 0, y: 560, width: 800, height: 40, type: 'neutral' },

    // Starting platforms
    { x: 50, y: 480, width: 120, height: 20, type: 'neutral' },
    { x: 630, y: 480, width: 120, height: 20, type: 'neutral' },

    // Middle platforms
    { x: 200, y: 400, width: 100, height: 20, type: 'neutral' },
    { x: 500, y: 400, width: 100, height: 20, type: 'neutral' },

    // Upper platforms
    { x: 250, y: 320, width: 80, height: 20, type: 'neutral' },
    { x: 470, y: 320, width: 80, height: 20, type: 'neutral' },

    // Top platform (near doors)
    { x: 300, y: 200, width: 200, height: 20, type: 'neutral' },

    // Fire and water platforms
    { x: 150, y: 260, width: 60, height: 20, type: 'fire' },
    { x: 590, y: 260, width: 60, height: 20, type: 'water' },
  ],

  hazards: [
    // Fire pool (deadly to watergirl)
    { x: 100, y: 540, width: 80, height: 20, type: 'fire' },

    // Water pool (deadly to fireboy)
    { x: 620, y: 540, width: 80, height: 20, type: 'water' },
  ],

  doors: [
    // Fireboy door (top left)
    { x: 320, y: 150, width: 30, height: 50, type: 'fireboy' },

    // Watergirl door (top right)
    { x: 450, y: 150, width: 30, height: 50, type: 'watergirl' },
  ],

  startPositions: {
    fireboy: { x: 80, y: 440 },
    watergirl: { x: 680, y: 440 },
  },
};

export const LEVELS: Level[] = [LEVEL_1];
