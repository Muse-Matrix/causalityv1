import { useExperimentContext } from "@/hooks/experiment.context";
import { useState } from "react";

export default function ExperimentModal({
  toggleModal,
}: {
  toggleModal: () => void;
}) {
  const { addExperiment, experiments } = useExperimentContext();
  const [experimentName, setExperimentName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [duration, setDuration] = useState(10); // Default 10s
  const [interval, setInterval] = useState(5); // Default 5s
  const [baselineMeasurement, setBaselineMeasurement] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Handle multiple file uploads
    }
  };

  const handleSaveExperiment = () => {
    const newExperiment = {
      experimentName,
      images,
      duration,
      interval,
      baselineMeasurement,
      isRecorded: false
    };
console.log(newExperiment);

    addExperiment({id: experiments.length+1, ...newExperiment}); 
    setExperimentName(''); 
    setImages([]);
    setDuration(10);
    setInterval(5);
    setBaselineMeasurement(true);
    alert("Experiment Saved!")
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 font-mono">
        <form
          className="bg-black text-white w-full max-w-2xl md:max-w-3xl p-8 relative border-2 border-buttonBlue"
          onSubmit={handleSaveExperiment}
        >
          <div className="border-b-2 border-buttonBlue mb-6">
            <button
              onClick={toggleModal}
              className="absolute top-8 right-8 text-white"
            >
              X
            </button>
            <h2 className="text-xl mb-4 text-center font-semibold">
              Setup an experiment
            </h2>
          </div>
          {/* Name of experiment */}
          <div className="flex flex-col md:flex-row items-center mb-4">
            <label className="block text-sm w-full md:w-1/2 mb-2 md:mb-0">
              Name of experiment
            </label>
            <input
              type="text"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
              className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
              required
            />
          </div>

          {/* Choose images */}
          <div className="flex flex-col md:flex-row items-center mb-4">
            <label className="block text-sm w-full md:w-1/2 mb-2 md:mb-0">
              Choose images
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
            />
          </div>

          {/* Duration of each image */}
          <div className="flex flex-col md:flex-row items-center mb-4">
            <label className="block text-sm w-full md:w-1/2 mb-2 md:mb-0">
              Duration of each image
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={15}>15s</option>
            </select>
          </div>

          {/* Interval between each image */}
          <div className="flex flex-col md:flex-row items-center mb-4">
            <label className="block text-sm w-full md:w-1/2 mb-2 md:mb-0">
              Interval between each image
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(Number(e.target.value))}
              className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={15}>15s</option>
            </select>
          </div>

          {/* Baseline measurement */}
          <div className="flex flex-col md:flex-row items-center mb-4">
            <label className="block text-sm w-full md:w-1/2 mb-2 md:mb-0">
              Baseline measurement (fixation cross)
            </label>
            <select
              value={baselineMeasurement ? "Yes" : "No"}
              onChange={(e) => setBaselineMeasurement(e.target.value === "Yes")}
              className="w-full md:w-1/2 p-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="text-center">
            <button
              className="bg-white text-buttonBlue py-2 rounded hover:bg-gray-200 px-12"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
