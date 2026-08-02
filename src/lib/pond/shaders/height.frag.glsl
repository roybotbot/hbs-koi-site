precision highp float;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDelta;
uniform vec2 uBody;
uniform vec2 uBodyVelocity;
uniform vec2 uBodyAcceleration;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 state = texture(uState, vUv);
  float left = texture(uState, vUv - vec2(uTexel.x, 0.0)).z;
  float right = texture(uState, vUv + vec2(uTexel.x, 0.0)).z;
  float bottom = texture(uState, vUv - vec2(0.0, uTexel.y)).z;
  float top = texture(uState, vUv + vec2(0.0, uTexel.y)).z;
  float laplacian = left + right + bottom + top - 4.0 * state.z;
  float height = state.z + (state.z - state.w) * 0.982 + laplacian * 0.19;

  vec2 bodyDelta = vUv - uBody;
  float bodyMask = exp(-dot(bodyDelta, bodyDelta) * 680.0);
  float bodyForce = length(uBodyVelocity) * 0.018 + length(uBodyAcceleration) * 0.0015;
  height += bodyMask * bodyForce;

  vec2 direction = length(bodyDelta) > 0.0001 ? normalize(bodyDelta) : vec2(0.0);
  vec2 velocity = state.xy * exp(-0.55 * uDelta) + direction * bodyMask * bodyForce * 0.35;
  fragColor = vec4(velocity, clamp(height, -0.12, 0.12), state.z);
}
