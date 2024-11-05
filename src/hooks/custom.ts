import { useEffect, useRef } from 'react'

export const useUpdate = (fn: () => void, deps: any[]) => {
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fn();
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};
