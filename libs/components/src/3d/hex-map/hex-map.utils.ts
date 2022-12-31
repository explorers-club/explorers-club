// pulled from https://github.com/zacbarton/node-mercator-projection

import { MAP_UNIT_SIZE } from './hex-map.constants';

const unitOrigin_ = { x: MAP_UNIT_SIZE / 2, y: MAP_UNIT_SIZE / 2 };
const unitsPerLonDegree_ = MAP_UNIT_SIZE / 360;
const unitsPerLonRadian_ = MAP_UNIT_SIZE / (2 * Math.PI);

function _bound(value: number, opt_min: number, opt_max: number) {
  if (opt_min != null) value = Math.max(value, opt_min);
  if (opt_max != null) value = Math.min(value, opt_max);
  return value;
}

function _degreesToRadians(deg: number) {
  return deg * (Math.PI / 180);
}

function _radiansToDegrees(rad: number) {
  return rad / (Math.PI / 180);
}

export function fromLatLngToPoint(lat: number, lng: number) {
  const origin = unitOrigin_;

  const x = origin.x + lng * unitsPerLonDegree_;

  // Truncating to 0.9999 effectively limits latitude to 89.189. This is
  // about a third of a tile past the edge of the world tile.
  const siny = _bound(Math.sin(_degreesToRadians(lat)), -0.9999, 0.9999);
  const y =
    origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -unitsPerLonRadian_;

  return { x, y };
}

export function fromPointToLatLng(x: number, y: number) {
  const origin = unitOrigin_;
  const lng = (x - origin.x) / unitsPerLonDegree_;
  const latRadians = (y - origin.y) / -unitsPerLonRadian_;
  const lat = _radiansToDegrees(
    2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2
  );

  return { lat: lat, lng: lng };
}
