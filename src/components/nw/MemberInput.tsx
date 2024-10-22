import React, { Fragment, useContext } from 'react';
import { NWContext } from './NWContext';
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
	const { familyOptions }: any = useContext(NWContext);
	return (
		<Fragment>
			{pre ? <LabelWithTooltip label={<UserOutlined />} /> : ''}
			<SelectInput
				pre=""
				value={value}
				options={familyOptions}
				changeHandler={(value: string) => changeHandler(value)}
				style={style}
			/>
		</Fragment>
	);
}
