import { SimplexNoise } from 'three-stdlib';
import { defineHex, Grid, spiral } from 'honeycomb-grid';

const simplex = new SimplexNoise();

export class Hex extends defineHex({ dimensions: { xRadius: 1, yRadius: 1 } }) {
  elevation!: number;
}

export class World {
  grid: Grid<Hex>;

  constructor() {
    this.grid = new Grid(Hex, spiral({ radius: 10 }));
    this.grid.forEach((hex) => {
      const noise = (simplex.noise(hex.q * 0.1, hex.r * 0.1) + 1) * 0.5;
      hex.elevation = Math.pow(noise, 1.5) * 10;
    });
  }

  //   static fromJSON({ hexSettings, coordinates }: WorldAsJSON): Grid<Hex> {
  //     const HexClass = defineHex(hexSettings);
  //     return new Grid(
  //       HexClass,
  //       coordinates.map((_coordinates) => new HexClass(_coordinates))
  //     );
  //   }

  //   toJSON() {}
}
