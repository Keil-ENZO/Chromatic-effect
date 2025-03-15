uniform float uGridSize;

varying vec2 vUv;

void main() {
    vec2 grid = abs(fract(vUv * uGridSize - 0.5) - 0.5) / fwidth(vUv * uGridSize);
    float line = min(grid.x, grid.y);
    vec3 color = mix(vec3(0.2, 0.2, 0.2), vec3(1.0), step(0.95, line));
    gl_FragColor = vec4(color, 1.0);
}
