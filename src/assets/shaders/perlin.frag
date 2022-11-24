varying vec2 vUV;
varying vec3 vNormal;

void main()
{
    vec3 color = vec3(vNormal);
    gl_FragColor = vec4(  vec3(1, 1, .5) * color.rgb, 1.0 );
}