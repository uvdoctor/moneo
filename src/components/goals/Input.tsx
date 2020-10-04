import React, { ReactNode } from 'react';
import Button from '../Button';
import ActionButtons from '../form/actionbuttons';
import Tabs from '../tabs';

interface InputProps {
	tabOptions: Array<any>;
	currentOrder: number;
	allInputDone: boolean;
	submitDisabled: boolean;
	cancelDisabled: boolean;
	showTab: string;
	children: ReactNode;
	showTabHandler: Function;
	cancelCallback: Function;
	handleSubmit?: Function | null;
}

export default function Input({
	tabOptions,
	currentOrder,
	allInputDone,
	submitDisabled,
	cancelDisabled,
	showTab,
	children,
	showTabHandler,
	cancelCallback,
	handleSubmit
}: InputProps) {
	return (
		<div
			className={`w-full ${allInputDone &&
				'lg:max-w-xs'} items-start transition-width duration-500 ease-in-out flex flex-col-reverse lg:flex-col`}
		>
			{(allInputDone || currentOrder >= tabOptions[0].order) && (
				<Tabs
					tabs={tabOptions}
					selectedTab={showTab}
					selectedTabHandler={showTabHandler}
					capacity={tabOptions.length}
					currentOrder={currentOrder}
					allInputDone={allInputDone}
				/>
			)}
			<div className="w-full flex flex-wrap justify-center">
				{React.Children.map(
					children,
					(child: any) => ((allInputDone || currentOrder >= tabOptions[0].order) && child ? child : null)
				)}
			</div>
			{!handleSubmit ? (
				<div className="w-full text-center">
					<Button label="Close" onClick={cancelCallback} isPrimary />
				</div>
			) : (
				<ActionButtons
					submitDisabled={submitDisabled}
					cancelDisabled={cancelDisabled}
					cancelHandler={cancelCallback}
					submitHandler={handleSubmit}
					submitText="Save"
				/>
			)}
		</div>
	);
}
