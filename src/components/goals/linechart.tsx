import React from 'react'
import dynamic from 'next/dynamic'

interface LineChartProps {
    data?: Array<any>
    currency?: string
    title?: string
    xTitle?: string
    yTitle?: string
}

export default function LineChart(props: LineChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div className="mt-4 mb-4 w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true, 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true, showgrid: false},
                yaxis: {fixedrange: true, showgrid: false},
                title: props.title,
                legend: {orientation: "h"}
            }} useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', mode: 'lines+markers', x: props.data[0], y: props.data[1]} 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false}} />
        </div>
    )
}