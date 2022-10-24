import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { loadOBJ } from './utils.js'
import { EffectComposer } from '../../node_modules/three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from '../../node_modules/three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from '../../node_modules/three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from '../../node_modules/three/examples/jsm/shaders/FXAAShader'
import { CustomOutlinePass } from '../modules/CustomOutlinePass'

export class ThreeTest5 {
    constructor(element) {
        this.renderer = null,
        this.composer = null,
        this.effectFXAA = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
        this.mesh = null,
        this.container = element,
        this.textureLoader = null,
        this.objLoader = null,
        this.customOutline = null
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

        const mat = new THREE.MeshLambertMaterial()
        mat.color.setHex(0x2e2f30)
        this.mesh  = await loadOBJ(this.objLoader, mat, 'src/assets/models/Monkey.obj')
        this.scene.add(this.mesh)

        //Setup POST PROCESSING
        //Create a render target that holds a depthTexture so we can use it in the outline pass
        let depthTexture = new THREE.DepthTexture()
        let renderTarget = new THREE.WebGLRenderTarget(this.container.clientWidth, 
            this.container.clientHeight,
            {
                depthTexture: depthTexture,
                depthBuffer: true
            }
        )

        //Initial render pass
        this.composer = new EffectComposer(this.renderer, renderTarget)
        const diffusePass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(diffusePass)

        //Outline pass
        this.customOutline = new CustomOutlinePass(
            new THREE.Vector2(this.container.clientWidth, this.container.clientHeight),
            this.scene,
            this.camera
        )

        this.composer.addPass(this.customOutline)

        //Antialias pass
        this.effectFXAA = new ShaderPass(FXAAShader)
        this.effectFXAA.uniforms["resolution"].value.set(
            1 / this.container.clientWidth,
            1 / this.container.clientHeight
        )

        this.composer.addPass(this.effectFXAA)
    }

    render() {
        if (this.composer != null)
        {
            this.composer.render()
        }
    }
    animate() {
        requestAnimationFrame(()=> this.animate())
        this.render()
        this.camera_ctrl.update()
    }

    onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.composer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.effectFXAA.setSize(this.container.clientWidth, this.container.clientHeight)
        this.customOutline.setSize(this.container.clientWidth, this.container.clientHeight)
    }
} 