"use client";

import { Preconnect } from "@/components/Preconnect";
import Recorder from "@/components/Recorder";
import { MuseContext } from "@/hooks/muse.context";
import ProtectedRoutes from "@/hooks/ProtectedRoutes";
import { useContext, useState } from "react";

const RecordArea: React.FC = () => {
  const museContext = useContext(MuseContext);
  const [phase, setPhase] = useState("pre-recording");

  console.log(
    "MUSE INCONNECT:",
    JSON.stringify(museContext),
    JSON.stringify(museContext?.museClient),
    JSON.stringify(museContext?.museService)
  );

  return (
    <div className="bg-darkBlue min-h-[80vh] flex flex-col items-center justify-center text-center text-white mx-10 mb-10 p-4">
      {!museContext?.museClient ? (
        <Preconnect />
      ) : (
        <Recorder />
      )}
    </div>
  );
};

export default ProtectedRoutes(RecordArea);
