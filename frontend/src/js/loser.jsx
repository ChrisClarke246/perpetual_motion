import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/loser.css";

function Loser() {
    const navigate = useNavigate();

    const handleTryAgain = () => {
        // Navigate back to the home page
        navigate("/");
    };

    return (
        <div className="loser-container">
            <div className="loser-card">
                <h2>Better Luck Next Time!</h2>
                <button onClick={handleTryAgain} className="losebtn">
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default Loser;
