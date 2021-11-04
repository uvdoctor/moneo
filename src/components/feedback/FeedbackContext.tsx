import React, { createContext, useContext, useState } from 'react';
import * as mutations from '../../graphql/mutations';
import awsconfig from '../../aws-exports';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';
import Amplify, { API } from 'aws-amplify';
import { CreateFeedbackMutation, FeedbackType } from '../../api/goals';
import { Form, notification } from 'antd';
import { sendMail } from '../utils';
import { AppContext } from '../AppContext';

Amplify.configure(awsconfig);

const FeedbackContext = createContext({});

interface FeedbackContextProviderProps {
	children: any;
}

function FeedbackContextProvider({ children }: FeedbackContextProviderProps) {
	const { user }: any = useContext(AppContext);
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
		let emailAddress = user ? user.attributes.email : email;
		setLoading(true);
		setFeedbackType(feedbackType);
		setFeedback(feedback);
		setFirstName(firstName);
		setLastName(lastName);
		setEmail(emailAddress);
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
						email: emailAddress
					}
				},
				authMode: GRAPHQL_AUTH_MODE.AWS_IAM
			})) as {
			data: CreateFeedbackMutation;
			};
			setFeedbackId(data.createFeedback?.id);
			form.resetFields();
			const mailTemplate = {
				firstName : data.createFeedback?.name.fn,
				lastName : data.createFeedback?.name.ln,
				email: data.createFeedback?.email,
				content: data.createFeedback?.feedback,
				type: (data.createFeedback?.type==='C'?'comment':(data.createFeedback?.type==='S'?'suggestion':'question'))
			}
			sendMail(`21.ramit@gmail.com;emailumangdoctor@gmail.com`, mailTemplate.email as string , 'FeedbackTemplate', mailTemplate);
			openNotificationWithIcon('success', 'Success', 'Feedback saved successfully');
		} catch (e) {
			setError({
				title: 'Error while creating feedback',
				//@ts-ignore
				message: e.errors ? e.errors[0].message : e.toString()
			});
			openNotificationWithIcon('error', 'Error', 'Error while saving feedback');
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
