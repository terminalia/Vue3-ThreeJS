import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { loadOBJ, loadShader } from './utils.js'

export class TestOrthoMask {
    constructor(element) {
        this.renderer = null,
        this.perspScene = null,
        this.orthoScene = null,
        this.perspCamera = null,
        this.orthoCamera = null,
        this.camera_ctrl = null,
        this.mesh = null,
        this.container = element
        this.textureLoader = null
        this.objLoader = null
    }

    async init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()
        this.objLoader = new OBJLoader()

        this.perspScene = new THREE.Scene()
        this.orthoScene = new THREE.Scene()

        this.perspCamera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.perspCamera.position.z = 1
        this.perspCamera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera_ctrl = new OrbitControls(this.perspCamera, this.renderer.domElement)
        this.camera_ctrl.rotateSpeed = 1
        this.camera_ctrl.update()

        this.orthoCamera = new THREE.OrthographicCamera(-1, 1,
            1, -1, 1, 1000 )
        this.orthoCamera.position.copy(this.perspCamera.position)
        this.orthoCamera.lookAt(new THREE.Vector3(0, 0, 0))

        this.perspScene.add(this.perspCamera)
        this.orthoScene.add(this.orthoCamera)

        this.perspScene.add(new THREE.AmbientLight(0xffffff))
        this.orthoScene.add(new THREE.AmbientLight(0xffffff))

        let basic_uniforms = {
            uColor: { value: new THREE.Vector3(1, 1, 1)},
            uTexture: { value: this.textureLoader.load('src/assets/textures/crate.png')},
            uRepeatU: { value: 1.0 },
            uRepeatV: { value: 1.0 }
        }
        const custom_mat = await loadShader('src/assets/shaders/basic.vert','src/assets/shaders/basic.frag', basic_uniforms)
        basic_uniforms.uTexture.value.wrapT =  basic_uniforms.uTexture.value.wrapS = THREE.RepeatWrapping
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), custom_mat)

        let mask_uniforms = {
            uDiffuseCol: { value: new THREE.Color(0xFAFBDC)},
            uDiffuseTex: { value: this.textureLoader.load('src/assets/textures/brown.jpg')},
            uAlphaTex: { value: this.textureLoader.load('src/assets/textures/Mask2.jpg')},
            uRepeatU: { value: 1.0 },
            uRepeatV: { value: 1.0 }
        }
        this.perspScene.add(this.mesh)

        mask_uniforms.uDiffuseTex.value.wrapT = mask_uniforms.uDiffuseTex.value.wrapS = THREE.RepeatWrapping
        const mask_mat = await loadShader('src/assets/shaders/ortho_mask.vert', 'src/assets/shaders/ortho_mask.frag', mask_uniforms)
        mask_mat.transparent = true
        const mask_plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2, 100, 100), mask_mat)
        mask_plane.position.set(0, 0, 0)
        this.orthoScene.add(mask_plane)
    }

    animate() {
        requestAnimationFrame(()=> this.animate())
        this.renderer.autoClear = false
        this.renderer.render(this.perspScene, this.perspCamera)
        this.renderer.render(this.orthoScene, this.orthoCamera)
        this.camera_ctrl.update()
    }

    onWindowResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.perspCamera.aspect = this.container.clientWidth / this.container.clientHeight
        this.perspCamera.updateProjectionMatrix()
    }
} 