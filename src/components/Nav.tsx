import React, {
  createElement,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { Layout, Drawer, Button, Affix } from "antd";
import { useScroll } from "react-browser-hooks";
import { MenuOutlined } from "@ant-design/icons";
import MainMenu from "./MainMenu";
import Logo from "./Logo";

require("./Nav.less");
import { AppContext } from "./AppContext";

interface NavProps {
  onBack?: Function | undefined | null;
  isFixed?: boolean;
  scrollable?: boolean;
  hideMenu?: boolean;
  title?: string;
}

export default function Nav({
  onBack,
  isFixed,
  scrollable,
  hideMenu,
  title,
}: NavProps) {
  const { defaultCurrency, setDefaultCurrency }: any = useContext(AppContext);
  const { top } = useScroll();
  const { Header } = Layout;
  const [showDrawer, setShowDrawer] = useState(false);
  const onShowDrawer = () => setShowDrawer(true);
  const onCloseDrawer = () => setShowDrawer(false);

  useEffect(() => {
    if (defaultCurrency !== "USD") return;
    const host = window.location.hostname;
    if (host.endsWith(".in")) {
      setDefaultCurrency("INR");
    } else if (host.endsWith(".uk")) {
      setDefaultCurrency("GBP");
    }
  }, []);

  return createElement(
    scrollable ? Fragment : Affix,
    //@ts-ignore
    scrollable ? {} : { offsetTop: scrollable ? "" : 0 },
    <Header className={`dd-header ${top > 10 || isFixed ? "fixed-nav" : ""}`}>
      {hideMenu ? (
        <>
          <Logo hideBackArrow />
          <MainMenu hideMenu title={title} />
        </>
      ) : (
        <Fragment>
          <Logo onBack={onBack} />
          <MainMenu />
          <Button type="text" onClick={onShowDrawer}>
            <MenuOutlined />
          </Button>
          <Drawer
            placement="right"
            closable
            onClose={onCloseDrawer}
            visible={showDrawer}
          >
            <MainMenu mode="inline" />
          </Drawer>
        </Fragment>
      )}
    </Header>
  );
}
