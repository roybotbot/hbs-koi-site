import { describe, expect, it } from 'vitest';
import { createBodyState, stepBody } from '../../src/lib/pond/body';

describe('stepBody', () => {
  it('moves toward target without teleporting', () => {
    const initial = createBodyState({ x: 0.5, y: 0.5 });
    const next = stepBody(initial, { x: 0.9, y: 0.5 }, 1 / 60);

    expect(next.position.x).toBeGreaterThan(0.5);
    expect(next.position.x).toBeLessThan(0.9);
    expect(next.velocity.x).toBeGreaterThan(0);
  });

  it('retains inertia after target stops', () => {
    let state = createBodyState({ x: 0.5, y: 0.5 });
    state = stepBody(state, { x: 0.9, y: 0.5 }, 1 / 60);
    const next = stepBody(state, state.position, 1 / 60);

    expect(next.velocity.x).toBeGreaterThan(0);
  });

  it('clamps body position to pond bounds', () => {
    let state = createBodyState({ x: 0.99, y: 0.01 });
    for (let frame = 0; frame < 120; frame += 1) {
      state = stepBody(state, { x: 2, y: -1 }, 1 / 60);
    }

    expect(state.position.x).toBeLessThanOrEqual(1);
    expect(state.position.y).toBeGreaterThanOrEqual(0);
  });
});
