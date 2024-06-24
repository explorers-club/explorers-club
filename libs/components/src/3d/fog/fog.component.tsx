import { useTexture, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import glsl from 'glslify';
import { Color, DoubleSide, RepeatWrapping, Texture } from 'three';

const h = 1.0;
const d = 10 * 2;
const o = -3.5 * 2;

const catmullRom = glsl`
  // catmull works by specifying 4 control points p0, p1, p2, p3 and a weight. The function is used to calculate a point n between p1 and p2 based
  // on the weight. The weight is normalized, so if it's a value of 0 then the return value will be p1 and if its 1 it will return p2. 
  float catmullRom( float p0, float p1, float p2, float p3, float weight ) {
    float weight2 = weight * weight;
    return 0.5 * (
        p0 * weight * ( ( 2.0 - weight ) * weight - 1.0 ) +
        p1 * ( weight2 * ( 3.0 * weight - 5.0 ) + 2.0 ) +
        p2 * weight * ( ( 4.0 - 3.0 * weight ) * weight + 1.0 ) +
        p3 * ( weight - 1.0 ) * weight2 );
  }

  // Performs a horizontal catmulrom operation at a given V value.
  float textureCubicU( sampler2D samp, vec2 uv00, float texel, float offsetV, float frac ) {
    return catmullRom(
        textureLod( samp, uv00 + vec2( -texel, offsetV ), 0.0 ).r,
        textureLod( samp, uv00 + vec2( 0.0, offsetV ), 0.0 ).r,
        textureLod( samp, uv00 + vec2( texel, offsetV ), 0.0 ).r,
        textureLod( samp, uv00 + vec2( texel * 2.0, offsetV ), 0.0 ).r,
    frac );
  }

  // Samples a texture using a bicubic sampling algorithm. This essentially queries neighbouring
  // pixels to get an average value.
  float textureBicubic( sampler2D samp, vec2 uv00, vec2 texel, vec2 frac ) {
    return catmullRom(
        textureCubicU( samp, uv00, texel.x, -texel.y, frac.x ),
        textureCubicU( samp, uv00, texel.x, 0.0, frac.x ),
        textureCubicU( samp, uv00, texel.x, texel.y, frac.x ),
        textureCubicU( samp, uv00, texel.x, texel.y * 2.0, frac.x ),
    frac.y );
  }
`;

type FogMeshProps = {
  map: Texture;
  mask: Texture;
  displacementMap: Texture;
  displacementScale: number;
  displacementBias: number;
  repeat: number;
  strength: number;
  layer: number; // number of fog layers used (1-3 for high performance)
  thickness: number; // virtual thickness of the fog
  args: [number, number, number, number]
  smoothness: number; // smoothness of the heightmap
  position: [number, number, number];
  rotation: [number, number, number];
}

export const FogMesh = ({map, mask, displacementScale, displacementBias, args, strength=2, repeat=1, layers=8, thickness=1, position, rotation, smoothness=1.1}:FogMeshProps) => {
  
  const displacementMap = useTexture('./assets/heightmap.png');

  map.wrapS = RepeatWrapping;
  map.wrapT = RepeatWrapping;
  displacementMap.wrapS = RepeatWrapping;
  displacementMap.wrapT = RepeatWrapping;
  const uniforms = {
    color: { type: 'vec3', value: new Color('grey') },
    time: { type: 'f', value: 0 },
    mask: { value: mask },
    map: { value: map },
    repeat: { value: repeat },
    displacementMap: { value: displacementMap },
    displacementScale: { value: displacementScale },
    displacementBias: { value: displacementBias },
    smoothness: { value: smoothness },
    strength: { value: strength },
    colorA: { type: 'vec4', value: [1,1,1,1] },
    colorB: { type: 'vec4', value: [0,0,0,0] },
  };

  // update uniforms
  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  const vertexShader = glsl`
    varying vec2 vUv;
    varying float vZ;
    uniform float time;
    uniform sampler2D map;
    uniform sampler2D displacementMap;
    uniform float displacementScale;
    uniform float displacementBias;
    uniform float repeat;
    uniform float smoothness;

    ${catmullRom}

    void main() {
      vUv = position.xy;
      vZ = position.z;

      vec2 heightUv = uv / repeat;
      vec2 tHeightSize = vec2( 512.0, 512.0 );
      tHeightSize /= smoothness;
      vec2 texel = vec2( 1.0 / tHeightSize );
      vec2 heightUv00 = ( floor( heightUv * tHeightSize ) ) / tHeightSize;
      vec2 frac = vec2( heightUv - heightUv00 ) * tHeightSize;

      float h = textureBicubic( displacementMap, heightUv00, texel, frac );

      h = h * displacementScale + displacementBias;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, h, 1.0); 
    }
  `;

  const fragmentShader = glsl`
    uniform vec4 colorA;
    uniform vec4 colorB;
    uniform sampler2D map;
    uniform sampler2D mask;
    uniform float strength;
    uniform float repeat; 
    uniform float time;
    varying vec2 vUv;
    varying float vZ; 

    void main() {
      vec2 uv = vUv + time;
      float mask = 1.0-texture2D(mask, vUv / repeat + 0.5).r;
      vec4 fogmap = texture2D(map, uv / repeat / 2.0);
      float depth = clamp(0.5 -pow(gl_FragCoord.z / gl_FragCoord.w, 2.0) / 200.0, 0.25, 0.5);
      float alpha = 0.5 - mask;
      vec4 color = mix(colorA, colorB, fogmap.r);
      color.a = (alpha - depth - fogmap.r/2.0) * strength;

      // gl_FragColor = vec4(1.0-fogmap.xyz , (alpha - depth - fogmap.r/2.0) * strength);
      gl_FragColor = color;
    }
  `;

  // todo - draw this with instancing to save on draw calls
  return (
     <>
      {
         Array.from({length:layers}).map((v, i)=>{
          const h = thickness/layers;
          let p = [...position];
          p[1] += i*h;
          return (
            (
              <mesh
                position={p}
                rotation={rotation}
              >
                <planeBufferGeometry args={args} />
                <shaderMaterial
                  transparent
                  uniforms={uniforms}
                  vertexShader={vertexShader}
                  fragmentShader={fragmentShader}
                  side={DoubleSide}
                  map={map}
                />
                {/* <meshBasicMaterial color="grey" opacity={0.5} transparent map={texture} /> */}
              </mesh>
             )
          )
         })
      }
     </>
  );
};