import React from 'react'
import dynamic from 'next/dynamic'
import { convertPerToDec } from '../utils'
interface AAChartProps {
    aa: any
    rr: Array<number>
    years: Array<number>
}

const Plot = dynamic(
    () => import('react-plotly.js'), { ssr: false }
)

export default function AAChart(props: AAChartProps) {
    
    const createScatterTrace = (cfs: any, name: string, color: string, mode: string = 'line') => {
        return {
            type: 'scatter', x: props.years, y: convertPerToDec(cfs), name: name,
            mode: mode, marker:{color: color}, line: {shape: 'spline'}
        }
    }

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true, margin:{t:0},
                yaxis: { fixedrange: true, tickformat: '%', showgrid: false },
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
                    createScatterTrace(props.aa.cash, 'Cash', '#38a169'),
                    createScatterTrace(props.aa.bonds, 'Bonds', '#3182ce'),
                    createScatterTrace(props.aa.stocks, 'Stocks', '#dd6b20'),
                    createScatterTrace(props.aa.reit, 'REIT', '#434190'),
                    createScatterTrace(props.aa.gold, 'Gold', 'gold'),
                    createScatterTrace(props.rr, 'Potential Return', 'brown', 'lines+markers')
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}