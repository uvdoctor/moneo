export const getCommonLayoutProps = (
  title: string = "",
  tickFormat: string = ","
) => {
  return {
    dragmode: "pan",
    font: { family: "'Quicksand', sans-serif", color: "#4a5568", size: 15 },
    autosize: true,
    title: title ? { x: 0.05, text: title, font: { size: 20 } } : false,
    yaxis: { tickformat: tickFormat, fixedrange: true, showgrid: false },
    margin: { t: title ? 40 : 20, r: 10 },
  };
};

export const getCommonStyle = () => {
    return {width: "100%", height:"100%", minHeight: "450px"}
};

export const getCommonConfig = () => {
    return {responsive: true, editable: false, displayModeBar: false, scrollZoom: true}
}
