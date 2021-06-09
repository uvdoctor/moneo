import React, { useContext, useEffect, useState } from 'react';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import {
	EmailShareButton,
	EmailIcon,
	FacebookShareButton,
	FacebookIcon,
	InstapaperShareButton,
	InstapaperIcon,
	LinkedinShareButton,
	LinkedinIcon,
	PinterestShareButton,
	PinterestIcon,
	RedditShareButton,
	RedditIcon,
	TwitterShareButton,
	TwitterIcon,
	TelegramShareButton,
	TelegramIcon,
	WhatsappShareButton,
	WhatsappIcon,
	ViberShareButton,
	ViberIcon
} from 'react-share';

import './SocialShare.less';
import { AppContext } from './AppContext';

export default function SocialMediaShare() {
	const { defaultCountry }: any = useContext(AppContext);
	const websiteUrl = defaultCountry === 'IN' ? 'https://moneo.in' : 'https://gomoneo.com';
	const [ url, setUrl ] = useState(websiteUrl);

	useEffect(() => setUrl(`${websiteUrl}${window.location.pathname}`), []);

	return (
		<div className="social-share">
			<span className="expand-collapse-icon">
				<CaretDownOutlined />
				<CaretUpOutlined />
			</span>
			<p>{`Earn ${defaultCountry === 'IN' ? 'cashback' : '500 points'} for Every Referral`}</p>
			<div>
				<EmailShareButton url={url} subject="Moneo - Your Money Coach">
					<EmailIcon size={32} round />
				</EmailShareButton>
				<FacebookShareButton url={url}>
					<FacebookIcon size={32} round />
				</FacebookShareButton>
				<InstapaperShareButton url={url}>
					<InstapaperIcon size={32} round />
				</InstapaperShareButton>
				<TwitterShareButton url={url}>
					<TwitterIcon size={32} round />
				</TwitterShareButton>
				<LinkedinShareButton url={url}>
					<LinkedinIcon size={32} round />
				</LinkedinShareButton>
				<PinterestShareButton media={`${websiteUrl}/images/icons/tlogo256.png`} url={url}>
					<PinterestIcon size={32} round />
				</PinterestShareButton>
				<TelegramShareButton url={url}>
					<TelegramIcon size={32} round />
				</TelegramShareButton>
				<WhatsappShareButton url={url}>
					<WhatsappIcon size={32} round />
				</WhatsappShareButton>
				<RedditShareButton url={url}>
					<RedditIcon size={32} round />
				</RedditShareButton>
				<ViberShareButton url={url}>
					<ViberIcon size={32} round />
				</ViberShareButton>
			</div>
		</div>
	);
}
