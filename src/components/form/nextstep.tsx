import React from 'react';
import SVGNext from '../svgnext';
interface NextStepProps {
	nextStepHandler: Function;
	disabled: boolean;
	actionCount?: number;
}

export default function NextStep({ nextStepHandler, disabled, actionCount }: NextStepProps) {
	return (
		<div className="relative">
			<div
				className={`absolute z-10 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={() => !disabled && nextStepHandler(actionCount ? actionCount : 1)}
			>
				<SVGNext disabled={disabled} />
			</div>
		</div>
	);
}
