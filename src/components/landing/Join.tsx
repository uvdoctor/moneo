import React, { Fragment } from 'react';
import Button from '../Button';
import IconTooltip from '../IconTooltip';
import SocialMediaShare from '../SocialMediaShare';

interface JoinProps {
	joinRef?: any;
}

const Join = ({ joinRef }: JoinProps) => {
	return (
		<Fragment>
			<h2 ref={joinRef} className="text-sm mt-8 font-bold text-green-primary sm:text-lg md:text-base md:mt-12 lg:text-lg lg:mt-20">
				Join Waitlist &amp; Earn up to $200 credit*{' '}
				<IconTooltip id="earn-credit">
					<ul className="p-3 text-lg font-normal">
						<li>First 100 get $200 credit</li>
						<li>Next 900 get $150 credit</li>
						<li>Next 2,000 get $100 credit</li>
						<li>Next 3,000 get $75 credit</li>
						<li>Next 4,000 get $50 credit</li>
						<li>Next 5,000 get $30 credit</li>
						<li>All others get $15 credit</li>
					</ul>
				</IconTooltip>
			</h2>
			<div
				className="bg-white border border-gray-500 rounded p-1 mt-5 shadow md:w-2/4 md:text-base lg:w-4/12 lg:text-lg"
			>
				<input className="w-3/4 p-2" type="text" placeholder="Enter email address" />
				<Button className="w-1/4" label="Join" />
			</div>
			<div className="text-sm bg-white border border-gray-400 p-5 rounded mt-4 shadow sm:text-base md:w-2/4 md:text-sm md:p-3 lg:text-base lg:w-4/12">
				<SocialMediaShare url={`https://dollardarwin.com`} />
			</div>
		</Fragment>
	);
};

export default Join;
