import {
  cellToCenterChild,
  cellToChildren,
  cellToLatLng,
  getResolution,
} from 'h3-js';
import { useMemo } from 'react';
import { Vector3 } from 'three';
import { fromLatLngToPoint } from './hex-map.utils';

export const useHexagonScatterAtIndex = (h3Index: string, lod: number) => {
  const points = useMemo(() => {
    const res = getResolution(h3Index);

    const targetRes = res + lod;
    const children = cellToChildren(h3Index, targetRes);

    const centerChild = cellToCenterChild(h3Index, targetRes);
    const [centerLat, centerLng] = cellToLatLng(centerChild);
    const centerPoint = fromLatLngToPoint(centerLat, centerLng);

    const points = children.flatMap((child) => {
      const [lat, lng] = cellToLatLng(child);
      const point = fromLatLngToPoint(lat, lng);
      // console.log(centerPoint, point, centerPoint.x - point.x, centerPoint.y - point.y);
      return new Vector3(point.x - centerPoint.x, point.y - centerPoint.y, 0);
    });
    console.log({ points });

    return points;
  }, [h3Index, lod]);

  return points;
};

// export const useHexagonScatter = (
//   radius = 5, //
//   gap = 1
// ) => {
//   const points = useMemo(() => {
//     const pts = [];
//     pts.push(new THREE.Vector3());
//     const unit = gap * 0.176;

//     const angle = Math.PI / 3;
//     const axis = new THREE.Vector3(0, 0, 1);

//     const axisVector = new THREE.Vector3(0, -unit, 0);
//     const sideVector = new THREE.Vector3(0, unit, 0).applyAxisAngle(
//       axis,
//       -angle
//     );
//     const tempV3 = new THREE.Vector3();
//     // for every segment on the hex
//     for (let seg = 0; seg < 6; seg++) {
//       for (let ax = 1; ax <= radius; ax++) {
//         for (let sd = 0; sd < ax; sd++) {
//           tempV3
//             .copy(axisVector)
//             .multiplyScalar(ax)
//             .addScaledVector(sideVector, sd)
//             .applyAxisAngle(axis, angle * seg);

//           pts.push(new THREE.Vector3().copy(tempV3));
//         }
//       }
//     }
//     return pts;
//   }, [radius, gap]);

//   return points;
// };
