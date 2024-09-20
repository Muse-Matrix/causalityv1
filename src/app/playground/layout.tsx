"use client";
import OpreationalButton from "@/components/OpreationalButton";
import { MuseContextProvider } from "@/hooks/muse.context";
import RecordArea from "./record/page";
import { useEffect, useState } from "react";
import Experiments from "./experiments/page";
import { usePathname, useRouter } from "next/navigation";

const PlayGroundLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedOperation, setSelectedOperation] = useState("Record");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if(pathname === "/playground/experiments"){
      setSelectedOperation("Experiments")
    }
    if(pathname === "/playground/record"){
      setSelectedOperation("Record")
    }
  }, [selectedOperation, router, pathname]);

  return (
    <div>
      <MuseContextProvider>
        <OpreationalButton
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
        />
        {children}
      </MuseContextProvider>
    </div>
  );
};

export default PlayGroundLayout;
