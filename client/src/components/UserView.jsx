import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io.connect('http://localhost:5000');

const UserView = () => {
    const [score, setScore] = useState({ runs: 0, wickets: 0, currentOver: 0, currentBall: 0, overs: [] });

    useEffect(() => {
        const fetchScore = async () => {
            const { data } = await axios.get('/api/score');
            setScore(data);
        };

        fetchScore();
        socket.on('scoreUpdated', (updatedScore) => {
            setScore(updatedScore);
        });
    }, []);

    return (
        <div>
            <h1>User View</h1>
            <div>
                Runs: {score.runs} | Wickets: {score.wickets} | Over: {score.currentOver}.{score.currentBall}
            </div>
            <div>
                <h3>Overs</h3>
                {score.overs.map((over, i) => (
                    <div key={i}>
                        {over.map((ball, j) => (
                            <span key={j}>{ball} </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserView;
