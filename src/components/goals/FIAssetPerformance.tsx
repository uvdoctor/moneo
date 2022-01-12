import React, { useContext } from 'react';
import NumberInput from '../form/numberinput';
import Section from '../form/section';
import { PlanContext } from './PlanContext';

export default function AssetPerformance() {
    const {
        savingsPerf, setSavingsPerf, depositsPerf, setDepositsPerf,
        medTermBondsPerf, setMedTermBondsPerf, iMedTermBondsPerf, setIMedTermBondsPerf,
        taxExemptBondsPerf, setTaxExemptBondsPerf, highYieldBondsPerf, setHighYieldBondsPerf, 
        iHighYieldBondsPerf, setIHighYieldBondsPerf, reitPerf ,setREITPerf, 
        iREITPerf, setIREITPerf, realEstatePerf, setRealEstatePerf, goldPerf, setGoldPerf, 
        goldBondsPerf, setGoldBondsPerf, largeCapStocksPerf, setLargeCapStocksPerf, 
        largeCapETFPerf, setLargeCapETFPerf, midCapStocksPerf, setMidCapStocksPerf, 
        smallCapStocksPerf, setSmallCapStocksPerf, divGrowthStocksPerf, setDivGrowthStocksPerf, 
        iLargeCapStocksPerf, setILargeCapStocksPerf, iLargeCapETFPerf, setILargeCapETFPerf, 
        iMidCapStocksPerf, setIMidCapStocksPerf, iSmallCapStocksPerf, setISmallCapStocksPerf, 
        liquidFundsPerf, setLiquidFundsPerf, uniqueCollectionPerf, setUniqueCollectionPerf
    }: any = useContext(PlanContext);
    return (
        <>
        <Section title="Average performance of cash">
            <NumberInput pre="Savings" unit="% yearly" value={savingsPerf} changeHandler={setSavingsPerf} />
            <NumberInput pre="Liquid funds" unit="% yearly" value={liquidFundsPerf} changeHandler={setLiquidFundsPerf} />
            <NumberInput pre="Deposits" unit="% yearly" value={depositsPerf} changeHandler={setDepositsPerf} />
        </Section>
        <Section title="Average performance of domestic bonds">
            <NumberInput pre="Intermediate-term bonds" unit="% yearly" value={medTermBondsPerf} changeHandler={setMedTermBondsPerf} />
            <NumberInput pre="Tax-exempt bonds" unit="% yearly" value={taxExemptBondsPerf} changeHandler={setTaxExemptBondsPerf} />
            <NumberInput pre="High-yield bonds" unit="% yearly" value={highYieldBondsPerf} changeHandler={setHighYieldBondsPerf} />
        </Section>
        <Section title="Average performance of international bonds">
            <NumberInput pre="Intermediate-term bonds" unit="% yearly" value={iMedTermBondsPerf} changeHandler={setIMedTermBondsPerf} />
            <NumberInput pre="High-yield bonds" unit="% yearly" value={iHighYieldBondsPerf} changeHandler={setIHighYieldBondsPerf} />
        </Section>
        <Section title="Average performance of alternative assets">
            <NumberInput pre="Domestic REITs" unit="% yearly" value={reitPerf} changeHandler={setREITPerf} />
            <NumberInput pre="International REITs" unit="% yearly" value={iREITPerf} changeHandler={setIREITPerf} />
            <NumberInput pre="Real-estate" unit="% yearly" value={realEstatePerf} changeHandler={setRealEstatePerf} />
            <NumberInput pre="Gold" unit="% yearly" value={goldPerf} changeHandler={setGoldPerf} />
            <NumberInput pre="Gold bonds" unit="% yearly" value={goldBondsPerf} changeHandler={setGoldBondsPerf} />
            <NumberInput pre="Unique collections" unit="% yearly" post="eg: Paintings, Watches, Statues, etc" value={uniqueCollectionPerf} changeHandler={setUniqueCollectionPerf} />
        </Section>
        <Section title="Average performance of domestic equities">
            <NumberInput pre="Large-cap ETFs" unit="% yearly" value={largeCapETFPerf} changeHandler={setLargeCapETFPerf} />
            <NumberInput pre="Large-cap stocks" unit="% yearly" value={largeCapStocksPerf} changeHandler={setLargeCapStocksPerf} />
            <NumberInput pre="Mid-cap stocks" unit="% yearly" value={midCapStocksPerf} changeHandler={setMidCapStocksPerf} />
            <NumberInput pre="Small-cap stocks" unit="% yearly" value={smallCapStocksPerf} changeHandler={setSmallCapStocksPerf} />
            <NumberInput pre="Dividend-growth stocks" unit="% yearly" value={divGrowthStocksPerf} changeHandler={setDivGrowthStocksPerf} />
        </Section>
        <Section title="Average performance of international equities">
        <NumberInput pre="Large-cap ETFs" unit="% yearly" value={iLargeCapETFPerf} changeHandler={setILargeCapETFPerf} />
            <NumberInput pre="Large-cap stocks" unit="% yearly" value={iLargeCapStocksPerf} changeHandler={setILargeCapStocksPerf} />
            <NumberInput pre="Mid-cap stocks" unit="% yearly" value={iMidCapStocksPerf} changeHandler={setIMidCapStocksPerf} />
            <NumberInput pre="Small-cap stocks" unit="% yearly" value={iSmallCapStocksPerf} changeHandler={setISmallCapStocksPerf} />
        </Section>
    </>
    );
}