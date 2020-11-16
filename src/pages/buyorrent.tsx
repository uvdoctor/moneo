import React, { Fragment } from "react";
import { Image, Row, Col } from "antd";
import { GoalType } from "../api/goals";
import Layout from "../components/calc/Layout";
import { CALC_NAMES } from "../CONSTANTS";

export default function BuyOrRent() {
	return (
		<Layout
			title={CALC_NAMES.BR}
			type={GoalType.B}
			assumptions={[
				<Fragment>
					<h3>All your money in one place</h3>
					<p>
						We bring together all of your accounts, bills and more, so you can
						conveniently manage your finances from one dashboard.
					</p>
					<ul>
						<li>See all of your bills and money at a glance</li>
						<li>Create budgets easily with tips tailored to you</li>
						<li>
							Enjoy access to unlimited free credit scores, without harming your
							credit
						</li>
					</ul>

					<h3>Effortlessly stay on top of bills</h3>
					<p>
						Bills are now easier than ever to track. Simply add them to your
						dashboard to see and monitor them all at once.
					</p>
					<ul>
						<li>Never miss a payment with alerts when bills are due</li>
						<li>Receive reminders for upcoming bills so you can plan ahead</li>
						<li>Get warned when funds are low so you know what you can pay</li>
					</ul>
				</Fragment>,
			]}
			features={[
				<Row className="key-features">
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Amortization</h4>
						<p>
							We bring all of your money to one place, from balances and bills
							to credit score and more.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Simple savings</h4>
						<p>
							Easily create budgets, and see our suggestions based on your
							spending.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Home affordability</h4>
						<p>
							Check your free credit score as many times as you like, and get
							tips to help improve it.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Cost-of-living</h4>
						<p>
							We bring all of your money to one place, from balances and bills
							to credit score and more.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>CD calculator</h4>
						<p>
							Easily create budgets, and see our suggestions based on your
							spending.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Credit card payoff</h4>
						<p>
							Check your free credit score as many times as you like, and get
							tips to help improve it.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Minimum card payment</h4>
						<p>
							We bring all of your money to one place, from balances and bills
							to credit score and more.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Balance transfer</h4>
						<p>
							Easily create budgets, and see our suggestions based on your
							spending.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Start saving</h4>
						<p>
							Check your free credit score as many times as you like, and get
							tips to help improve it.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Start investing</h4>
						<p>
							We bring all of your money to one place, from balances and bills
							to credit score and more.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Purchase a home</h4>
						<p>
							Easily create budgets, and see our suggestions based on your
							spending.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Refinance a home</h4>
						<p>
							Check your free credit score as many times as you like, and get
							tips to help improve it.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Save for retirement</h4>
						<p>
							We bring all of your money to one place, from balances and bills
							to credit score and more.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Get life insurance</h4>
						<p>
							Easily create budgets, and see our suggestions based on your
							spending.
						</p>
					</Col>
					<Col xs={24} sm={12} md={8} lg={6} xl={4}>
						<h4>Find car insurance</h4>
						<p>
							Check your free credit score as many times as you like, and get
							tips to help improve it.
						</p>
					</Col>
				</Row>,
			]}
			resultImg=""
			results={[
				<Fragment>
					<h3>What is Lorem Ipsum?</h3>
					<Row gutter={[20, 20]}>
						<Col md={4}>
							<Image
								src="/images/step1.png"
								fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
							/>
						</Col>
						<Col md={20}>
							<p>
								Lorem Ipsum is simply dummy text of the printing and typesetting
								industry. Lorem Ipsum has been the industry's standard dummy
								text ever since the 1500s, when an unknown printer took a galley
								of type and scrambled it to make a type specimen book. It has
								survived not only five centuries, but also the leap into
								electronic typesetting, remaining essentially unchanged. It was
								popularised in the 1960s with the release of Letraset sheets
								containing Lorem Ipsum passages, and more recently with desktop
								publishing software like Aldus PageMaker including versions of
								Lorem Ipsum.
							</p>
						</Col>
						<Col md={24}>
							<ul>
								<li>Option that costs lesser</li>
								<li>Time till which the Option costs lesser</li>
								<li>Yearly Cash Flows for Buying</li>
								<li>Yearly Interest &amp; Principal if Bought via Loan</li>
							</ul>
						</Col>
					</Row>
				</Fragment>,
			]}
		/>
	);
}
