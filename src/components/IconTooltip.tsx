import React, { Fragment, ReactNode } from "react";
import ReactTooltip from "react-tooltip";
import SVGInfo from "./svginfo";

/**
 * Usage
 * Normal text example:
 * <IconTooltip tip="hello world" />
 *
 * HTML example:
 * <IconTooltip id="earn-credit">
 *  <ul className="p-3 text-lg font-normal">
 *    <li>First 100 get $200 credit</li>
 *    <li>Next 900 get $150 credit</li>
 *    <li>Next 2,000 get $100 credit</li>
 *    <li>Next 3,000 get $75 credit</li>
 *    <li>Next 4,000 get $50 credit</li>
 *    <li>Next 5,000 get $30 credit</li>
 *    <li>All others get $15 credit</li>
 *  </ul>
 * </IconTooltip>
 */

interface IconTooltipProps {
  id?: string;
  tip?: string;
  icon?: ReactNode;
  children?: ReactNode;
  place?: any;
}

export default function IconTooltip({
  id,
  tip = "",
  children,
  icon = <SVGInfo />,
  place = "top",
}: IconTooltipProps) {
  return (
    <Fragment>
      <p className="inline-block" data-tip={tip} data-for={id}>
        {icon}
      </p>
      {tip.length ? (
        <ReactTooltip className="tooltip-info" />
      ) : (
        <ReactTooltip className="tooltip-info" id={id} place={place}>
          {children}
        </ReactTooltip>
      )}
    </Fragment>
  );
}
