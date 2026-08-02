import { createBodyState, stepBody, type BodyState, type Vec2 } from './body';
import { FluidSimulation } from './FluidSimulation';
import { shouldEnablePondWake } from './support';

interface ConnectionHints {
  saveData?: boolean;
}

interface NavigatorWithHints extends Navigator {
  connection?: ConnectionHints;
  deviceMemory?: number;
}

interface PondWakeOptions {
  canvas: HTMLCanvasElement;
  sourceImage: HTMLImageElement;
}

const noCleanup = () => undefined;

export function createPondWake({ canvas, sourceImage }: PondWakeOptions): () => void {
  const matchedRoot = canvas.closest<HTMLElement>('[data-pond-wake]');
  if (!matchedRoot) return noCleanup;
  const root: HTMLElement = matchedRoot;

  const context = canvas.getContext('webgl2', {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  });
  const navigatorWithHints = navigator as NavigatorWithHints;
  const capabilities = {
    webgl2: context !== null,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: navigatorWithHints.connection?.saveData === true,
    lowMemory:
      typeof navigatorWithHints.deviceMemory === 'number' && navigatorWithHints.deviceMemory <= 4,
  };

  if (!context || !shouldEnablePondWake(capabilities)) return noCleanup;

  let simulation: FluidSimulation;
  try {
    simulation = new FluidSimulation(canvas, sourceImage, context);
  } catch {
    return noCleanup;
  }

  let disposed = false;
  let visible = true;
  let animationFrame = 0;
  let previousTime = performance.now();
  let body: BodyState = createBodyState();
  let target: Vec2 = { ...body.position };

  const resize = () => {
    const bounds = root.getBoundingClientRect();
    simulation.resize(bounds.width, bounds.height);
  };

  const frame = (time: number) => {
    if (disposed || !visible) return;

    const deltaSeconds = Math.min(1 / 30, Math.max(1 / 240, (time - previousTime) / 1000));
    previousTime = time;
    body = stepBody(body, target, deltaSeconds);

    try {
      simulation.step({ body, deltaSeconds });
      simulation.render();
      root.dataset.enhanced = 'true';
      animationFrame = requestAnimationFrame(frame);
    } catch {
      cleanup();
    }
  };

  const start = () => {
    if (disposed || animationFrame) return;
    previousTime = performance.now();
    animationFrame = requestAnimationFrame(frame);
  };

  const stop = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const onPointerMove = (event: PointerEvent) => {
    const bounds = root.getBoundingClientRect();
    target = {
      x: Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width)),
      y: Math.min(1, Math.max(0, 1 - (event.clientY - bounds.top) / bounds.height)),
    };
  };

  const onPointerLeave = () => {
    target = { ...body.position };
  };

  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry?.isIntersecting ?? false;
    if (visible) start();
    else stop();
  });
  const resizeObserver = new ResizeObserver(resize);

  function cleanup(): void {
    if (disposed) return;
    disposed = true;
    stop();
    root.removeEventListener('pointermove', onPointerMove);
    root.removeEventListener('pointerleave', onPointerLeave);
    intersectionObserver.disconnect();
    resizeObserver.disconnect();
    delete root.dataset.enhanced;
    simulation.dispose();
  }

  root.addEventListener('pointermove', onPointerMove, { passive: true });
  root.addEventListener('pointerleave', onPointerLeave, { passive: true });
  resizeObserver.observe(root);
  intersectionObserver.observe(root);
  resize();
  start();

  return cleanup;
}
