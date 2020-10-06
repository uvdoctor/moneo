import React from "react";
//import Landing from "../components/landing/Landing";
import DDPage from "../components/ddpage";

import { Layout, Menu, Button, Tabs } from "antd";

function callback(key) {
  console.log(key);
}

export default function Home() {
  const { Header, Footer, Content } = Layout;
  const { SubMenu } = Menu;
  const { TabPane } = Tabs;

  return (
    <DDPage title="DollarDarwin">
      <Layout>
        <Header>
          <div className="logo" />
          <Menu mode="horizontal">
            <Menu.Item key="mail">Navigation One</Menu.Item>
            <Menu.Item key="app" disabled>
              Navigation Two
            </Menu.Item>
            <SubMenu key="SubMenu" title="Navigation Three - Submenu">
              <Menu.ItemGroup title="Item 1">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
              </Menu.ItemGroup>
              <Menu.ItemGroup title="Item 2">
                <Menu.Item key="setting:3">Option 3</Menu.Item>
                <Menu.Item key="setting:4">Option 4</Menu.Item>
              </Menu.ItemGroup>
            </SubMenu>
            <Menu.Item key="alipay">
              <a
                href="https://ant.design"
                target="_blank"
                rel="noopener noreferrer"
              >
                Navigation Four - Link
              </a>
            </Menu.Item>
          </Menu>
        </Header>
        <Content>
          <Button type="primary">Primary Button</Button>
          <Button>Default Button</Button>
          <Button type="dashed">Dashed Button</Button>
          <br />
          <Button type="text">Text Button</Button>
          <Button type="link">Link Button</Button>

          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Tab 1" key="1">
              Content of Tab Pane 1
            </TabPane>
            <TabPane tab="Tab 2" key="2">
              Content of Tab Pane 2
            </TabPane>
            <TabPane tab="Tab 3" key="3">
              Content of Tab Pane 3
            </TabPane>
          </Tabs>
        </Content>
        <Footer>Footer</Footer>
      </Layout>

      {/*<Landing />*/}
    </DDPage>
  );
}

/*export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      isProduction: process.env.NODE_ENV === "production",
    },
  };
}*/
