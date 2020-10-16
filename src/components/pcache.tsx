import React, { Fragment, useLayoutEffect } from "react";
import { useController } from "react-scroll-parallax";

export default function ParallaxCache() {
  const {parallaxController} = useController();

  useLayoutEffect(() => {
    const handler = () => parallaxController.update();
    window.addEventListener("load", handler);
    return () => window.removeEventListener("load", handler);
  }, [parallaxController]);

  return <Fragment />;
}
