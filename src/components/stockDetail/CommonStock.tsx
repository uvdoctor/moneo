import { useContext } from "react";
import { Image, Row, Col, Card, Tabs } from "antd";
import StockDetailContext from "./StockDetailContext";
import Results from "./Results";
import GridData from "./GridData";
import Officers from "./Officers";

import {
  incomeStatementParticulars,
  balanceSheetParticulars,
  cashFlowParticulars,
} from "./particulars.config";

export default function CommonStock() {
  const { state }: any = useContext(StockDetailContext);
  const { TabPane } = Tabs;

  return (
    <Tabs defaultActiveKey="1" tabPosition="left">
      <TabPane tab="Chart" key="chart">
        <iframe
          src={`/static/charting/index.html?code=${state.data.General?.Code}`}
          style={{
            width: "100%",
            height: "500px",
            border: "none",
            marginBottom: "15px",
          }}
        ></iframe>
      </TabPane>
      <TabPane tab="Highlights" key="highlights">
        <GridData
          data={{
            Industry: state.data.General.Industry,
            Sector: state.data.General.Sector,
            ...state.data.Highlights,
          }}
        />
      </TabPane>
      <TabPane tab="Valuation" key="valuation">
        <GridData data={state.data.Valuation} />
      </TabPane>
      <TabPane tab="Technicals" key="technicals">
        <GridData data={state.data.Technicals} />
      </TabPane>
      <TabPane tab="Splits & Dividends" key="splitsDividends">
        <GridData data={state.data.SplitsDividends} />
      </TabPane>
      <TabPane tab="Quarterly Result" key="quarterlyResult">
        <Results
          title="Quarterly Result"
          resultsData={state.data.Financials.Income_Statement.quarterly}
          particulars={incomeStatementParticulars}
          chartOptions={{
            bars: ["totalRevenue", "totalOperatingExpenses"],
            lines: ["incomeBeforeTax", "netIncome"],
          }}
        />
      </TabPane>
      <TabPane tab="Profit & Loss" key="profitLoss">
        <Results
          title="Profit & Loss"
          resultsData={state.data.Financials.Income_Statement.yearly}
          particulars={incomeStatementParticulars}
          chartOptions={{
            bars: ["totalRevenue", "totalOperatingExpenses"],
            lines: ["incomeBeforeTax", "netIncome"],
          }}
        />
      </TabPane>
      <TabPane tab="Balance Sheet" key="balanceSheet">
        <Results
          title="Balance Sheet"
          resultsData={state.data.Financials.Balance_Sheet.yearly}
          particulars={balanceSheetParticulars}
          chartOptions={{
            bars: ["cash"],
            lines: ["inventory"],
          }}
        />
      </TabPane>
      <TabPane tab="Cash Flow" key="cashFlow">
        <Results
          title="Cash Flow"
          resultsData={state.data.Financials.Cash_Flow.yearly}
          particulars={cashFlowParticulars}
          chartOptions={{
            bars: ["changeInCash"],
            lines: ["depreciation"],
          }}
        />
      </TabPane>
      <TabPane tab="About" key="about">
        <Card title="About">
          <Row style={{ paddingBottom: "30px" }} gutter={[10, 0]}>
            <Col xs={24} sm={6} lg={4}>
              <Image
                src={`https://eodhistoricaldata.com/${state.data.General.LogoURL}`}
              />
            </Col>
            <Col xs={24} sm={18} lg={20}>
              {state.data.General.Description}
            </Col>
          </Row>
          <GridData
            data={{
              Address: state.data.General.Address,
              CountryISO: state.data.General.CountryISO,
              CurrencyCode: state.data.General.CurrencyCode,
              CurrencyName: state.data.General.CurrencyName,
              CurrencySymbol: state.data.General.CurrencySymbol,
              Exchange: state.data.General.Exchange,
              FullTimeEmployees: state.data.General.FullTimeEmployees,
              IPODate: state.data.General.IPODate,
              ISIN: state.data.General.ISIN,
              Phone: state.data.General.Phone,
              UpdatedAt: state.data.General.UpdatedAt,
              WebURL: state.data.General.WebURL,
            }}
          />
          <Officers />
        </Card>
      </TabPane>
    </Tabs>
  );
}
