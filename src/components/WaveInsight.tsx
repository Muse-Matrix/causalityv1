/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/self-closing-comp */
import { FC, useState, useEffect, useContext } from "react";
import { waveInsights } from "@/utils/waveInsights";
import { IExperiment } from "@/utils/constant";
import dayjs from "dayjs";
import { MuseContext } from "@/hooks/muse.context";
import { SignalViewer } from "./SignalViewer"; // import { useSession } from "next-auth/react";
import { MuseEEGService, NeuroFusionParsedEEG } from "@/services/integrations/muse.service";

export const WaveInsight: FC<IExperiment> = (experiment) => {
  const [showSignalQuality, setShowSignalQuality] = useState(true);

  const [sandboxData, setSandboxData] = useState("");

  const museContext = useContext(MuseContext);

  const [duration, setDuration] = useState(0);
  const [tags, setTags] = useState<string[]>([]);

  const [experimentInfo, setExperimentInfo] = useState<IExperiment>(experiment);

//   const session = useSession();

  useEffect(() => {
    setExperimentInfo({ ...experiment, duration, tags });
  }, [experiment, tags, duration]);

  const [museEEGService, setMuseEEGService] = useState<MuseEEGService>();
  useEffect(() => {
    if (museContext?.museClient && museContext?.museService) {
      setMuseEEGService(museContext?.museService!);
    }
  }, [museContext?.museClient]);

  async function startMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(true);
      waveInsights.trackEvent({
        name: "start_muse_recording",
        properties: {
          deviceInfo: await museContext?.museClient?.deviceInfo(),
          experimentInfo: experimentInfo,
          userNpub: "Akhil",
        },
      });
      await museEEGService.startRecording(experimentInfo);
    }
  }

  async function stopMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(false);
      waveInsights.trackEvent({
        name: "stop_muse_recording",
        properties: {
          deviceInfo: await museContext?.museClient?.deviceInfo(),
          experimentInfo: experimentInfo,
          userNpub: "Akhil"
        },
      });
      await museEEGService.stopRecording(true);
    }
  }

  if (typeof window !== "undefined") {
    window.addEventListener("message", (event) => {
      // IMPORTANT: Check the origin of the data!
      // You should probably not use '*', but restrict it to certain domains:
      if (
        event.origin.startsWith("https://localhost:")
      ) {
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
        await downloadSandboxData(sandboxData, experiment.name, dayjs().unix());
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
    useState<NeuroFusionParsedEEG[]>();
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
    <div className="flex flex-col">
      {/* this needs to move to it's own component */}

      <div id="experiment-container" className="mt-5">
        {experiment.description && (
          <div className="mt-10">
            <h1>Description:</h1>
            <p>{experiment.description}</p>
          </div>
        )}
        {experiment.id == 3 && (
          <>
            <div className="mt-5">
              <div className="my-5">
                <p>
                  Duration<em>(optional)</em> :
                </p>
                <input
                  type="number"
                  placeholder="Duration (seconds)"
                  onChange={(e: any) => setDuration(e.target.valueAsNumber)}
                  value={duration ?? 0}
                />
              </div>
              <div className="my-5">
                <p>
                  Tags <em>(optional)</em> :
                </p>
                <input
                  type="text"
                  placeholder="Tags"
                  onChange={(e: any) => {
                    console.log(e.target.value);
                    setTags(e.target.value.split(","));
                  }}
                  value={tags.join(",")}
                />
              </div>
            </div>
          </>
        )}

        {experiment.url && (
          <div className="m-3">
            <iframe
              src={experiment.url}
              style={{
                width: "100%",
                height: "500px",
                border: "0",
                borderRadius: "4px",
                overflow: "hidden",
              }}
              title={experiment.name}
              allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking; download; fullscreen;"
              sandbox="allow-forms allow-downloads allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
            ></iframe>
            <div className="mt-3 flex justify-end">
              <button
                className=""
                onClick={() => {
                  if (experiment.url) {
                    const iframe = document.querySelector(
                      "iframe"
                    ) as HTMLIFrameElement;
                    if (iframe) {
                      iframe.src = iframe.src;
                    }
                  }
                }}
              >
                Restart Experiment
              </button>
            </div>
          </div>
        )}
      </div>

      {experiment.id !== 6 && (
        <>
          {/* Muse Methods */}
          <div className="item-start mt-3">
            {!museContext?.museClient && (
              <button
                className="ml-auto"
                onClick={async () => {
                  museContext?.getMuseClient();
                }}
              >
                Connect Muse Headset
              </button>
            )}
          </div>

          {museContext?.museClient && (
            <div className="mt-4">
              <p>Active Muse Device: {museContext?.museClient?.deviceName}</p>

              {/* display live eeg */}
              <div className="flex gap-x-5 mt-3">
                {!isMuseRecording ? (
                  <>
                    <button
                      onClick={() => {
                        startMuseRecording();
                      }}
                    >
                      Start Muse EEG Recording
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={async () => {
                        stopMuseRecording();
                      }}
                    >
                      Stop Muse EEG Recording
                    </button>
                  </>
                )}

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
            </div>
          )}
        </>
      )}
    </div>
  );
};
