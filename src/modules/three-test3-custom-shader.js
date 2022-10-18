import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { loadOBJ, loadShader } from './utils.js'

export class ThreeTest3 {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
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

        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 1

        this.camera_ctrl = new OrbitControls(this.camera, this.renderer.domElement)
        this.camera_ctrl.rotateSpeed = 1
        // this.camera_ctrl.zoomSpeed = 1.2
        // this.camera_ctrl.panSpeed = 0.8
        this.camera_ctrl.update()

        this.scene = new THREE.Scene()

        const ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
        this.scene.add( ambientLight );

        const pointLight = new THREE.PointLight( 0xffffff, 0.8 );
        this.camera.add( pointLight );
        this.scene.add( this.camera );

        let uniforms = {
            uColor: { value: new THREE.Vector3(1, 0, 0)},
            uTexture: { value: this.textureLoader.load('src/assets/textures/crate.png')},
            uRepeatU: { value: 3.0 },
            uRepeatV: { value: 3.0 }
        }

        uniforms.uTexture.value.wrapT = uniforms.uTexture.value.wrapS = THREE.RepeatWrapping
        const custom_mat = await loadShader('src/assets/shaders/basic.vert','src/assets/shaders/basic.frag', uniforms)
        this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), custom_mat)
        this.scene.add(this.mesh)
    }

    animate() {
        requestAnimationFrame(()=> this.animate())
        this.renderer.render(this.scene, this.camera)
        this.camera_ctrl.update()
    }

    onWindowResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.camera_ctrl.handleResize()
    }
} 