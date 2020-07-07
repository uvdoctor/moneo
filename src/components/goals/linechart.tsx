import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'

interface LineChartProps {
    cfs: Array<number>
    startYear: number
    currency?: string
}

export default function LineChart(props: LineChartProps) {
    const [years, setYears] = useState<Array<number>>([])
    const layout = {
        font: { family: "'Quicksand', sans-serif", color: "#4a5568", size: 15 },
        autosize: true,
        xaxis: { title: 'Year', type: 'category', fixedrange: years.length > 3 ? false : true, rangeslider: years.length > 3 ? {} : '', showgrid: false },
        yaxis: { fixedrange: true, tickformat: ',', type: props.cfs.length > 3 ? '' : 'category', showgrid: false },
        title: `Yearly Cash Flows in ${props.currency}`,
        legend: { orientation: "h" }
    }
    const track = //@ts-ignore: Object is possible undefined
    {
        type: 'scatter', mode: 'lines+markers', x: years, y: props.cfs,
        line: { color: '#48bb78', size: 3 },
        marker: { color: '#276749', size: 8, symbol: 'circle-x' }
    }

    useEffect(() => {
        let years = []
        for (let i = 0; i < props.cfs.length; i++) years.push(props.startYear + i)
        setYears([...years])
    }, [props.cfs, props.startYear])

    const Plot = dynamic(
        () => import('react-plotly.js'), { ssr: false }
    )

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={layout} useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                data={[track]}
                config={{ responsive: true, editable: false, displayModeBar: false }} />
        </div>
    )
}