import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { loadOBJ, loadShader } from './utils.js'
import * as dat from 'dat.gui'

export class ThreeTest6 {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
        this.mesh = null,
        this.container = element,
        this.gui = null,
        this.rad_angle = 0,
        this.settings = {
            scale: 1.0,
            amount: 0.0
        },
        this.shaderMat = null
    }

    async init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()
        this.objLoader = new OBJLoader()

        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 2

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

        this.addMorphObject()
        this.addGUI()
    }

    async addMorphObject() {
        let uniforms = {
            // uColor: { value: new THREE.Vector3(1, 0, 0)},
            // uTexture: { value: this.textureLoader.load('src/assets/textures/crate.png')},
            // uRepeatU: { value: 3.0 },
            // uRepeatV: { value: 3.0 }
            uScale: { value: 1.0},
            uAmount: {value: 0.0}
        }

        this.shaderMat = await loadShader('src/assets/shaders/perlin.vert','src/assets/shaders/perlin.frag', uniforms)
        this.mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 140, 140), this.shaderMat)
        this.scene.add(this.mesh)
    }

    addGUI() {
        this.gui = new dat.GUI()
        this.gui.add(this.settings, 'scale', 0, 8)
        this.gui.add(this.settings, 'amount', 0, 2)
    }

    animate() {
        requestAnimationFrame(()=> this.animate())
        this.renderer.render(this.scene, this.camera)
        this.camera_ctrl.update()

        this.rad_angle += 0.05
        let disp = Math.sin(this.rad_angle)

        
        if (this.shaderMat) {
            // this.shaderMat.uniforms['uScale'].value = this.settings.scale
            // this.shaderMat.uniforms['uAmount'].value = this.settings.amount
            this.shaderMat.uniforms['uScale'].value = this.map(disp, -1, 1, 0, 4)
            this.shaderMat.uniforms['uAmount'].value = this.map(disp, -1, 1, 0, 1)
        }
    }

    map(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    onWindowResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.camera_ctrl.handleResize()
    }
} 