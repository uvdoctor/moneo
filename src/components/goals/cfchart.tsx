import React from 'react'
import dynamic from 'next/dynamic'
interface CFChartProps {
    mustCFs: any
    tryCFs: any
    optCFs: any
}

export default function CFChart({ mustCFs, tryCFs, optCFs }: CFChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), { ssr: false }
    )

    const createBarTrace = (cfs: any, name: string) => {
        return {
            type: 'bar', x: cfs.x, y: cfs.y, name: name
        }
    }

    return (
        <div className="w-full h-100">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true,
                yaxis: { fixedrange: true, showgrid: false },
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