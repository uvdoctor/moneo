import React from "react";
import PContainer from "../pcontainer";

interface StepContainerProps {
  isPContainer: boolean;
  y?: any;
  className: string;
  children?: any;
}

export default function StepContainer({
  isPContainer = false,
  y = [],
  className,
  children,
}: StepContainerProps) {
  return isPContainer ? (
    <PContainer format={className} y={y}>
      {children}
    </PContainer>
  ) : (
    <div className={className}>{children}</div>
  );
}
