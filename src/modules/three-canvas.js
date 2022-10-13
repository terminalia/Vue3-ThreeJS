import * as THREE from 'three'

export class ThreeCanvas {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.mesh = null,
        this.container = element
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)

        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 1

        this.scene = new THREE.Scene()

        let geom = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        let mat = new THREE.MeshNormalMaterial()

        this.mesh = new THREE.Mesh(geom, mat)
        this.scene.add(this.mesh)
    }

    animate() {
        requestAnimationFrame(()=> this.animate())
        this.mesh.rotation.x += 0.01
        this.mesh.rotation.y += 0.02
        this.renderer.render(this.scene, this.camera)
    }

    onWindowResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
    }
} 