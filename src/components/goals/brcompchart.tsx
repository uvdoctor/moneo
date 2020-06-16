import React from 'react'
import dynamic from 'next/dynamic'

interface BRCompChartProps {
    data?: Array<any>
    currency?: string
    xTitle?: string
}

export function BRCompChart(props: BRCompChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size:20}, 
                autosize: true, 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true},
                yaxis: {fixedrange: true},
                showlegend: true,
	            legend: {
                    x:1,
                    y:1,
                    xanchor: 'right'
                }
            }} 
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
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