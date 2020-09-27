import React from "react";
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
import ExpandCollapse from "./form/expandcollapse";

interface SocialShareProps {
  url: string;
}

export default function SocialShare({ url }: SocialShareProps) {
  return (
    <ExpandCollapse title="Earn 500 points for Every Referral who Joins">
      <div className="mt-2 w-full flex justify-around">
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
    </ExpandCollapse>
  );
}
