import { Button } from 'antd';
import React from 'react';

interface StartProps {
	onClick: Function
}

export default function Start({onClick}: StartProps) {
	return (
		<div style={{ textAlign: 'center' }}>
			<h3>First Things First.</h3>
			<h3>Set Financial Independence Target.</h3>
			<Button type="primary" onClick={()=>onClick}>
				Get Started
			</Button>
		</div>
	);
}
