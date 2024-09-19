import React from 'react';
import Button from './Button';
import { Edit, Trash } from 'lucide-react';

interface Experiment {
  id: number;
  name: string;
  isRecording: boolean;
}

interface Props {
  experiment: Experiment;
}

const ExperimentItem: React.FC<Props> = ({ experiment }) => {
  const handleRecord = () => {
    console.log(`Recording data for ${experiment.name}`);
  };

  const handleAnalyze = () => {
    console.log(`Analyzing data for ${experiment.name}`);
  };

  const handleDelete = () => {
    console.log(`Deleting ${experiment.name}`);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-600 py-4">
      <span className="text-white">{experiment.name}</span>
      <div className="flex space-x-4">
        {experiment.isRecording ? (
          <Button onClick={handleRecord}>Record Data</Button>
        ) : (
          <Button onClick={handleAnalyze}>Analyze Data</Button>
        )}
        <Edit className="h-5 w-5 text-gray-300 cursor-pointer" />
        <Trash
          className="h-5 w-5 text-red-500 cursor-pointer"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
};

export default ExperimentItem;
