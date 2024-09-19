import React from 'react';
import ExperimentItem from './ExperimentItem';

const experiments = [
  { id: 1, name: 'Experiment 1', isRecording: true },
  { id: 2, name: 'Experiment 2', isRecording: false },
  { id: 3, name: 'Experiment 3', isRecording: false },
  { id: 4, name: 'Experiment 4', isRecording: false },
  { id: 5, name: 'Experiment 5', isRecording: false },
];

const ExperimentList: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-white mb-4">Saved Experiments</h1>
      <div className="space-y-4">
        {experiments.map((experiment) => (
          <ExperimentItem key={experiment.id} experiment={experiment} />
        ))}
      </div>
    </div>
  );
};

export default ExperimentList;
