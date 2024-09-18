import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "../css/play.css";

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

  useEffect(() => {
    window.updateReactScore = async (gameScore) => {
        setScore(gameScore); // Update the score in the React state

        console.log(`${user} scored ${gameScore}`);

        try {
          const response = await fetch('/api/leaderboard/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: user, score: gameScore }) // Ensure 'username' matches what the backend expects
          });
      
          const data = await response.json();
          console.log('Score submitted:', data);
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
