import * as THREE from 'three';
import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export default {
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
        tex1: {value: null},
        tex2: {value: null},
        xBase: {value: 500},
        xDelta: {value: 200},
        t: {value: 2000.0},
        screenSize: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        }
    }
};
