uniform vec3 vertexColor;

void main()
{
    gl_FragColor = vec4(vertexColor, 1);
}