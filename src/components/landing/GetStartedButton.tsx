import { Button } from "antd";
import { ROUTES } from "../../CONSTANTS";
import RollingImages from "../RollingImages";

export default function GetStartedButton() {
  return (
    <Button
      icon={<RollingImages />}
      type="primary"
      size="large"
      className="start-steps-btn"
      href={ROUTES.OVERVIEW}>
      Get. Set. Grow
    </Button>
  );
}
