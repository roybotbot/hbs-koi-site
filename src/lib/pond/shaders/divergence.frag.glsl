precision highp float;

uniform sampler2D uState;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uState, vUv - vec2(uTexel.x, 0.0)).x;
  float right = texture(uState, vUv + vec2(uTexel.x, 0.0)).x;
  float bottom = texture(uState, vUv - vec2(0.0, uTexel.y)).y;
  float top = texture(uState, vUv + vec2(0.0, uTexel.y)).y;
  float divergence = 0.5 * (right - left + top - bottom);
  fragColor = vec4(divergence, 0.0, 0.0, 1.0);
}
