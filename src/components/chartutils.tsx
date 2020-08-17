export const getCommonLayoutProps = (
  title: string = "",
  tickFormat: string = ",",
  autosize: boolean = true
) => {
  return {
    dragmode: "pan",
    font: { family: "'Quicksand', sans-serif", color: "#4a5568", size: 15 },
    autosize: autosize,
    title: title ? { x: 0.05, text: title, font: { size: 20 } } : false,
    yaxis: { tickformat: tickFormat, fixedrange: true, showgrid: false },
    margin: { t: title ? 40 : 20, r: 10},
    hoverlabel: { bgcolor: "#000" },
  };
};

export const getCommonStyle = () => {
    return {width: "100%", height: "100%", minHeight: "450px", minWidth: "320px"}
};

export const getCommonConfig = () => {
    return {responsive: true, editable: false, scrollZoom: true, displayModeBar: false}
}
