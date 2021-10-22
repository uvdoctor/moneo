import { Button } from "antd";
import Link from "next/link";
import RollingImages from "../RollingImages";

export default function GetStartedButton() {
	return (
		<Link href="#">
			<Button
				icon={<RollingImages />}
				type="primary"
				size="large"
				className="start-steps-btn"
				//@ts-ignore
				onClick={methodDoesNotExist}
			>
				Get. Set. Grow
			</Button>
		</Link>
	);
}
