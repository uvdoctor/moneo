import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getCommonConfig, getCommonLayoutProps, getCommonStyle } from '../chartutils';

interface LineChartProps {
    cfs: Array<number>
    startYear: number
}


const Plot = dynamic(
    () => import('react-plotly.js'), { ssr: false }
);

export default function LineChart(props: LineChartProps) {
    const [years, setYears] = useState<Array<number>>([])
    const layout = {
        ...getCommonLayoutProps(),
        xaxis: { title: 'Year', type: 'category', showgrid: false },
    }
    const track = 
    {
        type: 'scatter', mode: 'lines+markers', x: years, y: props.cfs,
        line: { color: '#68d391', size: 3 },
        marker: { color: '#276749', symbol: 'circle-x' }
    }

    useEffect(() => {
        let years = []
        for (let i = 0; i < props.cfs.length; i++) years.push(props.startYear + i)
        setYears([...years])
    }, [props.cfs, props.startYear])

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={layout} 
                style={getCommonStyle()}
                data={[track]}
                useResizeHandler={true}
                config={getCommonConfig()} />
        </div>
    )
}