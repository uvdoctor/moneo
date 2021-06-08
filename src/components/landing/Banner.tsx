import React, { useContext } from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import Join from './Join';
import './Banner.less';
import { AppContext } from '../AppContext';
import { Button } from 'antd';
import { useRouter } from 'next/router';

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);
	const router = useRouter();

	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				{defaultCountry === 'IN' ? (
					<p style={{textAlign: 'center'}}>
						<Button type="primary" onClick={() => router.push('/set')}>
							Set My Financial Plan
						</Button>
					</p>
				) : (
					<Join />
				)}
				<h3 style={{ textAlign: 'center', marginBottom: '10px' }}>No Commissions. Full Data Privacy.</h3>
				{defaultCountry !== 'IN' && <SocialShare />}
			</div>
		</div>
	);
}
