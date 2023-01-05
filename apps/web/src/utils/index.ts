import { useRef, useEffect } from 'react';

export const getClubNameFromPath = () => {
  const pathTokens = window.location.pathname.split('/');
  const clubName = pathTokens[1] !== '' ? pathTokens[1] : undefined;
  return clubName;
};

/**
 * a type-safe version of the `usePrevious` hook described here:
 * @see {@link https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state}
 */
export function usePrevious<T>(
  value: T
): ReturnType<typeof useRef<T>>['current'] {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
