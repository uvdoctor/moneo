import React, { useEffect } from 'react'
import Section from '../form/section'
import NumberInput from '../form/numberinput'
import HToggle from '../horizontaltoggle'
import { TargetInput } from '../../api/goals'
import { createNewTarget } from './goalutils'

interface CostProps {
    inputText: string
    title: string
    leftPre: string
    leftPost: string
    leftNote?: string
    footer?: string
    rightPre: string
    rightNote: string
    leftMin: number
    leftMax: number
    startingCost: number
    costChgRate: number
    manualMode: number
    manualTargets: Array<TargetInput>
    currency: string
    rangeFactor: number
    startYear: number
    endYear: number
    manualTgtMin?: number
    manualModeHandler: Function
    manualTargetsHandler: Function
    startingCostHandler: Function
    costChgRateHandler: Function
    showInputCondition: boolean
    showRightCondition: boolean
}

export default function Cost(props: CostProps) {
    const changeTargetVal = (val: number, i: number) => {
        props.manualTargets[i].val = val
        props.manualTargetsHandler([...props.manualTargets])
    }

    const initManualTargets = () => {
        let targets: Array<TargetInput> = []
        for (let year = props.startYear; year <= props.endYear; year++) {
            let existingT = null
            if (props.manualTargets.length > 0) {
                existingT = (props.manualTargets.filter((target) => target.year === year))[0] as TargetInput
            }
            let t = createNewTarget(year, existingT ? existingT.val : 0)
            targets.push(t)
        }
        props.manualTargetsHandler([...targets])
    }

    useEffect(() => {
        if (props.manualMode > 0) initManualTargets()
    }, [props.manualMode, props.startYear, props.endYear])

    return (
        <Section inputText={props.inputText} showInputCondition={props.showInputCondition} title={props.title}
            left={
                <NumberInput name="startingCost" pre={props.leftPre} post={props.leftPost}
                    currency={props.currency} rangeFactor={props.rangeFactor} value={props.startingCost} changeHandler={props.startingCostHandler}
                    min={props.leftMin} max={props.leftMax} step={500} note={props.leftNote} />
            } right={
                props.showRightCondition && <NumberInput name="priceChgRate" pre={props.rightPre} post="Changes" note={props.rightNote} unit="%"
                    min={-10} max={10} step={0.5} value={props.costChgRate} changeHandler={props.costChgRateHandler} />
            } showOnLoad={true}
            toggle={
                <HToggle rightText={`Manual Input for Years ${props.startYear} to ${props.endYear}`} value={props.manualMode} setter={props.manualModeHandler} />
            } manualInput={
                <div className="flex flex-wrap justify-around">
                    {props.manualTargets && props.manualTargets.map((t, i) =>
                        <div key={"t" + i} className="mr-4 md:mr-8 mt-8 flex flex-col justify-end items-end">
                            <label>{t.year}</label>
                            <NumberInput name="year" pre="" currency={props.currency} rangeFactor={props.rangeFactor}
                                value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                min={props.manualTgtMin ? props.manualTgtMin : 0} max={900000} step={500} />
                        </div>)}
                </div>
            } manualMode={props.manualMode} footer={props.footer} />
    )
}