import React from "react";
import { Button, Col, Dropdown, Menu, Row, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";

interface FilterProps {
  selectedKeys: Array<string>;
  setSelectedKeys: Function;
  options: any;
}

export default function Filter({
  selectedKeys,
  setSelectedKeys,
  options,
}: FilterProps) {
  const { SubMenu } = Menu;

  const onClose = (item: string) => {
    selectedKeys.splice(selectedKeys.indexOf(item), 1);
    setSelectedKeys([...selectedKeys]);
  };

  const handleClick = (e: any) => {
    const [subKey, main] = e.keyPath;
    const mainKey = main && !selectedKeys.includes(main) ? main : "";
    mainKey && setSelectedKeys([...selectedKeys, mainKey, subKey]);
    selectedKeys.includes(subKey)
      ? selectedKeys.splice(selectedKeys.indexOf(subKey), 1)
      : selectedKeys.push(subKey);
    setSelectedKeys([...selectedKeys]);
  };

  const getTagLabel = (key: string) => {
    const tagOptions: any = {};
    Object.keys(options.main).map((key) => {
      if (options.sub) {
        Object.keys(options.sub[key]).map(
          (subkey) => (tagOptions[subkey] = options.sub[key][subkey])
        );
      }
      tagOptions[key] = options.main[key];
    });
    console.log(tagOptions);

    return tagOptions[key];
  };

  const menu = (
    <Menu multiple onClick={handleClick} selectedKeys={selectedKeys}>
      {Object.keys(options.main).map((key) => {
        if (options.sub) {
          return (
            <SubMenu key={key} title={options.main[key]}>
              {Object.keys(options.sub[key]).map((subkey) => (
                <Menu.Item key={subkey}>{options.sub[key][subkey]}</Menu.Item>
              ))}
            </SubMenu>
          );
        } else {
          return <Menu.Item key={key}>{options.main[key]}</Menu.Item>;
        }
      })}
    </Menu>
  );

  return (
    <Row justify="space-between" align="middle">
      <Col>
        {selectedKeys.map((item: string, ind: number) => (
          <Tag
            closable
            onClose={() => onClose(item)}
            key={`tag-${ind}`}
            color="blue"
          >
            {getTagLabel(item)}
          </Tag>
        ))}
      </Col>
      <Col>
        <Dropdown overlay={menu}>
          <Button type="primary">
            Filters
            <DownOutlined />
          </Button>
        </Dropdown>
      </Col>
    </Row>
  );
}
