
varying vec2 UV;
uniform sampler2D tex1; //diffuse
//uniform sampler2D tex2; //depth
uniform int xBase;  //in pixels [0..width]
uniform int xDelta; //in pixels [0..width]   
uniform float t;    // msec
uniform vec2 screenSize;

const float effectTime = 2000.0; // msec
const int effectDelta = 200; //in pixels [0..width]

float rand(float from, float to, vec2 co) {
        return (
            from +
            fract(sin(dot(co.xy,vec2(12.9898, 78.233))) * 43758.5453) *
                (to - from)
        );
    }

void main(){
    vec4 pixelColor = vec4(texture2D(tex1,UV));
  //  float pixelDepth = vec4(texture2D(tex2,UV)).r;

    vec2 UVBase = vec2(float(xBase) / float(screenSize.x),UV.y);
    vec2 UVUp = vec2(float(xBase) / float(screenSize.x),UV.y + 0.01);
    vec2 UVDn = vec2(float(xBase) / float(screenSize.x),UV.y - 0.01);

    vec4 baseColor =    vec4(texture2D(tex1,UVBase).rgba) + 
                        ( vec4(texture2D(tex1,UVUp).rgba) + vec4(texture2D(tex1,UVDn).rgba))
                        / 3.0;

vec4 randomColor = vec4(rand(0.0,1.0,UV * 1.0),
                        rand(0.0,1.0,UV * 1.5),
                        rand(0.0,1.0,UV * 2.0),
                        1.0);
  // baseColor = mix(baseColor,randomColor,mod((UV.y * float(screenSize.y)),10.0) / 10.0);
        float kResult =  clamp(
                            clamp((t / effectTime),0.0,1.0) * // smooth increase
                            clamp((float(xDelta) / float(effectDelta)),0.0,1.0) *   // delta from drag&drop
                            (1.0 - clamp(abs(UV.x - float(xBase) / float(screenSize.x)), 0.0 , 1.0) * 1.0), // distance from xBase
                            0.0,1.0);
       // if (pixelDepth == 0.0) {
            gl_FragColor = mix(pixelColor,baseColor,pow(kResult,1.0));
        
       // } else {
        //    gl_FragColor = pixelColor;
       // }
    
}