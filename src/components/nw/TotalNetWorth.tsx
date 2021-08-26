import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { NWContext } from './NWContext';

export default function TotalNetWorth() {
    const { nw, selectedCurrency }: any = useContext(NWContext);

    return(
        <ItemDisplay label="You Own" result={nw} currency={selectedCurrency} pl />
    )
}