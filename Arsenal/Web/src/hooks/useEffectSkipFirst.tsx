import { useRef, useEffect, DependencyList, EffectCallback } from 'react';

const useEffectSkipFirst = (effect: EffectCallback, deps: DependencyList): void => {
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    return effect();
  }, deps);
};

export default useEffectSkipFirst;
