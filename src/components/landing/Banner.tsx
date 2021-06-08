import React, { useContext } from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import Join from './Join';
import './Banner.less';
import { AppContext } from '../AppContext';
import SetGoalsButton from './SetGoalsButton';

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				{defaultCountry === 'IN' ? (
					<p style={{ textAlign: 'center' }}>
						<SetGoalsButton />
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
