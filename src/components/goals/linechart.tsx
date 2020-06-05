import React, { useState, useEffect } from 'react'
import { Line } from 'nivo'
import { CreateGoalInput, TargetInput } from '../../api/goals'
import { toCurrency } from '../utils'
import AutoSizer from 'react-virtualized-auto-sizer'

interface LineChartProps {
    goals?: Array<CreateGoalInput>
    tgts?: Array<TargetInput>
    currency: string
}

export function LineChart(props: LineChartProps) {
    const [minY, setMinY] = useState(0)

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

    const dataItems: Array<any> = buildDataFromTargets(props.tgts as Array<TargetInput>)
    const [tgtIndex, setTgtIndex] = useState(0)
    const commonProperties = {
        margin: { top: 60, right: 20, bottom: 60, left: 80 },
        animate: true,
    }

    const [points, setPoints] = useState([dataItems[tgtIndex]])

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
        <div>
            <AutoSizer disableHeight>
                {({ width }) => (
                    <div style={{ width: width + 'px' }}>
                        <Line
                            {...commonProperties}
                            yScale={{ type: 'linear', min: -100000, max: 'auto', stacked: false }}
                            curve="monotoneY"
                            width={width}
                            height={500}
                            data={[
                                { id: 'tgts', data: buildDataFromTargets(props.tgts as Array<TargetInput>) },
                                { id: 'rent', data:buildDataFromTargets(props.tgts as Array<TargetInput>)}
                            ]}
                            xScale={{
                                type: 'linear',
                                min: 'auto',
                                max: 'auto',
                            }}
                            axisLeft={{
                                legend: 'Total Cost',
                                legendOffset: -50,
                                legendPosition: 'middle',
                                //@ts-ignore: Parameter 'val' implicitly has an 'any' type
                                format: val => toCurrency(val, props.currency)
                            }}
                            axisBottom={{
                                legend: 'Year',
                                legendOffset: 40,
                                legendPosition: 'middle',
                            }}
                            enablePointLabel={true}
                            pointLabel='y'
                            tooltipFormat={
                                val => toCurrency(val, props.currency)
                            }
                            enableArea={true}
                            areaOpacity={0.07}
                            enableSlices={false}
                            useMesh={true}
                            crosshairType="cross"
                            pointSymbol={CustomSymbol}
                            pointSize={14}
                            pointBorderWidth={1}
                            pointBorderColor={{
                                from: 'color',
                                modifiers: [['darker', 0.3]],
                            }}
                            pointLabelYOffset={-20}
                            enableGridX={false}
                            colors={['rgb(97, 205, 187)', 'rgb(244, 117, 96)']}
                        /></div>)}
            </AutoSizer>
            {/*<Line
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