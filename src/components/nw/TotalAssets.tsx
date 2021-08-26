import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { NWContext } from './NWContext';

export default function TotalAssets() {
    const { totalAssets, selectedCurrency }: any = useContext(NWContext);

    return(
        <ItemDisplay label="You Own" result={totalAssets} currency={selectedCurrency} pl />
    )
}