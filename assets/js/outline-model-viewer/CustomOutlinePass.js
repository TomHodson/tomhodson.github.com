import * as THREE from "three";
import { Pass } from "three/addons/postprocessing/Pass.js";
import { FullScreenQuad } from "three/addons/postprocessing/Pass.js";
import { getSurfaceIdMaterial } from "./FindSurfaces.js";

// Follows the structure of
// 		https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/OutlinePass.js
class CustomOutlinePass extends Pass {
  constructor(resolution, scene, camera, outlineColor, edgeThickness) {
    super();

    this.renderScene = scene;
    this.renderCamera = camera;
    this.resolution = new THREE.Vector2(resolution.x, resolution.y);
    this.outlineColor = outlineColor;
    this.edgeThickness = edgeThickness; // If rendering at N times final size, set to N

    this.fsQuad = new FullScreenQuad(null);
    this.fsQuad.material = this.createOutlinePostProcessMaterial();

    // Create a buffer for surface ids (r) and screen space normals (gb)
    const surfaceBuffer = new THREE.WebGLRenderTarget(
      this.resolution.x,
      this.resolution.y,
      {
        format: THREE.RGBAFormat,
        type: THREE.HalfFloatType,
        // minFilter: THREE.NearestFilter,
        // magFilter: THREE.NearestFilter,
      }
    );

    this.surfaceBuffer = surfaceBuffer;
    this.surfaceIdOverrideMaterial = getSurfaceIdMaterial();
  }

  dispose() {
    this.surfaceBuffer.dispose();
    this.fsQuad.dispose();
  }

  updateEdgeThickness(edgeThickness) {
    this.edgeThickness = edgeThickness;
    console.log("Updating edge thickness to", this.edgeThickness);
    this.fsQuad.material.uniforms.edgeThickness.value = edgeThickness;
  }

  updateMaxSurfaceId(maxSurfaceId) {
    this.surfaceIdOverrideMaterial.uniforms.maxSurfaceId.value = maxSurfaceId;
  }

  setSize(width, height) {
    this.surfaceBuffer.setSize(width, height);
    this.resolution.set(width, height);

    this.fsQuad.material.uniforms.screenSize.value.set(
      this.resolution.x,
      this.resolution.y,
      1 / this.resolution.x,
      1 / this.resolution.y
    );
  }

  render(renderer, writeBuffer, readBuffer) {
    // Store the original values of writeBuffer.depthBuffer and renderScene.overrideMaterial
    const originalDepthBufferValue = writeBuffer.depthBuffer;
    const originalOverrideMaterialValue = this.renderScene.overrideMaterial;

    // Turn off writing to the depth buffer
    // because we need to read from it in the subsequent passes.
    writeBuffer.depthBuffer = false;

    // 1. Re-render the scene to capture all surface IDs and normals in a texture.
    renderer.setRenderTarget(this.surfaceBuffer);
    this.renderScene.overrideMaterial = this.surfaceIdOverrideMaterial;
    renderer.render(this.renderScene, this.renderCamera);

    // Store the depth and scene colour from the previous pass
    this.fsQuad.material.uniforms["depthBuffer"].value =
      readBuffer.depthTexture;
    this.fsQuad.material.uniforms["sceneColorBuffer"].value =
      readBuffer.texture;

    // Store the normals and surface IDs from this pass
    this.fsQuad.material.uniforms["surfaceBuffer"].value =
      this.surfaceBuffer.texture;

    // restore the original value of renderScene.overrideMaterial
    this.renderScene.overrideMaterial = originalOverrideMaterialValue;

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
    writeBuffer.depthBuffer = originalDepthBufferValue;
  }

