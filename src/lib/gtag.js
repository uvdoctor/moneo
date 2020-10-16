export const GA_TRACKING_ID = "UA-176180938-1";

export const pageview = (url) => {
  try {
    window.gtag("config", GA_TRACKING_ID, {
      page_path: url,
    });
  } catch (e) {}
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  try {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  } catch (e) {}
};
