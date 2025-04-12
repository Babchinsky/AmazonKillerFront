import { useEffect, useState } from "react";


function useBreakpoint(breakpoint: number): boolean {
  const [doesMatch, setDoesMatch] = useState(window.innerWidth >= breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setDoesMatch(window.innerWidth >= breakpoint);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [breakpoint]);

  return doesMatch;
}

export { useBreakpoint };