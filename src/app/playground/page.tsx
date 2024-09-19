import OpreationalButton from "@/components/OpreationalButton";
import PlayGroundArea from "@/components/PlayGroundArea";
import { MuseContextProvider } from "@/hooks/muse.context";

const PlayGround = () => {
  return (
    <div>
        <MuseContextProvider>
          <OpreationalButton />
          <PlayGroundArea />
        </MuseContextProvider>
    </div>
  );
};

export default PlayGround;
