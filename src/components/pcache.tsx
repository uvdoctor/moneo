import React, { Fragment, useLayoutEffect } from "react";
import { useController } from "react-scroll-parallax";

export default function ParallaxCache() {
  const pc = typeof window !== "undefined" ? useController() : null;

  useLayoutEffect(() => {
    if (!pc) return;
    const handler = () => pc.parallaxController.update();
    window.addEventListener("load", handler);
    return () => window.removeEventListener("load", handler);
  }, [pc]);

  return <Fragment />;
}
