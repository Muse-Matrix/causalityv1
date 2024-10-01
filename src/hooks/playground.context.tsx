"use client"
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import dayjs from "dayjs";
import { MuseContext } from "@/hooks/muse.context";
import { CausalityNetworkParsedEEG, MuseEEGService } from "@/services/integrations/muse.service";

interface ExperimentContextType {
  museBrainwaves: CausalityNetworkParsedEEG[] | undefined;
  isMuseRecording: boolean;
  isMuseDataRecorded: boolean;
  sandboxData: any;
  startMuseRecording: () => Promise<void>;
  stopMuseRecording: () => Promise<void>;
  saveAndDownloadRecordedData: () => Promise<void>;
  discardMuseRecording: () => Promise<void>;
  downloadSandboxData: (sandboxData: any, dataName: string, fileTimestamp: number) => Promise<void>;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentProvider = ({ children }: { children: ReactNode }) => {
  const [sandboxData, setSandboxData] = useState("");
  const [museEEGService, setMuseEEGService] = useState<MuseEEGService>();
  const [isMuseDataRecorded, setIsMuseDataRecorded] = useState(false);
  const [museBrainwaves, setMuseBrainwaves] = useState<CausalityNetworkParsedEEG[]>();
  const [isMuseRecording, setIsMuseRecording] = useState(false);
  const museContext = useContext(MuseContext);

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
      await museEEGService.stopRecording();
    }
  }

  async function saveAndDownloadRecordedData() {
    if (museEEGService) {
      setIsMuseDataRecorded(false);
      setIsMuseRecording(false);
      await museEEGService.dowloadOrSaveRecordedData(false, true);
    }
  }

  async function discardMuseRecording() {
    if (museEEGService) {
      setIsMuseRecording(false);
      setIsMuseDataRecorded(false);
      await museEEGService.stopRecording();
    }
  }

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("message", (event) => {
        if (event.origin.startsWith("https://localhost:")) {
          if (typeof event.data === "object" && event.data["trials"]) {
            setSandboxData(event.data);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (sandboxData !== "") {
      (async () => {
        await downloadSandboxData(sandboxData, "test", dayjs().unix());
      })();
    }
  }, [sandboxData]);

  useEffect(() => {
    if (!isMuseRecording || !museContext?.museService) return;
    const unsubscribe = museContext.museService.onUpdate((data) => {
      const last1000Brainwaves = data.slice(-1000);
      setMuseBrainwaves(last1000Brainwaves);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isMuseRecording, museContext?.museService]);

  return (
    <ExperimentContext.Provider
      value={{
        museBrainwaves,
        isMuseRecording,
        isMuseDataRecorded,
        sandboxData,
        startMuseRecording,
        stopMuseRecording,
        saveAndDownloadRecordedData,
        discardMuseRecording,
        downloadSandboxData,
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperiment = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error("useExperiment must be used within an ExperimentProvider");
  }
  return context;
};
