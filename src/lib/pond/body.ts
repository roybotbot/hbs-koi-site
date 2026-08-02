export interface Vec2 {
  x: number;
  y: number;
}

export interface BodyState {
  position: Vec2;
  velocity: Vec2;
  acceleration: Vec2;
}

export function createBodyState(position: Vec2 = { x: 0.5, y: 0.5 }): BodyState {
  return {
    position: { ...position },
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
  };
}

export function stepBody(state: BodyState, target: Vec2, deltaSeconds: number): BodyState {
  const spring = 16;
  const drag = Math.exp(-5 * deltaSeconds);
  const acceleration = {
    x: (target.x - state.position.x) * spring,
    y: (target.y - state.position.y) * spring,
  };
  const velocity = {
    x: (state.velocity.x + acceleration.x * deltaSeconds) * drag,
    y: (state.velocity.y + acceleration.y * deltaSeconds) * drag,
  };

  return {
    acceleration,
    velocity,
    position: {
      x: Math.min(1, Math.max(0, state.position.x + velocity.x * deltaSeconds)),
      y: Math.min(1, Math.max(0, state.position.y + velocity.y * deltaSeconds)),
    },
  };
}
