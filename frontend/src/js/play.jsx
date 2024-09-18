import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../css/play.css";

function Play() {
  const [msg, setplayMessage] = useState("");
  const [description, setDescription] = useState("");
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in
  const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setplayMessage(`${user} is now in perpetual motion!`);
    } else {
      setplayMessage("Error");
      setDescription("Enter a valid username");
    }
  };

  // Ensure user won fairly (simple validation based on localStorage)
  const navigatedFairly = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
      setplayMessage("Error");
      setDescription("Enter a valid username");
    }
  };

  // Navigate back home
  const home = () => {
    navigate("/");
  };

  // Function to reload the page once
  const reloadOnce = () => {
    const alreadyReloaded = sessionStorage.getItem("alreadyReloaded");
    if (!alreadyReloaded) {
      sessionStorage.setItem("alreadyReloaded", "true");
      window.location.reload();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 500); // Reload after 0.5 second
    }
  };

  useEffect(() => {
    loggedIn();
    navigatedFairly();
  }, []); // This will run only once on mount to check login and fairness

  useEffect(() => {
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
