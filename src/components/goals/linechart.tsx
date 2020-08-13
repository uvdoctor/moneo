import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface LineChartProps {
    cfs: Array<number>
    startYear: number
}


const Plot = dynamic(
    () => import('react-plotly.js'), { ssr: false }
);

export default function LineChart(props: LineChartProps) {
    const [years, setYears] = useState<Array<number>>([])
    const layout = {
        font: { family: "'Quicksand', sans-serif", color: "#4a5568", size: 15 },
        xaxis: { title: 'Year', type: 'category', fixedrange: years.length > 3, showgrid: false },
        yaxis: { fixedrange: true, tickformat: ',', showgrid: false },
        legend: { orientation: "h" }, margin: {t:20, r:10},
        autosize: true
    }
    const track = 
    {
        type: 'scatter', mode: 'lines+markers', x: years, y: props.cfs,
        line: { color: '#68d391', size: 3 },
        marker: { color: '#276749', symbol: 'circle-x' }
    }

    useEffect(() => {
        let years = []
        for (let i = 0; i < props.cfs.length; i++) years.push(props.startYear + i)
        setYears([...years])
    }, [props.cfs, props.startYear])

    return (
        <div className="w-full flex justify-center">
            {/*@ts-ignore*/}
            <Plot layout={layout} 
                style={{ width: "100%", height: "100%", minHeight: "450px" }}
                data={[track]}
                useResizeHandler={true}
                config={{ responsive: true, displayModeBar: false, scrollZoom: true }} />
        </div>
    )
}