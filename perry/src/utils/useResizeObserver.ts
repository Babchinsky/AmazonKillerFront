import { useEffect } from "react";


function useResizeObserver(ref: any, callback: () => void) {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(() => {
      callback();
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [ref, callback]);
}

export { useResizeObserver };