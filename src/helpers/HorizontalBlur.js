import * as THREE from 'three';
import HorizontalBlurShader from 'shaders/HorizontalBlur/index';
import TextureShader from 'shaders/Texture/index';
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
        this.blurTarget = new THREE.WebGLRenderTarget(
            window.innerWidth,
            window.innerHeight,
            pars
        );
        this.depthMaterial = new THREE.MeshDepthMaterial();
        this.horizontalBlurMaterial = new THREE.ShaderMaterial({
            ...HorizontalBlurShader
        });
        this.textureMaterial = new THREE.ShaderMaterial({
            ...TextureShader
        });
        this.fsQuadBackground = new THREE.Pass.FullScreenQuad(this.textureMaterial);
        this.fsQuad = new THREE.Pass.FullScreenQuad(this.horizontalBlurMaterial);
        this.background = this.scene.background;
    }

    render(renderer, writeBuffer, readBuffer) {
        renderer.setRenderTarget(this.renderTarget);
        this.textureMaterial.uniforms.texture1.value = this.background;
        this.fsQuadBackground.render(renderer);
        this.firstPass = true;

        renderer.setRenderTarget(this.blurTarget);
        this.horizontalBlurMaterial.uniforms.tex1.value = this.renderTarget.texture;
        this.fsQuad.render(renderer);

        this.scene.background = null;
        this.scene.background = this.blurTarget.texture;

        this.scene.overrideMaterial = null;
        renderer.setRenderTarget(null);
        renderer.render(this.scene, this.camera);

        /*
         * Renderer.setRenderTarget(this.depthTarget);
         * this.scene.overrideMaterial = this.depthMaterial;
         * renderer.render(this.scene, this.camera);
         * this.scene.overrideMaterial = null;
         *
         * renderer.setRenderTarget(null);
         *
         * this.horizontalBlurMaterial.uniforms.tex1.value = writeBuffer.texture;
         * this.horizontalBlurMaterial.uniforms.tex2.value = this.depthTarget.texture;
         *
         *this.fsQuad.render(renderer);
         */
    }
}
export default HorizontalBlurPass;
