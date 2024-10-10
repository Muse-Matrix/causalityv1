import { useState, useEffect } from "react";

interface OverlayProps {
  time: number;
  closeOverlay: (timeFromOverlay: number) => void;
}

const Overlay: React.FC<OverlayProps> = ({ time, closeOverlay }) => {
  const [countdown, setCountdown] = useState<number>(time);

  // Countdown logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle the close button
  const handleClose = () => {
    closeOverlay(countdown); // Pass the remaining countdown time back to the parent
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-black text-white w-full max-w-2xl md:max-w-3xl p-8 relative border-2 border-buttonBlue text-center">
        <h1 className="text-2xl font-bold mb-4">Wait for: {countdown} seconds</h1>
        <button
          onClick={handleClose}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Overlay;
