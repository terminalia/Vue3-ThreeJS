uniform float uTime;
uniform float uProgress;
uniform sampler2D uTexture1;
uniform vec4 uResolution;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vColor;

float PI = 3.141592653589793238;

void main() 
{
    gl_FragColor = vec4(vColor, 1.);
    //gl_FragColor = vec4(vUv, 0.0, 1.);
}
