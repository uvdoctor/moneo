import React, { ReactNode } from 'react';
import { Space } from 'antd';
import { CaretLeftOutlined } from '@ant-design/icons';

interface StickyHeaderProps {
	title: string;
  cancelCallback: Function;
  children?: ReactNode;
}

export default function TitleSection({ title, cancelCallback, children }: StickyHeaderProps) {
	return (
		<Space align="center" direction="vertical">
			<h1>{title}</h1>
			<Space align="end">
				<div style={{ cursor: 'pointer' }} onClick={() => cancelCallback()}>
					<span>
						<CaretLeftOutlined />
						Back
					</span>
				</div>
				{children}
			</Space>
		</Space>
	);
}
