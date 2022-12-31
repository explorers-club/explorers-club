import { FC, useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FrontSide, InstancedMesh, Vector3 } from 'three';
import { BeveledHexagonGeometry } from './beveled-hexagon-geometry.component';
import { Tile } from '@explorers-club/api-client';

import { useSpring } from '@react-spring/three';
import { getHexagonEdgeLengthAvg, getResolution, UNITS } from 'h3-js';

const tempV4 = new THREE.Object3D();

interface Props {
  points: Vector3[];
  h3Index: string;
  lod: number;
  tiles?: Tile[];
}

export const HexTerrain: FC<Props> = ({ points, h3Index, lod }) => {
  const elevation = 4;

  const p1 = points[0];
  const p2 = points[1];
  const edgeLength = p1.distanceTo(p2);

  const ref = useRef<InstancedMesh>(null);

  const generate = useCallback(
    (scale: number) => {
      if (!ref.current) {
        return;
      }
      const mesh = ref.current;

      // Iterate each point and set the transform
      // of each instanced mesh to match the point
      points.forEach((point, i) => {
        tempV4.position.copy(point);

        tempV4.scale.setScalar(0.01);

        if (scale) {
          tempV4.scale.multiplyScalar(scale);
        }

        tempV4.scale.z *= 5 * elevation;
        tempV4.scale.x *= 2 * edgeLength; // todo add rotation to fit and fix sizes here
        tempV4.scale.y *= 2 * edgeLength;
        tempV4.updateMatrix();
        mesh.setMatrixAt(i, tempV4.matrix);
        //   mesh.setColorAt(i, c);
      });
      mesh.instanceMatrix.needsUpdate = true;
      // mesh.instanceColor.needsUpdate = true;
    },
    [points]
  );

  const { scale } = useSpring({
    scale: 1,
    onChange: ({ value: { scale } }) => {
      generate(scale);
    },
  });

  useEffect(() => {
    scale.start({ from: 0, to: 1 });
  }, [scale]);

  useEffect(() => {
    generate(1);
  }, [generate]);

  return (
    <group>
      {/* <mesh>
        <sphereGeometry args={[edgeLength]} />
        <meshStandardMaterial color="blue" />
      </mesh> */}
      <instancedMesh
        castShadow
        receiveShadow
        ref={ref}
        args={[undefined, undefined, points.length]}
      >
        <BeveledHexagonGeometry />
        <meshStandardMaterial
          color="green"
          shadowSide={FrontSide} //
          side={FrontSide} //
        />
      </instancedMesh>
    </group>
  );
};
