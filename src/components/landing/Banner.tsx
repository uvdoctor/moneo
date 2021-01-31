import React from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import Join from './Join';
import './Banner.less';

export default function Banner() {
	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				<Join />
				<h3 style={{ marginBottom: '10px' }}>No Commissions. No boring Budgets.</h3>
				<SocialShare />
			</div>
		</div>
	);
}
