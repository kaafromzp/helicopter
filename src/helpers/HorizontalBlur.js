import * as THREE from 'three';
import HorizontalBlurShader from 'shaders/HorizontalBlur/index';
class HorizontalBlurPass extends THREE.Pass {
    constructor(scene, camera) {
        super();
        this.scene = scene;
        this.camera = camera;
        const pars = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat
        };

        this.depthTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            pars
        );
        this.renderTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            pars
        );
        this.depthMaterial = new THREE.MeshDepthMaterial();
        this.horizontalBlurMaterial = new THREE.ShaderMaterial({
            uniforms: {
                tex1: {value: null},
                tex2: {value: null},
                xBase: {value: 500},
                xDelta: {value: 200},
                t: {value: 2000.0},
                screenSize: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
                }
            },
            ...HorizontalBlurShader
        });
        this.fsQuad = new THREE.Pass.FullScreenQuad(this.horizontalBlurMaterial);
    }

    render(renderer, writeBuffer, readBuffer) {
        renderer.setRenderTarget(this.depthTarget);
        this.scene.overrideMaterial = this.depthMaterial;
        renderer.render(this.scene, this.camera);
        this.scene.overrideMaterial = null;

        renderer.setRenderTarget(null);

        this.horizontalBlurMaterial.uniforms.tex1.value = writeBuffer.texture;
        this.horizontalBlurMaterial.uniforms.tex2.value = this.depthTarget.texture;

        /*
         * This.horizontalBlurMaterial.uniforms = {
         * uTime: {value: 1000},
         * uAlpha: {value: 1},
         * uAlphaNoise: {value: new THREE.Vector4(0.2, 0.4, 1, 1)},
         * uSize: {value: 0.03},
         * uSmoothness: {value: 0.5},
         * uColor: {value: new THREE.Color(11184895)},
         * uBlur: {value: 0.1},
         * uFadeAmplitude: {value: 0.5},
         * uFadeStart: {value: -1.4},
         * uFadeEnd: {value: -2},
         * uCursorPosition: {value: new THREE.Vector3(0.5, 0, 0)},
         * uCursorAlphaStrength: {value: 1}
         *};
         */
        this.fsQuad.render(renderer);
    }
}
export default HorizontalBlurPass;
