import { GLTF } from 'three-stdlib';

export type animationIndexes = {
  animationIndex: number;
  animations: (string | number | object)[];
  setAnimationIndex: (id: number) => void;
  setAnimations: (id: number) => void;
};

export type GLTFResult = GLTF & {
  nodes: {
    Mesh: THREE.SkinnedMesh;
    Mesh_1: THREE.SkinnedMesh;
    Mesh001: THREE.SkinnedMesh;
    Mesh001_1: THREE.SkinnedMesh;
    Bip001_Pelvis: THREE.Bone;
    Bip001_Pelvis_1: THREE.Bone;
  };
  materials: {
    Coconut: THREE.MeshStandardMaterial;
    Coconut_Eyes: THREE.MeshStandardMaterial;
    ['Coconut.001']: THREE.MeshStandardMaterial;
    ['Coconut_Eyes.001']: THREE.MeshStandardMaterial;
  };
};

type ActionName = 'Idle' | 'Walking';

export type CharacterAnimationAction = Record<
  ActionName,
  THREE.AnimationAction
>;

export type customizationStateTypes = {
  cameraMode: string;
  setCameraMode: (mode: string | any) => void;
  headColor: string;
  setHeadColor: (color: string | any) => void;
  faceColor: string;
  setFaceColor: (color: string | any) => void;
  eyesColor: string;
  setEyesColor: (arg: string | any) => void;
  eyeLidColor: string;
  setEyeLidColor: (arg: string | any) => void;
  eyebrowColor: string;
  setEyebrowColor: (arg: string | any) => void;
  armColor: string;
  setArmColor: (arg: string | any) => void;
  armbandColor: string;
  setArmbandColor: (arg: string | any) => void;
  handColor: string;
  sethandColor: (arg: string | any) => void;
  legsColor: string;
  setLegsColor: (arg: string | any) => void;
  legbandColor: string;
  setLegbandColor: (arg: string | any) => void;
  feetColor: string;
  setfeetColor: (arg: string | any) => void;
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
