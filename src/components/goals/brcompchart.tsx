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

export function BRCompChart(props: BRCompChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    return (
        <div className="w-full h-100">
            {/*@ts-ignore*/}
            <Plot layout={{
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true, 
                title: {text:props.title, font:{size: 20}}, 
                xaxis: {title: props.xTitle, type:'category', fixedrange: true, showgrid: false, range: [1, 20]},
                yaxis: {fixedrange: true, showgrid: false},
	            legend: {
                    orientation: 'h',
                    x:0.5,
                    y:1.5
                },
                annotations:[
                    {
                        text: props.rentAns,
                        //@ts-ignore
                        x: props.data[1].values.x[props.sellAfter - 1],
                        //@ts-ignore
                        y: props.data[1].values.y[props.sellAfter - 1],
                        showarrow: true,
                        yref: 'y', xref: 'x',
                        ax: -0, ay: -50,
                        font: {size: 15} // since there is no font.color attribute for this object,
                                         // it will use the annotationdefaults' color
                    }
                ]
            }} 
            useResizeHandler={true}
            style={{width: "100%", height: "100%"}}
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