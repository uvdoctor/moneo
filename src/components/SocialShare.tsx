import React from "react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  InstapaperShareButton,
  InstapaperIcon,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestShareButton,
  PinterestIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  ViberShareButton,
  ViberIcon,
} from "react-share";

import "./SocialShare.less";

interface SocialMediaShareProps {
  url: string;
}

export default function SocialMediaShare({ url }: SocialMediaShareProps) {
  return (
    <div className="social-share">
      <span className="expand-collapse-icon">
        <CaretDownOutlined />
        <CaretUpOutlined />
      </span>
      <p>Earn 500 points for Every Referral who Joins</p>
      <div>
        <EmailShareButton
          url={url}
          subject="DollarDarwin - Your Financial Analyst"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
        <FacebookShareButton url={url}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <InstapaperShareButton url={url}>
          <InstapaperIcon size={32} round />
        </InstapaperShareButton>
        <TwitterShareButton url={url}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <LinkedinShareButton url={url}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
        <PinterestShareButton
          media={`https://dollardarwin.com/images/icons/tlogo256.png`}
          url={url}
        >
          <PinterestIcon size={32} round />
        </PinterestShareButton>
        <TelegramShareButton url={url}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton url={url}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <RedditShareButton url={url}>
          <RedditIcon size={32} round />
        </RedditShareButton>
        <ViberShareButton url={url}>
          <ViberIcon size={32} round />
        </ViberShareButton>
      </div>
    </div>
  );
}
