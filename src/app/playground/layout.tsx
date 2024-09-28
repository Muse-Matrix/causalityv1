"use client";
import OpreationalButton from "@/components/OpreationalButton";
import { MuseContextProvider } from "@/hooks/muse.context";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ExperimentProvider } from "@/hooks/experiment.context";

const PlayGroundLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedOperation, setSelectedOperation] = useState("Record");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/playground/experiments") {
      setSelectedOperation("Experiments");
    }
    if (pathname === "/playground/record") {
      setSelectedOperation("Record");
    }
  }, [selectedOperation, router, pathname]);

  return (
    <div>
      <MuseContextProvider>
        <ExperimentProvider>
          <OpreationalButton
            selectedOperation={selectedOperation}
            setSelectedOperation={setSelectedOperation}
          />
          {children}
        </ExperimentProvider>
      </MuseContextProvider>
    </div>
  );
};

export default PlayGroundLayout;
