import React, { useEffect, useState } from 'react';
import Button from '../Button';
import SVGClose from '../svgclose';
import SVGSave from '../svgsave';

interface ActionButtonsProps {
	submitDisabled: boolean;
	cancelDisabled: boolean;
	submitText: string;
	cancelHandler: Function;
	submitHandler: Function;
}

export default function ActionButtons(props: ActionButtonsProps) {
	const [ actionInProgress, setActionInProgress ] = useState<boolean>(false);

	useEffect(
		() => {
			if (!props.submitDisabled) setActionInProgress(false);
		},
		[ props.submitDisabled ]
	);

	return (
		<footer className="w-full py-2 flex justify-center">
			<Button disabled={props.cancelDisabled} onClick={props.cancelHandler}>
				<SVGClose disable={props.cancelDisabled} />
				Cancel
			</Button>
			<Button
				className={`ml-8 ${props.submitDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
				onClick={() => {
					setActionInProgress(true);
					props.submitHandler();
				}}
				isPrimary
				disabled={props.submitDisabled}
				isLoading={props.submitDisabled && actionInProgress}
			>
				<SVGSave disable={props.submitDisabled} />
				{props.submitText}
			</Button>
		</footer>
	);
}
