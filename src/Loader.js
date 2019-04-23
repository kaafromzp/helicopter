import {CubeTextureLoader} from 'three';
class Loader {
    constructor() {
        this.a = 0;
    }

    loadCubeTexture(path, filetype = '.jpg') {
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
}
export default Loader;
