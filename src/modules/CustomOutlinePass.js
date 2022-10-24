import * as THREE from "three";
import { Pass, FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { loadShaderSync } from '../modules/utils'

// Follows the structure of
//https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
class CustomOutlinePass extends Pass {
  constructor(resolution, scene, camera) {
    super();

    this.renderScene = scene;
    this.renderCamera = camera;
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);

    this.fsQuad = new FullScreenQuad(null);
    this.fsQuad.material = this.createOutlinePostProcessMaterial();

    // Create a buffer to store the normals of the scene onto
    const normalTarget = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y
    );
    normalTarget.texture.format = THREE.RGBFormat;
    normalTarget.texture.minFilter = THREE.NearestFilter;
    normalTarget.texture.magFilter = THREE.NearestFilter;
    normalTarget.texture.generateMipmaps = false;
    normalTarget.stencilBuffer = false;
    this.normalTarget = normalTarget;

    this.normalOverrideMaterial = new THREE.MeshNormalMaterial();
  }

  dispose() {
    this.normalTarget.dispose();
    this.fsQuad.dispose();
  }

  setSize(width, height) {
    this.normalTarget.setSize(width, height);
    this.resolution.set(width, height);

    this.fsQuad.material.uniforms.screenSize.value.set(
      this.resolution.x,
      this.resolution.y,
      1 / this.resolution.x,
      1 / this.resolution.y
    );
  }

  render(renderer, writeBuffer, readBuffer) {
    // Turn off writing to the depth buffer
    // because we need to read from it in the subsequent passes.
    const depthBufferValue = writeBuffer.depthBuffer;
    writeBuffer.depthBuffer = false;

    // 1. Re-render the scene to capture all normals in texture.
    // Ideally we could capture this in the first render pass along with
    // the depth texture.
    renderer.setRenderTarget(this.normalTarget);

    const overrideMaterialValue = this.renderScene.overrideMaterial;
    this.renderScene.overrideMaterial = this.normalOverrideMaterial;
    renderer.render(this.renderScene, this.renderCamera);
    this.renderScene.overrideMaterial = overrideMaterialValue;

    this.fsQuad.material.uniforms["depthBuffer"].value =
      readBuffer.depthTexture;
    this.fsQuad.material.uniforms[
      "normalBuffer"
    ].value = this.normalTarget.texture;
    this.fsQuad.material.uniforms["sceneColorBuffer"].value =
      readBuffer.texture;

    // 2. Draw the outlines using the depth texture and normal texture
    // and combine it with the scene color
    if (this.renderToScreen) {
      // If this is the last effect, then renderToScreen is true.
      // So we should render to the screen by setting target null
      // Otherwise, just render into the writeBuffer that the next effect will use as its read buffer.
      renderer.setRenderTarget(null);
      this.fsQuad.render(renderer);
    } else {
      renderer.setRenderTarget(writeBuffer);
      this.fsQuad.render(renderer);
    }

    // Reset the depthBuffer value so we continue writing to it in the next render.
    writeBuffer.depthBuffer = depthBufferValue;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        debugVisualize: { value: 0 },
        sceneColorBuffer: {},
        depthBuffer: {},
        normalBuffer: {},
        outlineColor: { value: new THREE.Color(0xffffff) },
        //4 scalar values packed in one uniform: depth multiplier, depth bias, and same for normals.
        multiplierParameters: { value: new THREE.Vector4(1, 1, 1, 1) },
        cameraNear: { value: this.renderCamera.near },
        cameraFar: { value: this.renderCamera.far },
        screenSize: {
          value: new THREE.Vector4(
            this.resolution.x,
            this.resolution.y,
            1 / this.resolution.x,
            1 / this.resolution.y
          ),
        },
      },
      vertexShader: loadShaderSync('src/assets/shaders/PostProcessing/outline.vert'),
      fragmentShader: loadShaderSync('src/assets/shaders/PostProcessing/outline.frag')
    });
  }
}

export { CustomOutlinePass };