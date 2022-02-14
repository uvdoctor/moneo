import React, { useContext, useEffect } from "react";
import { Button, Dropdown, Menu, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { NWContext } from "../NWContext";

interface FilterProps {
  options: any;
}

export default function Filter({ options }: FilterProps) {
  const { childTab, selectedTags, setSelectedTags }: any =
    useContext(NWContext);
  const { SubMenu } = Menu;

  const onClose = (item: string) => {
    setSelectedTags([...selectedTags.filter((tag: string) => tag !== item)]);
  };

  const handleClick = (e: any) => {
    const [subKey, main] = e.keyPath;
    const mainKey = main && !selectedTags.includes(main) ? main : "";
    mainKey && setSelectedTags([...selectedTags, mainKey, subKey]);
    selectedTags.includes(subKey)
      ? selectedTags.splice(selectedTags.indexOf(subKey), 1)
      : selectedTags.push(subKey);
    setSelectedTags([...selectedTags]);
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
    return tagOptions[key];
  };

  const menu = (
    <Menu multiple onClick={handleClick} selectedKeys={selectedTags}>
      {Object.keys(options.main).map((key) => {
        if (options.sub && Object.keys(options.sub[key]).length) {
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

  useEffect(() => {
    setSelectedTags([...[]]);
  }, [childTab]);

  return (
    <>
      {selectedTags.length
        ? selectedTags.map((item: string, ind: number) => {
          console.log(selectedTags)
            return <Tag
              closable
              onClose={() => onClose(item)}
              key={`tag-${ind}`}
              color="blue"
            >
              {getTagLabel(item)}
            </Tag>
        })
        : null}
      <Dropdown overlay={menu}>
        <Button type="link">
          Filters
          <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );
}
