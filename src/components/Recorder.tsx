"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/self-closing-comp */
import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { MuseContext } from "@/hooks/muse.context";
import { SignalViewer } from "./SignalViewer"; // import { useSession } from "next-auth/react";
import {
CasualityNetworkParsedEEG,
  MuseEEGService,
} from "@/services/integrations/muse.service";
const Recorder = () => {
  const [sandboxData, setSandboxData] = useState("");
  const museContext = useContext(MuseContext);
  const [museEEGService, setMuseEEGService] = useState<MuseEEGService>();
  //@typescript-eslint/no-non-null-asserted-optional-chain
  useEffect(() => {
    if (museContext?.museClient && museContext?.museService) {
      setMuseEEGService(museContext?.museService!);
    }
  }, [museContext?.museClient]);

  async function stopMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(false);
      await museEEGService.stopRecording(true);
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      // IMPORTANT: Check the origin of the data!
      // You should probably not use '*', but restrict it to certain domains:
      if (event.origin.startsWith("https://localhost:")) {
        // console.log("event", event);
        if (typeof event.data === "string") {
          return;
        }

        try {
          if (typeof event.data === "object") {
            if (event.data["trials"]) {
              // jspsych events contain trials key...
              setSandboxData(event.data);
            } else {
              // console.log("rejected non experiment data");
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  }

  useEffect(() => {
    if (sandboxData !== "") {
      (async () => {
        await downloadSandboxData(sandboxData, "test", dayjs().unix());
      })();
    }
  }, [sandboxData]);

  // download the data
  async function downloadSandboxData(
    sandboxData: any,
    dataName: string,
    fileTimestamp: number
  ) {
    const fileName = `${dataName}_${fileTimestamp}.json`;

    const hiddenElement = document.createElement("a");
    hiddenElement.href =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(sandboxData));
    hiddenElement.target = "_blank";
    hiddenElement.download = fileName;
    hiddenElement.click();
  }

  const [museBrainwaves, setMuseBrainwaves] =
    useState<CasualityNetworkParsedEEG[]>();
  const [isMuseRecording, setIsMuseRecording] = useState(false);
  useEffect(() => {
    // Subscribe to updates
    if (!isMuseRecording) return;
    if (!museContext?.museService) return;
    const unsubscribe = museContext?.museService?.onUpdate((data) => {
      // Handle the new data
      const last1000Brainwaves = data.slice(-1000);
      setMuseBrainwaves(last1000Brainwaves);
    });

    // Unsubscribe on component unmount or when dependencies change
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isMuseRecording, museContext?.museService]);

  return (
    museContext &&
    museContext.museClient && (
      <>
        <div
          className="flex flex-col items-center space-y-4"
          style={{ width: "-webkit-fill-available" }}
        >
          <p className="text-lg text-offWhite font-mono mt-4">
            Muse Device ID: {museContext.museClient.deviceName} |{" "}
            <span className="text-blue-500 inline-flex">
              Recording in progress{" "}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="m-1 self-center"
              >
                <path
                  d="M7.99992 1.33325C4.31992 1.33325 1.33325 4.31992 1.33325 7.99992C1.33325 11.6799 4.31992 14.6666 7.99992 14.6666C11.6799 14.6666 14.6666 11.6799 14.6666 7.99992C14.6666 4.31992 11.6799 1.33325 7.99992 1.33325Z"
                  fill="#FF0000"
                />
              </svg>
            </span>
          </p>
          <div
            className="bg-black h-[400px] mx-[30px] snap-y rounded-sm block overflow-y-auto"
            style={{ width: "-webkit-fill-available" }}
          >
            <div>
              {museBrainwaves && (
                <>
                  <SignalViewer
                    rawBrainwaves={museBrainwaves}
                    channelNames={museContext.museService?.channelNames!}
                  />
                </>
              )}
            </div>
          </div>
          <button 
          className="bg-white text-buttonBlue px-6 py-2 font-semibold rounded-md hover:bg-opacity-90"
          onClick={() => {stopMuseRecording}}
          >
            STOP RECORDING
          </button>
        </div>
        {/* Disconnect section positioned at the bottom */}
        <div className="flex justify-around mt-auto mb-5">
          <button
            className="text-white-500 border-b-1 font-mono mt-2"
            onClick={() => {
              museContext.disconnectMuseClient();
            }}
          >
            DISCONNECT
          </button>
        </div>
      </>
    )
  );
};

export default Recorder;
