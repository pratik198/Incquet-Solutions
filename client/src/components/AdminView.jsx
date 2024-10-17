import { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminView = () => {
    const [run, setRun] = useState('');
    const [over, setOver] = useState(1);
    const [ball, setBall] = useState(1);

    const handleSubmit = () => {
        socket.emit('updateScores', { over, ball, run });
        setBall(ball < 6 ? ball + 1 : 1);
        if (ball === 6) setOver(over + 1);
    };

    return (
        <div>
            <h1>Admin View</h1>
            <input type="text" placeholder="Enter Run or Out" value={run} onChange={(e) => setRun(e.target.value)} />
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default AdminView;
