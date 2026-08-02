import { describe, expect, it } from 'vitest';
import { shouldEnablePondWake } from '../../src/lib/pond/support';

const capable = { webgl2: true, reducedMotion: false, saveData: false, lowMemory: false };

describe('shouldEnablePondWake', () => {
  it('enables capable devices', () => expect(shouldEnablePondWake(capable)).toBe(true));
  it('disables reduced motion', () =>
    expect(shouldEnablePondWake({ ...capable, reducedMotion: true })).toBe(false));
  it('disables data saver', () =>
    expect(shouldEnablePondWake({ ...capable, saveData: true })).toBe(false));
  it('disables missing WebGL2', () =>
    expect(shouldEnablePondWake({ ...capable, webgl2: false })).toBe(false));
  it('disables low-memory devices', () =>
    expect(shouldEnablePondWake({ ...capable, lowMemory: true })).toBe(false));
});