  get vertexShader() {
    return `
			varying vec2 vUv;
			void main() {
				vUv = uv;

                // Compute the position of this vertex
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
			}
			`;
  }
  get fragmentShader() {
    return `
			#include <packing>

			uniform sampler2D sceneColorBuffer;
			uniform sampler2D depthBuffer;
			uniform sampler2D surfaceBuffer;

			uniform float cameraNear;
			uniform float cameraFar;
			uniform vec4 screenSize;
			uniform vec3 outlineColor;

            // How many pixels away to sample for edges
            // Larger value give thicker lines
            // If rendering at N times the final display size
            // Set this to N for lines whose thickness doesn't depend on N
            uniform int edgeThickness;

            uniform int debugVisualize;

			varying vec2 vUv;

			// Helper functions for reading from depth buffer.
			float readDepth (sampler2D depthSampler, vec2 coord) {
				float fragCoordZ = texture2D(depthSampler, coord).x;
				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
			}
			float getLinearDepth(vec3 pos) {
				return -(viewMatrix * vec4(pos, 1.0)).z;
			}

			float getLinearScreenDepth(sampler2D map) {
					vec2 uv = gl_FragCoord.xy * screenSize.zw;
					return readDepth(map,uv);
			}
			// Helper functions for reading normals and depth of neighboring pixels.
			float getPixelDepth(int x, int y) {
				// screenSize.zw is pixel size 
				// vUv is current position
				return readDepth(depthBuffer, vUv + screenSize.zw * vec2(x, y));
			}
			// get surfaceID at current point + (x, y) pixels
			float getSurfaceValue(int x, int y) {
				return texture2D(surfaceBuffer, vUv + screenSize.zw * vec2(x, y)).r;
			}

            // get normal at current point + (x, y) pixels
            vec3 getNormal(int x, int y) {
				return texture2D(surfaceBuffer, vUv + screenSize.zw * vec2(x, y)).gba;
			}

			float saturateValue(float num) {
				return clamp(num, 0.0, 1.0);
			}


            float getSurfaceIdDiff(float surfaceValue) {
                float surfaceIdDiff = 0.;
                int e = edgeThickness;

                surfaceIdDiff += abs(surfaceValue - getSurfaceValue(e, 0));
                surfaceIdDiff += abs(surfaceValue - getSurfaceValue(0, e));
                surfaceIdDiff += abs(surfaceValue - getSurfaceValue(-e, 0));
                surfaceIdDiff += abs(surfaceValue - getSurfaceValue(0, -e));

                return surfaceIdDiff == 0. ? 0. : 1.;
            }
            
            float getDepthDiff(float depth) {
            	float depthDiff = 0.0;
				depthDiff += abs(depth - getPixelDepth(1, 0));
				depthDiff += abs(depth - getPixelDepth(-1, 0));
				depthDiff += abs(depth - getPixelDepth(0, 1));
				depthDiff += abs(depth - getPixelDepth(0, -1));
                return depthDiff;
            }


      const uint k = 1103515245U;  // GLIB C
      vec3 hash( vec3 f )
      { 
          uvec3 x = floatBitsToUint(f);
          x = ((x>>8U)^x.yzx)*k;
          x = ((x>>8U)^x.yzx)*k;
          x = ((x>>8U)^x.yzx)*k;
          return vec3(x)/float(0xffffffffU);
      }
      

			void main() {
                // Get the scene colour from the previous pass
				vec4 sceneColor = texture2D(sceneColorBuffer, vUv);

                // Get the depth, normal and surfaceID for this pixel.
				float depth = getPixelDepth(0, 0);
                vec3 normal = getNormal(0, 0);
				float surfaceId = getSurfaceValue(0, 0);
                float alpha = 1.0 - float(surfaceId == 0.);

				// Get the difference between depth of neighboring pixels and current.
				float surfaceIdDiff = getSurfaceIdDiff(surfaceId);
            
                float outline = saturateValue(surfaceIdDiff);
                vec4 outlineColor = vec4(outlineColor, 1.0);

                // If you want to do lighting yourself.
                // float lighting = max((1. + dot(normal, vec3(0., 1., 0.))/2.), 0.);
                // vec4 lighting_colour = vec4(vec3(lighting), 1.0);

                if (debugVisualize == 0) {
                    // Normal mode, use the surface ids to draw outlines and add the shaded scene in too
                    gl_FragColor = vec4(mix(sceneColor, outlineColor, outline));
                } 
                else if (debugVisualize == 1) {
					// Only show outlines
					gl_FragColor = mix(vec4(0,0,0,0), outlineColor, outline);
				}
                else if (debugVisualize == 2) {
                	// Only Scene color no outlines
					gl_FragColor = sceneColor;
				}
                else if (debugVisualize == 3) {
                    // Normal buffer
                    gl_FragColor = vec4(normal, alpha);
                }
				else if (debugVisualize == 4) {
                    // Depth buffer
					gl_FragColor = vec4(vec3(depth), alpha);
				}
				else if (debugVisualize == 5) {
					// Surface ID buffer 
					gl_FragColor = vec4(hash(vec3(surfaceId)), alpha);
				}
                else if (debugVisualize == 6) {
                    // Surface ID difference
                    gl_FragColor = vec4(vec3(surfaceIdDiff), alpha);
                }

                
			}
			`;
  }

  createOutlinePostProcessMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        debugVisualize: { value: 0 },

        lighting_bias: { value: 0.0 },
        lighting_power: { value: 1.0 },

        // The buffers we'll use: colours, depth, surface ID
        sceneColorBuffer: {},
        depthBuffer: {},
        surfaceBuffer: {},

        outlineColor: { value: new THREE.Color(this.outlineColor) },
        edgeThickness: { value: this.edgeThickness },
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
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
    });
  }
}

export { CustomOutlinePass };
