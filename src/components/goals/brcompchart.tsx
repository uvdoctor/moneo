import React from 'react'
import dynamic from 'next/dynamic'

interface BRCompChartProps {
    data: Array<any>
    currency?: string
    sellAfter: number
    rentAns: string
    title: string
}

const Plot = dynamic(
    () => import('react-plotly.js'), {ssr: false}
);

export function BRCompChart(props: BRCompChartProps) {
    const customWidth = props.data[0].values.x.length * 30

    return (
        <div className="w-full overflow-x-scroll scrolling-touch hide-scrollbar">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                width: customWidth,
                aspectratio: 0,
                title: {x:0.05, text:props.title, font:{size: 20}}, 
                xaxis: {type:'category', fixedrange: true, showgrid: false, range: [1, props.data[0].values.x.length]},
                yaxis: {fixedrange: true, tickformat: ',', showgrid: false},
	            legend: {
                    orientation: 'h',
                    x:0,
                    y:1.08
                }, margin:{t:40, r:10}
            }} 
            style={{width: "100%", height:"100%", minHeight: "400px"}}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tozeroy', mode: 'none', x: props.data[0].values.x, y: props.data[0].values.y, 
                name: props.data[0].name}, 
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tonexty', mode:'none', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={{displayModeBar: false, scrollZoom: true}} 
             />
        </div>
    )
}