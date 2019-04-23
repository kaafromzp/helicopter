/* eslint no-console: off */
import './helpers/GLTFLoader';
import './helpers/OrbitControls';
import * as THREE from 'three';
import Scene from './Scene';
import WEBGL from './helpers/WebGL';

export default class Viewer3D {
    constructor() {
        this.WEBGLCheck();
        if (this.canvas && this.context) {
            this.init();
            this.animate();
        }
    }

    WEBGLCheck() {
        if (WEBGL.isWebGL2Available() === false) {
            if (WEBGL.isWebGLAvailable() === false) {
                document.body.appendChild(WEBGL.getWebGLErrorMessage());
            } else {
                console.log('webgl v1 is available');
                this.canvas = document.createElement('canvas');
                this.context = this.canvas.getContext('webgl', {antialias: true});
            }
        } else {
            console.log('webgl v2 is available');
            this.canvas = document.createElement('canvas');
            this.context = this.canvas.getContext('webgl2', {antialias: true});
        }
    }

    initScene() {
        const scene = new Scene(this);
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

        scene.setCubeTextureBackground('/assets/textures/background/');
        scene.loadGLTFModel('assets/models/helicopter/helicopter.gltf', this.manager);

        this.scene = scene;
    }

    initCamera() {
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
        this.camera = camera;
    }

    initRenderer() {
        const renderer = new THREE.WebGLRenderer(this.canvas, this.context, {
            antialias: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);
        renderer.gammaOutput = true;

        document.body.appendChild(renderer.domElement);

        this.renderer = renderer;
    }

    initOrbitControls() {
        const controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.target = new THREE.Vector3(0, 0, 0);
        controls.update();
        this.controls = controls;
    }

    initManager() {
        this.manager = new THREE.LoadingManager();
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
    }

    init() {
        this.initManager();

        this.initCamera();

        this.initRenderer();

        this.initScene();

        this.initOrbitControls();

        this.clock = new THREE.Clock();

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
