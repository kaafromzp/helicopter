import * as THREE from 'three';
import Loader from './Loader';
class Scene extends THREE.Scene {
    constructor(viewer) {
        super();
        this.viewer = viewer;
    }

    setCubeTextureBackground(path, filetype) {
        this.background = Loader.loadCubeTexture(path, filetype);
    }

    set2DTextureBackground(path) {
        this.background = Loader.load2DTexture(path);
    }

    loadGLTFModel(path, manager) {
        const loaderGLTF = new THREE.GLTFLoader(manager);
        loaderGLTF.load(path, (gltf) => {
            let mixer = new THREE.AnimationMixer(gltf.scene);
            this.viewer.mixer = mixer;
            let action = mixer.clipAction(gltf.animations[0]);
            action.play();
            gltf.scene.traverse((child) => {
                if (child.isMesh) {
                    if (child.material.name === 'Glass') {
                        child.material.opacity = 0.5;
                        child.material.transparent = true;
                    }
                    child.material.envMap = this.background;
                }
            });
            this.add(gltf.scene);
        });
    }
}
export default Scene;
