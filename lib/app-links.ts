// The desktop app registers this custom protocol in Electron and uses
// "billing" as its Billing view identifier. Keep web-to-app handoffs here so
// return routes do not drift into invented checkout or portal URLs.
export const PROPEL_APP_PROTOCOL = "propel";
export const PROPEL_BILLING_DEEP_LINK = `${PROPEL_APP_PROTOCOL}://billing`;
