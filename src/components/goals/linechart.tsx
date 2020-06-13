import React from 'react'
import dynamic from 'next/dynamic'

interface LineChartProps {
    data?: Array<any>
    currency?: string
    title?: string
}

export function LineChart(props: LineChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div className="mt-4 mb-4">
            {/*@ts-ignore*/}
            <Plot layout={{title: props.title}}
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