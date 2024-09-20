import React, { useState } from "react";
import ExperimentItem from "./ExperimentItem";
import { useExperimentContext } from "@/hooks/experiment.context";
import ExperimentDetails from "./ExperimentDetails";

const ExperimentList: React.FC = () => {
  const { experiments } = useExperimentContext();
  const [selectedExperiment, setSelectedExperiment] = useState<number | null>(
    null
  );

  const handleSelectExperiment = (id: number) => {
    setSelectedExperiment(id);
  };

  const handleBack = () => {
    setSelectedExperiment(null);
  };

  const handleDelete = (id: number) => {
    removeExperiment(id);
    handleBack();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      {selectedExperiment === null ? (
        <>
          <h1 className="text-2xl font-bold text-white mb-4">
            Saved Experiments
          </h1>
          <div className="space-y-4">
            {experiments.length > 0 ? (
              experiments.map((experiment, index) => (
                <ExperimentItem 
                key={experiment.id}
                experiment={experiment}
                onClick={() => handleSelectExperiment(experiment.id)}
                />
              ))
            ) : (
              <p className="text-white">No experiments saved.</p>
            )}
          </div>
        </>
      ) : (
        <ExperimentDetails
          experiment={experiments.find((exp) => exp.id === selectedExperiment)!}
          onBack={handleBack}
          onDelete={() => handleDelete(selectedExperiment)}
          onEdit={() => console.log("Edit experiment")} // Implement edit functionality later
        />
      )}
    </div>
  );
};

export default ExperimentList;
function removeExperiment(id: number) {
  throw new Error("Function not implemented.");
}
