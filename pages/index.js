import axios from "axios";
import React, {useState, useEffect, useMemo} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
    const [data, setData] = useState([]);
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const getData = async () => {
        setLoading(true);
        await axios
            .get("https://www.balldontlie.io/api/v1/stats", {
                params: {
                    page: 0,
                    per_page: 100,
                    seasons: ["2017", "2018"],
                    start_date: date,
                    end_date: "2018-12-31"
                }
            })
            .then((response) => {
                console.log(response.data.data)
                setLoading(false);
                setData(response.data.data);
            });
    };

    const doubleDoublePlayers = useMemo(() => {
        const players = data.filter(player =>
            player.ast >= 10 && player.reb >= 10 ||
            player.ast >= 10 && player.blk >= 10 ||
            player.ast >= 10 && player.pts >= 10 ||
            player.ast >= 10 && player.stl >= 10 ||
            player.reb >= 10 && player.blk >= 10 ||
            player.reb >= 10 && player.pts >= 10 ||
            player.reb >= 10 && player.stl >= 10 ||
            player.blk >= 10 && player.pts >= 10 ||
            player.blk >= 10 && player.stl >= 10 ||
            player.pts >= 10 && player.stl >= 10);
        return players;
    }, [data]);

    console.log("doubleDoublePlayers", doubleDoublePlayers);

    return (
        <>
            <input
                type="date"
                min={"2017-01-01"}
                max={"2018-12-31"}
                onChange={(e) => {
                    setDate(e.target.value);
                }}
            />
            <button onClick={getData}>Get Double Double Player</button>
            {loading ? (
                <div>Loading...</div>
            ) : (
                doubleDoublePlayers.length > 0 ? (
                    <table className="table">
                        <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Team</th>
                            <th scope="col">Assists</th>
                            <th scope="col">Rebounds</th>
                            <th scope="col">Blocks</th>
                            <th scope="col">Points</th>
                            <th scope="col">Steals</th>
                        </tr>
                        </thead>
                        <tbody>
                        {doubleDoublePlayers.map((player) => (
                            <tr key={player.id}>
                                <td>{player.player.first_name} {player.player.last_name}</td>
                                <td>{player.team.full_name}</td>
                                <td>{player.ast}</td>
                                <td>{player.reb}</td>
                                <td>{player.blk}</td>
                                <td>{player.pts}</td>
                                <td>{player.stl}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div>No Data</div>
                )
            )}

        </>
    );
}