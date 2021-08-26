import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { NWContext } from './NWContext';

export default function TotalLiabilities() {
    const { totalLiabilities, selectedCurrency }: any = useContext(NWContext);

    return(
        <ItemDisplay label="You Own" result={totalLiabilities} currency={selectedCurrency} pl />
    )
}