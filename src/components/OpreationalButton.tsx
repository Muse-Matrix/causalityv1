"use client"
import { useState } from "react";

const OpreationalButton = () => {
  // Set "Record" as the default selected operation
  const [selectedOperation, setSelectedOperation] = useState('Record');

  return (
    <div className="flex justify-between mt-6 mb-4">
      <div className="flex justify-left space-x-4 text-white lg:ml-12 ml-6">
        <button 
          className={`${
            selectedOperation === 'Record' ? 'font-semibold bg-white/25 text-highLight' : 'text-gray-300'
          } border border-transparent rounded-md hover:font-semibold hover:bg-white/25 transition duration-300 px-4`}
          onClick={() => setSelectedOperation('Record')}
        >
          Record
        </button>
        <div className="bg-white w-px self-center h-4"></div>
        <button 
          className={`${
            selectedOperation === 'Analyze' ? 'font-semibold bg-white/25 text-highLight' : 'text-gray-300'
          } border border-transparent rounded-md hover:font-semibold hover:bg-white/25 transition duration-300 px-4`}
          onClick={() => setSelectedOperation('Analyze')}
        >
          Analyze
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
