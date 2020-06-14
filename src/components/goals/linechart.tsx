import React from 'react'
import dynamic from 'next/dynamic'

interface LineChartProps {
    data?: Array<any>
    currency?: string
    title?: string
    xTitle?: string
    yTitle?: string
}

export function LineChart(props: LineChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div>
            {/*@ts-ignore*/}
            <Plot layout={{
                title: {text: props.title, xref:'container'}, 
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size:20}, 
                autosize: true, width:'100%', height:'100%', 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true},
                yaxis: {title: props.yTitle, fixedrange: true}
            }} useResizeHandler={true}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', mode: 'lines', x: props.data[0], y: props.data[1], } 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false}} />
        </div>
    )
}