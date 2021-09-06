import React, { useContext } from 'react';
import ResImg from '../ResImg';
import BannerContent from './BannerContent';
import SocialShare from '../SocialShare';
import './Banner.less';
import { AppContext } from '../AppContext';
import GetStartedButton from './GetStartedButton';
import WalletSVG from '../svgs/2d/wallet';
import LockSVG from '../svgs/2d/lock';
import SecuritySVG from '../svgs/2d/security';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { COLORS } from '../../CONSTANTS';

export default function Banner() {
	const { defaultCountry }: any = useContext(AppContext);

	return (
		<div className="site-banner">
			<ResImg name="cover" />
			<div className="site-banner-content">
				<BannerContent />
				<p>
					<GetStartedButton />
				</p>
				<h3>
					<FontAwesomeIcon icon={faEyeSlash} color={COLORS.GREEN} />
					No hidden fees
				</h3>
				<h3>
					<WalletSVG />
					Smart deals based on goals
				</h3>
				<h3>
					<LockSVG />
					Respects Privacy
				</h3>
				<h3>
					<SecuritySVG />
					Bank-grade Security
				</h3>
				{defaultCountry !== 'IN' && <SocialShare />}
			</div>
		</div>
	);
}
