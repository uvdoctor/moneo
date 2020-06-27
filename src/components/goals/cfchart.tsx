import React from 'react'
import dynamic from 'next/dynamic'

interface CFChartProps {
    currency?: string
    xTitle?: string
    title: string
    mustCFs?: any
    tryCFs?: any
    optCFs?: any
    fromYear: number
    toYear: number
}

export default function CFChart(props: CFChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), { ssr: false }
    )

    const fromFilter = {
        type: 'filter',
        target: 'y',
        operation: '>=',
        value: props.fromYear
    }

    const toFilter = {
        type: 'filter',
        target: 'y',
        operation: '<=',
        value: props.toYear
    }

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                title: props.title,
                yaxis: { type: 'category', fixedrange: true, showgrid: false, autorange: 'reversed' },
                xaxis: { showgrid: false }
            }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                data={[
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', orientation: 'h', x: props.mustCFs.x, y: props.mustCFs.y, name: "Must", 
                    transforms: [fromFilter, toFilter]
                    },
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', orientation: 'h', x: props.tryCFs.x, y: props.tryCFs.y, name: "Try",
                    transforms: [fromFilter, toFilter] 
                    },
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', orientation: 'h', x: props.optCFs.x, y: props.optCFs.y, name: "Optional",
                    transforms: [fromFilter, toFilter] 
                    }
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}