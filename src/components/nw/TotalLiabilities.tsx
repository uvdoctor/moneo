import React, { useContext } from 'react';
import ItemDisplay from '../calc/ItemDisplay';
import { NWContext } from './NWContext';

export default function TotalLiabilities() {
    const { totalLiabilities, selectedCurrency }: any = useContext(NWContext);

    return(
        <ItemDisplay label="You Owe" result={totalLiabilities} currency={selectedCurrency} pl 
        info={"This is the sum of all payments you have to make for loans, insurance, etc."} />
    )
}