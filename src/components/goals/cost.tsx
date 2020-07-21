import React, { useEffect, useState, Fragment } from 'react'
import Section from '../form/section'
import NumberInput from '../form/numberinput'
import HToggle from '../horizontaltoggle'
import { TargetInput } from '../../api/goals'
import { createNewTarget } from './goalutils'
import NextStep from '../form/nextstep'
interface CostProps {
    inputOrder: number
    currentOrder: number
    nextStepDisabled: boolean
    nextStepHandler: Function
    allInputDone: boolean
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
    manualTargets?: Array<TargetInput>
    currency: string
    rangeFactor: number
    startYear?: number
    endYear?: number
    manualTgtMin?: number
    manualModeHandler?: Function
    manualTargetsHandler?: Function
    startingCostHandler: Function
    costChgRateHandler: Function
    showRightCondition: boolean
}

export default function Cost(props: CostProps) {
    const [manualInputPresent, setManualInputPresent] = useState<boolean>(false)

    const changeTargetVal = (val: number, i: number) => {
        if (!props.manualTargets || !props.manualTargetsHandler) return
        props.manualTargets[i].val = val
        props.manualTargetsHandler([...props.manualTargets])
    }

    const initManualTargets = () => {
        if (!props.manualTargets || !props.manualTargetsHandler
            || !props.startYear || !props.endYear) return
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

    const hasManualInput = () => {
        if (props.manualMode > 0 && props.manualTargets)
            for (let i = 0; i < props.manualTargets?.length; i++) {
                if (props.manualTargets[i].val > 0) return true
            }
        return false
    }

    useEffect(() => setManualInputPresent(hasManualInput()), [props.manualMode, props.manualTargets])

    return (
        <Fragment>
            {((!props.allInputDone && props.inputOrder <= props.currentOrder) || props.allInputDone) &&
                <Section title={props.title}
                    left={
                        <NumberInput name="startingCost" inputOrder={props.inputOrder}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={props.startingCost === 0}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone}
                            pre={props.leftPre} post={props.leftPost}
                            currency={props.currency} rangeFactor={props.rangeFactor} value={props.startingCost} changeHandler={props.startingCostHandler}
                            min={props.leftMin} max={props.leftMax} step={500} note={props.leftNote} />
                    } right={
                        props.showRightCondition ? <NumberInput name="priceChgRate"
                            inputOrder={props.inputOrder + 1}
                            currentOrder={props.currentOrder}
                            nextStepDisabled={false}
                            nextStepHandler={props.nextStepHandler}
                            allInputDone={props.allInputDone} pre={props.rightPre} post="Changes" note={props.rightNote} unit="%"
                            min={-10} max={10} step={0.5} value={props.costChgRate} changeHandler={props.costChgRateHandler} />
                            : props.nextStepHandler()
                    } showOnLoad
                    toggle={
                        props.manualModeHandler && <HToggle rightText={`Manual Input for Multiple Years`} value={props.manualMode} setter={props.manualModeHandler} />
                    } manualInput={
                        props.manualTargets && <Fragment>
                            <div className="flex flex-wrap justify-around">
                                {props.manualTargets.map((t, i) =>
                                    <div key={"t" + i} className="mr-4 md:mr-8 mt-8 flex flex-col justify-end items-end">
                                        <label>{t.year}</label>
                                        <NumberInput name="year"
                                            inputOrder={props.inputOrder}
                                            currentOrder={props.currentOrder}
                                            nextStepDisabled={false}
                                            nextStepHandler={props.nextStepHandler}
                                            allInputDone={true}
                                            pre="" currency={props.currency} rangeFactor={props.rangeFactor}
                                            value={t.val} changeHandler={(val: number) => changeTargetVal(val, i)}
                                            min={props.manualTgtMin ? props.manualTgtMin : 0} max={900000} step={500} />
                                    </div>)}
                            </div>
                            {!props.allInputDone && props.manualMode > 0 && 
                                props.currentOrder - props.inputOrder <= 1 &&
                                <NextStep nextStepHandler={props.nextStepHandler}
                                    disabled={!manualInputPresent} 
                                    actionCount={props.currentOrder > props.inputOrder ? 1 : 2} />}
                        </Fragment>
                    } manualMode={props.manualMode} footer={props.footer} insideForm />}
        </Fragment>
    )
}