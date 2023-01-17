import { useTexture, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import glsl from 'glslify';
import { Color, DoubleSide, RepeatWrapping } from 'three';

const h = 1.0;
const r = 200;
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

export const Floor = () => {
  return (
    <>
      <FogMesh />
      <Terrain />
      <Trees />
    </>
  );
};

export const Terrain = () => {
  const hmap = useTexture('./assets/heightmap.png');
  hmap.wrapS = RepeatWrapping;
  hmap.wrapT = RepeatWrapping;
  hmap.repeat.set(1 / 30, 1 / 30);
  return (
    <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[r, r, r, 1024]} />
      <meshStandardMaterial
        color="#1BB364"
        displacementScale={d}
        displacementMap={hmap}
        displacementBias={o}
      />
    </mesh>
  );
};

function Trees() {
  return (
    <>
      <mesh position={[-3, h / 2 + 0.5, 0]}>
        <coneBufferGeometry args={[0.75, h * 2, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[4, h / 3 + 1, 1]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[4, h / 3 + 1, 2.5]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[1, h / 3 + 1, 3]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[1, h / 3 + 1, -3]}>
        <coneBufferGeometry args={[0.75, h * 2.75, 32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
    </>
  );
}

export const FogMesh = () => {
  const fogTexture = useTexture('./assets/231.jpg');
  const mask = useTexture('./assets/blur.jpg');
  const hmap = useTexture('./assets/heightmap.png');

  fogTexture.wrapS = RepeatWrapping;
  fogTexture.wrapT = RepeatWrapping;
  hmap.wrapS = RepeatWrapping;
  hmap.wrapT = RepeatWrapping;
  const uniforms = {
    color: { type: 'vec3', value: new Color('grey') },
    time: { type: 'f', value: 0 },
    mask: { value: mask },
    map: { value: fogTexture },
    repeat: { value: 30.0 },
    displacementMap: { value: hmap },
    displacementScale: { value: d },
    displacementBias: { value: o },
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

    ${catmullRom}

    void main() {
      vUv = position.xy;
      vZ = position.z;

      vec2 heightUv = uv / repeat;
      vec2 tHeightSize = vec2( 512.0, 512.0 );
      float smoothness = 2.5;
      tHeightSize /= smoothness;
      vec2 texel = vec2( 1.0 / tHeightSize );
      vec2 heightUv00 = ( floor( heightUv * tHeightSize ) ) / tHeightSize;
      vec2 frac = vec2( heightUv - heightUv00 ) * tHeightSize;

      float h = textureBicubic( displacementMap, heightUv00, texel, frac );
      // float h = texture2D(displacementMap, uv / 30.0).r;

      h = h * displacementScale + displacementBias;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, h, 1.0); 
    }
  `;

  const fragmentShader = glsl`
    uniform vec3 color;
    uniform sampler2D map;
    uniform sampler2D mask;
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

      gl_FragColor = vec4(1.0-fogmap.xyz , (alpha - depth - fogmap.r/2.0) / 2.0);
    }
  `;

  // todo - draw this with instancing to save on draw calls
  return (
     <>
      {
         Array.from({length:10}).map((v, i)=>(
          <mesh
            position={[0, 3 + h / 2 + i*0.125, 0.0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeBufferGeometry args={[r, r, r * 5, r * 5]} />
            <shaderMaterial
              transparent
              uniforms={uniforms}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              side={DoubleSide}
              map={fogTexture}
              // wireframe
            />
            {/* <meshBasicMaterial color="grey" opacity={0.5} transparent map={texture} /> */}
          </mesh>
         ))
      }
     </>
  );
};