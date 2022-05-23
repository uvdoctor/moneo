import React, { useState } from "react";
import Search from "./Search";
import { TAB } from "./nw/NWContext";
import { useRouter } from "next/router";
import { ROUTES } from "../CONSTANTS";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";

export default function SearchInput() {
  const fsb = useFullScreenBrowser();
  const router = useRouter();
  const [searchType, setSearchType] = useState(TAB.STOCK);
  const [exchg, setExchg] = useState<string>("INDIA");

  return (
    <Search
      isNav
      searchType={searchType}
      setSearchType={setSearchType} 
      width={isMobileDevice(fsb) ? '300px' : "400px"}    
      onClick={(item: any)=>{
        router.push(`${ROUTES.LOOKUP}/${item.sid}.${item.exchg}`);
      }} 
      exchg={exchg}
      setExchg={setExchg}
    />
  );
}
