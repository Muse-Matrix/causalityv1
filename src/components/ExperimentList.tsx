import React, { useContext, useState } from "react";
import ExperimentItem from "./ExperimentItem";
import { useExperimentContext } from "@/hooks/experiment.context";
import ExperimentDetails from "./ExperimentDetails";
import { MuseContext } from "@/hooks/muse.context";
import { useRouter } from "next/navigation";
import { useExperiment } from "@/hooks/playground.context";

const ExperimentList: React.FC = () => {
  const museContext = useContext(MuseContext);
  const { experiments, removeExperiment } = useExperimentContext();
  const {
    museBrainwaves,
    isMuseRecording,
    isMuseDataRecorded,
    startMuseRecording,
    stopMuseRecording,
    saveAndDownloadRecordedData,
    discardMuseRecording,
  } = useExperiment();

  const router = useRouter();
  const [selectedExperiment, setSelectedExperiment] = useState<number | null>(
    null
  );
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  const handleRecordData = () => {
    if (!museContext?.museClient && !museContext?.museService) {
      router.push("/playground/record");
    }else{
      setIsPreviewing(true);
    }
    
  };

  const closePreview = () => {
    if(isMuseRecording && museBrainwaves && museContext?.museService){
      stopMuseRecording();
    }
    setIsPreviewing(false);
    router.push("/playground/record");
  };

  const handleSelectExperiment = (id: number) => setSelectedExperiment(id);
  const handleBack = () => setSelectedExperiment(null);
  const handleDelete = (id: number) => {
    removeExperiment(id);
    handleBack();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-mono text-white">
      {selectedExperiment === null ? (
        <>
          <div className="flex items-center space-x-4 mb-8">
            <h1 className="text-lg font-semibold text-white border-b-1">
              Saved Experiments
            </h1>
          </div>
          <div className="p-8 space-y-7 text-md w-full max-w-2xl md:max-w-3xl relative">
            <div className="space-y-4">
              {experiments.length > 0 ? (
                experiments.map((experiment) => (
                  <ExperimentItem
                    key={experiment.id}
                    experiment={experiment}
                    onClick={() => handleSelectExperiment(experiment.id)}
                    handleRecordData={handleRecordData}
                    saveAndDownloadRecordedData={saveAndDownloadRecordedData}
                  />
                ))
              ) : (
                <p className="text-white">No experiments saved.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <ExperimentDetails
          experiment={experiments.find((exp) => exp.id === selectedExperiment)!}
          onBack={handleBack}
          onDelete={() => handleDelete(selectedExperiment)}
          onEdit={() => console.log("Edit experiment")}
          isPreviewing={isPreviewing}
          handleRecordData={handleRecordData}
          closePreview={closePreview}
          saveAndDownloadRecordedData={saveAndDownloadRecordedData}
        />
      )}
    </div>
  );
};

export default ExperimentList;
function removeExperiment(id: number) {
  console.error("Function not implemented.");
}
