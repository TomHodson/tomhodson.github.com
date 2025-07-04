import * as THREE from "three";

/*
  This class computes "surface IDs" for a given mesh.

  A "surface" is defined as a set of triangles that share vertices.
  
  Inspired by Ian MacLarty, see:
    https://twitter.com/ianmaclarty/status/1499494878908403712
*/
class FindSurfaces {
  constructor() {
    // This identifier, must be globally unique for each surface
    // across all geometry rendered on screen
    // reserve 10 special ids for various purposes
    this.surfaceId = 10;
  }

  /*
   * Returns the surface Ids as a Float32Array that can be inserted as a vertex attribute
   */
  getSurfaceIdAttribute(mesh) {
    const bufferGeometry = mesh.geometry;
    const numVertices = bufferGeometry.attributes.position.count;

    // Check if "track" or "pad" is in the name of the mesh
    let idOverride = null;
    if (
      mesh.name.includes("track") ||
      mesh.name.includes("pad") ||
      mesh.name.includes("zone")
    ) {
      idOverride = 1;
    }

    const vertexIdToSurfaceId = this._generateSurfaceIds(mesh, idOverride);

    const colors = [];
    for (let i = 0; i < numVertices; i++) {
      const vertexId = i;
      let surfaceId = vertexIdToSurfaceId[vertexId];

      colors.push(surfaceId, 0, 0, 1);
    }

    const colorsTypedArray = new Float32Array(colors);
    return colorsTypedArray;
  }

  /*
   * Returns a `vertexIdToSurfaceId` map
   * given a vertex, returns the surfaceId
   */
  _generateSurfaceIds(mesh, idOverride = null) {
    const bufferGeometry = mesh.geometry;
    const numVertices = bufferGeometry.attributes.position.count;
    const numIndices = bufferGeometry.index.count;
    const indexBuffer = bufferGeometry.index.array;
    const vertexBuffer = bufferGeometry.attributes.position.array;
    // For each vertex, search all its neighbors
    const vertexMap = {};
    for (let i = 0; i < numIndices; i += 3) {
      const i1 = indexBuffer[i + 0];
      const i2 = indexBuffer[i + 1];
      const i3 = indexBuffer[i + 2];

      add(i1, i2);
      add(i1, i3);
      add(i2, i3);
    }
    function add(a, b) {
      if (vertexMap[a] == undefined) vertexMap[a] = [];
      if (vertexMap[b] == undefined) vertexMap[b] = [];

      if (vertexMap[a].indexOf(b) == -1) vertexMap[a].push(b);
      if (vertexMap[b].indexOf(a) == -1) vertexMap[b].push(a);
    }

    // Find cycles
    const frontierNodes = Object.keys(vertexMap).map((v) => Number(v));
    const exploredNodes = {};
    const vertexIdToSurfaceId = {};

    while (frontierNodes.length > 0) {
      const node = frontierNodes.pop();
      if (exploredNodes[node]) continue;

      // Get all neighbors recursively
      const surfaceVertices = getNeighbors(node);
      // Mark them as explored
      for (let v of surfaceVertices) {
        exploredNodes[v] = true;
        vertexIdToSurfaceId[v] = idOverride || this.surfaceId;
      }

      this.surfaceId += 1;
    }

    function getNeighbors(node) {
      const frontier = [node];
      const explored = {};
      const result = [];

      while (frontier.length > 0) {
        const currentNode = frontier.pop();
        if (explored[currentNode]) continue;
        const neighbors = vertexMap[currentNode];
        result.push(currentNode);

        explored[currentNode] = true;

        for (let n of neighbors) {
          if (!explored[n]) {
            frontier.push(n);
          }
        }
      }

      return result;
    }

    return vertexIdToSurfaceId;
  }
}

export default FindSurfaces;

export function getSurfaceIdMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      maxSurfaceId: { value: 1 },
    },
    vertexShader: getVertexShader(),
    fragmentShader: getFragmentShader(),
    vertexColors: true,
  });
}

function getVertexShader() {
  return `
  varying vec2 vUv;
  varying vec4 vSurfaceIdNormal;

  void main() {
     vUv = uv;

     // Save the surface id into the r channel and the normal into the gba channels 
     mat4 matrixWorld = projectionMatrix * modelViewMatrix;
     vec3 screenspace_normal = normalize( mat3(matrixWorld) * normal);
     vSurfaceIdNormal = vec4(color.r, screenspace_normal);
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `;
}

function getFragmentShader() {
  return `
  varying vec2 vUv;
  varying vec4 vSurfaceIdNormal;
  uniform float maxSurfaceId;

  void main() {
    // Normalize the surfaceId when writing to texture
    // Surface ID needs rounding as precision can be lost in perspective correct interpolation 
    // - see https://github.com/OmarShehata/webgl-outlines/issues/9 for other solutions eg. flat interpolation.
    float surfaceId = round(vSurfaceIdNormal.r) / maxSurfaceId;
    gl_FragColor = vec4(surfaceId, vSurfaceIdNormal);
  }
  `;
}
