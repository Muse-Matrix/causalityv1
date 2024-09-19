"use client"
import React from 'react';
import ExperimentList from '@/components/ExperimentList';

const Experiments: React.FC = () => {
  return (
    <div className="bg-darkBlue min-h-[80vh] flex flex-col items-center justify-center text-center text-white mx-10 mb-10 p-4">
      <ExperimentList />
    </div>
  );
};

export default Experiments;
