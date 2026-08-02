precision highp float;

uniform sampler2D uState;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  float left = texture(uState, vUv - vec2(uTexel.x, 0.0)).z;
  float right = texture(uState, vUv + vec2(uTexel.x, 0.0)).z;
  float bottom = texture(uState, vUv - vec2(0.0, uTexel.y)).z;
  float top = texture(uState, vUv + vec2(0.0, uTexel.y)).z;
  vec3 normal = normalize(vec3((left - right) * 16.0, (bottom - top) * 16.0, 1.0));
  fragColor = vec4(normal * 0.5 + 0.5, 1.0);
}
