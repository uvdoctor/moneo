import { Col, Empty, Row, Skeleton, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NWContext, TAB } from "./NWContext";
import Holding from "./Holding";
import {
  COLORS,
  LOCAL_FUN_DATA_KEY,
  LOCAL_INS_DATA_KEY,
} from "../../CONSTANTS";
import { FilterTwoTone } from "@ant-design/icons";
import {
  AssetSubType,
  AssetType,
  InstrumentInput,
  InsType,
  MCap,
} from "../../api/goals";
import simpleStorage from "simplestorage.js";
import {
  doesHoldingMatch,
  isFund,
  filterRisk,
  filterFixCategory,
  isStock,
  filterYearHighLow,
  filterLosersGainers,
  filterVolumeGL,
} from "./nwutils";
import { AppContext } from "../AppContext";
import InsPrice from "./InsPrice";
import { calculatePrice } from "./valuationutils";
import RadioInput from "../form/RadioInput";
import Purchase from "./Purchase";

export default function InstrumentValuation() {
  const { userInfo }: any = useContext(AppContext);
  const {
    instruments,
    setInstruments,
    selectedCurrency,
    childTab,
    selectedMembers,
    loadingInstruments,
    selectedTags,
  }: any = useContext(NWContext);
  const [filteredInstruments, setFilteredInstruments] = useState<Array<any>>([
    ...instruments,
  ]);
  const [filterByTag, setFilterByTag] = useState<Array<any>>([]);
  const [nameFilterValues, setNameFilterValues] = useState<Array<Object>>([{}]);
  const [filteredInfo, setFilteredInfo] = useState<any | null>({});
  const [totalFilterAmt, setTotalFilterAmt] = useState<number>(0);
  const [totalPrevAmt, setTotalPrevAmt] = useState<number>(0);
  const [view, setView] = useState<string>("Purchase");
  const { MF, STOCK, BOND, OIT, GOLDB } = TAB;

  const delRecord = (id: string) =>
    setInstruments([
      ...instruments.filter((record: InstrumentInput) => record.id !== id),
    ]);

  const columns = [
    {
      title: (
        <>
          Total ~{" "}
          {
            <InsPrice
              price={totalFilterAmt}
              previousPrice={totalPrevAmt}
              currency={selectedCurrency}
              noDecimal
            />
          }
        </>
      ),
      key: childTab,
      filterIcon: (
        <FilterTwoTone
          twoToneColor={filteredInfo?.id ? COLORS.GREEN : COLORS.DEFAULT}
          style={{ fontSize: 20 }}
        />
      ),
      filteredValue: filteredInfo.id || null,
      filters: nameFilterValues,
      onFilter: (values: Array<string>, record: InstrumentInput) =>
        values.indexOf(record.id) > -1,
      render: (record: InstrumentInput) => {
        return (
          <Holding
            key={`id-${record.id}-${record.fId}`}
            holding={record as InstrumentInput}
            onDelete={delRecord}
            onChange={calculateTotal}
          />
        );
      },
    },
  ];

  const handleChange = (_pagination: any, filters: any, _sorters: any) =>
    setFilteredInfo({ id: filters[childTab] });

  const calculateTotal = () => {
    let [total, totalPrev, cachedData] = [
      0,
      0,
      simpleStorage.get(LOCAL_INS_DATA_KEY),
    ];
    if (!cachedData) return;
    const dataToFilter = selectedTags.length
      ? filterByTag
      : filteredInstruments;
    dataToFilter.map((instrument: InstrumentInput) => {
      const id = instrument.id;
      if (!cachedData[id] || !cachedData[id].price) return;
      const price = instrument.qty * cachedData[id].price;
      const prevPrice = instrument.qty * cachedData[id].prev;
      if (filteredInfo.id) {
        if (filteredInfo.id.some((item: string) => item === id)) {
          total += price;
          totalPrev += prevPrice;
        }
      } else {
        total += price;
        totalPrev += prevPrice;
      }
    });
    setTotalFilterAmt(total);
    setTotalPrevAmt(totalPrev);
  };

  useEffect(() => {
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    let filteredNames: Array<{ text: String; value: String }> = [];
    let ids: Set<string> = new Set();
    filteredInstruments.forEach((instrument: InstrumentInput) => {
      const id = instrument.id;
      if (!ids.has(id))
        filteredNames.push({
          text: insData && insData[id] ? insData[id].name : id,
          value: id,
        });
      ids.add(id);
    });
    setNameFilterValues([...filteredNames]);
  }, [filteredInstruments]);

  useEffect(() => {
    calculateTotal();
  }, [
    filteredInstruments,
    filteredInfo,
    instruments,
    selectedTags,
    filterByTag,
  ]);

  useEffect(() => {
    filterInstrumentsByTabs();
  }, [childTab, instruments, selectedMembers, selectedCurrency]);

  useEffect(() => {
    filterInstrumentsByTags();
  }, [selectedTags]);

  const filterInstrumentsByTabs = () => {
    if (!instruments.length) return;
    const { REIT, InvIT, ETF } = InsType;
    let filteredData: Array<any> = instruments.filter(
      (instrument: any, index: number) => {
        instrument.key = index;
        const cachedData = simpleStorage.get(LOCAL_INS_DATA_KEY);
        if (!cachedData) return;
        const id = instrument.id;
        const data = cachedData[id];
        if (
          !data &&
          doesHoldingMatch(instrument, selectedMembers, selectedCurrency)
        ) {
          if (childTab === MF && isFund(id)) return id;
          if (childTab === STOCK && !isFund(id)) return id;
        }
        if (
          data &&
          doesHoldingMatch(instrument, selectedMembers, selectedCurrency)
        ) {
          if (childTab === TAB.REIT) return data.itype === REIT;
          if (childTab === OIT) return data.itype === InvIT;
          if (childTab === TAB.ETF) return data.itype === ETF;
          if (childTab === MF) return isFund(id) && !data.itype;
          if (childTab === GOLDB) return data.subt === AssetSubType.GoldB;
          if (childTab === BOND)
            return (
              data.type === AssetType.F &&
              !isFund(id) &&
              !data.itype &&
              data.subt !== AssetSubType.GoldB
            );
          if (childTab === STOCK) return isStock(data.subt, id);
        }
      }
    );
    setFilteredInstruments([...filteredData]);
  };

  const filterInstrumentsByTags = async () => {
    if (!selectedTags.length) return;
    const { gainers, losers, volGainers, volLosers, yhighList, ylowList } =
      await calculatePrice(filteredInstruments);
    const movers = [...volGainers, ...volLosers];
    const yhighlow = [...yhighList, ...ylowList];
    let filterDataByTag = filteredInstruments.filter(
      (instrument: any, index: number) => {
        instrument.key = index;
        let [id, sid, cachedData] = [
          instrument.id,
          instrument.sid,
          simpleStorage.get(LOCAL_INS_DATA_KEY),
        ];
        if (!cachedData) return;
        const data = cachedData[id];
        if (!data) return;
        if (childTab === MF) {
          const { subt, mftype, type, mcap, risk } = data;
          return (
            selectedTags.includes(type) ||
            (type === AssetType.E &&
              (selectedTags.includes(mcap) ||
                (selectedTags.includes(MCap.Small) && !mcap))) ||
            (type === AssetType.F &&
              filterFixCategory(selectedTags, subt, mftype)) ||
            filterRisk(selectedTags, risk, userInfo?.rp) ||
            filterLosersGainers(selectedTags, id, gainers, losers)
          );
        }
        if (childTab === STOCK) {
          const { mcapt, risk } = data;
          const funData = simpleStorage.get(LOCAL_FUN_DATA_KEY);
          return (
            selectedTags.includes(mcapt) ||
            filterRisk(selectedTags, risk, userInfo?.rp) ||
            (funData &&
              funData[sid as string] &&
              selectedTags.includes(funData[sid as string].ind)) ||
            (funData &&
              funData[sid as string] &&
              selectedTags.includes(funData[sid as string].sector)) ||
            filterYearHighLow(selectedTags, id, yhighlow) ||
            filterLosersGainers(selectedTags, id, gainers, losers) ||
            filterVolumeGL(selectedTags, id, movers)
          );
        } else if (childTab === BOND) {
          const { subt, risk } = data;
          const { GB, GBO } = AssetSubType;
          return (
            (selectedTags.includes(GB) && (subt === GB || subt === GBO)) ||
            selectedTags.includes(subt) ||
            filterRisk(selectedTags, risk, userInfo?.rp) ||
            filterLosersGainers(selectedTags, id, gainers, losers)
          );
        }
      }
    );
    setFilterByTag([...filterDataByTag]);
  };

  const expandedRow = (record: any) => {
    const options = ["Purchase", "Analysis", "Others"];
    return (
      <Row justify="center" gutter={[0, 8]}>
        <RadioInput
          options={options}
          value={view}
          changeHandler={(val: string) => setView(val)}
          size="medium"
        />
        {view === "Purchase" ? (
          <Col xs={24}>
            <Purchase
              onSave={(pur: any) => {
                const index = instruments.findIndex(
                  (item: any) => item.id === record.id
                );
                if (index > -1) {
                  let purchase: any = [];
                  if (pur.length) {
                    pur.map((item: any) => {
                      const { qty, amt, date } = item;
                      const newDate = new Date(date);
                      purchase.push({
                        qty,
                        amt,
                        month: newDate.getMonth() + 1,
                        year: newDate.getFullYear(),
                        day: newDate.getDate(),
                      });
                    });
                  }
                  instruments[index].pur = purchase;
                  setInstruments([...instruments]);
                }
              }}
              pur={record.pur ? record.pur : []}
              qty={Number(record.qty)}
            />
          </Col>
        ) : (
          <></>
        )}
      </Row>
    );
  };

  return !loadingInstruments ? (
    instruments.length ? (
      filteredInstruments.length ? (
        <Table
          dataSource={selectedTags.length ? filterByTag : filteredInstruments}
          //@ts-ignore
          columns={columns}
          expandable={{
            expandedRowRender: (record) => expandedRow(record),
          }}
          size="small"
          bordered
          onChange={handleChange}
        />
      ) : null
    ) : (
      <Empty description={<p>No data found.</p>} />
    )
  ) : (
    <Skeleton active />
  );
}
