import React from "react";
import { toast } from "react-toastify";
import SVGInfo from "./svginfo";

interface InfoTextProps {
  text: string;
  color: string
  info: string;
}

export default function InfoText({ text, color, info }: InfoTextProps) {
  return (
    <div
      className="flex cursor-pointer items-start"
      onClick={() => toast.info(info)}
    >
      <label className="text-base" style={{color: color}}>{text}</label>
      <SVGInfo />
    </div>
  );
}
