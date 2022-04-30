import { Button } from "antd";
// import { ROUTES } from "../../CONSTANTS";
import Link from "next/link";
import RollingImages from "../RollingImages";

export default function GetStartedButton() {
  return (
    // <Button
    //   icon={<RollingImages />}
    //   type="primary"
    //   size="large"
    //   className="start-steps-btn"
    //   href={ROUTES.OVERVIEW}>
    //   Get. Set. Grow
    // </Button>
    <Link href="#">
			<Button
				icon={<RollingImages />}
				type="primary"
				size="large"
				className="start-steps-btn"
			>
				Get. Set. Grow
			</Button>
		</Link>
  );
}
