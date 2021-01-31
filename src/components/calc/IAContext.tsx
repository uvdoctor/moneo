import React, { createContext, useContext, useEffect, useState } from 'react';
import { CalcContext } from './CalcContext';
import CalcTemplate from './CalcTemplate';

const IAContext = createContext({});

function IAContextProvider() {
  const [assetName, setAssetName] = useState<string>("GOOG");
	const {
		setCFs,
		allInputDone,
		setResults,
	}: any = useContext(CalcContext);

	useEffect(() => {
    setResults([...[
    ]
    ]);
	}, []);

  useEffect(() => {
    setCFs(...[]);
  }, [allInputDone]);

	return (
		<IAContext.Provider
			value={{
        assetName, setAssetName
			}}
		>
			<CalcTemplate />
		</IAContext.Provider>
	);
}

export { IAContext, IAContextProvider };
