import React from 'react'
import dynamic from 'next/dynamic'

interface BRCompChartProps {
    data: Array<any>
    currency?: string
    xTitle?: string
    sellAfter: number
    rentAns: string
    title: string
}

const Plot = dynamic(
    () => import('react-plotly.js'), {ssr: false}
);

export function BRCompChart(props: BRCompChartProps) {
    const customWidth = props.data[0].values.x.length * 60

    return (
        <div className="w-full overflow-x-auto overflow-hidden relative">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true, 
                width: customWidth,
                aspectratio: 0,
                title: {x:0.07, text:props.title, font:{size: 20}}, 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true, showgrid: false, range: [1, props.data[0].values.x.length]},
                yaxis: {fixedrange: true, tickformat: ',', showgrid: false},
	            legend: {
                    orientation: 'h',
                    x:0.7,
                    y:-0.1
                }, margin:{t:50}
            }} 
            useResizeHandler={false}
            style={{width: "100%", height:"100%", minHeight: "450px", overflow: "auto"}}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tozeroy', mode: 'none', x: props.data[0].values.x, y: props.data[0].values.y, 
                name: props.data[0].name}, 
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tonexty', mode:'none', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false}} 
             />
        </div>
    )
}