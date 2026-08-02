import {
  ClampToEdgeWrapping,
  GLSL3,
  HalfFloatType,
  LinearFilter,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three';
import type { BodyState } from './body';
import fullscreenVertexShader from './shaders/fullscreen.vert.glsl?raw';
import advectionFragmentShader from './shaders/advection.frag.glsl?raw';
import divergenceFragmentShader from './shaders/divergence.frag.glsl?raw';
import jacobiFragmentShader from './shaders/jacobi.frag.glsl?raw';
import gradientSubtractFragmentShader from './shaders/gradientSubtract.frag.glsl?raw';
import heightFragmentShader from './shaders/height.frag.glsl?raw';
import normalsFragmentShader from './shaders/normals.frag.glsl?raw';
import compositeFragmentShader from './shaders/composite.frag.glsl?raw';

export interface SimulationInput {
  body: BodyState;
  deltaSeconds: number;
}

interface SimulationMaterial extends ShaderMaterial {
  uniforms: Record<string, { value: unknown }>;
}

const MAX_SIMULATION_SIZE = 512;
const PRESSURE_ITERATIONS = 12;

export class FluidSimulation {
  private readonly renderer: WebGLRenderer;
  private readonly scene = new Scene();
  private readonly camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private readonly geometry = new PlaneGeometry(2, 2);
  private readonly sourceTexture: Texture;
  private readonly materials: SimulationMaterial[];
  private readonly quad: Mesh;
  private stateRead: WebGLRenderTarget;
  private stateWrite: WebGLRenderTarget;
  private readonly divergenceTarget: WebGLRenderTarget;
  private readonly pressureTargets: [WebGLRenderTarget, WebGLRenderTarget];
  private readonly normalsTarget: WebGLRenderTarget;
  private simulationWidth = 1;
  private simulationHeight = 1;

  constructor(
    canvas: HTMLCanvasElement,
    sourceImage: HTMLImageElement,
    context: WebGL2RenderingContext,
  ) {
    this.renderer = new WebGLRenderer({ canvas, context, alpha: false, antialias: false });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));

    this.sourceTexture = new Texture(sourceImage);
    this.sourceTexture.colorSpace = SRGBColorSpace;
    this.sourceTexture.needsUpdate = true;

    this.stateRead = this.createTarget();
    this.stateWrite = this.createTarget();
    this.divergenceTarget = this.createTarget();
    this.pressureTargets = [this.createTarget(), this.createTarget()];
    this.normalsTarget = this.createTarget();

    const texel = new Vector2(1, 1);
    const material = (fragmentShader: string, uniforms: Record<string, { value: unknown }>) =>
      new ShaderMaterial({
        glslVersion: GLSL3,
        vertexShader: fullscreenVertexShader,
        fragmentShader,
        uniforms,
        depthTest: false,
        depthWrite: false,
      }) as SimulationMaterial;

    const advection = material(advectionFragmentShader, {
      uState: { value: this.stateRead.texture },
      uTexel: { value: texel.clone() },
      uDelta: { value: 0 },
    });
    const divergence = material(divergenceFragmentShader, {
      uState: { value: this.stateWrite.texture },
      uTexel: { value: texel.clone() },
    });
    const jacobi = material(jacobiFragmentShader, {
      uPressure: { value: this.pressureTargets[0].texture },
      uDivergence: { value: this.divergenceTarget.texture },
      uTexel: { value: texel.clone() },
    });
    const gradientSubtract = material(gradientSubtractFragmentShader, {
      uState: { value: this.stateWrite.texture },
      uPressure: { value: this.pressureTargets[0].texture },
      uTexel: { value: texel.clone() },
    });
    const height = material(heightFragmentShader, {
      uState: { value: this.stateRead.texture },
      uTexel: { value: texel.clone() },
      uDelta: { value: 0 },
      uBody: { value: new Vector2(0.5, 0.5) },
      uBodyVelocity: { value: new Vector2() },
      uBodyAcceleration: { value: new Vector2() },
    });
    const normals = material(normalsFragmentShader, {
      uState: { value: this.stateRead.texture },
      uTexel: { value: texel.clone() },
    });
    const composite = material(compositeFragmentShader, {
      uSource: { value: this.sourceTexture },
      uState: { value: this.stateRead.texture },
      uNormals: { value: this.normalsTarget.texture },
    });

    this.materials = [advection, divergence, jacobi, gradientSubtract, height, normals, composite];
    this.quad = new Mesh(this.geometry, advection);
    this.quad.frustumCulled = false;
    this.scene.add(this.quad);
  }

  step({ body, deltaSeconds }: SimulationInput): void {
    const [advection, divergence, jacobi, gradientSubtract, height] = this.materials;

    advection.uniforms.uState.value = this.stateRead.texture;
    advection.uniforms.uDelta.value = deltaSeconds;
    this.runPass(advection, this.stateWrite);

    divergence.uniforms.uState.value = this.stateWrite.texture;
    this.runPass(divergence, this.divergenceTarget);

    this.renderer.setRenderTarget(this.pressureTargets[0]);
    this.renderer.clear();
    let pressureRead = this.pressureTargets[0];
    let pressureWrite = this.pressureTargets[1];
    for (let iteration = 0; iteration < PRESSURE_ITERATIONS; iteration += 1) {
      jacobi.uniforms.uPressure.value = pressureRead.texture;
      this.runPass(jacobi, pressureWrite);
      [pressureRead, pressureWrite] = [pressureWrite, pressureRead];
    }

    gradientSubtract.uniforms.uState.value = this.stateWrite.texture;
    gradientSubtract.uniforms.uPressure.value = pressureRead.texture;
    this.runPass(gradientSubtract, this.stateRead);

    height.uniforms.uState.value = this.stateRead.texture;
    height.uniforms.uDelta.value = deltaSeconds;
    (height.uniforms.uBody.value as Vector2).set(body.position.x, body.position.y);
    (height.uniforms.uBodyVelocity.value as Vector2).set(body.velocity.x, body.velocity.y);
    (height.uniforms.uBodyAcceleration.value as Vector2).set(
      body.acceleration.x,
      body.acceleration.y,
    );
    this.runPass(height, this.stateWrite);
    [this.stateRead, this.stateWrite] = [this.stateWrite, this.stateRead];
  }

  render(): void {
    const normals = this.materials[5];
    const composite = this.materials[6];

    normals.uniforms.uState.value = this.stateRead.texture;
    this.runPass(normals, this.normalsTarget);
    composite.uniforms.uState.value = this.stateRead.texture;
    composite.uniforms.uNormals.value = this.normalsTarget.texture;
    this.runPass(composite, null);
  }

  resize(width: number, height: number): void {
    const safeWidth = Math.max(1, Math.floor(width));
    const safeHeight = Math.max(1, Math.floor(height));
    this.renderer.setSize(safeWidth, safeHeight, false);

    const scale = Math.min(1, MAX_SIMULATION_SIZE / Math.max(safeWidth, safeHeight));
    this.simulationWidth = Math.max(1, Math.floor(safeWidth * scale));
    this.simulationHeight = Math.max(1, Math.floor(safeHeight * scale));
    for (const target of this.targets()) {
      target.setSize(this.simulationWidth, this.simulationHeight);
      this.assertFramebufferComplete(target);
    }
    this.renderer.setRenderTarget(null);

    const texel = new Vector2(1 / this.simulationWidth, 1 / this.simulationHeight);
    for (const pass of this.materials.slice(0, 6)) {
      if (pass.uniforms.uTexel) {
        (pass.uniforms.uTexel.value as Vector2).copy(texel);
      }
    }
  }

  dispose(): void {
    this.geometry.dispose();
    for (const material of this.materials) material.dispose();
    for (const target of this.targets()) target.dispose();
    this.sourceTexture.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }

  private createTarget(): WebGLRenderTarget {
    const target = new WebGLRenderTarget(1, 1, {
      type: HalfFloatType,
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      depthBuffer: false,
      stencilBuffer: false,
    });
    target.texture.wrapS = ClampToEdgeWrapping;
    target.texture.wrapT = ClampToEdgeWrapping;
    return target;
  }

  private runPass(material: SimulationMaterial, target: WebGLRenderTarget | null): void {
    this.quad.material = material;
    this.renderer.setRenderTarget(target);
    this.renderer.render(this.scene, this.camera);
  }

  private assertFramebufferComplete(target: WebGLRenderTarget): void {
    this.renderer.setRenderTarget(target);
    const context = this.renderer.getContext();
    if (context.checkFramebufferStatus(context.FRAMEBUFFER) !== context.FRAMEBUFFER_COMPLETE) {
      throw new Error('Pond wake framebuffer is incomplete');
    }
  }

  private targets(): WebGLRenderTarget[] {
    return [
      this.stateRead,
      this.stateWrite,
      this.divergenceTarget,
      ...this.pressureTargets,
      this.normalsTarget,
    ];
  }
}
