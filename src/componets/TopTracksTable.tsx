import { useEffect, useState } from "react"
import axios from "axios";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
}
interface TopTrack {
  name: string;
  artists: string[];
  images: ImageInfo[];
}

function Dashboard() {
  const [topTracks, setTopTracks] = useState<TopTrack[]>([])
  useEffect(() => {
    axios.get('/top/tracks')
      .then(({data}) => {
        console.log(data);
        setTopTracks(data);
      })
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <tbody>
          {topTracks.map((track, index) => (
            <tr>
              <th>{index+1}</th>
              <td>
                <div className="avatar">
                  <div className="mask w-12 h-12">
                    <img src={track?.images?.pop()?.url} alt="Album art for track" />
                  </div>
                </div>
              </td>
              <td>{track.name}</td>
              <td>{track.artists.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Dashboard
