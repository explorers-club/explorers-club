import { GLTF } from 'three-stdlib';

export type animationIndexes = {
  animationIndex: number;
  animations: (string | number | object)[];
  setAnimationIndex: (id: number) => void;
  setAnimations: (id: number) => void;
};

export type GLTFResult = GLTF & {
  nodes: {
    Mesh019: THREE.SkinnedMesh;
    Mesh019_1: THREE.SkinnedMesh;
    Mesh019_2: THREE.SkinnedMesh;
    Mesh019_3: THREE.SkinnedMesh;
    Mesh019_4: THREE.SkinnedMesh;
    Mesh019_5: THREE.SkinnedMesh;
    Mesh019_6: THREE.SkinnedMesh;
    Mesh019_7: THREE.SkinnedMesh;
    Mesh019_8: THREE.SkinnedMesh;
    Mesh019_9: THREE.SkinnedMesh;

    mixamorigHips: THREE.Bone;
  };
  materials: {
    Glasses: THREE.MeshStandardMaterial;
    Eyes: THREE.MeshStandardMaterial;
    Hair: THREE.MeshStandardMaterial;
    Skin: THREE.MeshStandardMaterial;
    Mouth: THREE.MeshStandardMaterial;
    Shirt: THREE.MeshStandardMaterial;
    Pants: THREE.MeshStandardMaterial;
    Shoes: THREE.MeshStandardMaterial;
    Sole: THREE.MeshStandardMaterial;
    Laces: THREE.MeshStandardMaterial;
  };
};

type ActionName =
  | 'Idle'
  | 'GuitarPlaying'
  | 'Running'
  | 'SalsaDancing'
  | 'TPose'
  | 'Death'
  | 'DrawArrow'
  | 'RunForward'
  | 'StandingIdle'
  | 'TPose';

export type CharacterAnimationAction = Record<
  ActionName,
  THREE.AnimationAction
>;

export type customizationStateTypes = {
  cameraMode: string;
  setCameraMode: (mode: string | any) => void;
  hairColor: string;
  setHairColor: (color: string | any) => void;
  eyesColor: string;
  setEyesColor: (arg: string | any) => void;
  mouthColor: string;
  setMouthColor: (arg: string | any) => void;
  glassesColor: string;
  setGlassesColor: (arg: string | any) => void;
  skinColor: string;
  setSkinColor: (arg: string | any) => void;
  shirtColor: string;
  setShirtColor: (arg: string | any) => void;
  pantsColor: string;
  setPantsColor: (arg: string | any) => void;
  shoesColor: string;
  setShoesColor: (arg: string | any) => void;
  lacesColor: string;
  setLacesColor: (arg: string | any) => void;
  soleColor: string;
  setSoleColor: (arg: string | any) => void;
  morphTargetDictionary: Array<any> | any;
  setMorphTargetDictionary: (arg: string | any) => void;
  morphTargetInfluences: Array<any> | any;
  setMorphTargetInfluences: (arg: string | any) => void;
};

export type cameraModeType = {
  FREE: 'FREE';
  HEAD: 'HEAD';
  TOP: 'TOP';
  BOTTOM: 'BOTTOM';
};
