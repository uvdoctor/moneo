import React from "react";
import { Row } from "antd";
import { Parallax } from "rc-scroll-anim";
import DDContent from "../DDContent";
import { JoinContextProvider } from "./JoinContext";
import Banner from "./Banner";
import VerifyCodeModal from "./VerifyCodeModal";
import Calculator from "./Calculator";
import HelloFinancialIndep from "./HelloFinancialIndep";
import Step from "./Step";
import GettingStarted from "./GettingStarted";
import Security from "./Security";
import GetRich from "./GetRich";
import TakeQuickStep from "./TakeQuickStep";

import "./Landing.less";

export default function Landing() {
  return (
    <JoinContextProvider>
      <DDContent>
        <Banner />
        <VerifyCodeModal />
        <Calculator />
        <Parallax
          animation={[
            { x: 0, opacity: 1, playScale: [0, 0.6] },
            { y: 0, playScale: [0, 1] },
            { blur: "10px", playScale: [0, 1.5] },
          ]}
          style={{
            transform: "translateX(-100px)",
            filter: "blur(0px)",
            opacity: 0,
            position: "relative",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            margin: "auto",
            width: "100%",
            height: "auto",
          }}
        >
          <HelloFinancialIndep />
          <Row
            className="steps"
            gutter={[
              { xs: 8, sm: 16, md: 24, lg: 32 },
              { xs: 8, sm: 16, md: 24, lg: 32 },
            ]}
          >
            <Step
              className="step1"
              count="01"
              title="Get"
              subTitle="Net Worth"
              content="Link with various accounts to automatically calculate, what you own minus, what you owe."
              imgSrc="images/step1.jpg"
            />
            <Step
              className="step2"
              count="02"
              title="Set"
              subTitle="Goals"
              content="Estimate money required across multiple currencies using in-built templates and calculators."
              imgSrc="images/step2.jpg"
            />
            <Step
              className="step3"
              count="03"
              title="Go"
              subTitle="Make Money Work"
              content="Helps you to not only align savings &amp; investements to goals, but also become more financially savvy via engaging games."
              imgSrc="images/step3.jpg"
            />
            <GettingStarted />
          </Row>
        </Parallax>
      </DDContent>

      <Security />
      <GetRich />
      <TakeQuickStep />
    </JoinContextProvider>
  );
}

// import React, { useEffect, useRef, useState } from "react";
// import { useScroll } from "react-browser-hooks";
// import * as gtag from "../../lib/gtag";
// import DDPage from "../ddpage";
// import TakeQuickStep from "./TakeQuickStep";
// import Security from "./Security";
// import GetRich from "./GetRich";
// import HelloFinancialIndep from "./HelloFinancialIndep";
// import Step from "./Step";
// import GettingStarted from "./GettingStarted";
// import Calculator from "./Calculator";
// import Banner from "./Banner";

// export default function Landing() {
//   const { top } = useScroll();
//   const [scrolledToSec, setScrolledToSec] = useState<boolean>(false);
//   const joinRef: any = useRef();
//   const calculateRef: any = useRef();
//   const featuresRef: any = useRef();
//   const securityRef: any = useRef();

//   useEffect(() => {
//     const opts = {
//       root: null,
//       rootMargin: "0px",
//       threshold: 0,
//     };

//     const featuresCallback = (list: Array<any>) => {
//       list.forEach((entry: any) => {
//         if (entry.isIntersecting) {
//           gtag.event({
//             category: "Home",
//             action: "Scroll",
//             label: "Section",
//             value: "Features",
//           });
//         }
//       });
//     };

//     const secCallback = (list: Array<any>) => {
//       list.forEach((entry: any) => {
//         if (entry.isIntersecting) {
//           setScrolledToSec(true);
//           gtag.event({
//             category: "Home",
//             action: "Scroll",
//             label: "Section",
//             value: "Security",
//           });
//         } else setScrolledToSec(false);
//       });
//     };

//     const featuresScrollObserver = new IntersectionObserver(
//       featuresCallback,
//       opts
//     );
//     featuresScrollObserver.observe(featuresRef.current);
//     const secScrollObserver = new IntersectionObserver(secCallback, opts);
//     secScrollObserver.observe(securityRef.current);
//     return () => {
//       featuresScrollObserver.disconnect();
//       secScrollObserver.disconnect();
//     };
//   }, []);

//   return (
//     <DDPage title="DollarDarwin">
//       <div
//         className={`fixed w-full h-12 left-0 z-10 md:h-16 ${
//           top > 10 && "shadow-lg"
//         }`}
//         style={{
//           backgroundImage:
//             top > 10
//               ? "linear-gradient(to bottom, #fff, #fff)"
//               : "linear-gradient(to bottom, #dbedca, rgba(246,246,246,0))",
//         }}
//       ></div>
//       <div className="max-w-screen-xl m-auto">
//         <Banner joinRef={joinRef} />
//       </div>

//       <div className="max-w-screen-xl m-auto">
//         <div
//           className="p-20 pl-0 pb-0"
//           style={{
//             maxWidth: "1280px",
//             paddingRight: "1rem",
//             paddingLeft: "1rem",
//           }}
//         >
//           <Calculator calculateRef={calculateRef} />
//           <HelloFinancialIndep />
//           <div className="w-full flex flex-wrap">
//             <Step
//               className="md:mr-3"
//               isPContainer={true}
//               y={[0, -10]}
//               count="01"
//               title="Get"
//               subTitle="Net Worth"
//               content="Link with various accounts to automatically calculate, what you own minus, what you owe."
//               bgColor="#dff1c7"
//               titleColor="#499824"
//               imgAttrs={{ className: "mt-5", src: "images/step1.jpg" }}
//             />
//             <Step
//               className="md:ml-5 translate-neg-30"
//               count="02"
//               title="Set"
//               subTitle="Goals"
//               content="Estimate money required across multiple currencies using in-built templates and calculators."
//               bgColor="#fcebcf"
//               titleColor="#e99507"
//               imgAttrs={{ className: "mt-20", src: "images/step2.jpg" }}
//             />
//             <Step
//               className="md:mr-3"
//               isPContainer={true}
//               y={[0, -25]}
//               count="03"
//               title="Go"
//               subTitle="Make Money work"
//               content="Helps you to not only align savings &amp; investements to goals, but also become more financially savvy via engaging games."
//               bgColor="#ffded8"
//               titleColor="#d5492e"
//               imgAttrs={{
//                 className: "mt-16",
//                 src: "images/step3.jpg",
//               }}
//             />
//             <GettingStarted />
//           </div>
//         </div>
//       </div>

//       <Security securityRef={securityRef} scrolledToSec={scrolledToSec} />
//       <GetRich featuresRef={featuresRef} />
//       <TakeQuickStep />

//       <div style={{ backgroundColor: "#d9e2e9" }}>
//         <div
//           className="py-10 m-auto"
//           style={{
//             maxWidth: "1280px",
//             paddingRight: "1rem",
//             paddingLeft: "1rem",
//           }}
//         >
//           <div className="flex justify-items-auto">
//             <div className="flex-1 pr-16">
//               <h2 className="text-xl">About Us</h2>
//               <p className="mt-3">
//                 We started by providing smart, simple investing, without the
//                 high fees and account minimums associated with traditional
//                 investment management. We invest your money in a globally
//                 diversified portfolio of low-cost index funds, and our
//                 cutting-edge technology helps you earn the best possible return,
//                 while optimizing your tax bill.
//               </p>
//             </div>
//             <div className="flex-1">Links</div>
//           </div>
//         </div>
//       </div>
//     </DDPage>
//   );
// }
