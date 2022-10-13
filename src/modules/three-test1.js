import * as THREE from 'three'
import { TrackballControls } from '../../node_modules/three/examples/jsm/controls/TrackballControls.js'

export class ThreeTest1 {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
        this.mesh = null,
        this.container = element
        this.textureLoader = null
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()

        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 1

        this.camera_ctrl = new TrackballControls(this.camera, this.renderer.domElement)
        this.camera_ctrl.rotateSpeed = 2.0
        this.camera_ctrl.zoomSpeed = 1.2
        this.camera_ctrl.panSpeed = 0.8

        this.scene = new THREE.Scene()

        let ambientLight = new THREE.AmbientLight(0xfaebd7)
        this.scene.add(ambientLight)

        this.addCube()
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

    addCube() {
        const geom = new THREE.BoxGeometry()
        const mat = new THREE.MeshPhongMaterial()
        const texture = this.textureLoader.load('src/assets/textures/crate.png')
        mat.map = texture
        this.mesh = new THREE.Mesh(geom, mat)
        this.scene.add(this.mesh)

    }
} 