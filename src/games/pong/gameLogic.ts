/**
 * Pong game logic
 * Pure functions for game state updates - easy to test and maintain
 */

import type { PongState, Paddle, Ball } from './types'
import { PONG_CONFIG } from './config'
import { checkCollision, clamp } from '@shared/utils/game'

export const createInitialState = (): PongState => {
  return {
    playerPaddle: {
      position: {
        x: PONG_CONFIG.PADDLE_OFFSET,
        y: PONG_CONFIG.CANVAS_HEIGHT / 2 - PONG_CONFIG.PADDLE_HEIGHT / 2,
      },
      size: {
        width: PONG_CONFIG.PADDLE_WIDTH,
        height: PONG_CONFIG.PADDLE_HEIGHT,
      },
      velocity: { x: 0, y: 0 },
      speed: PONG_CONFIG.PADDLE_SPEED,
    },
    aiPaddle: {
      position: {
        x: PONG_CONFIG.CANVAS_WIDTH - PONG_CONFIG.PADDLE_OFFSET - PONG_CONFIG.PADDLE_WIDTH,
        y: PONG_CONFIG.CANVAS_HEIGHT / 2 - PONG_CONFIG.PADDLE_HEIGHT / 2,
      },
      size: {
        width: PONG_CONFIG.PADDLE_WIDTH,
        height: PONG_CONFIG.PADDLE_HEIGHT,
      },
      velocity: { x: 0, y: 0 },
      speed: PONG_CONFIG.PADDLE_SPEED,
    },
    ball: createBall(),
    playerScore: 0,
    aiScore: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    winner: null,
  }
}

export const createBall = (): Ball => {
  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4 // -45 to 45 degrees
  const direction = Math.random() > 0.5 ? 1 : -1

  return {
    position: {
      x: PONG_CONFIG.CANVAS_WIDTH / 2 - PONG_CONFIG.BALL_SIZE / 2,
      y: PONG_CONFIG.CANVAS_HEIGHT / 2 - PONG_CONFIG.BALL_SIZE / 2,
    },
    size: {
      width: PONG_CONFIG.BALL_SIZE,
      height: PONG_CONFIG.BALL_SIZE,
    },
    velocity: {
      x: Math.cos(angle) * PONG_CONFIG.BALL_INITIAL_SPEED * direction,
      y: Math.sin(angle) * PONG_CONFIG.BALL_INITIAL_SPEED,
    },
    speed: PONG_CONFIG.BALL_INITIAL_SPEED,
  }
}

export const updatePaddle = (paddle: Paddle): Paddle => {
  const newY = paddle.position.y + paddle.velocity.y
  const clampedY = clamp(newY, 0, PONG_CONFIG.CANVAS_HEIGHT - paddle.size.height)

  return {
    ...paddle,
    position: {
      ...paddle.position,
      y: clampedY,
    },
  }
}

export const updateAIPaddle = (paddle: Paddle, ball: Ball): Paddle => {
  // AI follows ball with some imperfection based on difficulty
  const paddleCenter = paddle.position.y + paddle.size.height / 2
  const ballCenter = ball.position.y + ball.size.height / 2
  const diff = ballCenter - paddleCenter

  let velocity = 0
  if (Math.abs(diff) > 10) {
    velocity = diff > 0 ? paddle.speed : -paddle.speed
    velocity *= PONG_CONFIG.AI_DIFFICULTY
  }

  return updatePaddle({
    ...paddle,
    velocity: { x: 0, y: velocity },
  })
}

export const updateBall = (state: PongState): PongState => {
  let ball = { ...state.ball }
  let playerScore = state.playerScore
  let aiScore = state.aiScore

  // Update ball position
  ball.position.x += ball.velocity.x
  ball.position.y += ball.velocity.y

  // Top and bottom wall collision
  if (ball.position.y <= 0 || ball.position.y + ball.size.height >= PONG_CONFIG.CANVAS_HEIGHT) {
    ball.velocity.y *= -1
    ball.position.y = clamp(ball.position.y, 0, PONG_CONFIG.CANVAS_HEIGHT - ball.size.height)
  }

  // Player paddle collision
  if (
    checkCollision(
      ball.position,
      ball.size,
      state.playerPaddle.position,
      state.playerPaddle.size
    )
  ) {
    ball.velocity.x = Math.abs(ball.velocity.x) + PONG_CONFIG.BALL_SPEED_INCREASE

    // Add spin based on where ball hits paddle
    const paddleCenter = state.playerPaddle.position.y + state.playerPaddle.size.height / 2
    const ballCenter = ball.position.y + ball.size.height / 2
    const diff = ballCenter - paddleCenter
    ball.velocity.y += diff * 0.1
  }

  // AI paddle collision
  if (
    checkCollision(ball.position, ball.size, state.aiPaddle.position, state.aiPaddle.size)
  ) {
    ball.velocity.x = -(Math.abs(ball.velocity.x) + PONG_CONFIG.BALL_SPEED_INCREASE)

    // Add spin based on where ball hits paddle
    const paddleCenter = state.aiPaddle.position.y + state.aiPaddle.size.height / 2
    const ballCenter = ball.position.y + ball.size.height / 2
    const diff = ballCenter - paddleCenter
    ball.velocity.y += diff * 0.1
  }

  // Score points
  if (ball.position.x < 0) {
    aiScore++
    ball = createBall()
  } else if (ball.position.x > PONG_CONFIG.CANVAS_WIDTH) {
    playerScore++
    ball = createBall()
  }

  return {
    ...state,
    ball,
    playerScore,
    aiScore,
  }
}

export const checkWinner = (state: PongState): PongState => {
  if (state.playerScore >= PONG_CONFIG.MAX_SCORE) {
    return {
      ...state,
      isGameOver: true,
      isPlaying: false,
      winner: 'player',
    }
  }

  if (state.aiScore >= PONG_CONFIG.MAX_SCORE) {
    return {
      ...state,
      isGameOver: true,
      isPlaying: false,
      winner: 'ai',
    }
  }

  return state
}
