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
	totalOperatingExpenses: {
		particulars: labelWithTooltip(
			"Total Expenditure",
			"It includes companys core cost from operating and non-operating activities."
		),
	},
	operatingIncome: {
		particulars: labelWithTooltip(
			"Operating Profit",
			"The amount of profit earned from the core-operations, excluding any financing or tax-related expenses."
		),
	},
	interestExpense: {
		particulars: labelWithTooltip(
			"Interest",
			"It is the expense incurred by an entity for borrowed funds."
		),
	},
	incomeBeforeTax: {
		particulars: labelWithTooltip(
			"Profit Before Tax",
			"It is the total profit after accounting for operating and non-operating expenses but before paying corporate tax."
		),
	},
	taxProvision: {
		particulars: labelWithTooltip(
			"Tax",
			"The amount of income taxes paid or payable on the net earnings of the business."
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
