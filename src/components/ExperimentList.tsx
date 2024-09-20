import React from 'react';
import ExperimentItem from './ExperimentItem';
import { useExperimentContext } from '@/hooks/experiment.context';

const ExperimentList: React.FC = () => {
  const { experiments } = useExperimentContext(); // Access experiments from context

  return (
    <div className="w-full max-w-4xl mx-auto mt-10">
      <h1 className="text-2xl font-bold text-white mb-4">Saved Experiments</h1>
      <div className="space-y-4">
        {experiments.length > 0 ? (
          experiments.map((experiment, index) => (
            <ExperimentItem
              key={index}
              experiment={experiment}
            />
          ))
        ) : (
          <p className="text-white">No experiments saved.</p>
        )}
      </div>
    </div>
  );
};

export default ExperimentList;
