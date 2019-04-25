//uniform sampler2D texture; 
uniform float uAlpha;   
uniform float uSmoothness;   
uniform vec3 uColor;      
varying float vAlpha;      
void main()   {       
        float dist = sqrt( dot( gl_PointCoord - 0.5, gl_PointCoord - 0.5 ) ) + 0.5;       
        float customAlpha = 1.0 - dist;          
        customAlpha = smoothstep( 0.0, uSmoothness, customAlpha );       
        customAlpha *= uAlpha;       
        customAlpha *= vAlpha;          
        gl_FragColor = vec4( uColor, customAlpha );   
        } 