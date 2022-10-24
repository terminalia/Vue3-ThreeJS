import * as THREE from 'three'

export function loadOBJ(objLoader, material, path) {
    return new Promise(resolve => {
        let result = new THREE.Object3D()
        objLoader.load(path,
        (object) => {
            
            
            object.traverse(function(child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material
                    result.add(child)
                }
            })
            return resolve(result)
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            
        },
        (error) => {
            console.log(error)
        })
    })
}

export function loadShader(vert_path, frag_path, uniforms) {
    return new Promise(resolve => {
        let result = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: loadShaderSync(vert_path),
            fragmentShader: loadShaderSync(frag_path)
        })

        return resolve(result)
    })
}

export function loadShaderSync(url) {
    var req = new XMLHttpRequest();
    req.open("GET", url, false);
    req.send(null);
    
    return (req.status == 200) ? req.responseText : null;
}