import axios from "axios";
import { useState, useEffect } from "react";
import TopTable from "../componets/TopTable.tsx";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
}
export interface TopTrack {
  name: string;
  artists: string[];
  images: ImageInfo[];
}
export interface TopArtist {
  name: string;
  genres: string[];
  images: ImageInfo[];
}
export type TabName = "artists" | "tracks";
type TimeRange = "short_term" | "medium_term" | "long_term";

function Dashboard() {
    const [ artistsOrTracks, setArtistsOrTracks ] = useState<TabName>("artists");
    const [ timeRange, setTimeRange ] = useState<TimeRange>("short_term");
    const [topTracks, setTopTracks] = useState<TopTrack[]>([])
    const [topArtists, setTopArtists] = useState<TopArtist[]>([])
    useEffect(() => {
        axios.get(`/top/artists/${timeRange}`)
            .then(({data}) => {
                setTopArtists(data);
            })
    }, [timeRange]);
    useEffect(() => {
        axios.get(`/top/tracks/${timeRange}`)
            .then(({data}) => {
                setTopTracks(data);
            })
    }, [timeRange]);

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
            <div className="w-full flex justify-center bg-base-200">
                <ul className="menu menu-horizontal">
                    <li>
                        <a
                            className={timeRange === "short_term" ? "active" : ""}
                            onClick={() => setTimeRange("short_term")}
                        >
                            4 Weeks
                        </a>
                    </li>
                    <li>
                        <a 
                            className={timeRange === "medium_term" ? "active" : ""}
                            onClick={() => setTimeRange("medium_term")}
                        >
                            6 Months
                        </a>
                    </li>
                    <li>
                        <a 
                            className={timeRange === "long_term" ? "active" : ""}
                            onClick={() => setTimeRange("long_term")}
                        >
                            All Time
                        </a>
                    </li>
                </ul>
            </div>
            <main>
                {artistsOrTracks === "artists" ?
                    <TopTable
                        type={artistsOrTracks}
                        data={topArtists}
                    />
                    :
                    <TopTable
                        type={artistsOrTracks}
                        data={topTracks}
                    />
                }
            </main>
        </>
    );
}

export default Dashboard;
