import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
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
			<Button icon={<SVGClose />} onClick={() => props.cancelHandler()} disabled={props.cancelDisabled}>
				Cancel
			</Button>
			<Button type="primary"
				onClick={() => {
					setActionInProgress(true);
					props.submitHandler();
				}}
				icon={<SVGSave />}
				disabled={props.submitDisabled}
				loading={props.submitDisabled && actionInProgress}
			>
				{props.submitText}
			</Button>
		</footer>
	);
}
