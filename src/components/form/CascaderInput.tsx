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
	width?: number
	post?: any
}

export default function CascaderInput({
	parentValue,
	childValue,
	pre,
	info,
	options,
	childChangeHandler,
	parentChangeHandler,
	width,
	post
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

	const filter = (inputValue: string, path: any[]) => {
		return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
	}

	return (
		<Fragment>
			<LabelWithTooltip label={pre} info={info} />
			{Object.keys(options).length && <Cascader
				allowClear={false}
				style={{ width: isMobileDevice(fsb) ? 100 : width ? width : 200 }}
				defaultValue={defaultValue}
				options={options}
				onChange={onChange}
				showSearch={{ filter }}
			/>}
			{post ? post : null}
		</Fragment>
	);
}
