import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { loadOBJ, loadShader } from './utils.js'

export class ThreeTest7 {
    constructor(element, background_color, gradient_color) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null,
        this.mesh = null,
        this.container = element,
        this.textureLoader = null,
        this.time = 0,
        this.shaderMat = null,
        this.colors = null,
        this.speed_inc = 0.0003,
        this.background_color = background_color,
        this.gradient_color = gradient_color
    }

    

    async init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setClearColor(0x3E3E51)
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

        let uniforms = {
            uTime: { value: 0 },
            uBackgroundColor: { value: new THREE.Color(this.background_color) },
            uGradientColor: { value: new THREE.Color(this.gradient_color)},
            uHeight: { value: 0.5 }
        }

        this.shaderMat = await loadShader('src/assets/shaders/gradient.vert','src/assets/shaders/gradient.frag', uniforms, false)
        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5, 200, 200), this.shaderMat)
        this.scene.add(this.mesh)
        return this.renderer.domElement
    }

    render(bg, fg) {
        this.time += this.speed_inc
        if (this.shaderMat) {
            this.shaderMat.uniforms['uTime'].value = this.time
            this.shaderMat.uniforms['uBackgroundColor'].value = new THREE.Color(bg)
            this.shaderMat.uniforms['uGradientColor'].value = new THREE.Color(fg)
        }
    }
    
    update(bg, fg) {
        this.render(bg, fg)
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