import React from "react";

interface ExperimentDetailsProps {
  experiment: {
    id: number;
    experimentName: string;
    images: File[];
    duration: number;
    interval: number;
    baselineMeasurement: boolean;
    isRecorded: boolean;
  };
  onBack: () => void;
  onDelete: () => void;
  onEdit: () => void;
}

const ExperimentDetails: React.FC<ExperimentDetailsProps> = ({
  experiment,
  onBack,
  onDelete,
  onEdit,
}) => {
  return (
    <div className=" text-white rounded-lg shadow-lg space-y-10 font-mono">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="text-md text-gray-300 hover:underline"
        >
          ← Back
        </button>
      </div>
      <div className="border-1 p-8 space-y-7 text-md w-full max-w-2xl md:max-w-3xl relative">
        <div className="space-y-6">
          <div className="flex justify-between">
            <span>Name of experiment</span>
            <span>{experiment.experimentName}</span>
          </div>

          <div className="flex justify-between">
            <span>Images ({experiment.images.length})</span>
            <div className="flex space-x-2">
              {experiment.images.map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`img-${index}`}
                  className="w-8 h-8 rounded"
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <span>Duration of each image</span>
            <span>{experiment.duration}s</span>
          </div>

          <div className="flex justify-between">
            <span>Interval between images</span>
            <span>{experiment.interval}s</span>
          </div>

          <div className="flex justify-between">
            <span>Baseline measurement</span>
            <span>{experiment.baselineMeasurement ? "Yes" : "No"}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-around space-y-4 items-start sm:items-center py-4">
          <button
            className="bg-buttonBlue text-white py-2 rounded px-12"
            onClick={() => console.log("Recording data...")}
          >
            RECORD DATA
          </button>
          <button
            className="bg-transparent text-white py-2 rounded px-12 border-1"
            onClick={onEdit}
          >
            EDIT
          </button>
          <button
            className="bg-transparent text-red-500 py-2 rounded px-12 border-1"
            onClick={onDelete}
          >
            DELETE
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperimentDetails;
