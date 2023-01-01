import { useEffect, useState } from 'react';
import * as THREE from 'three';

type InputStateType = {
  move: boolean;
  attack: boolean;
  direction: THREE.Vector3;
};

const KEYBOARD_KEYS: { [keyCode: string]: keyof InputStateType } = {
  KeyW: 'move',
  KeyA: 'move',
  KeyD: 'move',
  KeyS: 'move',
  ShiftLeft: 'attack',
};

const DIRECTION_KEYS: { [keyCode: string]: THREE.Vector3 } = {
  KeyW: new THREE.Vector3(0, 0, 1),
  KeyA: new THREE.Vector3(-1, 0, 0),
  KeyD: new THREE.Vector3(1, 0, 0),
  KeyS: new THREE.Vector3(0, 0, -1),
};

export function useInput() {
  const [input, setInput] = useState<InputStateType>({
    move: false,
    attack: false,
    direction: new THREE.Vector3(),
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = KEYBOARD_KEYS[event.code];
    if (key) {
      setInput((input) => ({
        ...input,
        [key]: true,
        direction: DIRECTION_KEYS[event.code] ?? new THREE.Vector3(),
      }));
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = KEYBOARD_KEYS[event.code];
    if (key) {
      setInput((input) => ({
        ...input,
        [key]: false,
        direction: new THREE.Vector3(),
      }));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, [input]);

  return input;
}
