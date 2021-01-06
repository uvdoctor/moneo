import React, { Fragment } from 'react';
import { Popover } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import RollingImages from '../RollingImages';

const BannerContent = () => {
	return (
		<Fragment>
			<h3>Your Money Coach for</h3>
			<h2>Stress-free Financial Independence</h2>
			<h3 className="with-icon-anim">
				& Meeting Your Goals <RollingImages />
			</h3>
			<h4>
				Join Waitlist &amp; Earn up to $200 credit*
				<Popover
					content={
						<div>
							<p>First 100 get $200 credit</p>
							<p>Next 900 get $150 credit</p>
							<p>Next 2,000 get $100 credit</p>
							<p>Next 3,000 get $75 credit</p>
							<p>Next 4,000 get $50 credit</p>
							<p>Next 5,000 get $30 credit</p>
							<p>All others get $15 credit</p>
						</div>
					}
				>
					<span>
						<InfoCircleOutlined />
					</span>
				</Popover>
			</h4>
		</Fragment>
	);
};

export default BannerContent;
