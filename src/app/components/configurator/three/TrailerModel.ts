import { Box3, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";

const TRAILER_SCALE = 0.1;
const TRAILER_ROTATION_Y = Math.PI;
const TRAILER_FLOOR_NODE = "v2_Holzboden";

export function prepareTrailerModel(model: Group) {
  const trailer = new Group();
  trailer.name = "ASEA_TrailerModel";
  trailer.add(model);
  model.rotation.y = TRAILER_ROTATION_Y;
  model.scale.setScalar(TRAILER_SCALE);
  trailer.updateMatrixWorld(true);

  const floor = trailer.getObjectByName(TRAILER_FLOOR_NODE);
  if (!floor) throw new Error(`Trailer floor node ${TRAILER_FLOOR_NODE} is missing.`);

  const floorBounds = new Box3().setFromObject(floor);
  const floorCenter = floorBounds.getCenter(new Vector3());
  trailer.position.set(-floorCenter.x, -floorBounds.max.y, -floorCenter.z);

  trailer.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
    const materials = sourceMaterials.map((material) => material.clone());
    object.material = Array.isArray(object.material) ? materials : materials[0];

    materials.forEach((material) => {
      if (!(material instanceof MeshStandardMaterial)) return;
      if (material.transparent) {
        material.depthWrite = false;
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.45);
      } else {
        material.metalness = Math.min(material.metalness, 0.78);
        material.roughness = Math.max(material.roughness, 0.3);
        material.envMapIntensity = Math.min(material.envMapIntensity, 0.8);
      }
      material.needsUpdate = true;
    });

    object.castShadow = false;
    object.receiveShadow = false;
  });

  trailer.updateMatrixWorld(true);
  return trailer;
}
