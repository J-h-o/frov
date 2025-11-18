# Hill Climb Racing - Documentation

## Overview
Physics-based driving game. Drive a vehicle over hilly terrain, manage your fuel, and try to travel as far as possible without flipping over.

## Current Implementation (Level 1 - POC)
- ✅ 2D physics simulation (gravity, velocity, friction)
- ✅ Simple vehicle with two wheels
- ✅ Procedurally generated hilly terrain
- ✅ Wheel-ground collision detection
- ✅ Vehicle rotation based on terrain
- ✅ Fuel system (depletes when accelerating)
- ✅ Distance and score tracking
- ✅ Game over conditions (no fuel, flipped over)
- ✅ Keyboard controls (accelerate, brake)
- ✅ Camera follows vehicle

## How to Play
**Goal:** Travel as far as possible without running out of fuel or flipping over

**Controls:**
- Arrow Right / W: Accelerate (uses fuel)
- Arrow Left / S: Brake
- Space: Pause
- ESC: Pause

**Gameplay:**
1. Press SPACE to start
2. Use acceleration to climb hills
3. Don't flip over (game over if upside down)
4. Manage fuel carefully
5. Distance traveled = your score

**Tips:**
- Use brakes when going downhill to prevent flipping
- Don't accelerate too much on steep hills
- Balance is key - too much speed can flip you over

## Expansion Levels

**Level 2**: Multiple Vehicles
- Add different vehicle types (jeep, bike, monster truck)
- Each with different stats (speed, fuel capacity, weight)
- Vehicle selection screen
- Estimated time: 8-10 hours
- Changes needed:
  - Create vehicle types with different configurations
  - Add vehicle selection UI
  - Adjust physics per vehicle type

**Level 3**: Power-ups and Coins
- Fuel cans to collect on terrain
- Coins for scoring
- Boost power-up for speed
- Collectible spawning system
- Estimated time: 10-12 hours
- Changes needed:
  - Add collectible types to game state
  - Spawn collectibles on terrain
  - Collision detection with collectibles
  - Visual feedback for collection

**Level 4**: Multiple Maps/Terrains
- Different terrain types (desert, moon, arctic)
- Unique terrain generation algorithms per map
- Different gravity and physics per map
- Map selection screen
- Estimated time: 12-15 hours
- Changes needed:
  - Create terrain generators for each map type
  - Add map-specific visuals and colors
  - Adjust physics constants per map
  - Map selection UI

**Level 5**: Upgrades System
- Upgrade engine power
- Upgrade fuel capacity
- Upgrade suspension
- Upgrade tires
- Currency system (earned from distance/coins)
- Persistent upgrade state
- Estimated time: 15-20 hours
- Changes needed:
  - Add upgrade state to vehicle
  - Create upgrade shop UI
  - Implement localStorage for persistence
  - Balance upgrade costs and effects

**Level 6**: Advanced Physics
- Suspension simulation (spring/damper)
- Wheel torque and traction
- Air resistance
- More realistic rotation physics
- Particle effects (dust, exhaust)
- Estimated time: 20-25 hours
- Changes needed:
  - Implement spring physics for suspension
  - Add torque calculations
  - Create particle system
  - Improve collision response

**Level 7**: Multiplayer & Leaderboards
- Ghost racing (replay best runs)
- Online leaderboards
- Challenge friends
- Daily challenges
- Estimated time: 25-30 hours
- Changes needed:
  - Record and replay runs
  - Backend integration for leaderboards
  - Real-time multiplayer (WebSocket)
  - Challenge system

**Total Time Estimate**: 90-112 hours for all expansion levels

## Implementation Notes
- Uses simple 2D rigid body physics
- Terrain generated with random walk smoothing
- Vehicle has two wheels for ground contact
- Rotation calculated from wheel positions
- Physics runs at 60 FPS
- Camera offset follows vehicle smoothly

## Technical Details
- Physics: Custom 2D physics (gravity, velocity, friction)
- Collision: Point-to-line segment detection
- Terrain: Height map with interpolation
- Rendering: Canvas 2D with camera transform
- Controls: Event-based keyboard input

---
**Status**: ✅ POC Complete | **Last Updated**: 2025-11-18
