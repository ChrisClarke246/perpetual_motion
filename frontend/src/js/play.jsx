import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from 'crypto-js';

import "../css/play.css";

// Secret key used for generating HMAC (should match the server's secret)
const SECRET_KEY = process.env.HMAC_SECRET_KEY;

function Play() {
  const [score, setScore] = useState(0);
  const [user, setUSer] = useState("");
  const [msg, setPlayMessage] = useState("");
  const [description, setDescription] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in
  const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUSer(user);
      setPlayMessage(`${user} is now in perpetual motion!`);
      return true; // Indicate that the user is logged in
    } else {
      setPlayMessage("Error");
      setDescription("Enter a valid username");
      return false; // Indicate that the user is not logged in
    }
  };

  // Ensure user navigated fairly (simple validation based on localStorage)
  const navigatedFairly = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
      setPlayMessage("Error");
      setDescription("Enter a valid username");
      return false;
    }
    return true;
  };

  // Navigate back home
  const home = () => {
    sessionStorage.removeItem("alreadyReloaded"); // Clear reload flag when navigating home
    navigate("/");
  };

  // Function to reload the page once
  const reloadOnce = () => {
    const alreadyReloaded = sessionStorage.getItem("alreadyReloaded");
    if (!alreadyReloaded) {
      sessionStorage.setItem("alreadyReloaded", "true");
      window.location.reload();
    }
  };


  const generateHmac = (username, score) => {
    const message = `${username}:${score}`;
    return CryptoJS.HmacSHA256(message, SECRET_KEY).toString(CryptoJS.enc.Hex);
  };

  useEffect(() => {
    window.updateReactScore = async (gameScore) => {
        setScore(gameScore); // Update the score in the React state

        const hmac = generateHmac(user, gameScore); // Use the updated score value
        console.log(`${user} scored ${gameScore}`);

        try {
            // Send the data along with the HMAC to your backend API using fetch
            const response = await fetch('/api/leaderboard/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'HMAC': hmac,  // Include HMAC in headers
                },
                body: JSON.stringify({ username: user, score: gameScore }), // Send username and updated score
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }

            const responseData = await response.json();
            console.log('Success:', responseData);
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    return () => {
        // Clean up the function when the component unmounts
        window.updateReactScore = null;
    };
  }, [user, score]); // Ensure the useEffect hook runs when user and score change


  useEffect(() => {
    const isLoggedIn = loggedIn();
    const isFairlyNavigated = navigatedFairly();

    // Only load the game script if the user is logged in and navigated fairly
    if (isLoggedIn && isFairlyNavigated) {
      const script = document.createElement("script");
      script.src = "/dist/bundle.js";
      script.async = true;

      script.onload = () => {
        if (canvasRef.current && typeof window.initializeGame === "function") {
          window.initializeGame(canvasRef.current); // Pass canvas element to game initialization
        } else {
          reloadOnce(); // If the game does not initialize properly, reload the page once
        }
      };

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [canvasRef]); // Wait for the canvasRef to be available

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
