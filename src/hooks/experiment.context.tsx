import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export interface Experiment {
  id: number;
  experimentName: string;
  images: any;
  duration: number;
  interval: number;
  baselineMeasurement: boolean;
  isRecorded: boolean;
}

interface ExperimentContextType {
  experiments: Experiment[];
  addExperiment: (newExperiment: Experiment) => void;
  removeExperiment: (id: number) => void;
  updateExperiment: (updatedExperiment: Experiment) => void; // Function to update experiment
}

const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

export const useExperimentContext = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperimentContext must be used within an ExperimentProvider');
  }
  return context;
};

export const ExperimentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  const addExperiment = (newExperiment: Experiment) => {
    const updatedExperiments = [...experiments, newExperiment];
    setExperiments(updatedExperiments);
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  };

  const removeExperiment = (id: number) => {
    const updatedExperiments = experiments.filter(experiment => experiment.id !== id);
    setExperiments(updatedExperiments);
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  };

  const updateExperiment = (updatedExperiment: Experiment) => {
    const updatedExperiments = experiments.map(exp =>
      exp.id === updatedExperiment.id ? updatedExperiment : exp
    );
    setExperiments(updatedExperiments);
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  };

  useEffect(() => {
    const storedExperiments = localStorage.getItem('experiments');
    if (storedExperiments) {
      setExperiments(JSON.parse(storedExperiments));
    }
  }, []);

  return (
    <ExperimentContext.Provider value={{ experiments, addExperiment, removeExperiment, updateExperiment }}>
      {children}
    </ExperimentContext.Provider>
  );
};
