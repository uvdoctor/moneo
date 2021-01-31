/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { ROUTES } from '../CONSTANTS';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LogoImg from './LogoImg';
interface LogoProps {
	onBack?: Function | undefined | null;
}
export default function Logo({ onBack }: LogoProps) {
	const router = useRouter();
	return (
		<div style={{ cursor: 'pointer' }} className="logo">
			{router.pathname !== ROUTES.HOME && (
				<Button type="text" icon={<ArrowLeftOutlined />} onClick={() => (onBack ? onBack() : router.back())} />
			)}
			<Link href={ROUTES.HOME}>
				<a>
					<LogoImg />
				</a>
			</Link>
		</div>
	);
}
