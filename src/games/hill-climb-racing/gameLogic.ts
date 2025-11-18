/**
 * Hill Climb Racing game logic
 * 2D physics simulation for vehicle on terrain
 */

import type { Vector2, Vehicle, Wheel, Terrain, TerrainSegment, HillClimbState } from './types'
import { HILLCLIMB_CONFIG } from './config'

/**
 * Generate random hilly terrain
 */
export const generateTerrain = (): Terrain => {
  const points: Vector2[] = []
  let height = HILLCLIMB_CONFIG.TERRAIN_MIN_HEIGHT

  for (let i = 0; i < HILLCLIMB_CONFIG.TERRAIN_POINTS; i++) {
    const x = i * HILLCLIMB_CONFIG.TERRAIN_SEGMENT_LENGTH

    // First few segments are flat for starting area
    if (i < 5) {
      height = HILLCLIMB_CONFIG.TERRAIN_MIN_HEIGHT
    } else {
      // Random walk with smoothing
      const change = (Math.random() - 0.5) * 100 * HILLCLIMB_CONFIG.TERRAIN_SMOOTHNESS
      height += change
      height = Math.max(
        HILLCLIMB_CONFIG.TERRAIN_MIN_HEIGHT,
        Math.min(HILLCLIMB_CONFIG.TERRAIN_MAX_HEIGHT, height)
      )
    }

    points.push({ x, y: height })
  }

  // Create segments with normals
  const segments: TerrainSegment[] = []
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i]
    const end = points[i + 1]

    // Calculate normal (perpendicular to segment)
    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const normal = {
      x: -dy / length,
      y: dx / length,
    }

    segments.push({ start, end, normal })
  }

  return { points, segments }
}

/**
 * Create initial vehicle
 */
const createVehicle = (): Vehicle => {
  return {
    position: { x: 150, y: 200 },
    velocity: { x: 0, y: 0 },
    rotation: 0,
    angularVelocity: 0,
    wheelbase: HILLCLIMB_CONFIG.WHEELBASE,
    frontWheel: {
      position: { x: 0, y: 0 },
      radius: HILLCLIMB_CONFIG.WHEEL_RADIUS,
      rotation: 0,
      onGround: false,
      groundNormal: { x: 0, y: -1 },
    },
    rearWheel: {
      position: { x: 0, y: 0 },
      radius: HILLCLIMB_CONFIG.WHEEL_RADIUS,
      rotation: 0,
      onGround: false,
      groundNormal: { x: 0, y: -1 },
    },
  }
}

/**
 * Create initial game state
 */
export const createInitialState = (): HillClimbState => {
  return {
    vehicle: createVehicle(),
    terrain: generateTerrain(),
    cameraX: 0,
    fuel: HILLCLIMB_CONFIG.INITIAL_FUEL,
    distance: 0,
    maxDistance: 0,
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    accelerating: false,
    braking: false,
    time: 0,
  }
}

/**
 * Get terrain height at x position
 */
export const getTerrainHeight = (terrain: Terrain, x: number): { y: number; normal: Vector2 } => {
  // Find the segment containing this x position
  for (const segment of terrain.segments) {
    if (x >= segment.start.x && x <= segment.end.x) {
      // Interpolate height
      const t = (x - segment.start.x) / (segment.end.x - segment.start.x)
      const y = segment.start.y + t * (segment.end.y - segment.start.y)
      return { y, normal: segment.normal }
    }
  }

  // Default if not found
  return { y: HILLCLIMB_CONFIG.TERRAIN_MIN_HEIGHT, normal: { x: 0, y: -1 } }
}

/**
 * Update wheel positions based on vehicle
 */
const updateWheelPositions = (vehicle: Vehicle): Vehicle => {
  const cos = Math.cos(vehicle.rotation)
  const sin = Math.sin(vehicle.rotation)
  const halfWheelbase = vehicle.wheelbase / 2

  // Rear wheel (behind center)
  const rearX = vehicle.position.x - halfWheelbase * cos
  const rearY = vehicle.position.y - halfWheelbase * sin

  // Front wheel (ahead of center)
  const frontX = vehicle.position.x + halfWheelbase * cos
  const frontY = vehicle.position.y + halfWheelbase * sin

  return {
    ...vehicle,
    rearWheel: {
      ...vehicle.rearWheel,
      position: { x: rearX, y: rearY },
    },
    frontWheel: {
      ...vehicle.frontWheel,
      position: { x: frontX, y: frontY },
    },
  }
}

/**
 * Check wheel collision with terrain
 */
const checkWheelCollision = (wheel: Wheel, terrain: Terrain): Wheel => {
  const ground = getTerrainHeight(terrain, wheel.position.x)
  const wheelBottom = wheel.position.y + wheel.radius

  if (wheelBottom >= ground.y) {
    return {
      ...wheel,
      onGround: true,
      position: { x: wheel.position.x, y: ground.y - wheel.radius },
      groundNormal: ground.normal,
    }
  }

  return {
    ...wheel,
    onGround: false,
    groundNormal: { x: 0, y: -1 },
  }
}

