"use client";

import { useContext, useState } from "react";
import { Preconnect } from "./Preconnect";
import { MuseContext } from "@/hooks/muse.context";
import Inconnect from "./Inconnect";
import { WaveInsight } from "./WaveInsight";

const PlayGroundArea: React.FC = () => {
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
      {phase === "pre-recording" ? (
        !museContext?.museClient ? (
          <Preconnect />
        ) : (
          <Inconnect setPhase={setPhase} />
        )
      ) : (
        <WaveInsight id={3} name="Akhil" description="new experiments" />
      )}
    </div>
  );
};

export default PlayGroundArea;
