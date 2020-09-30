import React from 'react'
import CalcLayout from '../components/calc/calclayout'
import ResultItem from '../components/calc/resultitem'
import SVGBalance from '../components/calc/svgbalance'
import SVGHourGlass from '../components/svghourglass'
import SVGScale from '../components/svgscale'

export default function TrueCost() {
    return (
        <CalcLayout
        type="tc"
        title="True Cost"
        titleSVG={<SVGScale selected />}
        assumptions={["adfas", "asdfsad"]}
        features={["fsdgdf", "fgdssdf"]}
        results={[
          <ResultItem
            result="Option that costs lesser"
            svg={<SVGBalance />}
          />,
          <ResultItem
            result="Time till which the Option costs lesser"
            svg={<SVGHourGlass />}
          />,
        ]}
        resultImg="step1.png"
      />
    )
}