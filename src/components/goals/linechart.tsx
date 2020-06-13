import React, { useState } from 'react'
import { CreateGoalInput, TargetInput } from '../../api/goals'
import dynamic from 'next/dynamic'

interface LineChartProps {
    goals?: Array<CreateGoalInput>
    tgts?: Array<TargetInput>
    data?: Array<any>
    currency?: string
    title?: string
}

export function LineChart(props: LineChartProps) {
    const [minY, setMinY] = useState(0)
    const Plot = dynamic(
        () => import('react-plotly.js'), {ssr: false}
    )

    const buildDataFromGoals = (goals: Array<CreateGoalInput>) => {
        let resultItems: Array<any> = []
        for (let i = 0; i < goals.length; i++) {
            let id = goals[i].name
            let dataItems = []
            for (let j = 0; j < goals[i].tgts.length; j++) {
                let tgt = goals[i].tgts[j]
                let x = tgt.year
                let y = tgt.val
                dataItems.push({ x: x, y: y })
            }
            resultItems.push({
                id: id,
                data: dataItems
            })
        }
        return resultItems
    }

    const buildDataFromTargets = (tgts: Array<TargetInput>) => {
        let resultItems: Array<any> = []
        console.log("Going to build data for targets: ", tgts)
        for (let i = 0; i < tgts.length; i++) {
            let x = tgts[i].year
            let y = tgts[i].val
            if (y < minY) setMinY(y)
            resultItems.push({ x: x, y: y })
        }
        console.log(resultItems)
        return resultItems
    }

    //const dataItems: Array<any> = buildDataFromTargets(props.tgts as Array<TargetInput>)
    const [tgtIndex, setTgtIndex] = useState(0)
    const commonProperties = {
        margin: { top: 60, right: 20, bottom: 60, left: 80 },
        animate: true,
    }

    //const [points, setPoints] = useState([dataItems[tgtIndex]])
//@ts-ignore: Binding element 'size' implicitly has an 'any' type.ts(7031)
    const CustomSymbol = ({ size, color, borderWidth, borderColor }) => (
        <g>
            <circle fill="#fff" r={size / 2} strokeWidth={borderWidth} stroke={borderColor} />
            <circle
                r={size / 5}
                strokeWidth={borderWidth}
                stroke={borderColor}
                fill={color}
                fillOpacity={0.35}
            />
        </g>
    )

    /*useEffect(() => {

        if (points.length === dataItems.length) return

        setTimeout(() => {
            setPoints(p => {
                let arr = [
                    ...p,
                    {
                        x: dataItems[tgtIndex],
                        y: dataItems[tgtIndex]
                    },
                ]
                setTgtIndex(tgtIndex + 1)
                console.log("Tgt index: ", tgtIndex)
                return arr
            })
        }, 3000)
    }, [points, setPoints])*/

    return (
        <div className="mt-4 mb-4">
            <Plot layout={{title: props.title}}
            data={[
                {type: 'scatter', mode: 'lines+markers', x: props.data[0].values.x, y: props.data[0].values.y, name: props.data[0].name}, 
                {type: 'scatter', mode: 'lines+markers', x: props.data[1].values.x, y: props.data[1].values.y, name: props.data[1].name} 
            ]} 
            config={{responsive: true, editable: false, displayModeBar: false, scrollZoom: true}} />
            {/**<Line
                {...commonProperties}
                yScale={{ type: 'linear', stacked: false, min: -2000000, max: 2000000 }}
                curve="linear"
                width={900}
                height={500}
                enableSlices="x"
                data={props.xirrs}
                xScale={{
                    type: 'linear',
                    min: 1,
                    max: 30,
                }}
            />

            <Line
            {...commonProperties}
            yScale={{
                type: 'linear',
                stacked: true,
            }}
            curve='linear'
        />

            <Line
                {...commonProperties}
                yScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                }}
                xScale={{
                    type: 'linear',
                    min: 0,
                    max: 'auto',
                }}
                data={[{ id: 'goal', data: points }]}
                axisBottom={{
                    tickValues: [10],
                }}
                axisLeft={{
                    tickValues: [10],
                }}
                isInteractive={false}
                animate={false}
                enableArea={true}
            />*/}
        </div>
    )
}