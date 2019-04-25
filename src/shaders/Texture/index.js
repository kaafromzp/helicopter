import fragment from './fragment.glsl';
import vertex from './vertex.glsl';

export default {
    uniforms: {
        texture1: {type: 't', value: null}
    },
    vertexShader: vertex,
    fragmentShader: fragment
};
