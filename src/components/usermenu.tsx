import React from "react";
import SVGPiggy from "./svgpiggy";
import SVGMoneyBag from "./calc/svgmoneybag";
import SVGPlan from "./svgplan";
import SVGInvest from "./svginvest";
import { ROUTES } from "../CONSTANTS";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserMenu() {
  const GET = "GET";
  const SET = "SET";
  const SAVE = "SAVE";
  const INVEST = "INVEST";
  const router = useRouter();
  const tabs = [
    { label: GET, active: true, svg: SVGMoneyBag, link: ROUTES.GET },
    { label: SET, active: true, svg: SVGPlan, link: ROUTES.SET },
    { label: SAVE, active: true, svg: SVGPiggy, link: ROUTES.SAVE },
    {
      label: INVEST,
      order: 4,
      active: true,
      svg: SVGInvest,
      link: ROUTES.INVEST,
    },
  ];

  return (
    <div className="mt-12 pt-2 bg-gray-600 flex justify-center text-white text-base font-bold">
      {tabs.map((t: any) => (
        <Link href={t.link}>
          <a>
            <div
              className={`mr-4 md:mr-12 lg:mr-16 xl:mr-24 mt-1 flex flex-col items-center ${
                router.pathname === t.link
                  ? "text-green-primary"
                  : "hover:text-green-primary"
              }`}
            >
              <t.svg selected={router.pathname === t.link} />
              {t.label}
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
