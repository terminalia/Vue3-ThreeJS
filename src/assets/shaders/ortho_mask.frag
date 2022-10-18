uniform vec3 uDiffuseCol;
uniform sampler2D uDiffuseTex;
uniform sampler2D uAlphaTex;
uniform float uRepeatU;
uniform float uRepeatV;

varying vec2 vUv;

void main() 
{
    vec2 rUV = vec2(vUv.x * uRepeatU, vUv.y * uRepeatV);
    vec4 diffuseTex = texture2D(uDiffuseTex, rUV);
    vec4 alphaTex = texture2D(uAlphaTex, rUV);
    gl_FragColor = vec4(uDiffuseCol * vec3(diffuseTex), alphaTex.r);
}