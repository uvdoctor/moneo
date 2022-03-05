import React, { useContext, useEffect, useState } from "react";
import { Button, Dropdown, Menu, Spin, Tag } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { NWContext, TAB } from "../NWContext";
import { initializeFundata } from "../nwutils";

interface FilterProps {
  options: any;
}

export default function Filter({ options }: FilterProps) {
  const {
    childTab,
    selectedTags,
    setSelectedTags,
    instruments,
    setIndustryAndSector,
  }: any = useContext(NWContext);
  const { SubMenu } = Menu;
  const [loadingIndustry, setLoadingIndustry] = useState<boolean>(false);

  const onClose = (item: string) => {
    setSelectedTags([...selectedTags.filter((tag: string) => tag !== item)]);
  };

  const handleClick = (e: any) => {
    const [subKey] = e.keyPath;
    const tags = selectedTags;
    tags.includes(subKey)
      ? tags.splice(tags.indexOf(subKey), 1)
      : tags.push(subKey);
    setSelectedTags([...tags]);
  };

  const updateIndustryAndSector = async () => {
    let industry: { [key: string]: string } = {};
    let sector: { [key: string]: string } = {};
    const fundata = await initializeFundata(instruments);
    for (let ins of instruments) {
      let data = fundata[ins.sid as string];
      if (data) {
        industry[data.ind] = data.ind;
        sector[data.sector] = data.sector;
      }
    }
    const industryAndSector = { industry: industry, sector: sector };
    setIndustryAndSector(industryAndSector);
    setLoadingIndustry(false);
  };

  const onButtonClick = () => {
    if (childTab === TAB.STOCK && instruments.length) setLoadingIndustry(true);
    else setLoadingIndustry(false);
  };

  const getTagLabel = (key: string) => {
    const tagOptions: any = {};
    if (!options) return "";
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
      {options &&
        Object.keys(options.main).length &&
        Object.keys(options.main).map((key) => {
          if (
            (options.sub && Object.keys(options.sub[key]).length) ||
            key === "industry" ||
            key === "sector"
          ) {
            return (
              <SubMenu key={key} title={options.main[key]}>
                {((key === "industry" || key === "sector") && loadingIndustry) ? (
                  <Menu.Item key={`${key}-load`}>
                    <Spin tip="Loading" />
                  </Menu.Item>
                ) : (
                  Object.keys(options.sub[key]).map((subkey) => {
                    return (
                      <Menu.Item key={subkey}>
                        {options.sub[key][subkey]}
                      </Menu.Item>
                    );
                  })
                )}
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

  useEffect(() => {
    if (childTab === TAB.STOCK && instruments.length && loadingIndustry) {
      updateIndustryAndSector().then(() => {
        setLoadingIndustry(false);
      });
    }
  }, [loadingIndustry]);

  return (
    <>
      {selectedTags.length
        ? selectedTags.map((item: string) => {
            return (
              <Tag
                closable
                onClose={() => onClose(item)}
                key={item}
                color="blue"
              >
                {getTagLabel(item)}
              </Tag>
            );
          })
        : null}
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button type="link" onClick={() => onButtonClick()}>
          Filters
          <DownOutlined />
        </Button>
      </Dropdown>
    </>
  );
}
