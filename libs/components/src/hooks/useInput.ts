import { useEffect, useState } from 'react';

type InputStateType = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shift: boolean;
};

const KEYBOARD_KEYS: { [keyCode: string]: keyof InputStateType } = {
  KeyW: 'forward',
  ShiftLeft: 'shift',
};

export function useInput() {
  const [input, setInput] = useState({
    forward: false,
    shift: false,
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    const key = KEYBOARD_KEYS[event.code];
    if (key) {
      setInput((input) => ({ ...input, [key]: true }));
    }
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    const key = KEYBOARD_KEYS[event.code];
    if (key) {
      setInput((input) => ({ ...input, [key]: false }));
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
  }, [input]);

  return input;
}