/**
 * Update vehicle physics
 */
export const updatePhysics = (state: HillClimbState, deltaTime: number): HillClimbState => {
  if (!state.isPlaying || state.isPaused || state.isGameOver) return state

  const dt = deltaTime / 1000 // Convert to seconds
  let vehicle = { ...state.vehicle }

  // Update wheel positions
  vehicle = updateWheelPositions(vehicle)

  // Check wheel collisions
  vehicle.rearWheel = checkWheelCollision(vehicle.rearWheel, state.terrain)
  vehicle.frontWheel = checkWheelCollision(vehicle.frontWheel, state.terrain)

  // Apply gravity
  vehicle.velocity.y += HILLCLIMB_CONFIG.GRAVITY * dt

  // Apply engine power
  if (state.accelerating && state.fuel > 0) {
    const power = HILLCLIMB_CONFIG.ENGINE_POWER * dt
    vehicle.velocity.x += power * dt
  }

  // Apply braking
  if (state.braking) {
    const brake = HILLCLIMB_CONFIG.BRAKE_POWER * dt
    vehicle.velocity.x = Math.max(0, vehicle.velocity.x - brake * dt)
  }

  // Limit max speed
  vehicle.velocity.x = Math.min(HILLCLIMB_CONFIG.MAX_SPEED, vehicle.velocity.x)

  // Apply friction
  if (vehicle.rearWheel.onGround || vehicle.frontWheel.onGround) {
    vehicle.velocity.x *= HILLCLIMB_CONFIG.GROUND_FRICTION
    vehicle.velocity.y *= HILLCLIMB_CONFIG.GROUND_FRICTION
  } else {
    vehicle.velocity.x *= HILLCLIMB_CONFIG.AIR_FRICTION
    vehicle.velocity.y *= HILLCLIMB_CONFIG.AIR_FRICTION
  }

  // Update position
  vehicle.position.x += vehicle.velocity.x * dt
  vehicle.position.y += vehicle.velocity.y * dt

  // Update rotation based on ground normal (simple version)
  if (vehicle.rearWheel.onGround && vehicle.frontWheel.onGround) {
    const dx = vehicle.frontWheel.position.x - vehicle.rearWheel.position.x
    const dy = vehicle.frontWheel.position.y - vehicle.rearWheel.position.y
    const targetRotation = Math.atan2(dy, dx)
    vehicle.rotation = targetRotation
  }

  // Ground collision response
  if (vehicle.rearWheel.onGround || vehicle.frontWheel.onGround) {
    // If wheels are on ground, prevent falling through
    if (vehicle.velocity.y > 0) {
      vehicle.velocity.y = 0
    }
  }

  // Update fuel
  let fuel = state.fuel
  if (state.accelerating && fuel > 0) {
    fuel = Math.max(0, fuel - HILLCLIMB_CONFIG.FUEL_CONSUMPTION * dt)
  }

  // Update distance
  const distance = vehicle.position.x / HILLCLIMB_CONFIG.TERRAIN_SEGMENT_LENGTH
  const maxDistance = Math.max(state.maxDistance, distance)
  const score = Math.floor(distance * HILLCLIMB_CONFIG.SCORE_PER_METER)

  // Update camera to follow vehicle
  const cameraX = Math.max(0, vehicle.position.x - HILLCLIMB_CONFIG.CANVAS_WIDTH / 3)

  // Check game over conditions
  let isGameOver = false

  // Out of fuel and stopped
  if (fuel <= 0 && Math.abs(vehicle.velocity.x) < 1) {
    isGameOver = true
  }

  // Vehicle flipped over (upside down)
  const rotationNormalized = ((vehicle.rotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
  if (rotationNormalized > Math.PI / 2 && rotationNormalized < (Math.PI * 3) / 2) {
    if (vehicle.rearWheel.onGround || vehicle.frontWheel.onGround) {
      isGameOver = true
    }
  }

  return {
    ...state,
    vehicle,
    cameraX,
    fuel,
    distance,
    maxDistance,
    score,
    isGameOver,
    time: state.time + dt,
  }
}

/**
 * Handle key press
 */
export const handleKeyDown = (state: HillClimbState, key: string): HillClimbState => {
  switch (key) {
    case 'ArrowRight':
    case 'w':
    case 'W':
      return { ...state, accelerating: true }
    case 'ArrowLeft':
    case 's':
    case 'S':
      return { ...state, braking: true }
    default:
      return state
  }
}

/**
 * Handle key release
 */
export const handleKeyUp = (state: HillClimbState, key: string): HillClimbState => {
  switch (key) {
    case 'ArrowRight':
    case 'w':
    case 'W':
      return { ...state, accelerating: false }
    case 'ArrowLeft':
    case 's':
    case 'S':
      return { ...state, braking: false }
    default:
      return state
  }
}
