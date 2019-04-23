/* eslint no-console: off */
import './helpers/GLTFLoader';
import './helpers/OrbitControls';
import * as THREE from 'three';
import WEBGL from './helpers/WebGL';

export default class Viewer3D {
    constructor(name, scene = null, camera = null) {
        this.init();
        this.animate();
    }

    init() {
        const clock = new THREE.Clock();

        if (WEBGL.isWebGL2Available() === false) {
            document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
        }

        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl2', {antialias: false});

        const camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        camera.position.set(-1.74, 1.85, 11.56);
        camera.rotation.set(
            THREE.Math.degToRad(-15),
            THREE.Math.degToRad(-16),
            THREE.Math.degToRad(-4)
        );

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x808080);

        let light = new THREE.DirectionalLight(0xffffff, 0.5);
        light.position.set(-7.9, 9.9, 4.3);
        scene.add(light);

        light = new THREE.AmbientLight(0x000000, 0.5);
        scene.add(light);
        light = new THREE.HemisphereLight(0xdcf6ff, 0x082020, 0.8);
        light.position.set(0, 10, 0);
        // Soft white light
        scene.add(light);

        let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        scene.add(grid);

        // Model
        const manager = new THREE.LoadingManager();
        /*
         * Manager.onStart = (url, itemsLoaded, itemsTotal) => {
         *
         * Document.getElementById('load').innerHTML = `${itemsLoaded} of ${itemsTotal} files.`;
         * console.log(`Started loading file: ${
         * url
         * }.\nLoaded ${
         * itemsLoaded
         * } of ${
         * itemsTotal
         * } files.`);
         *
         * };
         * manager.onLoad = () => {
         * // Document.getElementById('load').innerHTML = ' ';
         * console.log('Loading complete!');
         * };
         * manager.onProgress = (url, itemsLoaded, itemsTotal) => {
         * // Document.getElementById('load').innerHTML = `${itemsLoaded} of ${itemsTotal} files.`;
         * };
         * manager.onError = (url) => {
         * console.log(`There was an error loading ${url}`);
         * };
         */
        const urls = [
            'envMap/posx.jpg',
            'envMap/negx.jpg',
            'envMap/posy.jpg',
            'envMap/negy.jpg',
            'envMap/posz.jpg',
            'envMap/negz.jpg'
        ];
        let mixer;
        const envLoader = new THREE.CubeTextureLoader(manager);
        envLoader.load(urls, (envTexture) => {
            let loadergltf = new THREE.GLTFLoader(manager);
            loadergltf.load('glTF/helicopter.gltf', (gltf) => {
                mixer = new THREE.AnimationMixer(gltf.scene);
                this.mixer = mixer;
                let action = mixer.clipAction(gltf.animations[0]);
                action.play();
                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        if (child.material.name === 'Glass') {
                            child.material.opacity = 0.5;
                            child.material.transparent = true;
                        }
                        child.material.envMap = envTexture;
                    }
                });
                scene.add(gltf.scene);
            });
            scene.background = envTexture;
        });

        const renderer = new THREE.WebGLRenderer(canvas, context, {antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.gammaOutput = true;

        document.body.appendChild(renderer.domElement);

        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.update();

        this.clock = clock;
        this.canvas = canvas;
        this.camera = camera;
        this.scene = scene;
        this.renderer = renderer;
        this.controls = controls;
        this.context = context;

        window.addEventListener(
            'resize',
            () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );
        document.addEventListener(
            'mousemove',
            () => {
                this.mouseX = (event.clientX - window.innerWidth / 2) / 50;
                this.mouseY = (event.clientY - window.innerHeight / 2) / 50;
            },
            false
        );
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(this.delta);
        }
        this.render();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
