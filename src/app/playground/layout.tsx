"use client";
import OpreationalButton from "@/components/OpreationalButton";
import { MuseContextProvider } from "@/hooks/muse.context";
import RecordArea from "./record/page";
import { useEffect, useState } from "react";
import Experiments from "./experiments/page";
import { useRouter } from "next/navigation";

const PlayGroundLayout = ({ children }: { children: React.ReactNode }) => {
  const [selectedOperation, setSelectedOperation] = useState("Record");
  const router = useRouter();

  useEffect(() => {
    if (selectedOperation === "Record") {
      router.push("/playground/record");
    } else {
      router.push("/playground/experiments");
    }
  }, [selectedOperation, router]);

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
