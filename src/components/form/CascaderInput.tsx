import React, { ReactNode, Fragment } from 'react';
import LabelWithTooltip from './LabelWithTooltip';
import { isMobileDevice } from '../utils';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { Cascader } from 'antd';

interface CascaderInputProps {
	info?: string;
	pre: string | ReactNode;
	options: any;
	parentValue: string | number;
	parentChangeHandler: any;
	childChangeHandler?: any;
	childValue?: string | number;
}

export default function CascaderInput({
	parentValue,
	childValue,
	pre,
	info,
	options,
	childChangeHandler,
	parentChangeHandler
}: CascaderInputProps) {
	const fsb = useFullScreenBrowser();
	const defaultValue: any = childChangeHandler ? [ parentValue, childValue ] : [ parentValue ];
	const onChange = (value: Array<string | number>) => {
		if (childChangeHandler) {
			parentChangeHandler(value[0]);
			childChangeHandler(value[1]);
		} else {
			parentChangeHandler(value[0]);
		}
	};
	return (
		<Fragment>
			<LabelWithTooltip label={pre} info={info} />
			<Cascader
				allowClear={false}
				style={{ width: isMobileDevice(fsb) ? 120 : 200 }}
				defaultValue={defaultValue}
				options={options}
				onChange={onChange}
			/>
		</Fragment>
	);
}
