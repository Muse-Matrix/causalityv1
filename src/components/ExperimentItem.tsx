import React from 'react';
import Button from './Button';
import { Edit, Trash } from 'lucide-react';
import { Experiment } from '@/hooks/experiment.context';



interface Props {
  experiment: Experiment
}

const ExperimentItem: React.FC<Props> = ({ experiment }) => {
  const handleRecord = () => {
    console.log(`Recording data for ${experiment.experimentName}`);
  };

  const handleAnalyze = () => {
    console.log(`Analyzing data for ${experiment.experimentName}`);
  };

  const handleDelete = () => {
    console.log(`Deleting ${experiment.experimentName}`);
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-600 py-4">
      <span className="text-white">{experiment.experimentName}</span>
      <div className="flex space-x-4">
        {!experiment.isRecorded ? (
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
