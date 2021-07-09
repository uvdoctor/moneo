import React, { useEffect, useState } from 'react';
import { useFullScreenBrowser } from 'react-browser-hooks';
import { isMobileDevice } from '../utils';
import Content from '../Content';
import GetStartedButton from './GetStartedButton';

export default function FinancialIndependence() {
	const fsb = useFullScreenBrowser();
	const [ imgPath, setImgPath ] = useState('images/1x1.gif');

	useEffect(() => setImgPath(`images/fi${isMobileDevice(fsb) ? '-mobile' : ''}.jpg`), []);

	return (
		<Content>
			<div className="site-banner">
				<img src={imgPath} />
				<div className="site-banner-content">
					<h2>Break-free to live on your terms</h2>
					<h3>Just 15 minutes for a personalized financial plan</h3>
					<p>
						<GetStartedButton />
					</p>
				</div>
			</div>
		</Content>
	);
}
