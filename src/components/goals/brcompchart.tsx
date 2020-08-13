import React from 'react'
import dynamic from 'next/dynamic'
import {getCommonConfig, getCommonLayoutProps, getCommonStyle} from '../chartutils'
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
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                ...getCommonLayoutProps(props.title),
                width: customWidth < 800 ? 800 : customWidth,
                xaxis: {type:'category', showgrid: false, range: [1, props.data[0].values.x.length]},
	            legend: {
                    orientation: 'h',
                    x:0,
                    y:1.08
                }
            }} 
            style={getCommonStyle()}
            useResizeHandler={true}
            data={[
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tozeroy', mode: 'none', x: props.data[0].values.x, y: props.data[0].values.y, 
                name: props.data[0].name}, 
                //@ts-ignore: Object is possible undefined
                {type: 'scatter', fill: 'tonexty', mode:'none', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={getCommonConfig()} 
             />
        </div>
    )
}