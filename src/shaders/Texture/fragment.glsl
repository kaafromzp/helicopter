//#version 300 es

precision highp float;
precision highp int;

uniform highp sampler2D texture1;
varying vec2 vUv;
//out vec4 fragmentColor[1];

void main() 
{
        gl_FragColor = vec4(texture2D(texture1,vUv));
}