export interface PondCapabilities {
  webgl2: boolean;
  reducedMotion: boolean;
  saveData: boolean;
  lowMemory: boolean;
}

export function shouldEnablePondWake(value: PondCapabilities): boolean {
  return value.webgl2 && !value.reducedMotion && !value.saveData && !value.lowMemory;
}
