"use client";
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/self-closing-comp */
import { useState, useEffect, useContext } from "react";
import dayjs from "dayjs";
import { MuseContext } from "@/hooks/muse.context";
import { SignalViewer } from "./SignalViewer"; // import { useSession } from "next-auth/react";
import {
  CausalityNetworkParsedEEG,
  MuseEEGService,
} from "@/services/integrations/muse.service";
import { useRouter } from "next/navigation";
const Recorder = () => {
  const [sandboxData, setSandboxData] = useState("");
  const museContext = useContext(MuseContext);
  const [museEEGService, setMuseEEGService] = useState<MuseEEGService>();
  const [isMuseDataRecorded, setIsMuseDataRecorded] = useState(false);
  const router = useRouter()
  //@typescript-eslint/no-non-null-asserted-optional-chain
  useEffect(() => {
    if (museContext?.museClient && museContext?.museService) {
      setMuseEEGService(museContext?.museService!);
    }
  }, [museContext?.museClient]);

  async function startMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(true);
      await museEEGService.startRecording({
        id: 3,
        name: "Akhil",
        description: "new experiments",
      });
    }
  }

  async function stopMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(false);
      setIsMuseDataRecorded(true);
      await museEEGService.stopRecording(true);
    }
  }

  async function saveAndDowloadRecordedData() {
    if(museEEGService){
      setIsMuseDataRecorded(false);
      setIsMuseRecording(false);
      router.push('/playground/experiments')
      await museEEGService.dowloadOrSaveRecordedData(true);
    }
  }

  async function discardMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(false);
      setIsMuseDataRecorded(false);
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
    useState<CausalityNetworkParsedEEG[]>();
  const [isMuseRecording, setIsMuseRecording] = useState(false);
  useEffect(() => {
    // Subscribe to updates
    if (!isMuseRecording) return;
    if (!museContext?.museService) return;
    if (museContext?.museService?.onUpdate) {
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
    }
  }, [isMuseRecording, museContext?.museService]);

  return (
    museContext &&
    museContext.museClient && (
      <>
        {!isMuseRecording && !isMuseDataRecorded ? (
          <div className="flex flex-col items-center space-y-4 mt-20">
            <svg
              width="102"
              height="110"
              viewBox="0 0 102 110"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M101.999 30.836C102.036 24.5534 100.712 18.6918 97.9501 12.9243C95.6837 8.18267 92.6822 4.00517 89.0349 0.506204C88.6613 0.146498 88.0683 0.16285 87.7149 0.538907C87.3575 0.914964 87.3737 1.51175 87.7474 1.86737C91.2322 5.211 94.0997 9.20456 96.2686 13.7418C101.979 25.6857 100.436 36.3747 97.6901 46.1603C96.5163 45.7229 96.0614 45.8823 95.0379 46.0745C91.017 46.8429 90.547 46.9644 86.3961 46.9276C82.9113 46.8908 79.4427 46.572 76.0757 45.9752C75.7873 44.3402 75.2187 42.7052 74.3942 41.2009C72.729 38.1598 70.2027 35.9648 67.2743 35.0205C66.9006 34.902 65.934 34.62 64.6586 34.4973L55.382 30.3157C52.9938 29.2366 50.3335 29.159 47.8844 30.095C45.4393 31.0311 43.502 32.8746 42.4297 35.2781C42.3241 35.511 42.2266 35.744 41.7514 36.8559C41.4224 37.6284 40.9148 38.822 40.0984 40.7309C40.0984 40.7309 40.0984 40.735 40.0943 40.735C39.5298 42.0552 39.0667 43.1385 38.7581 43.8538C37.1741 47.4958 35.586 51.146 33.9979 54.8003C33.3806 56.2309 33.3806 57.8455 34.002 59.1168C34.5097 60.1591 35.3788 60.8867 36.447 61.1606L46.6375 63.7562C46.9462 63.8338 47.2548 63.8706 47.5676 63.8706C49.3181 63.8706 51.024 62.673 51.8525 60.7559L55.2561 52.9159C56.2553 50.6187 55.6257 48.0517 53.7858 46.944C53.2985 46.6538 49.5659 44.6304 46.3085 42.8809C46.4222 42.6152 46.5359 42.3496 46.6497 42.0839C46.8487 41.6179 47.0518 41.1478 47.2467 40.6941C48.5952 37.6775 52.145 36.3286 55.1546 37.6815L55.7273 37.9391C54.7809 39.1245 54.2367 40.3793 53.928 41.3481C53.7696 41.8427 54.0417 42.3741 54.5332 42.5294C55.0246 42.6847 55.5526 42.415 55.707 41.9204C56.0684 40.7718 56.8279 39.1449 58.3876 37.9186C60.2965 36.4144 62.5466 36.2018 64.2444 36.3408C64.3012 36.349 64.354 36.3572 64.4068 36.3572C65.5197 36.4634 66.3726 36.7087 66.6935 36.8109C72.0832 38.5522 74.9913 44.9574 74.3252 49.8421C74.183 50.8803 73.988 51.5793 73.5778 52.5113C73.0255 53.7661 72.1441 54.8698 70.5438 56.8727C69.4472 58.2461 68.0866 59.9506 66.2873 62.3787C64.9551 64.1772 63.956 65.7795 63.1559 67.063C61.4744 69.7608 60.6702 70.9585 59.2771 71.0198C58.5216 71.0525 57.8515 70.7255 57.5306 70.5702L57.5143 70.562C54.7322 69.209 54.1595 65.5261 54.0742 64.8026C54.0133 64.2876 53.5462 63.9197 53.0344 63.981C52.5227 64.0423 52.1572 64.5124 52.2181 65.0274C52.3237 65.9226 53.0426 70.4761 56.702 72.2583L56.7183 72.2665C57.1204 72.4627 58.0302 72.9042 59.1715 72.9042C59.2324 72.9042 59.2974 72.9042 59.3624 72.9001C61.7952 72.7938 62.965 70.9135 64.7439 68.0645C65.5684 66.7401 66.5026 65.24 67.7901 63.5027C69.5691 61.1033 70.9216 59.4111 72.006 58.0499C73.4804 56.2023 74.4308 55.0128 75.0806 53.7171C78.8822 54.2648 82.7163 54.555 86.4936 54.5755C86.6236 54.5755 86.7576 54.5755 86.8876 54.5755C90.5105 54.5755 90.4443 54.593 93.9413 54.1352C94.2012 54.1025 94.4612 54.0657 94.7171 54.033C93.7504 63.23 93.2996 72.5415 93.3808 81.7385C93.458 90.8783 94.0591 100.108 95.1557 109.174C95.2126 109.653 95.6147 110 96.0817 110C96.1183 110 96.1589 109.996 96.1955 109.992C96.7072 109.931 97.0728 109.46 97.0118 108.945C95.9193 99.9528 95.3263 90.7925 95.2491 81.7222C95.1679 72.4516 95.6309 63.0583 96.6219 53.7918C97.2921 53.7141 98.2831 53.4566 99.0751 52.6555C100.472 51.2412 100.549 48.8172 99.3066 47.2966C101.11 40.9773 101.971 35.7288 101.999 30.836ZM53.5421 52.1679L50.1386 60.0079C49.5374 61.3936 48.2296 62.2233 47.0924 61.9372L36.906 59.3416C36.2318 59.1699 35.8662 58.6753 35.6794 58.2952C35.2976 57.5104 35.3098 56.4885 35.7119 55.5565C37.3 51.9063 38.888 48.2561 40.4761 44.61C40.7117 44.0622 41.0325 43.3101 41.4224 42.4068C44.1234 43.8333 52.1612 48.1703 52.8314 48.5708C53.8427 49.1758 54.1554 50.7577 53.5421 52.1679ZM57.2422 36.443C57.2097 36.4675 57.1813 36.4961 57.1488 36.5207L55.9222 35.9688C51.9744 34.1948 47.3198 35.9729 45.5449 39.9379C45.3419 40.408 45.1388 40.878 44.9398 41.344C44.8463 41.5606 44.7529 41.7814 44.6595 41.998C43.6482 41.4585 42.7668 40.9884 42.1657 40.6696C42.7871 39.2185 43.1973 38.2538 43.4735 37.5957C43.9447 36.4921 44.0422 36.2632 44.1396 36.0465C45.0088 34.1008 46.5766 32.6089 48.5545 31.8527C50.5325 31.0924 52.6852 31.1578 54.6185 32.0284L60.6783 34.7589C59.5208 35.0532 58.3388 35.5724 57.2422 36.443ZM97.751 51.3352C96.9875 52.1118 94.5018 52.1731 93.7098 52.2753C90.1681 52.7372 90.1815 52.7156 86.5098 52.6993C82.9682 52.6788 79.3737 52.4172 75.8036 51.9226C75.9741 51.3545 76.096 50.7781 76.1894 50.0996C76.2869 49.3884 76.3194 48.6567 76.2869 47.9127C79.5849 48.4646 82.9722 48.767 86.3758 48.8038C90.6526 48.8406 91.2444 48.7069 95.3791 47.918C97.158 47.591 99.7737 49.2914 97.751 51.3352Z"
                fill="white"
              />
              <path
                d="M25.4864 46.8909C24.6172 49.7849 26.4449 52.1393 26.6561 52.4009C27.31 53.2021 28.9996 52.3069 28.102 51.2073C28.0451 51.1338 26.6764 49.4292 27.2734 47.4345C27.708 45.9875 28.9752 44.9247 30.5755 44.6631C31.7046 43.8415 31.6031 43.2243 30.2749 42.8074C27.968 43.1834 26.1321 44.749 25.4864 46.8909Z"
                fill="white"
              />
              <path
                d="M20.2026 44.565C18.6998 48.6975 20.7184 52.2741 21.1408 52.9486C21.7135 53.8683 23.4559 53.1284 22.7249 51.9512C22.3877 51.4075 20.755 48.5217 21.9572 45.2108C23.196 41.8018 26.4128 40.694 27.0464 40.5101C28.0658 39.5536 27.8912 38.9527 26.5184 38.7034C25.7385 38.9364 21.7501 40.3057 20.2026 44.565Z"
                fill="white"
              />
              <path
                d="M22.8468 37.0889C23.7688 36.0384 23.5373 35.458 22.1483 35.3435C20.9176 35.8463 16.7586 37.8533 15.0283 42.6889C13.42 47.177 14.9309 51.0725 15.6538 52.5358C16.1493 53.5373 17.9324 52.9242 17.3272 51.6979C16.8479 50.725 15.3858 47.2383 16.787 43.3224C18.2573 39.2267 21.799 37.5181 22.8468 37.0889Z"
                fill="white"
              />
              <path
                d="M42.1845 50.0358L48.6383 53.6165C49.3857 54.0294 50.9047 52.7255 49.54 51.9693L43.0862 48.3885C42.6354 48.1392 42.0667 48.3027 41.8149 48.7564C41.5672 49.2142 41.7296 49.7865 42.1845 50.0358Z"
                fill="white"
              />
              <path
                d="M67.2274 78.3678C66.6243 78.3678 66.1351 78.7888 66.1351 79.308V88.2847C66.1351 90.4307 63.3286 92.1803 62.3247 92.1803H21.7074C18.4782 92.1803 15.7428 90.6065 15.4722 88.5994L12.6228 67.4086C12.5611 66.963 12.1479 66.6155 11.6303 66.5788C10.3766 66.4888 9.0944 66.309 7.82645 66.0433C5.22881 65.4996 4.04159 65.2216 3.19628 64.3468C2.56943 63.6887 2.22276 62.7853 2.19427 61.7307L11.2314 45.719C12.2334 43.9449 12.5753 41.9664 12.2144 40.0002C11.1412 34.1956 11.4404 28.5259 13.1025 23.1465C13.1737 22.9216 13.2449 22.6805 13.3209 22.427C14.4559 18.6091 16.5739 11.4964 29.4576 1.64494C29.9088 1.30157 29.9515 0.70476 29.5479 0.316424C29.149 -0.0719116 28.4556 -0.108702 28.0045 0.238756C22.2441 4.64534 17.8798 9.08872 15.04 13.4463C12.6371 17.1375 11.7728 20.0357 11.2029 21.9569C11.1269 22.2063 11.0604 22.4393 10.9892 22.66C9.24637 28.297 8.93294 34.2283 10.0537 40.2946C10.3434 41.8806 10.0679 43.4707 9.26061 44.8974L0.109508 61.1093C0.0382743 61.2361 0.000283817 61.3751 0.000283817 61.514C-0.0139628 63.1042 0.508415 64.494 1.50568 65.5446C2.85437 66.9385 4.72068 67.3309 7.30407 67.8705C8.38207 68.0953 9.46956 68.2629 10.5476 68.3733L13.2972 88.812C13.7008 91.8042 17.3147 94.0606 21.7027 94.0606H44.6873C44.5021 97.9563 44.749 108.355 44.7585 108.846C44.7728 109.357 45.2572 109.766 45.8508 109.766C45.8603 109.766 45.865 109.766 45.8745 109.766C46.4776 109.754 46.9573 109.324 46.943 108.805C46.9383 108.683 46.6818 97.7396 46.8718 94.0606H62.3199C66.9738 94.0606 68.3149 91.469 68.3149 88.2847V79.3121C68.3244 78.7888 67.8352 78.3678 67.2274 78.3678Z"
                fill="white"
              />
            </svg>
            <p className="text-lg text-offWhite font-mono mt-4">
              Muse Device ID: {museContext.museClient.deviceName} |{" "}
              <span className="text-blue-500 inline-flex">
                Connected{" "}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="m-1 self-center"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.33325 7.99992C1.33325 4.31992 4.31992 1.33325 7.99992 1.33325C11.6799 1.33325 14.6666 4.31992 14.6666 7.99992C14.6666 11.6799 11.6799 14.6666 7.99992 14.6666C4.31992 14.6666 1.33325 11.6799 1.33325 7.99992ZM6.99992 8.93127L10.2949 5.66658L10.9999 6.37005L6.99992 10.3333L4.99992 8.35165L5.70492 7.65314L6.99992 8.93127Z"
                    fill="#00F2FF"
                  />
                </svg>
              </span>
            </p>
            <button
              className="bg-buttonBlue text-white px-6 py-2 font-semibold rounded-md hover:bg-opacity-90"
              onClick={() => {
                startMuseRecording();
              }}
            >
              START AN OPEN ENDED RECORDING
            </button>
            <button className="bg-transparent text-white px-6 py-2 rounded-md border-1 border-white hover:bg-opacity-90"
            onClick={() => {
              router.push('/playground/experiments');
            }}
            >
              CHOOSE EXPERIMENT
            </button>
          </div>
        ) : (
          <div
            className="flex flex-col items-center space-y-4"
            style={{ width: "-webkit-fill-available" }}
          >
            <p className="text-lg text-offWhite font-mono mt-4">
              Muse Device ID: {museContext.museClient.deviceName} |{" "}
              {!isMuseDataRecorded ? (
                <span className="text-white inline-flex">
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
              ) : (
                <span className="text-white inline-flex">
                  Recording complete{" "}
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
                      fill="white"
                    />
                  </svg>
                </span>
              )}
            </p>
            <div
              className="bg-black h-[400px] mx-[30px] snap-y rounded-sm block overflow-y-auto p-4"
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
            {!isMuseDataRecorded ? (
              <button
                className="bg-white text-buttonBlue px-6 py-2 font-semibold rounded-md hover:bg-opacity-90"
                onClick={() => {
                  stopMuseRecording();
                }}
              >
                STOP RECORDING
              </button>
            ) : (
              <div>
                <button
                  className="bg-buttonBlue text-white px-6 py-2 font-semibold rounded-md hover:bg-opacity-90 mx-2"
                  onClick={() => {
                    saveAndDowloadRecordedData();
                  }}
                >
                  SAVE RECORDING
                </button>
                <button className="bg-transparent text-white px-6 py-2 rounded-md border-1 border-white hover:bg-opacity-90 m-2"
                onClick={()=>{
                  discardMuseRecording()
                }}
                >
                  DISCARD
                </button>
              </div>
            )}
          </div>
        )}
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
