uniform vec3 uColor;
uniform sampler2D uTexture;
uniform float uRepeatU;
uniform float uRepeatV;

varying vec2 vUv;

void main() 
{
    vec4 textureColor = texture2D(uTexture, vec2(vUv.x * uRepeatU, vUv.y * uRepeatV));
    gl_FragColor = vec4(uColor, 1) * textureColor;
}