import React from 'react'
import dynamic from 'next/dynamic'

interface BRCompChartProps {
    data?: Array<any>
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

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true, 
                title: {text:props.title, font:{size: 20}}, 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true, showgrid: false, range: [1, 20]},
                yaxis: {fixedrange: true, tickformat: ',', showgrid: false},
	            legend: {
                    orientation: 'h',
                    x:0.5,
                    y:1.5
                }, margin:{t:10},
                annotations:[
                    {
                        text: props.rentAns,
                        //@ts-ignore
                        x: props.data[1].values.x[props.sellAfter - 1],
                        //@ts-ignore
                        y: props.data[1].values.y[props.sellAfter - 1],
                        showarrow: true,
                        yref: 'y', xref: 'x',
                        ax: -40, ay: -40,
                        font: {size: 14}
                    }
                ]
            }} 
            useResizeHandler={true}
            style={{width: "100%", height:"100%"}}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tozeroy', mode: 'none', x: props.data[0].values.x, y: props.data[0].values.y, name: props.data[0].name}, 
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tonexty', mode:'none', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false}} 
             />
        </div>
    )
}