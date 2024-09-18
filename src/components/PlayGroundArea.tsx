"use client"
import { useContext } from "react";
import { Preconnect } from "./Preconnect";
import { MuseContext } from "@/hooks/muse.context";
import Inconnect from "./Inconnect";

const PlayGroundArea: React.FC = () => {
  const museContext = useContext(MuseContext);
  console.log("MUSE INCONNECT:", museContext, museContext?.museClient, museContext?.museService);

  return (
    <div className="bg-darkBlue min-h-[80vh] flex flex-col items-center justify-center text-center text-white mx-10 mb-10 p-4">
      {!museContext?.museClient ? <Preconnect/> : <Inconnect/>}
    </div>
  );
};

export default PlayGroundArea;
