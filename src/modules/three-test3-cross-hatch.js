import * as THREE from 'three'
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from '../../node_modules/three/examples/jsm/loaders/OBJLoader.js'
import { Settings } from '../modules/settings.js'
import * as dat from 'dat.gui'
import { MeshBasicMaterial } from 'three'

export class ThreeTest3 {
    constructor(element) {
        this.renderer = null,
        this.scene = null,
        this.camera = null,
        this.camera_ctrl = null
        this.mesh = null,
        this.container = element,
        this.textureLoader = null,
        this.objLoader = null,
        this.gui = null,
        this.cross_hatch_material = null,
        this.settings = null
    }

    async init() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.autoClear = false
        this.container.appendChild(this.renderer.domElement)
        this.textureLoader = new THREE.TextureLoader()
        this.objLoader = new OBJLoader()
        this.settings = new Settings();
        console.log(this.settings)

        this.camera = new THREE.PerspectiveCamera(45, this.container.clientWidth / this.container.clientHeight, 0.01, 1000.0)
        this.camera.position.z = 1

        this.camera_ctrl = new OrbitControls(this.camera, this.renderer.domElement)
        this.camera_ctrl.rotateSpeed = 1
        // this.camera_ctrl.zoomSpeed = 1.2
        // this.camera_ctrl.panSpeed = 0.8
        this.camera_ctrl.update()

        this.scene = new THREE.Scene()

        this.scene.add( this.camera );
        
        //var model = await this.objLoader.loadAsync('src/assets/models/Monkey.obj')
        
        this.cross_hatch_material = await this.loadCrossHatchMaterial()
        //var model = new THREE.Mesh( new THREE.BoxGeometry( 1, 1, 1 ), this.cross_hatch_material ); 
        var model = await this.objLoader.loadAsync('src/assets/models/Village.obj')
        model.children[0].material = this.cross_hatch_material
        this.cross_hatch_material.uniforms.repeat.value.set(1, 1);
        //model.children[0].material = this.cross_hatch_material
        //model.children[0].material = mat

        this.scene.add(model)
        //this.loadOBJ('src/assets/models/Monkey.obj')
        this.addGUI()
    }

    animate() {
        requestAnimationFrame(()=> this.animate())

        if (this.cross_hatch_material != undefined)
        {
            this.cross_hatch_material.uniforms.ambientWeight.value = this.settings.ambient / 100
            this.cross_hatch_material.uniforms.diffuseWeight.value = this.settings.diffuse / 100
            this.cross_hatch_material.uniforms.rimWeight.value = this.settings.rim / 100
            this.cross_hatch_material.uniforms.specularWeight.value = this.settings.specular / 100
            this.cross_hatch_material.uniforms.shininess.value = this.settings.shininess
            this.cross_hatch_material.uniforms.invertRim.value = this.settings.invertRim?1:0
            this.cross_hatch_material.uniforms.solidRender.value = this.settings.solidRender?1:0
            this.cross_hatch_material.uniforms.inkColor.value.set( this.settings.inkColor[ 0 ] / 255, this.settings.inkColor[ 1 ] / 255, this.settings.inkColor[ 2 ] / 255, 1 );
        }
        this.camera.lookAt(this.scene.position );
        this.renderer.render(this.scene, this.camera)
        this.camera_ctrl.update()
    }

    onWindowResize() {
        this.cross_hatch_material.uniforms.resolution.value.set( window.innerWidth, window.innerHeight );
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        //this.camera_ctrl.handleResize()
    }

    addGUI() {
        this.gui = new dat.GUI()
        this.gui.add( this.settings, 'ambient', 0.0, 100.0 );
        this.gui.add( this.settings, 'diffuse', 0.0, 100.0 );
        this.gui.add( this.settings, 'specular', 0.0, 100.0 );
        this.gui.add( this.settings, 'rim', 0.0, 100.0 );
        this.gui.add( this.settings, 'shininess', 1, 100 );
        this.gui.add( this.settings, 'invertRim' );
        this.gui.add( this.settings, 'displayOutline' );
        this.gui.add( this.settings, 'solidRender' );
        this.gui.add( this.settings, 'model', { Cube: 1, Sphere: 2, TorusKnot: 3, Torus: 4, Distort: 5, Capsule: 6 } );
        this.gui.add( this.settings, 'paper', { Crumpled: 0, Grainy: 1, Fibers: 2, Squared: 3, Wrapper: 4, Parchment: 5 } );
        this.gui.addColor( this.settings, 'inkColor' );

    }

    loadCrossHatchMaterial() {
        let id = 'src/assets/textures/hatch_'
        let result = new THREE.ShaderMaterial({
            uniforms:       {
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
                hatch1: { type: 't', value: this.textureLoader.load( id + '0.jpg' ) },
                hatch2: { type: 't', value: this.textureLoader.load( id + '1.jpg' ) },
                hatch3: { type: 't', value: this.textureLoader.load( id + '2.jpg' ) },
                hatch4: { type: 't', value: this.textureLoader.load( id + '3.jpg' ) },
                hatch5: { type: 't', value: this.textureLoader.load( id + '4.jpg' ) },
                hatch6: { type: 't', value: this.textureLoader.load( id + '5.jpg' ) },
                paper: { type: 't', value: this.textureLoader.load( 'src/assets/textures/paper6.jpg' ) },
                repeat: { type: 'v2', value: new THREE.Vector2( 0, 0 ) }
            },
            vertexShader: this.loadShaderSync('src/assets/shaders/cross-hatch.vert'),
            fragmentShader: this.loadShaderSync('src/assets/shaders/cross-hatch.frag'),
            lights: false
        })

        result.uniforms.paper.value.generateMipmaps = false;
        result.uniforms.paper.value.magFilter = THREE.LinearFilter;
        result.uniforms.paper.value.minFilter = THREE.LinearFilter;
        
        result.uniforms.repeat.value.set( 1,1 );
        result.uniforms.hatch1.value.wrapS = result.uniforms.hatch1.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.hatch2.value.wrapS = result.uniforms.hatch2.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.hatch3.value.wrapS = result.uniforms.hatch3.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.hatch4.value.wrapS = result.uniforms.hatch4.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.hatch5.value.wrapS = result.uniforms.hatch5.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.hatch6.value.wrapS = result.uniforms.hatch6.value.wrapT = THREE.RepeatWrapping;
        result.uniforms.paper.value = this.textureLoader.load( 'src/assets/textures/paper6.jpg' )
        result.uniforms.paper.value.needsUpdate = true
        result.uniforms.bkgResolution.value.set(this.container.clientWidth, this.container.clientHeight );

        return result
    }

    loadShaderSync(url) {
        var req = new XMLHttpRequest();
        req.open("GET", url, false);
        req.send(null);
        
        return (req.status == 200) ? req.responseText : null;
    }
} 