"use client";
import React from 'react';
import ExperimentList from '@/components/ExperimentList';

const Experiments: React.FC = () => {
  return (
    <div className="bg-darkBlue min-h-screen flex flex-col items-center justify-start text-white py-8 px-4 mx-10 mb-10">
      <ExperimentList />
    </div>
  );
};

export default Experiments;
