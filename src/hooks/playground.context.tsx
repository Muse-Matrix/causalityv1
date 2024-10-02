"use client"
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { MuseContext } from "@/hooks/muse.context";
import { CausalityNetworkParsedEEG, MuseEEGService } from "@/services/integrations/muse.service";
import { Experiment } from "./experiment.context";

interface ExperimentContextType {
  museBrainwaves: CausalityNetworkParsedEEG[] | undefined;
  isMuseRecording: boolean;
  isMuseDataRecorded: boolean;
  startMuseRecording: () => Promise<void>;
  stopMuseRecording: () => Promise<void>;
  saveAndDownloadRecordedData: () => Promise<void>;
  discardMuseRecording: () => Promise<void>;
  updateMuseRecordingEvent:(experimentId: number, imageName: string, experimentName: string) => void;
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const ExperimentPlaygroundProvider = ({ children }: { children: ReactNode }) => {
  const [museEEGService, setMuseEEGService] = useState<MuseEEGService>();
  const [isMuseDataRecorded, setIsMuseDataRecorded] = useState(false);
  const [museBrainwaves, setMuseBrainwaves] = useState<CausalityNetworkParsedEEG[]>();
  const [isMuseRecording, setIsMuseRecording] = useState(false);
  const museContext = useContext(MuseContext);

  useEffect(() => {
    if (museContext?.museClient && museContext?.museService) {
      setMuseEEGService(museContext?.museService!);
    }else{
        setIsMuseDataRecorded(false);
        setIsMuseRecording(false);
    }
  }, [museContext?.museClient]);

  async function startMuseRecording(experiment?: Experiment) {
    if (museEEGService) {
      setIsMuseRecording(true);
      await museEEGService.startRecording({
        id: experiment?.id ?? 1,
        name:experiment?.experimentName ?? "Open Ended Recording",
        description: `Recording brain waves for experiment: ${experiment?.experimentName}` ?? "Recording brain waves for open ended recording",
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

  function updateMuseRecordingEvent(experimentId: number, imageName: string, experimentName: string) {
    const recordingData = {
      experimentId,
      imageName,
      experimentName,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Updated recording event:', recordingData);
  }


  useEffect(() => {
    if (!isMuseRecording || !museContext?.museService) return;
    const unsubscribe = museContext.museService.onUpdate && museContext.museService.onUpdate((data) => {
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
        startMuseRecording,
        stopMuseRecording,
        saveAndDownloadRecordedData,
        discardMuseRecording,
        updateMuseRecordingEvent
      }}
    >
      {children}
    </ExperimentContext.Provider>
  );
};

export const useExperimentPlayground = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error("useExperiment must be used within an ExperimentProvider");
  }
  return context;
};
