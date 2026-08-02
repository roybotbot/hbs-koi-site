precision highp float;

uniform sampler2D uSource;
uniform sampler2D uState;
uniform sampler2D uNormals;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec3 normal = texture(uNormals, vUv).rgb * 2.0 - 1.0;
  float height = texture(uState, vUv).z;
  vec2 refractedUv = clamp(vUv + normal.xy * 0.018, 0.0, 1.0);
  vec3 source = texture(uSource, refractedUv).rgb;
  vec3 waterTint = vec3(0.67, 0.82, 0.70);
  vec3 color = mix(source, source * waterTint, 0.16);

  vec3 lightDirection = normalize(vec3(-0.35, 0.45, 0.82));
  float specular = pow(max(dot(normal, lightDirection), 0.0), 36.0) * 0.18;
  float fresnel = pow(1.0 - max(normal.z, 0.0), 3.0) * 0.12;
  float caustic = smoothstep(0.018, 0.08, abs(height)) * 0.08;

  fragColor = vec4(color + vec3(specular + fresnel + caustic), 1.0);
}
