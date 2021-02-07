import React, { createContext, useState } from 'react';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import Amplify, { API } from 'aws-amplify';
import { CreateFeedbackMutation, FeedbackType } from '../../api/goals';
import { Form, notification } from 'antd';
import { sendMail } from '../utils';

Amplify.configure(awsconfig);

const FeedbackContext = createContext({});

interface FeedbackContextProviderProps {
	children: any;
}

function FeedbackContextProvider({ children }: FeedbackContextProviderProps) {
	const [ feedbackType, setFeedbackType ] = useState<FeedbackType>(FeedbackType.C);
	const [ feedback, setFeedback ] = useState<String>('');
	const [ firstName, setFirstName ] = useState<String>('');
	const [ lastName, setLastName ] = useState<String>('');
	const [ email, setEmail ] = useState<String>('');
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ feedbackId, setFeedbackId ] = useState<String | undefined>('');
	const [ error, setError ] = useState({});
	const [ form ] = Form.useForm();

	const openNotificationWithIcon = (type: any, message: string, description: string) => {
    //@ts-ignore
    notification[type]({
			message: message,
			description: description
		});
	};

	const onFormSubmit = async ({ feedbackType, feedback, firstName, lastName, email }: any) => {
		setLoading(true);
		setFeedbackType(feedbackType);
		setFeedback(feedback);
		setFirstName(firstName);
		setLastName(lastName);
		setEmail(email);
		try {
			const { data }  = (await API.graphql({
				query: mutations.createFeedback,
				variables: {
					input: {
						type: feedbackType,
						feedback: feedback,
						name: {
							fn: firstName,
							ln: lastName
						},
						email: email
					}
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			})) as {
			data: CreateFeedbackMutation;
			};
			setFeedbackId(data.createFeedback?.id);
			form.resetFields();
			sendMail('21.ramit@gmail.com', 'FeedbackTemplate', data);
			openNotificationWithIcon('success', 'Success', 'Feedback saved successfully.');
		} catch (e) {
			setError({
				title: 'Error while creating feedback',
				message: e.errors ? e.errors[0].message : e.toString()
			});
			openNotificationWithIcon('error', 'Error', 'Error while saving feedback.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<FeedbackContext.Provider
			value={{
				feedbackType,
				feedback,
				firstName,
				lastName,
				isLoading,
				onFormSubmit,
				email,
        form,
        feedbackId,
				error
			}}
		>
			{children}
		</FeedbackContext.Provider>
	);
}

export { FeedbackContextProvider, FeedbackContext };
