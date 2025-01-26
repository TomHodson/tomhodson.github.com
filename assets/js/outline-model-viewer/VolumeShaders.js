export const vertexShader = `
// Attributes.
in vec3 position;

// Uniforms.
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec3 cameraPosition;

// Output.
out vec3 vOrigin; // Output ray origin.
out vec3 vDirection;  // Output ray direction.

void main() {
  // Compute the ray origin in model space.
  vOrigin = vec3(inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz;
  // Compute ray direction in model space.
  vDirection = position - vOrigin;

  // Compute vertex position in clip space.
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
precision highp sampler3D; // Precision for 3D texture sampling.
precision highp float; // Precision for floating point numbers.

uniform sampler3D dataTexture; // Sampler for the volume data texture.
// uniform sampler2D colorTexture; // Sampler for the color palette texture.
uniform float samplingRate; // The sampling rate.
uniform float clampMin; // Clamp values below this value to 0.
uniform float clampMax; // Clamp values above this value to 1.
uniform float threshold; // Threshold to use for isosurface-style rendering.
uniform float alphaScale; // Scaling of the color alpha value.
uniform bool invertColor; // Option to invert the color palette.

in vec3 vOrigin; // The interpolated ray origin from the vertex shader.
in vec3 vDirection; // The interpolated ray direction from the vertex shader.

out vec4 frag_color; // Output fragment color.

// Sampling of the volume data texture.
float sampleData(vec3 coord) {
  return texture(dataTexture, coord).x;
}

// Sampling of the color palette texture.
vec4 sampleColor(float value) {
  // In case the color palette should be inverted, invert the texture coordinate to sample the color texture.
  float x = invertColor ? value : 1.0 - value;
//   return texture(colorTexture, vec2(x, 0.5));
return vec4(x, x, x, 1.0);
}

// Intersection of a ray and an axis-aligned bounding box.
// Returns the intersections as the minimum and maximum distance along the ray direction. 
vec2 intersectAABB(vec3 rayOrigin, vec3 rayDir, vec3 boxMin, vec3 boxMax) {
  vec3 tMin = (boxMin - rayOrigin) / rayDir;
  vec3 tMax = (boxMax - rayOrigin) / rayDir;
  vec3 t1 = min(tMin, tMax);
  vec3 t2 = max(tMin, tMax);
  float tNear = max(max(t1.x, t1.y), t1.z);
  float tFar = min(min(t2.x, t2.y), t2.z);

  return vec2(tNear, tFar);
}

// Volume sampling and composition.
// Note that the code is inserted based on the selected algorithm in the user interface.
vec4 compose(vec4 color, vec3 entryPoint, vec3 rayDir, float samples, float tStart, float tEnd, float tIncr) {
  // Composition of samples using maximum intensity projection.
  // Loop through all samples along the ray.
  float density = 0.0;
  for (float i = 0.0; i < samples; i += 1.0) {
    // Determine the sampling position.
    float t = tStart + tIncr * i; // Current distance along ray.
    vec3 p = entryPoint + rayDir * t; // Current position.

    // Sample the volume data at the current position. 
    float value = sampleData(p);  
    value = value < clampMin ? 0. : value;   
    value = value > clampMax ? 0. : value;
    

    // Keep track of the maximum value.
    if (value > density) {
      // Store the value if it is greater than the previous values.
      density = value;
    }

    // Early exit the loop when the maximum possible value is found or the exit point is reached. 
    if (density >= 1.0 || t > tEnd) {
      break;
    }
  }

  // Convert the found value to a color by sampling the color palette texture.
  color.rgb = sampleColor(density).rgb;
  // Modify the alpha value of the color to make lower values more transparent.
  color.a = alphaScale * (invertColor ? 1.0 - density : density);

  // Return the color for the ray.
  return color;
}

void main() {
  // Determine the intersection of the ray and the box.
  vec3 rayDir = normalize(vDirection);
  vec3 aabbmin = vec3(-0.5);
  vec3 aabbmax = vec3(0.5);
  vec2 intersection = intersectAABB(vOrigin, rayDir, aabbmin, aabbmax);

  // Initialize the fragment color.
  vec4 color = vec4(0.0);

  // Check if the intersection is valid, i.e., if the near distance is smaller than the far distance.
  if (intersection.x <= intersection.y) {
    // Clamp the near intersection distance when the camera is inside the box so we do not start sampling behind the camera.
    intersection.x = max(intersection.x, 0.0);
    // Compute the entry and exit points for the ray.
    vec3 entryPoint = vOrigin + rayDir * intersection.x;
    vec3 exitPoint = vOrigin + rayDir * intersection.y;

    // Determine the sampling rate and step size.
    // Entry Exit Align Corner sampling as described in
    // Volume Raycasting Sampling Revisited by Steneteg et al. 2019
    vec3 dimensions = vec3(textureSize(dataTexture, 0));
    vec3 entryToExit = exitPoint - entryPoint;
    float samples = ceil(samplingRate * length(entryToExit * (dimensions - vec3(1.0))));
    float tEnd = length(entryToExit);
    float tIncr = tEnd / samples;
    float tStart = 0.5 * tIncr;

    // Determine the entry point in texture space to simplify texture sampling.
    vec3 texEntry = (entryPoint - aabbmin) / (aabbmax - aabbmin);

    // Sample the volume along the ray and convert samples to color.
    color = compose(color, texEntry, rayDir, samples, tStart, tEnd, tIncr);
  }

  // Return the fragment color.
  frag_color = color;
}`;
