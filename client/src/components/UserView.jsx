import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const UserView = () => {
    const [scores, setScores] = useState([]);

    useEffect(() => {
        socket.on('scoreUpdated', (data) => {
            setScores([...scores, data]);
        });
    }, [scores]);

    return (
        <div>
            <h1>User View</h1>
            <div>
                {scores.map((score, index) => (
                    <div key={index}>
                        Over: {score.over} | Runs: {score.totalRuns} | Wickets: {score.totalWickets}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserView;
