import { Row, Col, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const labelWithTooltip = (label, tooltipText) => (
	<Row gutter={[10, 0]}>
		<Col>{label}</Col>
		<Col>
			<Tooltip title={tooltipText}>
				<InfoCircleOutlined />
			</Tooltip>
		</Col>
	</Row>
);

export const incomeStatementParticulars = {
	totalRevenue: {
		particulars: labelWithTooltip(
			"Total Revenue",
			"It is the revenue earned by the bank from its core lending activity over a financial year."
		),
	},
	incomeBeforeTax: {
		particulars: labelWithTooltip(
			"Profit Before Tax",
			"It is the total profit after accounting for operating and non-operating expenses but before paying corporate tax."
		),
	},
	netIncome: {
		particulars: labelWithTooltip(
			"Net Profit",
			"It is the final profit left over after subtracting all operating and non operating items from net revenue."
		),
	},
};

export const balanceSheetParticulars = {
	cash: {
		particulars: "Cash",
	},
	inventory: {
		particulars: "Inventory",
	},
};

export const cashFlowParticulars = {
	changeInCash: {
		particulars: "Change In Cash",
	},
	depreciation: {
		particulars: "Depreciation",
	},
};
