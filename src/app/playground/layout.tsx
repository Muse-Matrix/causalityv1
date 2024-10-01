"use client";
import OpreationalButton from "@/components/OpreationalButton";
import { MuseContextProvider } from "@/hooks/muse.context";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExperimentProvider } from "@/hooks/experiment.context";

const PlayGroundLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null); 
  const pathname = usePathname();

  useEffect(() => {
    // Only update selectedOperation after client-side hydration
    if (pathname === "/playground/experiments") {
      setSelectedOperation("Experiments");
    } else if (pathname === "/playground/record") {
      setSelectedOperation("Record");
    }
  }, [pathname]);

  // If selectedOperation is null, skip rendering OpreationalButton to avoid hydration mismatch
  if (!selectedOperation) {
    return null; // Or a loading state
  }

  return (
    <>
      <MuseContextProvider>
        <ExperimentProvider>
          <OpreationalButton
            selectedOperation={selectedOperation}
            setSelectedOperation={setSelectedOperation}
          />
          {children}
        </ExperimentProvider>
      </MuseContextProvider>
    </>
  );
};

export default PlayGroundLayout;
