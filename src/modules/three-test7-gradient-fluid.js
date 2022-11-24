import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { loadOBJ, loadShader } from './utils.js'

export class ThreeTest7 {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null,
        this.mesh = null,
        this.container = element,
        this.textureLoader = null,
        this.time = 0,
        this.shaderMat = null,
        this.colors = null
    }

    async init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()
    
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
        
        this.colors = [
            new THREE.Color(0x3E3E51),
            new THREE.Color(0x41D629),
            new THREE.Color(0xFB9600),
            new THREE.Color(0xFF3C5F),
            new THREE.Color(0xFE83F2)
        ];

        console.log(this.colors)

        let uniforms = {
            uTime: { value: 0 },
            uColor: { value: this.colors }
        }

        this.shaderMat = await loadShader('src/assets/shaders/gradient.vert','src/assets/shaders/gradient.frag', uniforms, false)
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 200, 200), this.shaderMat)
        this.scene.add(this.mesh)
    }

    render() {
        this.time += 0.0005
        if (this.shaderMat) {
            this.shaderMat.uniforms['uTime'].value = this.time
        }
    }
    animate() {
        this.render()
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