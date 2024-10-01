import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// Define the structure of an experiment
export interface Experiment {
  id: number;
  experimentName: string;
  images: any;
  duration: number;
  interval: number;
  baselineMeasurement: boolean;
  isRecorded: boolean
}

// Define the context structure
interface ExperimentContextType {
  experiments: Experiment[];
  addExperiment: (newExperiment: Experiment) => void;
  removeExperiment: (experimentName: string) => void;
}

// Create the context with default values
const ExperimentContext = createContext<ExperimentContextType | undefined>(undefined);

// Custom hook to use the ExperimentContext
export const useExperimentContext = () => {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperimentContext must be used within an ExperimentProvider');
  }
  return context;
};

// ExperimentProvider component
export const ExperimentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);

  // Function to add an experiment
  const addExperiment = (newExperiment: Experiment) => {
    const updatedExperiments = [...experiments, newExperiment];
    setExperiments(updatedExperiments);
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  };

  // Function to remove an experiment
  const removeExperiment = (experimentName: string) => {
    const updatedExperiments = experiments.filter(experiment => experiment.experimentName !== experimentName);
    setExperiments(updatedExperiments);
    localStorage.setItem('experiments', JSON.stringify(updatedExperiments));
  };

  const deleteExperiment = (id: number) => {
    setExperiments((prevExperiments) =>
      prevExperiments.filter((exp) => exp.id !== id)
    );
  };
  
  const updateExperiment = (updatedExperiment: Experiment) => {
    setExperiments((prevExperiments) =>
      prevExperiments.map((exp) =>
        exp.id === updatedExperiment.id ? updatedExperiment : exp
      )
    );
  };

  // Load experiments from localStorage on initial render
  useEffect(() => {
    const storedExperiments = localStorage.getItem('experiments');
    if (storedExperiments) {
      setExperiments(JSON.parse(storedExperiments));
    }
  }, []);

  return (
    <ExperimentContext.Provider value={{ experiments, addExperiment, removeExperiment }}>
      {children}  {/* Ensure that the children are returned */}
    </ExperimentContext.Provider>
  );
};
