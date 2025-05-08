import { useEffect, useState } from "react";


function useBreakpoint(breakpoint: number): boolean {
  const [isAbove, setIsAbove] = useState(() => window.innerWidth >= breakpoint);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`);

    const handler = (e: MediaQueryListEvent) => {
      setIsAbove(e.matches);
    };

    mq.addEventListener("change", handler);
    setIsAbove(mq.matches);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, [breakpoint]);

  return isAbove;
}

export { useBreakpoint };