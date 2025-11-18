/**
 * Hill Climb Racing game types
 */

export interface Vector2 {
  x: number
  y: number
}

export interface Vehicle {
  position: Vector2
  velocity: Vector2
  rotation: number // radians
  angularVelocity: number
  wheelbase: number // distance between wheels
  frontWheel: Wheel
  rearWheel: Wheel
}

export interface Wheel {
  position: Vector2
  radius: number
  rotation: number
  onGround: boolean
  groundNormal: Vector2
}

export interface Terrain {
  points: Vector2[] // Height map points
  segments: TerrainSegment[]
}

export interface TerrainSegment {
  start: Vector2
  end: Vector2
  normal: Vector2
}

export interface HillClimbState {
  vehicle: Vehicle
  terrain: Terrain
  cameraX: number // Camera follows vehicle
  fuel: number
  distance: number
  maxDistance: number
  isPlaying: boolean
  isPaused: boolean
  isGameOver: boolean
  score: number
  accelerating: boolean
  braking: boolean
  time: number
}
