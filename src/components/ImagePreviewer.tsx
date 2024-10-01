import React, { useState, useEffect } from "react";

interface ImagePreviewOverlayProps {
  images: string[];
  duration: number; // How long each image should be shown
  interval: number; // Time between images
  onClose: () => void; // Function to close the overlay
}

const ImagePreviewOverlay: React.FC<ImagePreviewOverlayProps> = ({
  images,
  duration,
  interval,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1); // -1 to show starting message first
  const [message, setMessage] = useState<string>("Starting image preview...");
  const [isPreviewing, setIsPreviewing] = useState<boolean>(true);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (currentIndex === -1) {
      // Starting message for 2 seconds
      timeout = setTimeout(() => {
        setMessage("");
        setCurrentIndex(0);
      }, 2000);
    } else if (currentIndex < images.length) {
      // Show each image for the specified duration and interval
      timeout = setTimeout(() => {
        setMessage("Changing image...");
        setTimeout(() => {
          setMessage("");
          setCurrentIndex(currentIndex + 1);
        }, 1000); // Show "Changing image" message for 1 second
      }, (duration + interval) * 1000); // Include interval between images
    } else {
      // Once all images are done, close the preview
      setIsPreviewing(false);
      onClose();
    }

    return () => clearTimeout(timeout); // Clear timeout when unmounting
  }, [currentIndex, images, duration, interval, onClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isPreviewing ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{ width: "100vw", height: "100vh" }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-lg font-bold bg-red-500 rounded px-4 py-2 hover:bg-red-600"
      >
        Close
      </button>
      {message ? (
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
