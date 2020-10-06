import React, { Fragment } from "react";
import { Input, Popover } from "antd";
import SVGInfo from "../svginfo";

interface JoinProps {
	joinRef?: any;
}

const Join = ({ joinRef }: JoinProps) => {
	const { Search } = Input;

	return (
		<Fragment>
			<h3>
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
						<SVGInfo />
					</span>
				</Popover>
			</h3>
			<Search
				placeholder="Enter email address"
				enterButton="Join"
				size="large"
			/>
		</Fragment>
	);
};

export default Join;
