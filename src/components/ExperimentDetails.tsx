import { downloadFromIpfs } from "@/services/storage.service";
import React, { useEffect, useState } from "react";

interface ExperimentDetailsProps {
  experiment: {
    id: number;
    experimentName: string;
    images: { cid: string }[]; 
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
  const [imageUrls, setImageUrls] = useState<(string | undefined)[]>([]);

  // Function to download all files for the experiment
  const downloadImages = async (cids: any[]) => {
    try {
      const urls = await Promise.all(
        cids.map((cid) => {
            return downloadFromIpfs(cid); 
        })
      );
      setImageUrls(urls);
    } catch (error) {
      console.error("Error downloading images", error);
    }
  };
  

  // UseEffect to download images when the component loads
  useEffect(() => {
    if (experiment.images.length > 0) {
      const cids = experiment.images.map((image) => image); // Extract CIDs from the images
      downloadImages(cids);
    }
  }, [experiment.images]);

  return (
    <div className="text-white rounded-lg shadow-lg space-y-10 font-mono">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={onBack} className="text-md text-gray-300 hover:underline">
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
              {imageUrls.map((url, index) => (
                url ? (
                  <img
                    key={index}
                    src={url}
                    alt={`img-${index}`}
                    className="w-8 h-8 rounded"
                  />
                ) : (
                  <div key={index} className="w-8 h-8 rounded bg-gray-800" />
                )
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
