import { Tabs } from "antd";
import React, { useContext } from "react";
import NumberInput from "../form/numberinput";
import Section from "../form/section";
import { FIGoalContext } from "./FIGoalContext";

export default function FIAssetPerformance() {
  const {
    cashPerf,
    setCashPerf,
    medTermBondsPerf,
    setMedTermBondsPerf,
    iMedTermBondsPerf,
    setIMedTermBondsPerf,
    taxExemptBondsPerf,
    setTaxExemptBondsPerf,
    highYieldBondsPerf,
    setHighYieldBondsPerf,
    iHighYieldBondsPerf,
    setIHighYieldBondsPerf,
    reitPerf,
    setREITPerf,
    iREITPerf,
    setIREITPerf,
    reitETFPerf,
    setREITETFPerf,
    iREITETFPerf,
    setIREITETFPerf,
    realEstatePerf,
    setRealEstatePerf,
    goldPerf,
    setGoldPerf,
    goldBondsPerf,
    setGoldBondsPerf,
    largeCapStocksPerf,
    setLargeCapStocksPerf,
    largeCapETFPerf,
    setLargeCapETFPerf,
    midCapStocksPerf,
    setMidCapStocksPerf,
    smallCapStocksPerf,
    setSmallCapStocksPerf,
    divGrowthStocksPerf,
    setDivGrowthStocksPerf,
    iLargeCapStocksPerf,
    setILargeCapStocksPerf,
    iLargeCapETFPerf,
    setILargeCapETFPerf,
    iMidCapStocksPerf,
    setIMidCapStocksPerf,
    iSmallCapStocksPerf,
    setISmallCapStocksPerf,
    uniqueCollectionPerf,
    setUniqueCollectionPerf,
    cryptoPerf,
    setCryptoPerf,
    p2pPerf,
    setP2PPerf,
  }: any = useContext(FIGoalContext);
  const { TabPane } = Tabs;
  return (
    <Tabs defaultActiveKey="cash" type="line">
      <TabPane key="cash" tab="Cash">
        <Section title="Average long-time performance of cash">
          <NumberInput
            pre="Portfolio of deposits, liquid funds & retirement funds"
            unit="% yearly"
            value={cashPerf}
            changeHandler={setCashPerf}
          />
        </Section>
      </TabPane>
      <TabPane key="bonds" tab="Bonds">
        <Section title="Average long-time performance of domestic bonds">
          <NumberInput
            pre="Intermediate-term bonds"
            unit="% yearly"
            value={medTermBondsPerf}
            changeHandler={setMedTermBondsPerf}
          />
          <NumberInput
            pre="Tax-exempt bonds"
            unit="% yearly"
            value={taxExemptBondsPerf}
            changeHandler={setTaxExemptBondsPerf}
          />
          <NumberInput
            pre="High-yield bonds"
            unit="% yearly"
            value={highYieldBondsPerf}
            changeHandler={setHighYieldBondsPerf}
          />
        </Section>
        <Section title="Average long-time performance of international bonds">
          <NumberInput
            pre="Intermediate-term bonds"
            unit="% yearly"
            value={iMedTermBondsPerf}
            changeHandler={setIMedTermBondsPerf}
          />
          <NumberInput
            pre="High-yield bonds"
            unit="% yearly"
            value={iHighYieldBondsPerf}
            changeHandler={setIHighYieldBondsPerf}
          />
        </Section>
      </TabPane>
      <TabPane key="equities" tab="Equities">
        <Section title="Average long-time performance of domestic equities">
          <NumberInput
            pre="Large-cap ETFs"
            unit="% yearly"
            value={largeCapETFPerf}
            changeHandler={setLargeCapETFPerf}
          />
          <NumberInput
            pre="Large-cap stocks"
            unit="% yearly"
            value={largeCapStocksPerf}
            changeHandler={setLargeCapStocksPerf}
          />
          <NumberInput
            pre="Mid-cap stocks"
            unit="% yearly"
            value={midCapStocksPerf}
            changeHandler={setMidCapStocksPerf}
          />
          <NumberInput
            pre="Small-cap stocks"
            unit="% yearly"
            value={smallCapStocksPerf}
            changeHandler={setSmallCapStocksPerf}
          />
          <NumberInput
            pre="Dividend-growth stocks"
            unit="% yearly"
            value={divGrowthStocksPerf}
            changeHandler={setDivGrowthStocksPerf}
          />
        </Section>
        <Section title="Average long-time performance of international equities">
          <NumberInput
            pre="Large-cap ETFs"
            unit="% yearly"
            value={iLargeCapETFPerf}
            changeHandler={setILargeCapETFPerf}
          />
          <NumberInput
            pre="Large-cap stocks"
            unit="% yearly"
            value={iLargeCapStocksPerf}
            changeHandler={setILargeCapStocksPerf}
          />
          <NumberInput
            pre="Mid-cap stocks"
            unit="% yearly"
            value={iMidCapStocksPerf}
            changeHandler={setIMidCapStocksPerf}
          />
          <NumberInput
            pre="Small-cap stocks"
            unit="% yearly"
            value={iSmallCapStocksPerf}
            changeHandler={setISmallCapStocksPerf}
          />
        </Section>
      </TabPane>
      <TabPane key="re" tab="Real-estate">
        <Section title="Average long-term performance of real-estate assets">
          <NumberInput
            pre="Real-estate"
            unit="% yearly"
            value={realEstatePerf}
            changeHandler={setRealEstatePerf}
          />
          <NumberInput
            pre="Domestic REITs"
            unit="% yearly"
            value={reitPerf}
            changeHandler={setREITPerf}
          />
          <NumberInput
            pre="Domestic REIT ETFs"
            unit="% yearly"
            value={reitETFPerf}
            changeHandler={setREITETFPerf}
          />
          <NumberInput
            pre="International REITs"
            unit="% yearly"
            value={iREITPerf}
            changeHandler={setIREITPerf}
          />
          <NumberInput
            pre="International REIT ETFs"
            unit="% yearly"
            value={iREITETFPerf}
            changeHandler={setIREITETFPerf}
          />
        </Section>
      </TabPane>
      <TabPane key="alt" tab="Alternative">
        <Section title="Average long-time performance of alternative assets">
          <NumberInput
            pre="Gold"
            unit="% yearly"
            value={goldPerf}
            changeHandler={setGoldPerf}
          />
          <NumberInput
            pre="Gold bonds"
            unit="% yearly"
            value={goldBondsPerf}
            changeHandler={setGoldBondsPerf}
          />
          <NumberInput
            pre="Peer-to-peer lending"
            unit="% yearly"
            value={p2pPerf}
            changeHandler={setP2PPerf}
          />
          <NumberInput
            pre="Crypto"
            unit="% yearly"
            value={cryptoPerf}
            changeHandler={setCryptoPerf}
          />
          <NumberInput
            pre="Unique collections"
            unit="% yearly"
            post="eg: Paintings, Watches, Statues, etc"
            value={uniqueCollectionPerf}
            changeHandler={setUniqueCollectionPerf}
          />
        </Section>
      </TabPane>
    </Tabs>
  );
}
