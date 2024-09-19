import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../css/play.css";

function Play() {
  const [score, setScore] = useState(0);
  const [user, setUser] = useState("");
  const [msg, setPlayMessage] = useState("");
  const [description, setDescription] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in
  const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUser(user);
      setPlayMessage(`${user} is now in perpetual motion!`);
      return true;
    } else {
      setPlayMessage("Error");
      setDescription("Enter a valid username");
      return false;
    }
  };

  // Ensure user navigated fairly (simple validation based on localStorage)
  const navigatedFairly = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setPlayMessage("Error");
      setDescription("Enter a valid username");
      return false;
    }
    return true;
  };

  // Navigate back home
  const home = () => {
    navigate("/");
  };

  useEffect(() => {
    window.updateReactScore = async (gameScore) => {
      setScore(gameScore);

      try {
        const response = await fetch('/api/leaderboard/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user, score: gameScore })
        });
        const data = await response.json();
      } catch (error) {
        //console.error('Error submitting score:', error);
      }
    };

    return () => {
      window.updateReactScore = null;
    };
  }, [user, score]);

  useEffect(() => {
    const isLoggedIn = loggedIn();
    const isFairlyNavigated = navigatedFairly();

    if (isLoggedIn && isFairlyNavigated) {
      const scriptExists = document.querySelector('script[src="/dist/bundle.js"]');

      if (!scriptExists) {
        const script = document.createElement("script");
        script.src = "/dist/bundle.js";
        script.async = true;

        script.onload = () => {
          //console.log("Script loaded successfully.");
          //console.log("Checking window object for initializeGame: ", window.initializeGame);

          if (canvasRef.current && typeof window.initializeGame === "function") {
            //console.log("Initializing game...");
            window.initializeGame(canvasRef.current);
          } else {
            //console.error("Game initialization function not found.");
          }
        };

        script.onerror = () => {
          //console.error("Error loading the game script.");
        };

        document.body.appendChild(script);
      } else {
        // Script already exists, ensure game initialization is called
        //console.log("Script already exists. Checking window object for initializeGame: ", window.initializeGame);
        if (canvasRef.current && typeof window.initializeGame === "function") {
          //console.log("Initializing game...");
          window.initializeGame(canvasRef.current);
        } else {
          //console.error("Game initialization function not found.");
        }
      }

      return () => {
        // No need to remove the script, keep it for future visits
      };
    }
  }, [canvasRef]);

  return (
    <div className="play-container">
      <div className="play-card">
        <h2>{msg}</h2>
        <p>{description}</p>

        {/* The canvas for the game */}
        <div className="game">
          <canvas
            ref={canvasRef}
            id="gameCanvas"
            width="768"
            height="576"
            style={{ display: "block", margin: "0 auto", backgroundColor: "#000" }}
          />
        </div>

        {/* Back button to navigate home */}
        <button onClick={home} className="winbtn">
          Back
        </button>
      </div>
    </div>
  );
}

export default Play;
