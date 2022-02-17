import { Empty, Skeleton, Table } from "antd";
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
import { doesHoldingMatch, isFund, isBond } from "./nwutils";

export default function InstrumentValuation() {
  const {
    instruments,
    setInstruments,
    selectedCurrency,
    childTab,
    selectedMembers,
    loadingInstruments,
    selectedTags,
  }: any = useContext(NWContext);
  const [filteredInstruments, setFilteredInstruments] = useState<
    Array<InstrumentInput>
  >([...instruments]);
  const [filterByTag, setFilterByTag] = useState<Array<InstrumentInput>>([]);
  const [nameFilterValues, setNameFilterValues] = useState<Array<Object>>([{}]);
  const [filteredInfo, setFilteredInfo] = useState<any | null>({});
  const [totalFilterAmt, setTotalFilterAmt] = useState<number>(0);
  const { MF, STOCK, BOND, OIT, GOLDB } = TAB;

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
            key={`id-${record.id}`}
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
        instrument.qty *
        (cachedData && cachedData[id] ? cachedData[id].price : 0);
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
          text: insData && insData[id] ? insData[id].name : id,
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
  }, [selectedTags]);

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
        if (!cachedData) return;
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
        if (!cachedData) return;
        const data = cachedData[id];
        if (childTab === MF && data && selectedTags.length) {
          const { CB, GBO, I, HB, GB, L } = AssetSubType;
          const { subt, mftype, type, mcap } = data;
          return (
            selectedTags.includes(type) ||
            (type === AssetType.E &&
              (selectedTags.includes(mcap) ||
                (selectedTags.includes("HC") && mcap === MCap.H) ||
                (selectedTags.includes(MCap.S) &&
                  (mcap === MCap.S || !mcap)))) ||
            (type === AssetType.F &&
              ((selectedTags.includes("CB") &&
                (subt === CB || mftype === MFSchemeType.O)) ||
                (selectedTags.includes("I") && subt === I) ||
                (selectedTags.includes("GovB") &&
                  (subt === GB || subt === GBO)) ||
                (selectedTags.includes("IF") &&
                  subt === HB &&
                  mftype === MFSchemeType.I) ||
                (selectedTags.includes("FMP") &&
                  subt === HB &&
                  mftype === MFSchemeType.C) ||
                (selectedTags.includes("LF") && subt === L)))
          );
        }
        if (childTab === STOCK && data && selectedTags.length) {
          return selectedTags.includes(data.mcapt);
        } else if (childTab === BOND && data && selectedTags.length) {
          const { subt } = data;
          const { GB, GBO } = AssetSubType;
          return (
            (selectedTags.includes(GB) && (subt === GB || subt === GBO)) ||
            selectedTags.includes(subt)
          );
        }
      }
    );
    setFilterByTag([...filterDataByTag]);
  };

  return !loadingInstruments ? (
    instruments.length ? (
      filteredInstruments.length ? (
        <Table
          dataSource={selectedTags.length ? filterByTag : filteredInstruments}
          //@ts-ignore
          columns={columns}
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
