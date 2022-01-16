import {
  Alert,
  Button,
  Col,
  Modal,
  Row,
  Select,
  Tooltip,
  notification,
} from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { NWContext } from "./NWContext";
import {
  UserAddOutlined,
  EditOutlined,
  SaveOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { COLORS } from "../../CONSTANTS";
import TextInput from "../form/textinput";
import { addFamilyMember, updateFamilyMember } from "./nwutils";
import {
  CreateFamilyInput,
  TaxLiability,
  UpdateFamilyInput,
} from "../../api/goals";
import SelectInput from "../form/selectinput";
import { getTaxLiabilityOptions } from "../utils";

export const ALL_FAMILY = "All";

const ADD_MODE = "Add";
const EDIT_MODE = "Edit";

export default function FamilyInput() {
  const {
    allFamily,
    familyMemberKeys,
    setFamilyMemberKeys,
    selectedMembers,
    setSelectedMembers,
  }: any = useContext(NWContext);
  const { Option } = Select;
  const [mode, setMode] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [taxId, setTaxId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [taxLiability, setTaxLiability] = useState<TaxLiability>(
    TaxLiability.M
  );

  const selectMember = (val: string[]) => {
    if (!val.length) return setSelectedMembers([...[ALL_FAMILY]]);
    if (val.length === 1 && val[0] && !selectedMembers.length)
      return setSelectedMembers([...val]);
    let filteredOpts = val.filter((key: string) => key && key !== ALL_FAMILY);
    setSelectedMembers([...filteredOpts]);
  };

  const resetState = () => {
    setId("");
    setName("");
    setTaxId("");
    setTaxLiability(TaxLiability.M);
  };

  const getFamilyMemberOptions = () => {
    let opts: any = {};
    familyMemberKeys.forEach(
      (key: string) => (opts[key] = allFamily[key].name)
    );
    return opts;
  };

  useEffect(() => {
    if (!mode || mode !== EDIT_MODE) return resetState();
    setId(Object.keys(allFamily)[0]);
  }, [mode]);

  useEffect(() => {
    if (!id) return resetState();
    setName(allFamily[id].name);
    setTaxId(allFamily[id].taxId);
    setTaxLiability(allFamily[id].tax);
  }, [id]);

  const addMember = async () => {
    let member: CreateFamilyInput | null = null;
    try {
      member = await addFamilyMember(name, taxId, taxLiability);
      if (!member) return;
      allFamily[member.id as string] = {
        name: member.name,
        taxId: member.tid,
        tax: member.tax,
      };
      setMode("");
      setSelectedMembers([...[member.id]]);
      familyMemberKeys.push(member.id as string);
      setFamilyMemberKeys([...familyMemberKeys]);
      notification.success({
        message: "New Family Member Added",
        description: `Success! ${name} has been added to your family list.`,
      });
      return true;
    } catch (err) {
      notification.error({
        message: "Family Member not added",
        description: "Sorry! Unable to add this family member: " + err,
      });
      return false;
    }
  };

  const changeMember = async () => {
    let member: UpdateFamilyInput | null = null;
    try {
      member = await updateFamilyMember({
        id: id,
        name: name,
        tid: taxId,
        tax: taxLiability,
      });
      if (!member) return;
      allFamily[id] = { name: member.name, taxId: member.tid, tax: member.tax };
      setMode("");
      notification.success({
        message: "Family Member Updated",
        description: `Success! Family member details have been updated.`,
      });
      return true;
    } catch (err) {
      notification.error({
        message: "Family Member not updated",
        description: "Sorry! Unable to update this family member: " + err,
      });
      return false;
    }
  };

  return (
    <Fragment>
      {familyMemberKeys.length ? (
        <Row align="middle">
          <Col>
            {familyMemberKeys.length > 1 ? (
              <Select
                showSearch
                mode="multiple"
                value={selectedMembers}
                onChange={(val: string[]) => selectMember(val)}
                showArrow={familyMemberKeys.length > 1}
                filterOption={(input, option) =>
                  // @ts-ignore
                  option?.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="middle"
                maxTagCount={1}>
                {familyMemberKeys.length > 1 &&
                  familyMemberKeys.map((key: string) => (
                    <Option key={key} value={key}>
                      {allFamily[key] && allFamily[key].name}
                    </Option>
                  ))}
                <Option key={ALL_FAMILY} value={ALL_FAMILY} disabled>
                  All Members
                </Option>
              </Select>
            ) : (
              <label>
                {familyMemberKeys.length && allFamily
                  ? allFamily[familyMemberKeys[0]].name
                  : ""}
              </label>
            )}
          </Col>
          <Col>
            <Tooltip title="Add Family Member">
              <Button
                type="link"
                style={{ color: COLORS.WHITE }}
                icon={<UserAddOutlined />}
                onClick={() => setMode(ADD_MODE)}
              />
            </Tooltip>
          </Col>
          {familyMemberKeys.length ? (
            <Col>
              <Tooltip title="Edit Family Member">
                <Button
                  type="link"
                  style={{ color: COLORS.WHITE }}
                  icon={<EditOutlined />}
                  onClick={() => setMode(EDIT_MODE)}
                />
              </Tooltip>
            </Col>
          ) : null}
        </Row>
      ) : null}
      {mode && (
        <Modal
          title={`${mode} Family Member`}
          visible={mode.length > 0}
          onCancel={() => setMode("")}
          onOk={() => (mode === ADD_MODE ? addMember() : changeMember())}
          okText={"Save"}
          okButtonProps={{
            icon: <SaveOutlined />,
            disabled: !name || !taxId || error ? true : false,
          }}>
          <Row gutter={[32, 16]} align="bottom" justify="space-between">
            {error && (
              <Col>
                <Alert type="error" message={error} />
              </Col>
            )}
            {familyMemberKeys.length > 1 && id && (
              <Col>
                <SelectInput
                  pre="Family Member"
                  value={id}
                  changeHandler={setId}
                  options={getFamilyMemberOptions()}
                />
              </Col>
            )}
            <Col>
              <TextInput
                pre={<UserOutlined />}
                placeholder="Member Name"
                value={name}
                changeHandler={setName}
                minLength={3}
                setError={setError}
                fieldName="Member name"
                size="middle"
              />
            </Col>
            <Col>
              <SelectInput
                info="How much do you earn in a year?"
                pre="Yearly Income"
                value={taxLiability}
                changeHandler={setTaxLiability}
                options={getTaxLiabilityOptions()}
              />
            </Col>
            <Col>
              <TextInput
                pre="PAN"
                placeholder="XXXXX1234X"
                value={taxId}
                changeHandler={setTaxId}
                minLength={10}
                setError={setError}
                pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                fieldName="PAN number"
                size="middle"
              />
            </Col>
          </Row>
        </Modal>
      )}
    </Fragment>
  );
}
