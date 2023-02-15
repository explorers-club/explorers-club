/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useAnimations, useGLTF } from '@react-three/drei';
import { RefObject, useEffect } from 'react';
import * as THREE from 'three';
import { TypeOf } from 'zod';
import { useCharacterCustomization } from './character-customization.context';
import {
  customizationStateTypes,
  //GLTFResult
} from './character.types';
import { useTexture } from '@react-three/drei';

type GLTFResult = GLTF & {
  nodes: {
    Mesh: THREE.SkinnedMesh;
    Mesh_1: THREE.SkinnedMesh;
    Mesh_2: THREE.SkinnedMesh;
    Mesh_3: THREE.SkinnedMesh;
    Mesh_4: THREE.SkinnedMesh;
    Mesh_5: THREE.SkinnedMesh;
    Mesh_6: THREE.SkinnedMesh;
    Mesh_7: THREE.SkinnedMesh;
    Mesh_8: THREE.SkinnedMesh;
    Mesh_9: THREE.SkinnedMesh;
    Mesh_10: THREE.SkinnedMesh;
    Bip001_Pelvis: THREE.Bone;
  };
  materials: {
    Coconut: THREE.MeshStandardMaterial;
    Coconut_Eyes: THREE.MeshStandardMaterial;
    Coconut_Arm: THREE.MeshStandardMaterial;
    Coconut_Armband: THREE.MeshStandardMaterial;
    Coconut_Hand: THREE.MeshStandardMaterial;
    Coconut_Leg: THREE.MeshStandardMaterial;
    Coconut_Legband: THREE.MeshStandardMaterial;
    Coconut_Foot: THREE.MeshStandardMaterial;
    Coconut_Eyelids: THREE.MeshStandardMaterial;
    Coconut_Eyebrows: THREE.MeshStandardMaterial;
    Coconut_Face: THREE.MeshStandardMaterial;
  };
};

interface Props {
  gltf: GLTFResult;
  group: RefObject<THREE.Group>;
}

import React, { useRef } from 'react';
import { GLTF } from 'three-stdlib';
import { useLoader } from '@react-three/fiber';

type ActionName =
  | 'Bip001.001|Take 001|BaseLayer'
  | 'Bip001.001|Take 001|BaseLayer';
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export function Character({ gltf, group }: Props) {
  const { nodes, materials, animations } = gltf;

  const {
    headColor,
    setHeadColor,
    faceColor,
    setFaceColor,
    eyesColor,
    setEyesColor,
    eyeLidColor,
    setEyeLidColor,
    eyebrowColor,
    setEyebrowColor,
    armColor,
    setArmColor,
    armbandColor,
    setArmbandColor,
    handColor,
    sethandColor,
    legsColor,
    setLegsColor,
    legbandColor,
    setLegbandColor,
    feetColor,
    setfeetColor,
    setMorphTargetDictionary,
    morphTargetInfluences,
    setMorphTargetInfluences,
  } = useCharacterCustomization() as customizationStateTypes;

  useEffect(() => {
    // console.log(
    //   nodes.Mesh.morphTargetDictionary,
    //   nodes.Mesh.morphTargetInfluences
    // );
    // setMorphTargetDictionary(
    //   Object.keys(nodes.Mesh.morphTargetDictionary as any)
    // );
    // setMorphTargetInfluences(nodes.Mesh.morphTargetInfluences);
    setHeadColor(`#${materials.Coconut.color.getHexString()}`);
    setFaceColor(`#${materials.Coconut_Face.color.getHexString()}`);
    setEyesColor(`#${materials.Coconut_Eyes.color.getHexString()}`);
    setEyeLidColor(`#${materials.Coconut_Eyelids.color.getHexString()}`);
    setEyebrowColor(`#${materials.Coconut_Eyebrows.color.getHexString()}`);
    setArmColor(`#${materials.Coconut_Arm.color.getHexString()}`);
    setArmbandColor(`#${materials.Coconut_Armband.color.getHexString()}`);
    sethandColor(`#${materials.Coconut_Hand.color.getHexString()}`);
    setLegsColor(`#${materials.Coconut_Leg.color.getHexString()}`);
    setLegbandColor(`#${materials.Coconut_Legband.color.getHexString()}`);
    setfeetColor(`#${materials.Coconut_Foot.color.getHexString()}`);
  }, []);

  const map = useLoader(THREE.TextureLoader, './assets/Coconut_MaskB.png');

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group
          name="Bip001"
          position={[0, 0.43, 0]}
          rotation={[2.36, -1.45, 2.44]}
          scale={0.03}
        >
          <primitive object={nodes.Bip001_Pelvis} />
          <group name="Coconut_Base">
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh"
              geometry={nodes.Mesh.geometry}
              skeleton={nodes.Mesh.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={headColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_1"
              geometry={nodes.Mesh_1.geometry}
              skeleton={nodes.Mesh_1.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={eyesColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_2"
              geometry={nodes.Mesh_2.geometry}
              skeleton={nodes.Mesh_2.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={armColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_3"
              geometry={nodes.Mesh_3.geometry}
              skeleton={nodes.Mesh_3.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={armbandColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_4"
              geometry={nodes.Mesh_4.geometry}
              skeleton={nodes.Mesh_4.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={handColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_5"
              geometry={nodes.Mesh_5.geometry}
              skeleton={nodes.Mesh_5.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={legsColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_6"
              geometry={nodes.Mesh_6.geometry}
              skeleton={nodes.Mesh_6.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={legbandColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_7"
              geometry={nodes.Mesh_7.geometry}
              skeleton={nodes.Mesh_7.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={feetColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_8"
              geometry={nodes.Mesh_8.geometry}
              skeleton={nodes.Mesh_8.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={eyeLidColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_9"
              geometry={nodes.Mesh_9.geometry}
              skeleton={nodes.Mesh_9.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={eyebrowColor}
              />
            </skinnedMesh>
            <skinnedMesh
              frustumCulled={false}
              castShadow
              name="Mesh_10"
              geometry={nodes.Mesh_10.geometry}
              skeleton={nodes.Mesh_10.skeleton}
              morphTargetDictionary={nodes.Mesh.morphTargetDictionary}
              morphTargetInfluences={morphTargetInfluences}
            >
              <meshStandardMaterial
                normalMap={materials.Coconut.normalMap}
                roughness={materials.Coconut.roughness}
                color={faceColor}
              />
            </skinnedMesh>
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('./assets/Character1.gltf');
