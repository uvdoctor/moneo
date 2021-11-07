import React, { Fragment, useState, useContext, useEffect } from "react";
import { Modal, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import AddHoldingInput from "../AddHoldingInput";
import AddHoldingFiancialInput from "../AddHoldingFinancialInput";
import { NWContext } from "../NWContext";

interface AddHoldingsProps {
  data: Array<any>;
  changeData: Function;
  isPrimary: boolean;
  title: string;
  categoryOptions: any;
  subCategoryOptions?: any;
}

export default function AddHoldings({
  data,
  changeData,
  isPrimary,
  title,
  categoryOptions,
  subCategoryOptions,
}: AddHoldingsProps) {
  const [isModalVisible, setModalVisibility] = useState<boolean>(false);
  const [okDisabled, setOkDisabled] = useState<boolean>(true);
  const [newRec, setNewRec] = useState<any>({});
  const { activeTab, setInstruments, instruments }: any = useContext(NWContext);
  const [instrumentsList, setInstrumentsList] = useState<any>([]);

  const close = () => {
    setModalVisibility(false);
  };

  const addHolding = () => {
    if (activeTab === "Financial") {
      setInstruments(instrumentsList);
      setInstrumentsList([])
    } else {
      data.push(newRec);
      changeData([...data]);
    }
    close();
  };

  const updateInstruments = (instrumentsToAdd: []) => {
    setInstrumentsList([...instrumentsToAdd, ...instruments]);
  };

  return (
    <Fragment>
      &nbsp;&nbsp;
      <Button
        type={isPrimary ? "primary" : "default"}
        icon={<PlusOutlined />}
        onClick={() => setModalVisibility(true)}
      >
        {isPrimary ? "Add" : "Add Manually"}
      </Button>
      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={close}
        onOk={() => addHolding()}
        okButtonProps={{ disabled: okDisabled }}
        destroyOnClose
        centered
        width="800px"
      >
        {activeTab === "Financial" ? (
          <AddHoldingFiancialInput
            updateInstruments={updateInstruments}
            disableOk={setOkDisabled}
          />
        ) : (
          <AddHoldingInput
            setInput={setNewRec}
            disableOk={setOkDisabled}
            categoryOptions={categoryOptions}
            subCategoryOptions={subCategoryOptions}
          />
        )}
      </Modal>
    </Fragment>
  );
}
