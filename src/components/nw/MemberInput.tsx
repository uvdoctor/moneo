import React, { Fragment, useContext, useEffect, useState } from 'react';
import { NWContext } from './NWContext';
import { getFamilyOptions } from './nwutils';
import LabelWithTooltip from '../form/LabelWithTooltip';
import SelectInput from '../form/selectinput';
import { UserOutlined } from '@ant-design/icons';
interface MemberInputProps {
	value: string;
	changeHandler: Function;
	pre?: boolean;
	style?: any;
}

export default function MemberInput({ value, changeHandler, pre, style }: MemberInputProps) {
	const { allFamily }: any = useContext(NWContext);
	const [ options, setOptions ] = useState<any>(getFamilyOptions(allFamily));

	useEffect(
		() => {
			setOptions(getFamilyOptions(allFamily));
		},
		[ allFamily ]
	);

	return (
		<Fragment>
			{pre ? <LabelWithTooltip label={<UserOutlined />} /> : ''}
			<SelectInput
				pre=""
				value={value}
				options={options}
				changeHandler={(value: string) => changeHandler(value)}
				style={style}
			/>
		</Fragment>
	);
}
