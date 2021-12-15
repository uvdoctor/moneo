import { Button, Col, Row } from "antd";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { HoldingInput } from "../../api/goals";
import SelectInput from "../form/selectinput";
import { NWContext } from "./NWContext";
import { doesHoldingMatch, getFamilyOptions } from "./nwutils";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";

require("./ListHoldings.less");

interface ListHoldingsProps {
	data: Array<HoldingInput>;
	changeData: Function;
	categoryOptions: any;
	viewComp: any;
	subCategoryOptions?: any;
}

export default function ListHoldings({
	data,
	changeData,
	categoryOptions,
	viewComp,
	subCategoryOptions,
}: ListHoldingsProps) {
	const { allFamily, selectedMembers , selectedCurrency }: any = useContext(NWContext);
	const [ dataToRender, setDataToRender ] = useState<Array<HoldingInput>>([]);

	const changeOwner = (ownerKey: string, i: number) => {
		data[i].fId = ownerKey;
		changeData([...data]);
	};

	const removeHolding = (i: number) => {
		data.splice(i, 1);
		changeData([...data]);
	};

	useEffect(() => {
		setDataToRender([...data.filter((data: any) => data && doesHoldingMatch(data, selectedMembers, selectedCurrency))]);
	}, [selectedCurrency, selectedMembers, data])

	return (
		<Row
			className="list-holdings"
			gutter={[
				{ xs: 10, sm: 10, md: 10 },
				{ xs: 10, sm: 10, md: 10 },
			]}
		>
			{dataToRender &&
				dataToRender[0] &&
				dataToRender.map((holding: HoldingInput, i: number) => (
					<Fragment key={"" + i}>
						<Col span={24} className="fields-divider" />
						{React.createElement(viewComp, {
							record: holding,
							data: data,
							changeData: changeData,
							categoryOptions: categoryOptions,
							subCategoryOptions: subCategoryOptions,
						})}
						<Col xs={24} sm={12} md={8} lg={6} xl={6} xxl={3}>
							<SelectInput
								pre={<UserOutlined />}
								value={holding.fId ? holding.fId : ""}
								options={getFamilyOptions(allFamily)}
								changeHandler={(key: string) => changeOwner(key, i)}
								post={
									<Button type="link" onClick={() => removeHolding(i)} danger>
										<DeleteOutlined />
									</Button>
								}
							/>
						</Col>
					</Fragment>
				))}
		</Row>
	);
}
