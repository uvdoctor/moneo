import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ROUTES } from "../CONSTANTS";
import Calculators from "./calc/calculators";
import ExpandCollapse from "./form/expandcollapse";
import { useFullScreenBrowser } from "react-browser-hooks";
import { isMobileDevice } from "./utils";
interface MenuProps {
  parentStyleDiff?: boolean;
  parentStyleDiffHandler?: Function;
}

export default function Menu({
  parentStyleDiff,
  parentStyleDiffHandler,
}: MenuProps) {
  const fsb = useFullScreenBrowser();
  const getTopMargin = () =>
    fsb.info.screenWidth < isMobileDevice(fsb) ? 33 : 17;
  const [topMargin, setTopMargin] = useState<number>(getTopMargin());

  useEffect(() => {
    setTopMargin(getTopMargin());
  }, [fsb.info.screenWidth]);

  return (
    <div className="w-5/6 md:w-2/3 lg:w-1/2 xl:w-1/3 flex justify-between">
      <div className="w-full flex justify-around">
        <Link href={ROUTES.CALCULATE}>
          <a>
            <div className="hover:text-green-primary w-full">
              <ExpandCollapse
                title="Calculate"
                coverPage={parentStyleDiff}
                animate
                parentStyleDiffHandler={parentStyleDiffHandler}
              >
                <div
                  className="w-full text-default absolute left-0 z-50 bg-white"
                  style={{ marginTop: topMargin + "rem" }}
                >
                  <Calculators insideMenu />
                </div>
              </ExpandCollapse>
            </div>
          </a>
        </Link>
        <div className="hover:text-green-primary">
          <Link href="#">
            <a>Learn</a>
          </Link>
        </div>
        <div className="flex flex-col relative">
          <ExpandCollapse title="About" coverPage={parentStyleDiff}>
            <ul
              className={`mt-32 z-50 ${
                !parentStyleDiff
                  ? "bg-white"
                  : "pt-4 bg-white text-default md:text-silver md:bg-transparent"
              } px-2 md:px-4 absolute shadow-xl`}
            >
              <li className="py-1 hover:text-green-primary">Features</li>
              <li className="py-1 hover:text-green-primary">Price</li>
              <li className="py-1 hover:text-green-primary">Company</li>
            </ul>
          </ExpandCollapse>
        </div>
      </div>
      <div className="hover:text-green-primary mr-2 md:mr-4 lg:mr-8">
        <Link href={ROUTES.DASHBOARD}>
          <a>Login</a>
        </Link>
      </div>
    </div>
  );
}
