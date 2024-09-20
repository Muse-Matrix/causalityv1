"use client"
import { useRouter } from "next/navigation";

interface OpreationalButtonProps {
  selectedOperation: string;
  setSelectedOperation: (operation: string) => void;
}

const OpreationalButton: React.FC<OpreationalButtonProps> = ({
  selectedOperation,
  setSelectedOperation,
}) => {
  const router = useRouter();

  const handleClick = (operation: string) => {
    setSelectedOperation(operation);
    if (operation === "Record") {
      router.push("/playground/record");
    } else if (operation === "Experiments") {
      router.push("/playground/experiments");
    }
  };

  return (
    <div className="flex justify-between mt-6 mb-4">
      <div className="flex justify-left space-x-4 text-white lg:ml-12 ml-6">
        <button
          className={`${
            selectedOperation === 'Record'
              ? 'font-semibold bg-white/25 text-highLight'
              : 'text-gray-300'
          } border border-transparent rounded-md hover:font-semibold hover:bg-white/25 transition duration-300 px-4`}
          onClick={() => handleClick("Record")}
        >
          Record
        </button>
        <div className="bg-white w-px self-center h-4"></div>
        <button
          className={`${
            selectedOperation === 'Experiments'
              ? 'font-semibold bg-white/25 text-highLight'
              : 'text-gray-300'
          } border border-transparent rounded-md hover:font-semibold hover:bg-white/25 transition duration-300 px-4`}
          onClick={() => handleClick("Experiments")}
        >
          Experiments
        </button>
      </div>
      <div className="flex justify-right space-x-4 text-white lg:mr-12 mr-6">
        <button className="text-white border rounded-lg p-3">
          Setup an experiment
        </button>
      </div>
    </div>
  );
};

export default OpreationalButton;
