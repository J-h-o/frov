import type {
  GameState,
  Player,
  Platform,
  KeyState,
  PlayerType,
  Position,
  Level,
  Door,
} from './types';
import {
  GRAVITY,
  MAX_FALL_SPEED,
  MOVE_SPEED,
  JUMP_FORCE,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  GAME_WIDTH,
  LEVELS,
} from './config';

export function createInitialState(isHost: boolean): GameState {
  const level = LEVELS[0];

  return {
    fireboy: createPlayer('fireboy', level.startPositions.fireboy),
    watergirl: createPlayer('watergirl', level.startPositions.watergirl),
    level,
    gameStatus: 'waiting',
    isHost,
  };
}

function createPlayer(type: PlayerType, position: Position): Player {
  return {
    type,
    position: { ...position },
    velocity: { x: 0, y: 0 },
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    isGrounded: false,
    isJumping: false,
  };
}

export function updateGame(state: GameState, keys: KeyState): GameState {
  if (state.gameStatus !== 'playing') {
    return state;
  }

  const newState = { ...state };

  // Update both players
  newState.fireboy = updatePlayer(
    state.fireboy,
    {
      left: keys.ArrowLeft,
      right: keys.ArrowRight,
      up: keys.ArrowUp,
    },
    state.level
  );

  newState.watergirl = updatePlayer(
    state.watergirl,
    {
      left: keys.KeyA,
      right: keys.KeyD,
      up: keys.KeyW,
    },
    state.level
  );

  // Check win condition
  if (checkWinCondition(newState)) {
    newState.gameStatus = 'won';
  }

  // Check lose condition
  if (checkLoseCondition(newState)) {
    newState.gameStatus = 'lost';
  }

  return newState;
}

interface PlayerControls {
  left: boolean;
  right: boolean;
  up: boolean;
}

function updatePlayer(player: Player, controls: PlayerControls, level: Level): Player {
  const newPlayer = { ...player };

  // Horizontal movement
  if (controls.left) {
    newPlayer.velocity.x = -MOVE_SPEED;
  } else if (controls.right) {
    newPlayer.velocity.x = MOVE_SPEED;
  } else {
    newPlayer.velocity.x = 0;
  }

  // Apply gravity
  newPlayer.velocity.y += GRAVITY;
  if (newPlayer.velocity.y > MAX_FALL_SPEED) {
    newPlayer.velocity.y = MAX_FALL_SPEED;
  }

  // Jump
  if (controls.up && newPlayer.isGrounded && !newPlayer.isJumping) {
    newPlayer.velocity.y = JUMP_FORCE;
    newPlayer.isJumping = true;
    newPlayer.isGrounded = false;
  }

  // Reset jumping state when not pressing jump
  if (!controls.up) {
    newPlayer.isJumping = false;
  }

  // Update position
  newPlayer.position.x += newPlayer.velocity.x;
  newPlayer.position.y += newPlayer.velocity.y;

  // Apply collisions
  applyCollisions(newPlayer, level);

  // Keep player in bounds
  if (newPlayer.position.x < 0) {
    newPlayer.position.x = 0;
    newPlayer.velocity.x = 0;
  }
  if (newPlayer.position.x + newPlayer.width > GAME_WIDTH) {
    newPlayer.position.x = GAME_WIDTH - newPlayer.width;
    newPlayer.velocity.x = 0;
  }

  return newPlayer;
}

function applyCollisions(player: Player, level: Level): void {
  let grounded = false;

  // Check all platforms
  for (const platform of level.platforms) {
    // Skip platforms that are deadly to this player
    if (
      (platform.type === 'fire' && player.type === 'watergirl') ||
      (platform.type === 'water' && player.type === 'fireboy')
    ) {
      continue;
    }

    const collision = checkCollision(
      player.position.x,
      player.position.y,
      player.width,
      player.height,
      platform.x,
      platform.y,
      platform.width,
      platform.height
    );

    if (collision) {
      resolveCollision(player, platform);

      // Check if player is on top of platform
      if (
        player.velocity.y >= 0 &&
        player.position.y + player.height <= platform.y + platform.height / 2
      ) {
        grounded = true;
      }
    }
  }

  player.isGrounded = grounded;
}

function checkCollision(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function resolveCollision(player: Player, platform: Platform): void {
  const playerLeft = player.position.x;
  const playerRight = player.position.x + player.width;
  const playerTop = player.position.y;
  const playerBottom = player.position.y + player.height;

  const platformLeft = platform.x;
  const platformRight = platform.x + platform.width;
  const platformTop = platform.y;
  const platformBottom = platform.y + platform.height;

  // Calculate overlap on each side
  const overlapLeft = platformRight - playerLeft;
  const overlapRight = playerRight - platformLeft;
  const overlapTop = platformBottom - playerTop;
  const overlapBottom = playerBottom - platformTop;

  // Find minimum overlap
  const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

  // Resolve collision based on minimum overlap
  if (minOverlap === overlapTop && player.velocity.y < 0) {
    // Collision from top (player hit ceiling)
    player.position.y = platformBottom;
    player.velocity.y = 0;
  } else if (minOverlap === overlapBottom && player.velocity.y > 0) {
    // Collision from bottom (player landed on platform)
    player.position.y = platformTop - player.height;
    player.velocity.y = 0;
    player.isGrounded = true;
  } else if (minOverlap === overlapLeft && player.velocity.x < 0) {
    // Collision from left
    player.position.x = platformRight;
    player.velocity.x = 0;
  } else if (minOverlap === overlapRight && player.velocity.x > 0) {
    // Collision from right
    player.position.x = platformLeft - player.width;
    player.velocity.x = 0;
  }
}

function checkWinCondition(state: GameState): boolean {
  const fireboyAtDoor = isPlayerAtDoor(state.fireboy, state.level.doors);
  const watergirlAtDoor = isPlayerAtDoor(state.watergirl, state.level.doors);

  return fireboyAtDoor && watergirlAtDoor;
}

function isPlayerAtDoor(player: Player, doors: Door[]): boolean {
  const playerDoor = doors.find((door) => door.type === player.type);
  if (!playerDoor) return false;

  return checkCollision(
    player.position.x,
    player.position.y,
    player.width,
    player.height,
    playerDoor.x,
    playerDoor.y,
    playerDoor.width,
    playerDoor.height
  );
}

function checkLoseCondition(state: GameState): boolean {
  // Check if either player touched a deadly hazard
  return (
    isPlayerInHazard(state.fireboy, state.level.hazards) ||
    isPlayerInHazard(state.watergirl, state.level.hazards)
  );
}

function isPlayerInHazard(player: Player, hazards: Platform[]): boolean {
  for (const hazard of hazards) {
    // Check if this hazard is deadly to this player
    if (
      (hazard.type === 'fire' && player.type === 'watergirl') ||
      (hazard.type === 'water' && player.type === 'fireboy')
    ) {
      const collision = checkCollision(
        player.position.x,
        player.position.y,
        player.width,
        player.height,
        hazard.x,
        hazard.y,
        hazard.width,
        hazard.height
      );

      if (collision) {
        return true;
      }
    }
  }

  return false;
}

export function resetGame(state: GameState): GameState {
  return createInitialState(state.isHost);
}

export function startGame(state: GameState): GameState {
  return {
    ...state,
    gameStatus: 'playing',
  };
}
