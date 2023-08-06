import { useEffect, useState } from "react"
import axios from "axios";

interface ImageInfo {
  url: string;
  width: number;
  height: number;
}
interface TopArtist {
  name: string;
  genres: string[];
  images: ImageInfo[];
}

function Dashboard() {
  const [topArtists, setTopArtists] = useState<TopArtist[]>([])
  useEffect(() => {
    axios.get('/top/artists')
      .then(({data}) => {
        setTopArtists(data);
      })
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <tbody>
          {topArtists.map((artist, index) => (
            <tr>
              <th>{index+1}</th>
              <td>
                <div className="avatar">
                  <div className="mask mask-squircle w-12 h-12">
                    <img src={artist?.images?.pop()?.url} alt="Artist's profile picture" />
                  </div>
                </div>
              </td>
              <td>{artist.name}</td>
              <td>{artist.genres.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

}

export default Dashboard
