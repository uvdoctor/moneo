import { useReducer } from "react";

const useFetch = (url: any) => {
	const initialState = {
		isLoading: false,
		data: null,
		error: null,
	};
	const [state, dispatch] = useReducer(reducer, initialState);

	function reducer(state: any, { type, error, data }: any) {
		switch (type) {
			case "loading":
				return {
					...state,
					isLoading: true,
					data: null,
					error: null,
				};

			case "completed":
				return {
					...state,
					isLoading: false,
					error: null,
					data,
				};

			case "error":
				return {
					...state,
					isLoading: false,
					error,
				};

			default:
				return state;
		}
	}

	async function loadData() {
		dispatch({ type: "loading" });

		try {
			const response = await fetch(url);
			const data = await response.json();

			response.ok
				? dispatch({ type: "completed", data })
				: dispatch({
						type: "error",
						error: {
							type: "error",
							title: `${response.status} ${data.title}`,
							text: data.message,
						},
				  });
		} catch (e: any) {
			dispatch({
				type: "error",
				error: {
					type: "error",
					title: e.toString(),
					text: e.stack.replace(/( at )/g, "<br />at "),
				},
			});
		}
	}

	return [state, dispatch, loadData];
};

export default useFetch;
