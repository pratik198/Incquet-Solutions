import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
    const [score, setScore] = useState({ runs: 0, wickets: 0, currentOver: 0, currentBall: 0, overs: [] });

    useEffect(() => {
        // Fetch current score on load
        const fetchScore = async () => {
            const { data } = await axios.get('/api/score');
            setScore(data);
        };
        fetchScore();
    }, []);

    const updateScore = async (run) => {
        let newOvers = [...score.overs];
        if (!newOvers[score.currentOver]) newOvers[score.currentOver] = [];
        newOvers[score.currentOver][score.currentBall] = run;

        let newScore = {
            runs: score.runs + run,
            wickets: run === 'Out' ? score.wickets + 1 : score.wickets,
            currentOver: score.currentBall === 5 ? score.currentOver + 1 : score.currentOver,
            currentBall: score.currentBall === 5 ? 0 : score.currentBall + 1,
            overs: newOvers
        };

        setScore(newScore);
        await axios.post('/api/score', newScore);
    };

    return (
        <div>
            <h1>Admin View</h1>
            <div>
                Runs: {score.runs} | Wickets: {score.wickets} | Over: {score.currentOver}.{score.currentBall}
            </div>
            <div>
                <button onClick={() => updateScore(0)}>0</button>
                <button onClick={() => updateScore(1)}>1</button>
                <button onClick={() => updateScore(4)}>4</button>
                <button onClick={() => updateScore(6)}>6</button>
                <button onClick={() => updateScore('Out')}>Out</button>
            </div>
            <div>
                <h3>Overs</h3>
                {(score.overs && score.overs.length > 0) ? (
                    score.overs.map((over, i) => (
                        <div key={i}>
                            {over.map((ball, j) => (
                                <span key={j}>{ball} </span>
                            ))}
                        </div>
                    ))
                ) : (
                    <div>No overs available</div>
                )}
            </div>
        </div>
    );
};

export default AdminView;
