import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { loadOBJ, loadShader } from './utils.js'
import * as dat from 'dat.gui'
import { Settings } from '../modules/settings.js'

export class TestCrossHatch {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
        this.mesh = null,
        this.container = element,
        this.textureLoader = null,
        this.objLoader = null,
        this.settings = null,
        this.material = null
    }

    init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()
        this.objLoader = new OBJLoader()
        this.settings = new Settings()

        this.camera = new THREE.PerspectiveCamera(70, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 3

        this.camera_ctrl = new OrbitControls(this.camera, this.renderer.domElement)
        this.camera_ctrl.rotateSpeed = 1
        // this.camera_ctrl.zoomSpeed = 1.2
        // this.camera_ctrl.panSpeed = 0.8
        this.camera_ctrl.update()
        this.scene = new THREE.Scene()
        this.scene.add( this.camera );

        this.loadResources()
        this.addGUI()
    }

    render() {
        if (this.material != undefined) {
            this.material.uniforms.ambientWeight.value = this.settings.ambient / 100
            this.material.uniforms.diffuseWeight.value = this.settings.diffuse / 100
            this.material.uniforms.rimWeight.value = this.settings.rim / 100
            this.material.uniforms.specularWeight.value = this.settings.specular / 100
            this.material.uniforms.shininess.value = this.settings.shininess
            this.material.uniforms.invertRim.value = this.settings.invertRim?1:0
            this.material.uniforms.solidRender.value = this.settings.solidRender?1:0
            this.material.uniforms.inkColor.value.set( this.settings.inkColor[ 0 ] / 255, this.settings.inkColor[ 1 ] / 255, this.settings.inkColor[ 2 ] / 255, 1 );
            //this.material.uniforms.repeat.value.set(this.settings.repeat_x, this.settings.repeat_y);
            this.material.uniforms.repeat.value.set(this.settings.repeat, this.settings.repeat);
        }
        this.renderer.render(this.scene, this.camera)
        this.camera_ctrl.update()
    }

    animate() {
        requestAnimationFrame(()=> this.animate())
        this.render()    
    }

    onWindowResize() {
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
    }

    addGUI() {
        this.settings.repeat = 5
        this.gui = new dat.GUI()
        this.gui.add( this.settings, 'ambient', 0.0, 100.0 );
        this.gui.add( this.settings, 'diffuse', 0.0, 100.0 );
        this.gui.add( this.settings, 'specular', 0.0, 100.0 );
        this.gui.add( this.settings, 'rim', 0.0, 100.0 );
        this.gui.add( this.settings, 'shininess', 1, 100 );
        this.gui.add( this.settings, 'invertRim' );
        this.gui.add( this.settings, 'solidRender' );
        this.gui.add( this.settings, 'repeat', 1, 100);
        //this.gui.add( this.settings, 'repeat_x', 1, 100);
        //this.gui.add( this.settings, 'repeat_y', 1, 100);
    }

    async loadResources() {
        let tex_folder = 'src/assets/textures/hatch_'
        let uniforms = {
            showOutline: { type: 'f', value: 0 },
            ambientWeight: { type: 'f', value : 0 },
            diffuseWeight: { type: 'f', value : 1 },
            rimWeight: { type: 'f', value : 1 },
            specularWeight: { type: 'f', value : 1 },
            shininess: { type: 'f', value : 1 },
            invertRim: { type: 'i', value: 0 },
            inkColor: { type: 'v4', value: new THREE.Vector3( 0, 0,0 ) },
            solidRender: { type: 'i', value: 0 },
            resolution: { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
            bkgResolution: { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
            lightPosition: { type: 'v3', value: new THREE.Vector3( -100, 100, 0 ) },
            hatch1: { type: 't', value: this.textureLoader.load( tex_folder + '0.jpg' ) },
            hatch2: { type: 't', value: this.textureLoader.load( tex_folder + '1.jpg' ) },
            hatch3: { type: 't', value: this.textureLoader.load( tex_folder + '2.jpg' ) },
            hatch4: { type: 't', value: this.textureLoader.load( tex_folder + '3.jpg' ) },
            hatch5: { type: 't', value: this.textureLoader.load( tex_folder + '4.jpg' ) },
            hatch6: { type: 't', value: this.textureLoader.load( tex_folder + '5.jpg' ) },
            paper: { type: 't', value: this.textureLoader.load( 'src/assets/textures/brown.jpg' ) },
            repeat: { type: 'v2', value: new THREE.Vector2( 0, 0 ) }
        }

        uniforms.paper.value.generateMipmaps = false;
        uniforms.paper.value.magFilter = THREE.LinearFilter;
        uniforms.paper.value.minFilter = THREE.LinearFilter;
        
        uniforms.repeat.value.set( 5,5 );
        uniforms.hatch1.value.wrapS = uniforms.hatch1.value.wrapT = THREE.RepeatWrapping;
        uniforms.hatch2.value.wrapS = uniforms.hatch2.value.wrapT = THREE.RepeatWrapping;
        uniforms.hatch3.value.wrapS = uniforms.hatch3.value.wrapT = THREE.RepeatWrapping;
        uniforms.hatch4.value.wrapS = uniforms.hatch4.value.wrapT = THREE.RepeatWrapping;
        uniforms.hatch5.value.wrapS = uniforms.hatch5.value.wrapT = THREE.RepeatWrapping;
        uniforms.hatch6.value.wrapS = uniforms.hatch6.value.wrapT = THREE.RepeatWrapping;
        uniforms.paper.value = this.textureLoader.load( 'src/assets/textures/brown.jpg' )
        uniforms.paper.value.needsUpdate = true
        uniforms.bkgResolution.value.set(this.container.clientWidth, this.container.clientHeight );

        this.container.style.backgroundImage = "url('src/assets/textures/brown.jpg')"
        this.material = await loadShader('src/assets/shaders/cross-hatch.vert',
        'src/assets/shaders/cross-hatch.frag', uniforms);
        this.mesh  = await loadOBJ(this.objLoader, this.material, 'src/assets/models/Monkey.obj')
        this.scene.add(this.mesh)
    }
}