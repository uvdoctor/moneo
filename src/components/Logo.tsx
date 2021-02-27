/* eslint-disable jsx-a11y/alt-text */
import React, { useContext } from 'react';
import { ROUTES } from '../CONSTANTS';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import MainLogo from './svgs/MainLogo';
import { PlanContext } from './goals/PlanContext';
import { CalcContext } from './calc/CalcContext';
interface LogoProps {
	onBack?: Function | undefined | null;
}

export default function Logo({ onBack }: LogoProps) {
	const { isPublicCalc }: any = useContext(PlanContext);
	const { handleSubmit }: any = useContext(CalcContext);

	const router = useRouter();
	return (
		<div style={{ cursor: 'pointer' }} className="logo">
			{router.pathname !== ROUTES.HOME && (
				<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => (onBack ? onBack() : !isPublicCalc && handleSubmit ? handleSubmit(true) : router.back())} />
			)}
			<Link href={ROUTES.HOME}>
				<a>
					<MainLogo />
				</a>
			</Link>
		</div>
	);
}
