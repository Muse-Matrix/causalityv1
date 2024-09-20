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
    <div className="w-full max-w-2xl mx-auto mt-10 p-6 bg-darkblue text-white rounded-md shadow-lg">
      <button onClick={onBack} className="text-white mb-4">{`← Back`}</button>
      <h1 className="text-xl font-bold mb-4">{experiment.experimentName}</h1>

      <div className="border border-white rounded-md p-4 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm">Name of experiment</span>
          <span className="text-lg">{experiment.experimentName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Images ({experiment.images.length})</span>
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

        <div className="flex justify-between items-center">
          <span className="text-sm">Duration of each image</span>
          <span>{experiment.duration}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Interval between each image</span>
          <span>{experiment.interval}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm">Baseline measurement (fixation cross)</span>
          <span>{experiment.baselineMeasurement ? "Yes" : "No"}</span>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => console.log("Recording data...")}
        >
          RECORD DATA
        </button>
        <button
          className="bg-white text-black border border-white px-4 py-2 rounded-md hover:bg-gray-300"
          onClick={onEdit}
        >
          EDIT
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          onClick={onDelete}
        >
          DELETE
        </button>
      </div>
    </div>
  );
};

export default ExperimentDetails;
