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
				<SocialShare />
				<p style={{marginTop: '30px'}}>
					<h3>No Commissions! No boring Budgets!</h3>
					<h3>Personalized, Easy-to-use & Unbiased.</h3>
					<h3>Respects Data Privacy. Fully Secure.</h3>
				</p>
			</div>
		</div>
	);
}
