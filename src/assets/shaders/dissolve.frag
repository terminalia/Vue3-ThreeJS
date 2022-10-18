uniform vec3 uDiffuseCol;
uniform sampler2D uDiffuseTex;
uniform sampler2D uDissolveTex;
uniform float uDissolveAmount;

varying vec2 vUv;

void main() 
{

    vec4 dissolvTex = texture2D(uDissolveTex, vUv);
    float dissolve_val = dissolvTex.r - uDissolveAmount;

    if (dissolve_val < 0.0)
        discard;

    vec4 diffuseTex = texture2D(uDiffuseTex, vUv);
    gl_FragColor = vec4(uDiffuseCol,1.0) * diffuseTex;
}
