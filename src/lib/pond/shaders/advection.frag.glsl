precision highp float;

uniform sampler2D uState;
uniform vec2 uTexel;
uniform float uDelta;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec2 velocity = texture(uState, vUv).xy;
  vec2 previousUv = clamp(vUv - velocity * uDelta * 0.22, uTexel, vec2(1.0) - uTexel);
  vec4 state = texture(uState, previousUv);
  state.xy *= exp(-0.45 * uDelta);
  fragColor = state;
}
