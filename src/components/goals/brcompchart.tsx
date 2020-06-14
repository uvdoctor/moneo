import React from 'react'
import dynamic from 'next/dynamic'

interface BRCompChartProps {
    data?: Array<any>
    currency?: string
    title?: string
    xTitle?: string
    yTitle?: string
}

export function BRCompChart(props: BRCompChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div className="mt-4 mb-4">
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
                {type: 'scatter', mode: 'lines+markers', x: props.data[0].values.x, y: props.data[0].values.y, name: props.data[0].name}, 
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', mode: 'lines+markers', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false, scrollZoom: true}} />
        </div>
    )
}