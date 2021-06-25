import React, { useContext } from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import Join from './Join';
import './Banner.less';
import { AppContext } from '../AppContext';
import GetStartedButton from './GetStartedButton';
import { WalletTwoTone, SafetyCertificateTwoTone, LockTwoTone } from '@ant-design/icons';
import { COLORS } from '../../CONSTANTS';

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				{defaultCountry === 'IN' ? (
					<p>
						<GetStartedButton />
					</p>
				) : (
					<Join />
				)}
				<h3>
					<WalletTwoTone twoToneColor={COLORS.GREEN} />
					No Commissions.
				</h3>
				<h3>
					<LockTwoTone twoToneColor={COLORS.GREEN} />
					Respects Privacy.
				</h3>
				<h3>
					<SafetyCertificateTwoTone twoToneColor={COLORS.GREEN} />
					Bank-grade Security.
				</h3>
				{defaultCountry !== 'IN' && <SocialShare />}
			</div>
		</div>
	);
}
