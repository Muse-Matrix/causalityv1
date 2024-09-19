import OpreationalButton from "@/components/OpreationalButton";
import PlayGroundArea from "@/components/PlayGroundArea";
import { MuseContextProvider } from "@/hooks/muse.context";
import { reactPlugin } from "@/utils/waveInsights";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import React from "react";

const PlayGround = () => {
  return (
    <div>
      {/* <AppInsightsContext.Provider value={reactPlugin}> */}
        <MuseContextProvider>
          <OpreationalButton />
          <PlayGroundArea />
        </MuseContextProvider>
      {/* </AppInsightsContext.Provider> */}
    </div>
  );
};

export default PlayGround;
