import React from 'react'
import dynamic from 'next/dynamic'
import {LMH} from '../../api/goals'
interface CFChartProps {
    mustCFs: any
    tryCFs: any
    optCFs: any
    fromYear: number
    toYear: number
    impFilter: string
}

export default function CFChart({ mustCFs, tryCFs, optCFs, fromYear, toYear, impFilter }: CFChartProps) {
    const Plot = dynamic(
        () => import('react-plotly.js'), { ssr: false }
    )

    const fromFilter = {
        type: 'filter',
        target: 'x',
        operation: '>=',
        value: fromYear
    }

    const toFilter = {
        type: 'filter',
        target: 'x',
        operation: '<=',
        value: toYear
    }

    const createBarTrace = (cfs: any, name: string) => {
        return {
            type: 'bar', x: cfs.x, y: cfs.y, name: name,
            transforms: [fromFilter, toFilter]
        }
    }

    const modifyColor = (trace: any, val: string) => trace.marker = {color: val}

    const createFilteredTraces = () => {
        let mustTrace = createBarTrace(mustCFs, "Must Meet")
        let tryTrace = createBarTrace(tryCFs, "Try Best")
        let optTrace = createBarTrace(optCFs, "Optional")
        if(!impFilter) return [mustTrace, tryTrace, optTrace]
        modifyColor(mustTrace, '#48bb78')
        modifyColor(tryTrace, '#48bb78')
        modifyColor(optTrace, '#48bb78')
        if(impFilter === LMH.L as string) return [optTrace]
        else if(impFilter === LMH.M as string) return [tryTrace]
        else return [mustTrace]
    }

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true,
                yaxis: { fixedrange: true, showgrid: false },
                xaxis: { showgrid: false, type: 'category', fixedrange: true },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    y: 1.5
                },
            }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%" }}
                data={createFilteredTraces()}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}