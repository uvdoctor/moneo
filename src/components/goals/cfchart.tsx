import React from 'react'
import dynamic from 'next/dynamic'

interface CFChartProps {
    currency?: string
    xTitle?: string
    title: string
    mustCFs: any
    tryCFs: any
    optCFs: any
}

export default function CFChart(props: CFChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), { ssr: false }
    )

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                title: props.title
            }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                data={[
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', x: props.mustCFs.x, y: props.mustCFs.y, name: "Must" },
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', x: props.tryCFs.x, y: props.tryCFs.y, name: "Try" },
                    //@ts-ignore: Object is possible undefined
                    { type: 'bar', x: props.optCFs.x, y: props.optCFs.y, name: "Optional" }
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}