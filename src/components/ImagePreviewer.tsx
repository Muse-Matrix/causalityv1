import { useExperimentPlayground } from "@/hooks/playground.context";
import React, { useState, useEffect } from "react";
import { useExperimentContext } from "@/hooks/experiment.context";
import { useRouter } from "next/navigation";

interface ImagePreviewOverlayProps {
  images: string[];
  duration: number; // How long each image should be shown
  interval: number; // Time between images
  onClose: () => void; // Function to close the overlay
  experimentId: number; // To track and update experiment as recorded
}

const ImagePreviewOverlay: React.FC<ImagePreviewOverlayProps> = ({
  images,
  duration,
  interval,
  onClose,
  experimentId,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // -1 to show starting message first
  const [message, setMessage] = useState<string>("Starting image preview...");
  const [isPreviewing, setIsPreviewing] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(5); 
  const router = useRouter();
  const { experiments, updateExperiment } = useExperimentContext(); 
  const {
    startMuseRecording,
    stopMuseRecording,
  } = useExperimentPlayground();

  useEffect(() => {
    if (countdown > 0) {
      const countdownInterval = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(countdownInterval);
    } else {
      startMuseRecording();
      setCurrentIndex(0);
    }
  }, [countdown]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (currentIndex === -1) {
      console.log("starting image preview...");
      setMessage("");
    } else if (currentIndex < images.length) {
      timeout = setTimeout(() => {
        setCurrentIndex(currentIndex + 1);
      }, (duration) * 1000);
    } else {
      const experiment = experiments.find((exp) => exp.id === experimentId);
      if (experiment) {
        const updatedExperiment = { ...experiment, isRecorded: false };
        updateExperiment(updatedExperiment); 
      }
      onClose();
    }

    return () => clearTimeout(timeout);
  }, [currentIndex, images, duration, interval, onClose, experimentId, stopMuseRecording, experiments, updateExperiment]);

  return (
    <div
      className={`fixed min-w-screen inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-300 p-4 ${
        isPreviewing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        onClick={onClose}
        className="absolute top-4 right-4 text-buttonBlue text-lg font-bold rounded px-4 py-2"
      >
        X
      </div>
      {countdown > 0 ? (
        <div className="text-center">
          <p>Ensure that the user is wearing the EEG device </p>
          <p>Experiment is starting in</p>
        <p className="text-white text-6xl font-bold">
          {countdown}</p>
          </div>
      ) : message ? (
        <p className="text-white text-xl font-bold">{message}</p>
      ) : (
        <img
          src={images[currentIndex]}
          alt={`Experiment image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      )}
    </div>
  );
};

export default ImagePreviewOverlay;
