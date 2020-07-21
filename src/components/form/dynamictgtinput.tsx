import React, { useState, useEffect } from 'react'
import { TargetInput } from '../../api/goals'
import NumberInput from './numberinput'
import SelectInput from './selectinput'
import SVGAdd from '../svgadd'
import SVGRemove from '../svgremove'
import { initYearOptions } from '../utils'
import { createNewTarget } from '../goals/goalutils'
import NextStep from './nextstep'
interface DynamicTgtInputProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
    actionCount?: number
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

    const newRec = () => createNewTarget(getDefaultYear(), 0)

    const filterTgts = () => {
        let ft = props.tgts.filter((t) => t.year >= props.startYear && t.year <= props.endYear)
        props.tgtsHandler([...ft])
    }

    useEffect(() => {
        filterTgts()
        setYearOpts(initYearOptions(props.startYear,
            props.endYear - props.startYear))
    }, [props.startYear, props.endYear])

    const addTgt = () => {
        props.tgts.push(newRec())
        props.tgtsHandler([...props.tgts])
    }

    const removeTgt = (index: number) => {
        props.tgts.splice(index, 1)
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
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <div className={`${!props.allInputDone && props.inputOrder === props.currentOrder ? 'p-2 border-2 border-orange-600' : ''}`}>
                    {props.tgts && props.tgts[0] ? props.tgts.map((t, i) =>
                        <div key={"ctr" + i} className="mt-2 flex items-center justify-start w-full">
                            <div className="flex justify-center mr-4">
                                <SelectInput name={"year" + i}
                                    inputOrder={0} currentOrder={1}
                                    nextStepDisabled
                                    allInputDone nextStepHandler={() => true}
                                    pre="Year" options={yearOpts} value={t.year}
                                    changeHandler={(year: string) => changeTargetYear(i, year)} />
                                <div className="ml-4 md:ml-8">
                                    <NumberInput name={"val" + i} inputOrder={0} currentOrder={1}
                                        nextStepDisabled
                                        allInputDone nextStepHandler={() => true}
                                        pre="Amount" currency={props.currency} rangeFactor={props.rangeFactor}
                                        value={t.val} changeHandler={(val: number) => changeTargetVal(i, val)}
                                        min={0} max={900000} step={500} width="120px" />
                                </div>
                            </div>
                            <div onClick={() => removeTgt(i)}>
                                <SVGRemove />
                            </div>
                            {i === props.tgts.length - 1 && <div className="ml-2" onClick={() => addTgt()}>
                                <SVGAdd />
                            </div>}
                        </div>
                    ) : <div className="flex justify-center" onClick={() => addTgt()}>
                            <SVGAdd />
                        </div>
                    }
                </div>}
            {!props.allInputDone && props.inputOrder === props.currentOrder && <NextStep
                nextStepHandler={() => props.nextStepHandler(props.actionCount ? props.actionCount : 1)}
                disabled={props.nextStepDisabled} />}
        </div>
    )
}