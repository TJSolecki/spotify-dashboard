import { TopArtist, TopTrack, TabName } from "../views/Dashboard";

interface TopTableProps<T extends TopArtist | TopTrack> {
    type: TabName;
    data: T[];
}

function TopTable<T extends TopArtist | TopTrack>({ type, data }: TopTableProps<T>) {
    return (
        <div className="overflow-x-auto flex justify-center">
            <table className="table table-zebra table-fixed max-w-lg">
                <tbody className="w-full">
                    {data.map((trackOrArtist, index) => (
                        <tr>
                            <td className="w-[1.5rem]">{index+1}</td>
                            <td className="w-[5rem]">
                                <div className="avatar">
                                    <div className={`${type === "artists" ? "mask" : ""} w-12 h-12`}>
                                        <img src={trackOrArtist?.images?.pop()?.url} alt="Album art for track" />
                                    </div>
                                </div>
                            </td>
                            <td className="w-full">{trackOrArtist.name}</td>
                            {type === "artists" 
                                ?
                                <td>{(trackOrArtist as TopTrack)?.artists?.join(', ')}</td>
                                :
                                <td>{(trackOrArtist as TopArtist)?.genres?.join(', ')}</td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

}

export default TopTable;
