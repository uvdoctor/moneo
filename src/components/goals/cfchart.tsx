import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
interface CFChartProps {
    mustCFs: Array<number>
    tryCFs: Array<number>
    optCFs: Array<number>
    from: number
    to: number
}

const Plot = dynamic(
    () => import('react-plotly.js'), { ssr: false }
)

export default function CFChart({ mustCFs, tryCFs, optCFs, from, to }: CFChartProps) {
    const [years, setYears] = useState<Array<number>>([])
    
    useEffect(() => {
        for(let year = from; year <= to; year++)
            years.push(year)
        setYears([...years])
    }, [from, to])

    const createBarTrace = (cfs: Array<number>, name: string) => {
        return {
            type: 'bar', x: years, y: cfs, name: name
        }
    }

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true,
                yaxis: { fixedrange: true, tickformat: ',', showgrid: false },
                xaxis: { showgrid: false, type: 'category', rangeslider: {} },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    y: 1.5
                },
            }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                data={[
                    createBarTrace(mustCFs, 'Must Meet'),
                    createBarTrace(tryCFs, 'Try Best'),
                    createBarTrace(optCFs, 'Optional'),
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}