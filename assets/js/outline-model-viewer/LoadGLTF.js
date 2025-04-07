import * as THREE from "three";

export function load_gltf(
  element,
  scene,
  surfaceFinder,
  model_color,
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

      // override materials for different purposes
      // materials = outlines
      // sets the material to be emissive to the background colour of the page
      // This makes for nice two colour rendering with no shading

      // material = flat overides all the materials to just be flat with the base colour

      // material = keep uses whatever material is defined in the gltf

      console.log(
        `element.getAttribute("materials") ${element.getAttribute("materials")}`
      );
      const material_mode = element.getAttribute("materials") || "outlines";
      if (material_mode === "outlines") {
        node.material = new THREE.MeshStandardMaterial({
          emissive: model_color,
        });
      } else if (material_mode === "flat") {
        node.material = new THREE.MeshStandardMaterial({
          color: node.material.color,
        });
      } else if (material_mode === "keep") {
        // Do nothing, leave the material as set in the GLTF file
      } else {
        throw new Error(
          "Invalid material mode, should be outlines, flat or keep."
        );
      }
    }
  });

  customOutline.updateMaxSurfaceId(surfaceFinder.surfaceId + 1);
  element.component.controls.update();
  element.component.composer.render();
}
