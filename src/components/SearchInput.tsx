import React, { useState } from "react";
import Search from "./Search";
import { TAB } from "./nw/NWContext";
import { useRouter } from "next/router";
import { ROUTES } from "../CONSTANTS";

export default function SearchInput() {
  const {STOCK} = TAB;
  const router = useRouter();
  const [searchType, setSearchType] = useState(STOCK);

  return (
    <Search
      isNav
      searchType={searchType}
      setSearchType={setSearchType} width={"250px"}     
      onClick={(item: any)=>{
        router.push(`${ROUTES.LOOKUP}/${item.sid}.${item.exchg}`);
      }} 
    />
  );
}
