// import { useEffect, useState } from 'react';
// import axios from 'axios';

// const UserView = () => {
//     const [scores, setScores] = useState([]);

//     // Function to fetch the latest scores from the server
//     const fetchScores = async () => {
//         try {
//             const response = await axios.get('http://localhost:5000/api/scores');
//             setScores(response.data);
//         } catch (error) {
//             console.error('Error fetching scores:', error);
//         }
//     };

//     // Fetch initial data and set up polling to update scores
//     useEffect(() => {
//         fetchScores(); // Fetch scores on component mount
//         const intervalId = setInterval(fetchScores, 5000); // Poll every 5 seconds

//         return () => clearInterval(intervalId); // Clean up interval on component unmount
//     }, []);

//     return (
//         <div>
//             <h1>User View</h1>
//             <div>
//                 <h2>
//                     Current Score:
//                     {scores.reduce((total, score) => total + score.balls.filter(run => run !== null && run !== 'Out').length, 0)}/
//                     {scores.reduce((total, score) => total + score.balls.filter(run => run === 'Out').length, 0)}
//                 </h2>
//                 <h3>Current Over: {scores.length > 0 ? scores[scores.length - 1].over : 0}</h3>
//             </div>
//             <div>
//                 <h3>This Over Run Scored</h3>
//                 {scores.length > 0 && scores[scores.length - 1].balls.map((run, index) => (
//                     <div key={index}>Ball {index + 1}: {run}</div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default UserView;

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const UserView = () => {
    const [scores, setScores] = useState([]);

    // Function to fetch the latest scores from the server
    const fetchScores = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/scores');
            setScores(response.data);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    // Fetch initial data and set up polling to update scores
    useEffect(() => {
        fetchScores(); // Fetch scores on component mount
        const intervalId = setInterval(fetchScores, 5000); // Poll every 5 seconds

        // Listen for score updates from the server
        socket.on('scoreUpdated', (updatedScore) => {
            setScores((prevScores) => {
                const newScores = [...prevScores];
                const { over, ball, run } = updatedScore;
                if (!newScores[over]) {
                    newScores[over] = { over, balls: Array(6).fill(null) };
                }
                newScores[over].balls[ball - 1] = run;
                return newScores;
            });
        });

        return () => {
            clearInterval(intervalId); // Clean up interval on component unmount
            socket.off('scoreUpdated'); // Clean up the listener on unmount
        };
    }, []);

    return (
        <div>
            <h1>User View</h1>
            <div>
                <h2>
                    Current Score:
                    {scores.reduce((total, score) => total + score.balls.filter(run => run !== null && run !== 'Out').length, 0)}/
                    {scores.reduce((total, score) => total + score.balls.filter(run => run === 'Out').length, 0)}
                </h2>
                <h3>Current Over: {scores.length > 0 ? scores[scores.length - 1].over : 0}</h3>
            </div>
            <div>
                <h3>This Over Run Scored</h3>
                {scores.length > 0 && scores[scores.length - 1].balls.map((run, index) => (
                    <div key={index}>Ball {index + 1}: {run}</div>
                ))}
            </div>
        </div>
    );
};

export default UserView;
