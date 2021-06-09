import React, { useContext } from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import Join from './Join';
import './Banner.less';
import { AppContext } from '../AppContext';
import SetGoalsButton from './SetGoalsButton';
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
					<p style={{ textAlign: 'center' }}>
						<SetGoalsButton />
					</p>
				) : (
					<Join />
				)}
				<h3 style={{ textAlign: 'center' }}>
					<WalletTwoTone twoToneColor={COLORS.GREEN} />
					No Commissions.
				</h3>
				<h3 style={{ textAlign: 'center' }}>
					<LockTwoTone twoToneColor={COLORS.GREEN} />
					Respects Privacy.
				</h3>
				<h3 style={{ textAlign: 'center' }}>
					<SafetyCertificateTwoTone twoToneColor={COLORS.GREEN} />
					Bank-grade Security.
				</h3>
				{defaultCountry !== 'IN' && <SocialShare />}
			</div>
		</div>
	);
}
