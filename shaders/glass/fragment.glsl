uniform sampler2D iChannel0;
uniform vec3 uCameraPosition;

varying vec3 vWorldPosition;
varying vec3 vNormal;

void main() {
    vec3 worldPosition = vWorldPosition;
    vec3 worldNormal = normalize(vNormal);

    vec3 I = normalize(worldPosition - uCameraPosition);
    vec3 R = reflect(I, worldNormal);

    vec3 reflectColor = texture2D(iChannel0, vec2(0.5) - 0.5 * R.xy / R.z).rgb;

    float zoomFactor = 0.6;

    // Adjust refractive indices for a smaller chromatic dispersion
    float refractiveIndexR = 1.02;
    float refractiveIndexG = 1.015;
    float refractiveIndexB = 1.01;

    vec3 refractColorR = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexR).xy / (refract(I, worldNormal, 1.0 / refractiveIndexR).z)).rgb;
    vec3 refractColorG = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexG).xy / (refract(I, worldNormal, 1.0 / refractiveIndexG).z)).rgb;
    vec3 refractColorB = texture2D(iChannel0, vec2(0.5) - zoomFactor * refract(I, worldNormal, 1.0 / refractiveIndexB).xy / (refract(I, worldNormal, 1.0 / refractiveIndexB).z)).rgb;

    vec3 refractionColor = vec3(refractColorR.r, refractColorG.g, refractColorB.b);

    gl_FragColor = vec4(mix(refractionColor, reflectColor, 0.1), 1.0);
}
