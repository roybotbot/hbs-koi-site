precision highp float;

uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uPressure, vUv - vec2(uTexel.x, 0.0)).r;
  float right = texture(uPressure, vUv + vec2(uTexel.x, 0.0)).r;
  float bottom = texture(uPressure, vUv - vec2(0.0, uTexel.y)).r;
  float top = texture(uPressure, vUv + vec2(0.0, uTexel.y)).r;
  float divergence = texture(uDivergence, vUv).r;
  fragColor = vec4((left + right + bottom + top - divergence) * 0.25, 0.0, 0.0, 1.0);
}
