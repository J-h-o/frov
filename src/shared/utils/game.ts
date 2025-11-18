/**
 * Shared game utilities
 * DRY principle - common game functions used across all games
 */

import type { Position, Velocity, Size } from '@shared/types'

/**
 * Check collision between two rectangles (AABB collision detection)
 */
export const checkCollision = (
  pos1: Position,
  size1: Size,
  pos2: Position,
  size2: Size
): boolean => {
  return (
    pos1.x < pos2.x + size2.width &&
    pos1.x + size1.width > pos2.x &&
    pos1.y < pos2.y + size2.height &&
    pos1.y + size1.height > pos2.y
  )
}

/**
 * Check if position is within bounds
 */
export const isInBounds = (pos: Position, size: Size, bounds: Size): boolean => {
  return pos.x >= 0 && pos.y >= 0 && pos.x + size.width <= bounds.width && pos.y + size.height <= bounds.height
}

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max)
}

/**
 * Calculate distance between two points
 */
export const distance = (pos1: Position, pos2: Position): number => {
  const dx = pos2.x - pos1.x
  const dy = pos2.y - pos1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Normalize velocity to maintain consistent speed
 */
export const normalizeVelocity = (velocity: Velocity, speed: number): Velocity => {
  const magnitude = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y)
  if (magnitude === 0) return { x: 0, y: 0 }
  return {
    x: (velocity.x / magnitude) * speed,
    y: (velocity.y / magnitude) * speed,
  }
}

/**
 * Generate random number between min and max
 */
export const random = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * Generate random integer between min and max (inclusive)
 */
export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Format score with commas for thousands
 */
export const formatScore = (score: number): string => {
  return score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

/**
 * Format time in MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

/**
 * Pause execution for specified milliseconds
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
