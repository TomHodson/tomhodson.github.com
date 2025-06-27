import * as THREE from "three";

export function load_gltf(
  element,
  scene,
  surfaceFinder,
  material_mode,
  customOutline,
  gltf
) {
  scene.add(gltf.scene);

  // Compute bounding box
  let box = new THREE.Box3().setFromObject(gltf.scene);

  // Scale the model to fit into a unit cube
  const size = new THREE.Vector3();
  box.getSize(size); // Get the size of the bounding box
  const maxDim = Math.max(size.x, size.y, size.z); // Find the largest dimension
  const scaleFactor = 1 / maxDim; // Calculate the scaling factor
  gltf.scene.scale.set(scaleFactor, scaleFactor, scaleFactor); // Apply the scale uniformly

  // Reposition the model so that its center is at the origin
  let box2 = new THREE.Box3().setFromObject(gltf.scene);
  const center = new THREE.Vector3();
  box2.getCenter(center); // Get the center of the bounding box
  gltf.scene.position.sub(center); // Subtract the center from the position

  // Modify the materials to support surface coloring
  scene.traverse((node) => {
    if (node.type == "Mesh") {
      // Add surface ID attribute to the geometry
      const colorsTypedArray = surfaceFinder.getSurfaceIdAttribute(node);
      node.surfaceId = colorsTypedArray;
      node.geometry.setAttribute(
        "color",
        new THREE.BufferAttribute(colorsTypedArray, 4)
      );

      // Hack specific to kicad models to make the tracks and zones look good
      if (node.name.includes("track") || node.name.includes("zone")) {
        //set to a copper colour
        // #c87533
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x558855),
        });
        node.position.y += 0.00001;
      }

      // Hack specific to kicad models to make the tracks and zones look good
      if (node.name.includes("pad")) {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0xaaaaaa),
        });
        node.position.y += 0.00002;
      }

      if (node.name.includes("PCB")) {
        node.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(0x446644),
        });
      }

      if (material_mode === "flat") {
        node.material = new THREE.MeshStandardMaterial({
          color: node.material.color,
        });
      }
    }
  });

  customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
  element.component.controls.update();
  element.component.composer.render();

  return gltf;
}
