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

    const createBarTrace = (cfs: any, name: string, color: string, mode: string = 'line') => {
        return {
            type: 'bar', x: props.years, y: convertPerToDec(cfs), name: name,
            mode: mode, marker:{color: color}
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
                    y: -0.5
                },
            }}
                useResizeHandler={true}
                style={{ width: "100%", height: "100%", minHeight: "450px" }}
                data={[
                    createBarTrace(props.aa.savings, 'Savings Account', '#975a16'),
                    createBarTrace(props.aa.deposits, 'Deposits', '#38a169'),
                    createBarTrace(props.aa.bonds, 'Bonds ETF', '#3182ce'),
                    createBarTrace(props.aa.stocks, 'Stocks Index ETF', '#dd6b20'),
                    createBarTrace(props.aa.reit, 'REIT Fund', '#805ad5'),
                    createBarTrace(props.aa.gold, 'Gold ETF', 'gold'),
                    createScatterTrace(props.rr, 'Potential Return', 'red', 'lines+markers')
                ]}
                config={{ responsive: true, editable: false, displayModeBar: false }}
            />
        </div>
    )
}