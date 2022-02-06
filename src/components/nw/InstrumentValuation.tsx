import { Col, Empty, Row, Skeleton, Table } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { NWContext, TAB } from "./NWContext";
import Holding from "./Holding";
import { toHumanFriendlyCurrency } from "../utils";
import { COLORS, LOCAL_INS_DATA_KEY } from "../../CONSTANTS";
import { FilterTwoTone } from "@ant-design/icons";
import {
  AssetSubType,
  AssetType,
  InstrumentInput,
  InsType,
  MCap,
  MFSchemeType,
} from "../../api/goals";
import simpleStorage from "simplestorage.js";
import {
  doesHoldingMatch,
  getAssetTypes,
  getMarketCap,
  getFixedCategories,
  isFund,
  isBond,
  getCascaderOptions,
} from "./nwutils";
import CascaderMultiple from "../form/CascaderMultiple";

export default function InstrumentValuation() {
  const {
    instruments,
    setInstruments,
    selectedCurrency,
    childTab,
    selectedMembers,
    loadingInstruments,
  }: any = useContext(NWContext);
  const [filteredInstruments, setFilteredInstruments] = useState<
    Array<InstrumentInput>
  >([...instruments]);
  const [filterByTag, setFilterByTag] = useState<Array<InstrumentInput>>([]);
  const [nameFilterValues, setNameFilterValues] = useState<Array<Object>>([{}]);
  const [filteredInfo, setFilteredInfo] = useState<any | null>({});
  const [selectedTags, setSelectedTags] = useState<Array<string>>([]);
  const [selectedSubtTags, setSelectedSubtTags] = useState<Array<string>>([]);
  const [totalFilterAmt, setTotalFilterAmt] = useState<number>(0);
  const { MF, STOCK, BOND, OIT, GOLDB } = TAB;

  const bondTags = { CB: "Corporate Bond", GB: "Government Bond" };
  const tagsData = (childTab: string) => {
    const data: any = {
      Stocks: getCascaderOptions(
        { ind: "Industry", mcap: "Capitalization" },
        {
          ind: { F: "Finance", T: "Technology", B: "Bank" },
          mcap: getMarketCap(),
        },
        false
      ),
      "Mutual Funds": getCascaderOptions(
        getAssetTypes(),
        { E: getMarketCap(), F: getFixedCategories(), H: {}, A: {} },
        false
      ),
      Bonds: getCascaderOptions(bondTags),
    };
    return data[childTab];
  };

  const hasTags = (childTab: string): Boolean =>
    [STOCK, MF, BOND].includes(childTab);
  const delRecord = (id: string) =>
    setInstruments([
      ...instruments.filter((record: InstrumentInput) => record.id !== id),
    ]);

  const columns = [
    {
      title: (
        <strong style={{ color: COLORS.GREEN }}>
          Total ~ {toHumanFriendlyCurrency(totalFilterAmt, selectedCurrency)}
        </strong>
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
            key={record.id}
            holding={record as InstrumentInput}
            onDelete={delRecord}
            onChange={setTotal}
          />
        );
      },
    },
  ];

  const handleChange = (_pagination: any, filters: any, _sorters: any) =>
    setFilteredInfo({ id: filters[childTab] });

  const setTotal = () => {
    let [total, filterAmt, cachedData] = [
      0,
      0,
      simpleStorage.get(LOCAL_INS_DATA_KEY),
    ];
    const dataToFilter = selectedTags.length
      ? filterByTag
      : filteredInstruments;
    dataToFilter.map((instrument: InstrumentInput) => {
      const id = instrument.id;
      const price =
        instrument.qty * (cachedData[id] ? cachedData[id].price : 0);
      if (filteredInfo.id) {
        if (filteredInfo.id.some((item: string) => item === id))
          filterAmt += price;
      }
      total += price;
    });
    filteredInfo.id ? setTotalFilterAmt(filterAmt) : setTotalFilterAmt(total);
  };

  useEffect(() => {
    const insData = simpleStorage.get(LOCAL_INS_DATA_KEY);
    let filteredNames: Array<{ text: String; value: String }> = [];
    let ids: Set<string> = new Set();
    filteredInstruments.forEach((instrument: InstrumentInput) => {
      const id = instrument.id;
      if (!ids.has(id))
        filteredNames.push({
          text: insData[id] ? insData[id].name : id,
          value: id,
        });
      ids.add(id);
    });
    setNameFilterValues([...filteredNames]);
  }, [filteredInstruments]);

  useEffect(() => {
    setTotal();
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
  }, [selectedTags, selectedSubtTags]);

  const filterInstrumentsByTabs = () => {
    if (!instruments.length) return;
    const { E, F } = AssetType;
    const { REIT, InvIT, ETF } = InsType;
    let filteredData: Array<InstrumentInput> = instruments.filter(
      (instrument: InstrumentInput) => {
        let [id, cachedData] = [
          instrument.id,
          simpleStorage.get(LOCAL_INS_DATA_KEY),
        ];
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
              data.type === F &&
              !isFund(id) &&
              !data.itype &&
              data.subt !== AssetSubType.GoldB
            );
          if (childTab === STOCK)
            return data.type === E && !isFund(id) && !isBond(id);
        }
      }
    );
    setFilteredInstruments([...filteredData]);
  };

  const filterInstrumentsByTags = () => {
    if (!selectedTags.length) return;
    let filterDataByTag = filteredInstruments.filter(
      (instrument: InstrumentInput) => {
        let [id, cachedData] = [
          instrument.id,
          simpleStorage.get(LOCAL_INS_DATA_KEY),
        ];
        const data = cachedData[id];
        if (
          childTab === MF &&
          selectedSubtTags.length &&
          selectedTags.indexOf(data.type as string) > -1
        ) {
          const { CB, GBO, I, HB, GB, L } = AssetSubType;
          const { subt, mftype, type, mcap } = data;
          return (
            (selectedSubtTags.includes(MCap.L) && mcap === MCap.L) ||
            (selectedSubtTags.includes("Multi") &&
              (mcap !== MCap.L || !mcap)) ||
            (selectedSubtTags.includes("CB") &&
              (subt === CB || mftype === MFSchemeType.O)) ||
            (selectedSubtTags.includes("I") &&
              type === AssetType.F &&
              subt === I) ||
            (selectedSubtTags.includes("GovB") &&
              (subt === GB || subt === GBO)) ||
            (selectedSubtTags.includes("IF") &&
              subt === HB &&
              mftype === MFSchemeType.I) ||
            (selectedSubtTags.includes("FMP") &&
              subt === HB &&
              mftype === MFSchemeType.C) ||
            (selectedSubtTags.includes("LF") && subt === L)
          );
        }
        if (childTab === STOCK && data && selectedTags.length) {
          return (
            (selectedSubtTags.includes(MCap.L) &&
              data.meta &&
              data.meta.mcap === MCap.L) ||
            (selectedSubtTags.includes("Multi") &&
              ((data.meta && data.meta.mcap !== MCap.L) ||
                !data.meta ||
                !data.meta.mcap)) ||
            (selectedTags.includes("mcap") && selectedSubtTags.length === 0)
          );
        } else if (childTab === BOND && data) {
          const { subt } = data;
          const { GB, CB, GBO } = AssetSubType;
          if (selectedTags.includes(GB)) return subt === GB || subt === GBO;
          if (selectedTags.includes(CB)) return subt === CB;
        }
      }
    );
    setFilterByTag([...filterDataByTag]);
  };

  return !loadingInstruments ? (
    instruments.length ? (
      <Row gutter={[10, 10]}>
        {hasTags(childTab) ? (
          <Col xs={24} sm={24}>
            <Row justify="center" align="middle">
              <Col>
                <FilterTwoTone
                  twoToneColor={
                    selectedTags.length ? COLORS.GREEN : COLORS.DEFAULT
                  }
                  style={{ fontSize: 20 }}
                />
              </Col>
              <Col>
                <CascaderMultiple
                  pre=""
                  options={tagsData(childTab)}
                  parentValue={selectedTags}
                  childValue={selectedSubtTags}
                  parentChangeHandler={(val: any) => setSelectedTags(val)}
                  childChangeHandler={(val: any) => setSelectedSubtTags(val)}
                />
              </Col>
            </Row>
          </Col>
        ) : null}
        <Col span={24}>
          {filteredInstruments.length ? (
            <Table
              dataSource={
                selectedTags.length ? filterByTag : filteredInstruments
              }
              //@ts-ignore
              columns={columns}
              size="small"
              bordered
              onChange={handleChange}
            />
          ) : null}
        </Col>
      </Row>
    ) : (
      <Empty description={<p>No data found.</p>} />
    )
  ) : (
    <Skeleton active />
  );
}
