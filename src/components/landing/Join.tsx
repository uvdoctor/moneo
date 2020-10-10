import React, { Fragment } from "react";
import { Input, Popover, notification } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import awsconfig from "../../aws-exports";
import { GRAPHQL_AUTH_MODE } from "@aws-amplify/api-graphql";
import Amplify, { API } from "aws-amplify";
import { Status } from "../../api/goals";

Amplify.configure(awsconfig);

const Join = () => {
	const { Search } = Input;

	const doesEntryExist = async (email: string) => {
		try {
			const { data }: any = await API.graphql({
				query: queries.listRegistrations,
				variables: { email: email },
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
			});
			if (data.listRegistrations.items.length > 0) {
				notification.error({
					message: "Email Already Registered",
					description:
						"This email has already been registered. Please try again with another email address.",
				});
				return true;
			} else return false;
		} catch (e) {
			console.log("Error while checking for existing registration: ", e);
			return true;
		}
	};

	const handleEmail = async (email: string) => {
		if (await doesEntryExist(email)) return;
		try {
			console.log("Going to register...");
			const result = await API.graphql({
				query: mutations.createRegistration,
				variables: {
					input: {
						email: email,
						status: Status.N,
						code: "a123",
					},
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM,
			});
			if (result) {
				notification.success({
					message: "Verify Email",
					description: "Almost there...please verify the code emailed to You.",
				});
			}
		} catch (e) {
			console.log("Error while registering: ", e);
		}
	};

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
						<InfoCircleOutlined />
					</span>
				</Popover>
			</h3>
			<Search
				placeholder="Enter email address"
				enterButton="Join"
				size="large"
				onSearch={(value) => handleEmail(value)}
			/>
		</Fragment>
	);
};

export default Join;
