/* eslint no-console: off */
import './helpers/EffectComposer';
import './helpers/GLTFLoader';
import './helpers/OrbitControls';
import * as THREE from 'three';
import HorizontalBlurPass from './helpers/HorizontalBlur';
import Loader from './Loader';
import Scene from './Scene';
import TWEEN from '@tweenjs/tween.js';
import WEBGL from './helpers/WebGL';

export default class Viewer3D {
    constructor() {
        this.WEBGLCheck();

        this.slideNumber = 1;
        this.mouseDownX = window.innerWidth / 2;
        this.mouseDeltaX = 0;
        this.mouseDeltaY = 0;
        this.mouseBiasX = 0;
        this.mouseBiasY = 0;

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

    initSlideParameters() {
        this.textures = [
            null,
            Loader.load2DTexture('/assets/textures/slide1/background/s1-d-b.png'),
            Loader.load2DTexture('/assets/textures/slide2/background/s2-d-b.png'),
            Loader.load2DTexture('/assets/textures/slide3/background/s3-d-b.png'),
            Loader.load2DTexture('/assets/textures/slide4/background/s4-d-b.png'),
            Loader.load2DTexture('/assets/textures/slide5/background/s5-d-b.png')
        ];
        this.camerapositions = [
            null,
            {x: -3.085, y: 2.48, z: 13.265},
            {x: -11.577, y: -8.353, z: -10.292},
            {x: -23.23, y: 0.91, z: -1.39},
            {x: 8.78, y: 6.088, z: 11.96},
            {x: -5.585, y: 2.31, z: -22.86}
        ];
        this.cameralookat = [
            null,
            {
                x: -0.7,
                y: -0.6,
                z: 0
            },
            {
                x: 5,
                y: -2.8,
                z: 0
            },
            {
                x: 1.0,
                y: -0.4,
                z: 0.6
            },
            {
                x: -0.5,
                y: -0.1,
                z: 0.5
            },
            {
                x: 5.5,
                y: -0.1,
                z: -1.0
            }
        ];
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

        /*
         * Let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
         * grid.material.opacity = 0.2;
         * grid.material.transparent = true;
         *scene.add(grid);
         */

        // Scene.setCubeTextureBackground('/assets/textures/background/');
        scene.set2DTextureBackground('/assets/textures/slide1/background/s1-d-b.png');
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
        camera.position.set(
            this.camerapositions[1].x,
            this.camerapositions[1].y,
            this.camerapositions[1].z
        );
        /*
         * Camera.rotation.set(
         * this.camerarotations[1].x,
         * this.camerarotations[1].y,
         * this.camerarotations[1].z
         *);
         */
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
        controls.enabled = false;
        controls.screenSpacePanning = true;
        controls.enablePan = false;
        console.log(this.slideNumber);
        controls.target = new THREE.Vector3(
            this.cameralookat[this.slideNumber].x,
            this.cameralookat[this.slideNumber].y,
            this.cameralookat[this.slideNumber].z
        );
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

    initComposer() {
        this.composer = new THREE.EffectComposer(this.renderer);

        this.hbp = new HorizontalBlurPass(this.scene, this.camera);
        this.composer.addPass(this.hbp);
    }

    init() {
        this.initSlideParameters();

        this.initManager();

        this.initCamera();

        this.initRenderer();

        this.initScene();

        this.initOrbitControls();

        this.clock = new THREE.Clock(true);

        this.initComposer();

        window.addEventListener(
            'resize',
            () => {
                this.camera.aspect = window.innerWidth / window.innerHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(window.innerWidth, window.innerHeight);
            },
            false
        );
        window.addEventListener('keydown', (e) => {
            if (e.keyCode === 49) {
                // Цифра 1
                console.log('camerapos');
                console.log(this.camera.position);
                console.log('cameralookat');
                console.log(this.controls.target);
            }
            if (e.keyCode === 50) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x - 0.1,
                    this.controls.target.y,
                    this.controls.target.z
                );
            }
            if (e.keyCode === 51) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x + 0.1,
                    this.controls.target.y,
                    this.controls.target.z
                );
            }
            if (e.keyCode === 52) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x,
                    this.controls.target.y - 0.1,
                    this.controls.target.z
                );
            }
            if (e.keyCode === 53) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x,
                    this.controls.target.y + 0.1,
                    this.controls.target.z
                );
            }
            if (e.keyCode === 54) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x,
                    this.controls.target.y,
                    this.controls.target.z - 0.1
                );
            }
            if (e.keyCode === 55) {
                this.controls.target = new THREE.Vector3(
                    this.controls.target.x,
                    this.controls.target.y,
                    this.controls.target.z + 0.1
                );
            }
            if (e.keyCode === 56) {
                this.controls.target = new THREE.Vector3(0, 0, 0);
            }
        });
        document.addEventListener(
            'mousedown',
            (event) => {
                this.mouseDownX = event.clientX;
                this.mouseDownY = event.clientY;
                this.mouseDown = true;
                this.mouseDownSC = true;
            },
            false
        );
        document.addEventListener(
            'mouseup',
            (event) => {
                this.mouseDown = false;
                this.mouseDownSC = false;
                this.mouseDeltaX = 0;
                this.mouseDeltaY = 0;
                this.mouseDeltaXSC = 0;

                let tween = new TWEEN.Tween(this.mouseDeltaX).to(0, 2000);
                tween.start();
            },
            false
        );
        document.addEventListener(
            'mousemove',
            (event) => {
                if (this.mouseDown) {
                    this.mouseDeltaX = event.clientX - this.mouseDownX;
                    this.mouseDeltaY = event.clientY - this.mouseDownY;
                } else {
                    this.mouseDeltaX = 0;
                    this.mouseDeltaY = 0;
                }
                if (this.mouseDownSC) {
                    this.mouseDeltaXSC = event.clientX - this.mouseDownX;
                } else {
                    this.mouseDeltaXSC = 0;
                }
                this.mouseBiasX = event.clientX - window.innerWidth / 2;
                this.mouseBiasY = event.clientY - window.innerHeight / 2;

                if (this.mouseDeltaXSC > window.innerWidth / 4) {
                    this.changeSlideToRight();
                    this.mouseDownSC = false;
                }
                if (this.mouseDeltaXSC < -window.innerWidth / 4) {
                    this.changeSlideToLeft();
                    this.mouseDownSC = false;
                }
            },
            false
        );
    }

    changeSlideToLeft() {
        if (this.slideNumber > 1) {
            this.slideNumber -= 1;
        } else {
            this.slideNumber = 5;
        }

        this.hbp.background = null;
        this.hbp.background = this.textures[this.slideNumber];
        this.HelicopterMove();
    }

    changeSlideToRight() {
        if (this.slideNumber < 5) {
            this.slideNumber += 1;
        } else {
            this.slideNumber = 1;
        }

        this.hbp.background = null;
        this.hbp.background = this.textures[this.slideNumber];

        console.log(this.slideNumber);

        this.HelicopterMove();
    }

    HelicopterMove() {
        // This.tween.stop();
        let tweenObj = {
            posx: this.camera.position.x,
            posy: this.camera.position.y,
            posz: this.camera.position.z,
            lookatx: this.controls.target.x,
            lookaty: this.controls.target.y,
            lookatz: this.controls.target.z
        };
        this.tween = new TWEEN.Tween(tweenObj).to(
            {
                posx: this.camerapositions[this.slideNumber].x,
                posy: this.camerapositions[this.slideNumber].y,
                posz: this.camerapositions[this.slideNumber].z,
                lookatx: this.cameralookat[this.slideNumber].x,
                lookaty: this.cameralookat[this.slideNumber].y,
                lookatz: this.cameralookat[this.slideNumber].z
            },
            3000
        );
        this.tween.onUpdate(() => {
            this.camera.position.x = tweenObj.posx;
            this.camera.position.y = tweenObj.posy;
            this.camera.position.z = tweenObj.posz;
            this.controls.target = new THREE.Vector3(
                tweenObj.lookatx,
                tweenObj.lookaty,
                tweenObj.lookatz
            );
        });
        this.tween.start();
    }

    animate(time) {
        requestAnimationFrame((time) => this.animate(time));

        this.controls.target = new THREE.Vector3(
            this.cameralookat[this.slideNumber].x +
                this.mouseBiasX / 2000 +
                Math.abs(this.mouseDeltaX) / 1000,
            this.cameralookat[this.slideNumber].y +
                this.mouseBiasY / 2000 +
                this.mouseDeltaY / 1000,
            0
        );

        /*
         *This.scene.rotation.set(
         * this.scene.rotation.x +
         * (this.mouseBiasY / 20000 + this.mouseDeltaY / 10000) * 0.5,
         * this.scene.rotation.y,
         * this.scene.rotation.z +
         * (this.mouseBiasX / 20000 + Math.abs(this.mouseDeltaX) / 10000) * 0.5
         *);
         */

        this.controls.update();
        this.delta = this.clock.getDelta();
        TWEEN.update(time);
        if (this.mixer) {
            this.mixer.update(this.delta);
        }
        this.render();
    }

    render() {
        this.hbp.horizontalBlurMaterial.uniforms.xBase.value = this.mouseDownX;
        this.hbp.horizontalBlurMaterial.uniforms.xDelta.value = Math.abs(this.mouseDeltaX);
        this.hbp.horizontalBlurMaterial.uniforms.t.value = 2000;
        this.hbp.horizontalBlurMaterial.uniforms.screenSize.value = new THREE.Vector2(
            window.innerWidth,
            window.innerHeight
        );

        this.composer.render();
        // This.renderer.render(this.scene, this.camera);
    }
}
