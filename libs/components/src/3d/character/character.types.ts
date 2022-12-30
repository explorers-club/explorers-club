import { GLTF } from 'three-stdlib';

export type GLTFResult = GLTF & {
  nodes: {
    Erika_Archer_Body_Mesh: THREE.SkinnedMesh;
    Erika_Archer_Clothes_Mesh: THREE.SkinnedMesh;
    Erika_Archer_Eyelashes_Mesh: THREE.SkinnedMesh;
    Erika_Archer_Eyes_Mesh: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
  };
  materials: {
    Akai_MAT: THREE.MeshStandardMaterial;
    eyelash_MAT: THREE.MeshStandardMaterial;
    Body_MAT: THREE.MeshStandardMaterial;
    EyeSpec_MAT: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | 'Death'
  | 'DrawArrow'
  | 'RunForward'
  | 'StandingIdle'
  | 'TPose';

export type CharacterAnimationAction = Record<
  ActionName,
  THREE.AnimationAction
>;
