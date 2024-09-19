import React from "react";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { ReactPlugin, withAITracking } from "@microsoft/applicationinsights-react-js";

const reactPlugin = new ReactPlugin();

const waveInsights = new ApplicationInsights({
  config: {
    instrumentationKey: process.env["NEXT_PUBLIC_APP_INSIGHTS_KEY"] || "<placeholder>",
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    disableCookiesUsage: true,
  },
});

waveInsights.loadAppInsights();
waveInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview

export { waveInsights, reactPlugin };
