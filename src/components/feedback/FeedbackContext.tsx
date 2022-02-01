import React, { createContext, useContext, useState } from 'react';
import * as mutations from '../../graphql/mutations';
import { API } from 'aws-amplify';
import { CreateFeedbackMutation } from '../../api/goals';
import { Form, notification } from 'antd';
import { AppContext } from '../AppContext';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api-graphql';

const FeedbackContext = createContext({});

interface FeedbackContextProviderProps {
	children: any;
}

function FeedbackContextProvider({ children }: FeedbackContextProviderProps) {
	const { user, validateCaptcha, owner }: any = useContext(AppContext);
	const [ isLoading, setLoading ] = useState<boolean>(false);
	const [ feedbackId, setFeedbackId ] = useState<String | undefined>('');
	const [ rating, setRating ] = useState<number>(0);
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
		validateCaptcha("feedback_change").then(async(success: boolean) => {
			if(!success) return;
			let emailAddress = user ? user.attributes.email : email;
			let fn = user && user?.attributes.name ? user?.attributes.name : owner ? owner : firstName; 
			try {
				const { data }  = await API.graphql({
					query: mutations.createFeedback,
					variables: {
						input: {
							type: feedbackType,
							feedback: feedback,
							name: { fn: fn, ln: lastName },
							email: emailAddress,
							uname: user ? owner : ''
						}
					},
					authMode: !user ? GRAPHQL_AUTH_MODE.AWS_IAM : GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS }) as 
				{ data: CreateFeedbackMutation };
				if (rating && rating < 4) setFeedbackId(data.createFeedback?.id); 
				form.resetFields();
				openNotificationWithIcon('success', 'Success', 'Feedback saved successfully');
			} catch (e) {
				console.log(e)
				setError({
					title: 'Error while creating feedback',
					//@ts-ignore
					message: e.errors ? e.errors[0].message : e.toString()
				});
				openNotificationWithIcon('error', 'Error', 'Error while saving feedback');
			} finally {
				setFeedbackId('');
				setLoading(false);
			}
		})
	};

	return (
		<FeedbackContext.Provider
			value={{ isLoading, onFormSubmit, form, feedbackId, error, setRating }}
		>
			{children}
		</FeedbackContext.Provider>
	);
}

export { FeedbackContextProvider, FeedbackContext };
