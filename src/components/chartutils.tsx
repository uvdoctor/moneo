import { COLORS } from "../CONSTANTS";

export const getCommonLayoutProps = (
  title: string = "",
  tickFormat: string = ",",
  autosize: boolean = true
) => {
  return {
    dragmode: "pan",
    font: { family: "'Jost', sans-serif", color: COLORS.DEFAULT, size: 15 },
    autosize: autosize,
    title: title ? { x: 0.05, text: title, font: { size: 20 }, align: 'left' } : false,
    yaxis: { tickformat: tickFormat, fixedrange: true, showgrid: false },
    margin: { t: title ? 40 : 0, r: title ? 10 : 0},
  };
};

export const getCommonStyle = () => {
    return {width: "100%", height: "100%", minHeight: "450px", minWidth: "320px"}
};

export const getCommonConfig = () => {
    return {responsive: true, editable: false, scrollZoom: true, displayModeBar: false}
}
