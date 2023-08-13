import { useState } from "react";
import TopArtistsTable from "../componets/TopArtistTable.tsx";
import TopTracksTable from "../componets/TopTracksTable.tsx";

type TabType = "artists" | "tracks"

function Dashboard() {
  const [ artistsOrTracks, setArtistsOrTracks ] = useState<TabType>("artists");
  return (
    <>
      <div className="tabs tabs-boxed">
        <a
          onClick={() => setArtistsOrTracks("artists")}
          className={`tab ${artistsOrTracks === "artists" ? "tab-active" : ""}`}
        >
          Top Artists
        </a>
        <a
          onClick={() => setArtistsOrTracks("tracks")}
          className={`tab ${artistsOrTracks === "tracks" ? "tab-active" : ""}`}
        >
          Top Tracks
        </a>
      </div>
      <main>
        {artistsOrTracks === "artists"
          ?
            <TopArtistsTable/>
          :
            <TopTracksTable/>
        }
      </main>
    </>
  );
}

export default Dashboard;
