uniform vec3 uDiffuseCol;
uniform sampler2D uDiffuseTex;
uniform sampler2D uAlphaTex;

varying vec2 vUv;

void main() 
{
    vec4 diffuseTex = texture2D(uDiffuseTex, vUv);
    vec4 alphaTex = texture2D(uAlphaTex, vUv);
    gl_FragColor = vec4(uDiffuseCol * vec3(diffuseTex), alphaTex.r);
}