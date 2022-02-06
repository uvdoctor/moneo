import React, { Fragment, useContext, useEffect, useState } from "react";
import { Badge, Col, Empty, Row, Skeleton, Tabs, Tooltip } from "antd";
import { TAB, NWContext, LIABILITIES_TAB, LIABILITIES_VIEW } from "./NWContext";
import AddHoldings from "./addHoldings/AddHoldings";
import UploadHoldings from "./UploadHoldings";
import { toHumanFriendlyCurrency, toReadableNumber } from "../utils";
import ListHoldings from "./ListHoldings";
import { COLORS } from "../../CONSTANTS";
import ListProperties from "./ListProperties";
import InfoCircleOutlined from "@ant-design/icons/lib/icons/InfoCircleOutlined";
import TabInfo from "./TabInfo";
import CurrentAAChart from "./CurrentAAChart";
import { getCascaderOptions, getNPSFundManagers, hasRate } from "./nwutils";
import RiskAllocationChart from "./RiskAllocationChart";

interface HoldingTabViewProps {
  liabilities?: boolean;
}

export default function HoldingTabView({ liabilities }: HoldingTabViewProps) {
  const {
    tabs,
    activeTab,
    setActiveTab,
    loadingHoldings,
    selectedCurrency,
    childTab,
    setChildTab,
    npsData,
    loadNPSSubCategories,
    setIsDirty,
    totalAssets,
    totalLiabilities,
    view,
    npsSubcategory,
  }: any = useContext(NWContext);

  const { TabPane } = Tabs;
  const RISK_CHART = "Risk";
  const ASSET_CHART = "Asset";
  const [chartType, setChartType] = useState<string>(RISK_CHART);

  useEffect(() => {
    setActiveTab(
      view === LIABILITIES_VIEW
        ? LIABILITIES_TAB
        : !totalAssets
        ? "Cash"
        : TAB.SUMMARY
    );
  }, [view]);

  useEffect(() => {
    if (childTab === TAB.NPS && !npsData.length) {
      (async () => await loadNPSSubCategories())();
    }
  }, [childTab]);

  useEffect(() => {
    if (activeTab === LIABILITIES_TAB) {
      setChildTab(TAB.LOAN);
      return;
    }
    const children = tabs[activeTab]?.children;
    setChildTab(children ? Object.keys(children)[0] : "");
  }, [activeTab]);

  useEffect(() => {
    setIsDirty(false);
  }, []);

  function renderTabs(
    tabsData: any,
    defaultActiveKey: string,
    isRoot?: boolean
  ) {
    return (
      <Tabs
        defaultActiveKey={defaultActiveKey}
        activeKey={isRoot ? activeTab : childTab ? childTab : defaultActiveKey}
        type={isRoot || liabilities ? "card" : "line"}
        onChange={(activeKey) => {
          if (isRoot) {
            setActiveTab(activeKey);
          } else {
            setChildTab(activeKey);
          }
        }}
        tabBarExtraContent={
          !isRoot && activeTab === "Financial" ? <UploadHoldings /> : null
        }>
        {isRoot && !liabilities && (
          <TabPane disabled={!totalAssets} key={TAB.SUMMARY} tab={TAB.SUMMARY}>
            <Tabs
              activeKey={chartType}
              type="line"
              onChange={(activeKey) => setChartType(activeKey)}>
              <TabPane key={RISK_CHART} tab={RISK_CHART}>
                <RiskAllocationChart />
              </TabPane>
              <TabPane key={ASSET_CHART} tab={ASSET_CHART}>
                <CurrentAAChart />
              </TabPane>
            </Tabs>
          </TabPane>
        )}
        {Object.keys(tabsData).map((tabName) => {
          if (!liabilities && tabName === LIABILITIES_TAB) return;
          const { label, children, info, link, total } = tabsData[tabName];
          const allTotal =
            activeTab === LIABILITIES_TAB ? totalLiabilities : totalAssets;
          const allocationPer =
            total && allTotal ? (total * 100) / allTotal : 0;
          return (
            <TabPane
              key={label}
              tab={
                <Fragment>
                  {label}
                  {!children && activeTab === "Financial" && !liabilities && (
                    <Tooltip
                      title={<TabInfo info={info} link={link} />}
                      color={COLORS.DEFAULT}>
                      <InfoCircleOutlined />
                    </Tooltip>
                  )}
                  {allocationPer ? (
                    <>
                      {!info && " "}
                      <Badge
                        count={toReadableNumber(allocationPer, 2) + "%"}
                        offset={[0, -5]}
                        showZero
                      />
                    </>
                  ) : null}
                </Fragment>
              }>
              {children ? (
                renderTabs(children, Object.keys(children)[0])
              ) : (
                <Fragment>
                  <Row justify="space-between">
                    <Col>
                      <h2 style={{ color: COLORS.GREEN }}>
                        &nbsp;&nbsp;
                        {toHumanFriendlyCurrency(
                          tabsData[tabName].total,
                          selectedCurrency
                        )}
                      </h2>
                    </Col>
                    <Col>
                      <AddHoldings
                        data={tabsData[tabName].data}
                        changeData={tabsData[tabName].setData}
                        title={`${tabsData[tabName].label} - Add Record`}
                        categoryOptions={
                          childTab === TAB.NPS
                            ? getCascaderOptions(
                                getNPSFundManagers(),
                                npsSubcategory,
                                false
                              )
                            : tabsData[tabName].categoryOptions
                        }
                        fields={
                          tabsData[tabName].fieldsAndInfo &&
                          tabsData[tabName].fieldsAndInfo.fields
                        }
                        info={
                          tabsData[tabName].fieldsAndInfo &&
                          tabsData[tabName].fieldsAndInfo.info
                        }
                        defaultRate={
                          hasRate(childTab) ? tabsData[tabName].rate : 0
                        }
                      />
                    </Col>
                  </Row>
                  {!loadingHoldings ? (
                    tabsData[tabName].data.length ? (
                      tabsData[tabName].contentComp ? (
                        tabsData[tabName].contentComp
                      ) : tabsData[tabName].label === TAB.PROP ? (
                        <ListProperties
                          data={tabsData[tabName].data}
                          changeData={tabsData[tabName].setData}
                          categoryOptions={tabsData[tabName].categoryOptions}
                          fields={
                            tabsData[tabName].fieldsAndInfo &&
                            tabsData[tabName].fieldsAndInfo.fields
                          }
                          info={
                            tabsData[tabName].fieldsAndInfo &&
                            tabsData[tabName].fieldsAndInfo.info
                          }
                        />
                      ) : (
                        <ListHoldings
                          data={tabsData[tabName].data}
                          changeData={tabsData[tabName].setData}
                          categoryOptions={
                            childTab === TAB.NPS
                              ? getCascaderOptions(
                                  getNPSFundManagers(),
                                  npsSubcategory,
                                  false
                                )
                              : tabsData[tabName].categoryOptions
                          }
                          fields={
                            tabsData[tabName].fieldsAndInfo &&
                            tabsData[tabName].fieldsAndInfo.fields
                          }
                          info={
                            tabsData[tabName].fieldsAndInfo &&
                            tabsData[tabName].fieldsAndInfo.info
                          }
                        />
                      )
                    ) : (
                      <Empty description="No data found." />
                    )
                  ) : (
                    <Skeleton loading />
                  )}
                </Fragment>
              )}
            </TabPane>
          );
        })}
      </Tabs>
    );
  }

  return renderTabs(
    liabilities ? tabs[LIABILITIES_TAB].children : tabs,
    liabilities ? TAB.LOAN : TAB.SUMMARY,
    !liabilities
  );
}
