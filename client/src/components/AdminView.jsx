// import { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import axios from 'axios';

// const socket = io('http://localhost:5000');

// const AdminView = () => {
//     const [run, setRun] = useState('');
//     const [over, setOver] = useState(0);
//     const [ball, setBall] = useState(1);
//     const [scores, setScores] = useState([]);

//     // Fetch initial data from the server on page load
//     useEffect(() => {
//         axios
//             .get('http://localhost:5000/api/scores')
//             .then((response) => {
//                 const data = response.data;
//                 setScores(data.previousOvers);
//                 setOver(data.currentOver);
//                 setBall(data.currentBall);
//             })
//             .catch((error) => console.error('Error fetching initial data', error));
//     }, []);

//     const handleSubmit = (score) => {
//         const updatedScore = {
//             over,
//             ball,
//             run: score,
//         };

//         // Emit the score update event to the server
//         socket.emit('updateScores', updatedScore);

//         // Update the state locally using a functional update
//         setScores((prevScores) => {
//             const updatedScores = [...prevScores];
//             if (!updatedScores[over]) {
//                 updatedScores[over] = { over, runsPerBall: Array(6).fill(null) };
//             }
//             updatedScores[over].runsPerBall[ball - 1] = score;
//             return updatedScores;
//         });

//         // Update the ball and over
//         setBall((prevBall) => {
//             if (prevBall < 6) {
//                 return prevBall + 1;
//             } else {
//                 setOver((prevOver) => prevOver + 1);
//                 return 1; // Reset ball count after over completion
//             }
//         });
//     };

//     const calculateTotalRuns = () =>
//         scores.reduce(
//             (acc, curr) =>
//                 acc + curr.runsPerBall.filter((run) => run !== null && run !== 'Out').reduce((sum, run) => sum + (typeof run === 'number' ? run : 0), 0),
//             0
//         );

//     const calculateTotalWickets = () =>
//         scores.reduce((acc, curr) => acc + curr.runsPerBall.filter((run) => run === 'Out').length, 0);

//     return (
//         <div>
//             <h1>Admin View</h1>
//             <div>
//                 <h2>
//                     Current Score: {calculateTotalRuns()}/{calculateTotalWickets()}
//                 </h2>
//                 <h3>
//                     Current Over: {over}.{ball}
//                 </h3>
//             </div>
//             <div>
//                 <h3>Enter Run or Out</h3>
//                 {[0, 1, 2, 3, 4, 6, 'Out'].map((option, index) => (
//                     <button key={index} onClick={() => handleSubmit(option)}>
//                         {option}
//                     </button>
//                 ))}
//             </div>
//             <div>
//                 <h3>Previous Overs</h3>
//                 {scores.map((score, index) => (
//                     <div key={index}>
//                         Over {score.over}: {score.runsPerBall.join(', ')}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default AdminView;

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const AdminView = () => {
    const [run, setRun] = useState('');
    const [over, setOver] = useState(0);
    const [ball, setBall] = useState(1);
    const [scores, setScores] = useState([]);

    // Fetch initial data from the server on page load
    useEffect(() => {
        axios
            .get('http://localhost:5000/api/scores')
            .then((response) => {
                const data = response.data;
                setScores(data);
                setOver(data.length > 0 ? data[data.length - 1].over : 0);
                setBall(data.length > 0 ? data[data.length - 1].balls.length + 1 : 1);
            })
            .catch((error) => console.error('Error fetching initial data', error));
    }, []);

    useEffect(() => {
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
            socket.off('scoreUpdated'); // Clean up the listener on unmount
        };
    }, []);

    const handleSubmit = (score) => {
        const updatedScore = {
            over,
            ball,
            run: score,
        };

        // Emit the score update event to the server
        socket.emit('updateScores', updatedScore);

        // Update the state locally using a functional update
        setScores((prevScores) => {
            const updatedScores = [...prevScores];
            if (!updatedScores[over]) {
                updatedScores[over] = { over, balls: Array(6).fill(null) };
            }
            updatedScores[over].balls[ball - 1] = score;
            return updatedScores;
        });

        // Update the ball and over
        setBall((prevBall) => {
            if (prevBall < 6) {
                return prevBall + 1;
            } else {
                setOver((prevOver) => prevOver + 1);
                return 1; // Reset ball count after over completion
            }
        });
    };

    const calculateTotalRuns = () =>
        scores.reduce(
            (acc, curr) =>
                acc + curr.balls.filter((run) => run !== null && run !== 'Out').reduce((sum, run) => sum + (typeof run === 'number' ? run : 0), 0),
            0
        );

    const calculateTotalWickets = () =>
        scores.reduce((acc, curr) => acc + curr.balls.filter((run) => run === 'Out').length, 0);

    return (
        <div>
            <h1>Admin View</h1>
            <div>
                <h2>
                    Current Score: {calculateTotalRuns()}/{calculateTotalWickets()}
                </h2>
                <h3>
                    Current Over: {over}.{ball}
                </h3>
            </div>
            <div>
                <h3>Enter Run or Out</h3>
                {[0, 1, 2, 3, 4, 6, 'Out'].map((option, index) => (
                    <button key={index} onClick={() => handleSubmit(option)}>
                        {option}
                    </button>
                ))}
            </div>
            <div>
                <h3>Previous Overs</h3>
                {scores.map((score, index) => (
                    <div key={index}>
                        Over {score.over}: {score.balls.join(', ')}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminView;
