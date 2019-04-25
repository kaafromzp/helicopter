import {CubeTextureLoader, TextureLoader} from 'three';
class Loader {
    constructor() {}

    static loadCubeTexture(path, filetype = '.jpg') {
        return new CubeTextureLoader().
            setPath(path).
            load([
                `px${filetype}`,
                `nx${filetype}`,
                `py${filetype}`,
                `ny${filetype}`,
                `pz${filetype}`,
                `nz${filetype}`
            ]);
    }

    static load2DTexture(path) {
        return new TextureLoader().load(path);
    }
}
export default Loader;
