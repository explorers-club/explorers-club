import { useTexture, Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import glsl from 'glslify';
import { Color, DoubleSide, RepeatWrapping } from 'three';

export const Floor = () => {
  const texture = useTexture('./assets/231.jpg');
  const mask = useTexture('./assets/blur.jpg');
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  const uniforms = {
    colorB: { type: 'vec3', value: new Color('#8f97db') },
    colorA: { type: 'vec3', value: new Color('#8fb5db') },
    time: { type: 'f', value: 0 },
    map: { value: texture },
    mask: { value: mask },
  };

  const h = 1.0;
  const r = 200;

  // update uniforms
  useFrame(({ clock }) => {
    uniforms.time.value = clock.getElapsedTime();
  });

  const vertexShader = glsl`
    varying vec2 vUv;
    varying float vZ;
    uniform float time;
    uniform sampler2D map;
    void main() {
      vUv = position.xy;
      vZ = position.z;

      float t = time;

      // displacement based on map
      vec2 st = (vUv + vec2(sin(vUv.x/4.0+ t), cos(vUv.y/4.0 + vUv.x/4.0 +t))/4.0 + t/4.0) /12.0 * vec2(1.25,1);
      float v = texture2D(map, st).r;
      vec2 displacement = vec2(sin(time), cos(time));
      vec3 vp = position + vec3(0.0, 0.0, 1.0-v/2.0 );
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vp, 1.0);
      
    }
  `;

  const fragmentShader = glsl`
  uniform vec3 colorA;
  uniform vec3 colorB;
  uniform sampler2D map;
  uniform sampler2D mask;
  uniform float time;
  varying vec2 vUv;
  varying float vZ; 


  void main() {
    // vec3 color = mix(colorA, colorB, vUv.y);
    vec3 color = colorA;

    vec2 st = (vec2(vUv.x, vZ) + time/8.0) /8.0 *vec2(1.5,1);
    float v = 1.0-texture2D(mask, vUv / 30.0 + 0.5).r;

    float t = time * 0.5;

    vec2 uv = (vUv + vec2(sin(vUv.x/4.0+ t), cos(vUv.y/4.0 + vUv.x/4.0 +t))/4.0 + t/4.0) /12.0 * vec2(1.25,1);

    // would be more accurate to compute the depth based on the entrance and exit points of the ray
    // but this is a quick approximation based on the camera position
    float depth = pow(gl_FragCoord.z / gl_FragCoord.w, 2.0)/ 16.0;

    // idea: instead of using geometry to make wavy top, fade the top of the object out to transparent based on 3 noise functions

    float alpha = clamp(depth, 0.0, 0.75);

    gl_FragColor = vec4(color - (texture2D(map, uv).rgb * 0.5 - 0.25), alpha- v);
    float w = 1.0 - gl_FragColor.r + gl_FragColor.g + gl_FragColor.b;
    gl_FragColor.a - w;
    // gl_FragColor = vec4( v, 0,0, 1);

    // top of object
    // if(vUv.y == ${(h/2).toFixed(1)}){
    //   gl_FragColor = vec4(color - (texture2D(map, st).rgb * 0.5 - 0.25), alpha);
    // } else {
    //   // gl_FragColor = vec4(color, vUv.y + 0.5);
    //   // clamping helps with the depth inaccuracy introduced by the camera position approximation
    //   gl_FragColor = vec4(color, alpha);
    // }

    // gl_FragColor = vec4(colorA, depth);
    
  }
`;



  return (
    <>
      <mesh position={[0, 0, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 50]} />
        <meshBasicMaterial color="#1BB364" />
      </mesh>
      <mesh>
        <boxGeometry args={[30, 0.1, 50]} />
        <meshBasicMaterial color="#1BB364" />
      </mesh>
      <mesh position={[-3, h/2, 0]}>
        <coneBufferGeometry args={[0.75,h*2,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[-2, h/2, 5]}>
        <coneBufferGeometry args={[0.75,h*2,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      
      <mesh position={[4, h/3, 1]}>
        <coneBufferGeometry args={[0.75,h*2.75,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>

      <mesh position={[4, h/3, 2.5]}>
        <coneBufferGeometry args={[0.75,h*2.75,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>

      <mesh position={[1, h/3, 3]}>
        <coneBufferGeometry args={[0.75,h*2.75,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>
      <mesh position={[1, h/3, -3]}>
        <coneBufferGeometry args={[0.75,h*2.75,32]} />
        <meshBasicMaterial color="#168051" />
      </mesh>

      <mesh position={[0, 1+h / 2 + 0.3, 0.0]} rotation={[-Math.PI/2,0,0]}>
        {/* <boxGeometry args={[r, h, r]} /> */}
        <planeBufferGeometry args={[r, r, r*5, r*5]} />
        {/* <cylinderGeometry args={[r, r, h, 32]} /> */}
        <shaderMaterial
          transparent
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          // side={DoubleSide}
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
