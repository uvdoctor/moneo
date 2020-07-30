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
    const createScatterTrace = (cfs: any, name: string, color: string) => {
        return {
            type: 'scatter', x: props.years, y: convertPerToDec(cfs), name: name,
            marker: {
                color: color
            }
        }
    }

    return (
        <div className="w-full">
            {/*@ts-ignore*/}
            <Plot layout={{
                barmode: 'stack',
                font:{family: "'Quicksand', sans-serif", color: "#4a5568", size: 15}, 
                autosize: true,
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
                    createScatterTrace(props.aa.cash, 'Cash', 'green'),
                    createScatterTrace(props.aa.deposits, 'Deposits', 'pink'),
                    createScatterTrace(props.aa.bonds, 'Bonds', 'brown'),
                    createScatterTrace(props.aa.stocks, 'Equity', 'red'),
                    createScatterTrace(props.aa.property, 'Property', 'purple'),
                    createScatterTrace(props.aa.gold, 'Gold', 'gold'),
                    createScatterTrace(props.rr, 'Yearly Potential Return', 'blue')
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}