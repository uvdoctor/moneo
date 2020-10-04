import React from 'react';
import Button from '../Button';
import ItemDisplay from '../calc/ItemDisplay';
import SVGNext from '../svgnext';
interface NextStepProps {
	nextStepHandler: Function;
	disabled: boolean;
	actionCount?: number;
}

export default function NextStep({ nextStepHandler, disabled, actionCount }: NextStepProps) {
	return (
		<div className="w-full flex justify-center mt-2 relative">
			<Button
				className="absolute z-10"
				onClick={() => nextStepHandler(actionCount ? actionCount : 1)}
				disabled={disabled}
			>
				<ItemDisplay svg={<SVGNext />} result="Next" />
			</Button>
		</div>
	);
}
