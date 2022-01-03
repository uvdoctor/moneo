import { Tooltip } from 'antd';
import React, { Fragment, ReactNode } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';

interface LabelWithTooltipProps {
	label: string | ReactNode;
	info?: string;
}

export default function LabelWithTooltip({ label, info }: LabelWithTooltipProps) {
	return (
		label ? 
		<Fragment>
			{label}
			{info && (
				<Tooltip title={info}>
					<InfoCircleOutlined />
				</Tooltip>
			)}
            {label || info ? <br/> : null}
		</Fragment> : null
	);
}
