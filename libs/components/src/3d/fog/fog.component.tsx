import { useTexture, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import glsl from 'glslify';
import { Color, DoubleSide } from 'three';

export const Floor = () => {
  const texture = useTexture('./assets/elevation.png');
  const uniforms = {
    colorB: { type: 'vec3', value: new Color(0xacb6e5) },
    // colorA: { type: 'vec3', value: new Color(0xacb6e5) },
    colorA: { type: 'vec3', value: new Color(0x74ebd5) },
    time: { type: 'f', value: 0 },
    map: { value: texture },
  };

  const h = 10.0;
  const r = 10;

  // update uniforms
  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  const vertexShader = glsl`
    varying vec2 vUv;
    varying float vZ;
    void main() {
      vUv = position.xy;
      vZ = position.z;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = glsl`
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform sampler2D map;
  uniform float time;
  varying vec2 vUv;
  varying float vZ; 


  
  
  void main() {
    vec3 color = mix(colorA, colorB, vUv.y);

    vec2 st = mod(vec2(vUv.x, vZ) + time/16.0, 1.0);

    // would be more accurate to compute the depth based on the entrance and exit points of the ray
    // but this is a quick approximation based on the camera position
    float depth = gl_FragCoord.z / gl_FragCoord.w / 15.0;

    float alpha = clamp(depth, 0.0, 0.5);

    // top of object
    if(vUv.y == ${(h/2).toFixed(1)}){
      gl_FragColor = vec4(texture2D(map, st).rgb, alpha);
    } else {
      // gl_FragColor = vec4(color, vUv.y + 0.5);
      // clamping helps with the depth inaccuracy introduced by the camera position approximation
      gl_FragColor = vec4(color, alpha);
    }

    // gl_FragColor = vec4(colorA, depth);
    
  }
`;



  return (
    <>
      <mesh position={[0, 0, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        {/* <planeGeometry args={[30, 50]} /> */}
        <meshBasicMaterial color="green" />
      </mesh>
      <mesh position={[0, h / 2 + 0.1, 0.0]}>
        <boxGeometry args={[r, h, r]} />
        {/* <cylinderGeometry args={[r, r, h, 32]} /> */}
        <shaderMaterial
          transparent
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={DoubleSide}
          // wireframe
        />
        {/* <meshBasicMaterial color="red" opacity={0.5} transparent map={texture} /> */}
      </mesh>
    </>
  );
};

// gausian heightmap cube

// scrolling top texture

// custom material
// base opacity of camera distance
// mask texture
// frenel alpha

// import a height map
// create a custom material
// A Primary fog color
// Fog color intensity should increase with distance from camera (min/max)
// Optional vertical height limits on fog (min/max). Samples height map.
// World aligned, optionally scrolling noise texture to add visual depth
// Mask Texture that clears fog (fog of war)
