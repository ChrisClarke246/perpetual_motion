import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/winner.css";

function Winner() {
  const [msg, setWinnerMessage] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const loggedIn = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setWinnerMessage(`Congrats ${user}!`);
      const winid = JSON.parse(localStorage.getItem("guessid"))
      // fetch ticket code
      // console.log(winid)
      fetch(`/api/winner/${winid}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((winner) => {
          // console.log(winners);
          if (winner.winner === null){
            setDescription(`DM @motion_enterprises with a screenshot of this page to claim your free ${winner.prize}`)
            
            fetch(`/api/winner/${winid}/`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ winner: user }), // Assuming you want to mark it as read
            })
              .then((response) => {
                if (response.ok) {
                  console.log("Winner successfully registered.");
                  // Continue with displaying the message or any other logic.
                } else {
                  console.error("Failed to register winner.");
                }
              })
              .catch((error) => {
                console.error("Error while registering winner:", error);
              });
          }
          else{
            console.log("Prize already claimed.");
            setWinnerMessage("Almost ...");
            setDescription("This prize has already been claimed");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          // Log the actual response for debugging purposes
          error.response.text().then((text) => {
            console.error("Response:", text);
          });
        });
    } else {
      setWinnerMessage("Skim.");
      setDescription("Your parents should have raised you better.");
    }
  };

  const wonFairly = () => {
    // fetch from the winning table and compare local storage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user == null) {
      setWinnerMessage("Skim.");
      setDescription("Your parents should have raised you better.");
    }
  };

  const home = () => {
    // Navigate back to the home page
    navigate("/");
  };

  useEffect(() => {
    loggedIn();
    wonFairly();
  }, []);

  return (
    <div className="winner-container">
      <div className="winner-card">
        <h2>{msg}</h2>
        <p>{description}</p>
        <button onClick={home} className="winbtn">
          Back
        </button>
      </div>
    </div>
  );
};

export default Winner;
