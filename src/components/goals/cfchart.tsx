import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { getCommonConfig, getCommonLayoutProps, getCommonStyle } from '../chartutils'
import {useFullScreenBrowser} from "react-browser-hooks"

interface CFChartProps {
    mustCFs: Array<number>
    tryCFs: Array<number>
    optCFs: Array<number>
    from: number
    to: number
    fullScreen: boolean
}

const Plot = dynamic(
    () => import('react-plotly.js'), { ssr: false }
)

export default function CFChart({ mustCFs, tryCFs, optCFs, from, to, fullScreen }: CFChartProps) {
    const [years, setYears] = useState<Array<number>>([])
    const fsb = useFullScreenBrowser()

    useEffect(() => {
        for(let year = from; year <= to; year++)
            years.push(year)
        setYears([...years])
    }, [from, to])

    useEffect(() => {
        if (fsb.info.screenWidth > 800)
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 300);
      }, [fullScreen]);
    
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
                ...getCommonLayoutProps(),
                xaxis: { title: 'Year', showgrid: false, type: 'category' },
                legend: {
                    orientation: 'h',
                    x: 0.5,
                    y: 1.5
                },
            }}
                useResizeHandler
                style={getCommonStyle()}
                data={[
                    createBarTrace(mustCFs, 'Must Meet'),
                    createBarTrace(tryCFs, 'Try Best'),
                    createBarTrace(optCFs, 'Optional'),
                ]}
                config={getCommonConfig()}
            />
        </div>
    )
}