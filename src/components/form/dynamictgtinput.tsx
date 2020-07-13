import React, { useState, useEffect } from 'react'
import { TargetInput } from '../../api/goals'
import NumberInput from './numberinput'
import SelectInput from './selectinput'
import SVGAdd from '../svgadd'
import SVGRemove from '../svgremove'
import { initYearOptions } from '../utils'

interface DynamicTgtInputProps {
    tgts: Array<TargetInput>
    currency: string
    rangeFactor: number
    startYear: number
    endYear: number
    tgtsHandler: Function
}

export default function DynamicTgtInput(props: DynamicTgtInputProps) {
    const [yearOpts, setYearOpts] = useState(initYearOptions(
        props.startYear, props.endYear - props.startYear))

    const getDefaultYear = () => {
        if (!props.tgts || props.tgts.length === 0) return props.startYear
        return props.tgts[props.tgts.length - 1].year + 1
    }

    const newRec = () =>
        Object.create(
            {
                year: getDefaultYear(),
                val: 0
            } as TargetInput
        )

    const filterTgts = () => {
        let ft = props.tgts.filter((t) => t.year >= props.startYear && t.year <= props.endYear)
        if (ft.length === 0) ft.push(newRec())
        props.tgtsHandler([...ft])
    }

    useEffect(() => {
        filterTgts()
        setYearOpts(initYearOptions(props.startYear,
            props.endYear - props.startYear))
    }, [props.startYear, props.endYear])

    const addTgt = () => props.tgtsHandler([...props.tgts, newRec()])

    const removeTgt = (index: number) => {
        props.tgts.splice(index, 1)
        if(props.tgts.length === 0) props.tgts.push(newRec())
        props.tgtsHandler([...props.tgts])
    }

    const changeTargetYear = (index: number, year: string) => {
        props.tgts[index].year = parseInt(year)
        props.tgtsHandler([...props.tgts])
    }

    const changeTargetVal = (index: number, val: number) => {
        props.tgts[index].val = val
        props.tgtsHandler([...props.tgts])
    }

    return (
        <div className="w-full">
            {props.tgts && props.tgts.map((t, i) =>
                <div className="flex items-center justify-around w-full">
                    <div className="flex justify-center w-5/6 md:w-11/12">
                        <SelectInput name={"year" + i} pre="Year" options={yearOpts} value={t.year} changeHandler={(year: string) => changeTargetYear(i, year)} />
                        <div className="ml-4 md:ml-8">
                        <NumberInput name={"val" + i} pre="Amount" currency={props.currency} rangeFactor={props.rangeFactor}
                            value={t.val} changeHandler={(val: number) => changeTargetVal(i, val)}
                            min={0} max={900000} step={500} width="120px" />
                        </div>
                    </div>
                    <div className="flex justify-end w-1/6 md:w-1/12">
                        <div onClick={() => removeTgt(i)}>
                            <SVGRemove />
                        </div>
                        {i === props.tgts.length - 1 && <div onClick={() => addTgt()}>
                            <SVGAdd />
                        </div>}
                    </div>
                </div>
            )}

        </div>
    )
}