precision highp float;

uniform sampler2D uState;
uniform sampler2D uPressure;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).r;
  float right = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).r;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexel.y)).r;
  float top = texture(uPressure, vUv + vec2(0.0, uTexel.y)).r;
  vec4 state = texture(uState, vUv);
  state.xy -= 0.5 * vec2(right - left, top - bottom);
  fragColor = state;
}
