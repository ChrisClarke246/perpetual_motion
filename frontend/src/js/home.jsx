import React, { useState, useRef, useEffect } from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
//import ReCAPTCHA from "react-google-recaptcha";

function Home() {
  sessionStorage.removeItem("alreadyReloaded");

  const usernameRegex = /^@[a-zA-Z0-9._]{1,30}$/;
  // const captchaRef = useRef(null);
  localStorage.clear();
  const [ig, setIG] = useState("");
  const [errormsg, setErrorMessage] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);

  // React Router navigation hook
  const navigate = useNavigate();

  // Simulate fetching leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("/api/leaderboard/");  // Assuming this is the API endpoint for the leaderboard
      // console.log(response)
      if (response.ok) {
        const data = await response.json();
        // console.log(data)
        setLeaderboard(data);  // Update leaderboard state
      } else {
        console.error("Failed to fetch leaderboard data.");
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Function to handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");

    if (!usernameRegex.test(ig)) {
      setErrorMessage("Enter a valid IG username starting with '@' and containing only letters, numbers, periods, and underscores.");
      setIG("");
      return;
    }

    if (!ig.includes("@")) {
      setErrorMessage("Enter a valid IG username (with an @)");
      // Reset input fields
      setIG("");
      return;
    }

    // const token = captchaRef.current.getValue();

    // if (!token) {
    //   setErrorMessage("Please complete the reCAPTCHA.");
    //   return;
    // }

    // You would normally verify the captcha and handle the IG data
    localStorage.setItem("user", JSON.stringify(ig));
    navigate("/play/");

    // captchaRef.current.reset();
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-card">
        <h2>Perpetual Motion</h2>
        <form onSubmit={handleClick}>
          <div className="input-group">
            <input
              type="text"
              placeholder="@Instagram_Username"
              value={ig}
              onChange={(e) => setIG(e.target.value)}
              required
            />
            <p>** You will not be eligible for any giveaways unless you enter a valid Instagram Username **</p>
          {/* </div>
          <div className="captcha">
            <ReCAPTCHA
              theme="dark"
              size="small"
              render="explicit"
              sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY || ""}
              ref={captchaRef}
            /> */}
          </div>
          {errormsg && <p className="error-message">{errormsg}</p>}
          <button type="submit" className="btn">
            Play
          </button>
        </form>

        {/* Leaderboard section under the form */}
        <div className="leaderboard-card">
          <h3>Leaderboard</h3>
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Instagram</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.slice(0, 10).map((entry, index) => (
                <tr key={index}>
                  <td>{entry.username}</td>
                  <td>{entry.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Home;



    // Verify token
    // fetch(`/api/verify-captcha/${token}/`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ captch_response: token }),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       return response.json().then((errorData) => {
    //         throw new Error(errorData.message || "Captcha verification failed");
    //       });
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     if (data.success) {
    //       // Captcha verification successful, continue with your logic
    //       console.log("Captcha verification successful");

    //       // Save the IG username and navigate to the play page
    //       localStorage.setItem("user", JSON.stringify(ig));
    //       navigate("/play/");
    //     } else {
    //       // Captcha verification unsuccessful
    //       console.log("Captcha verification unsuccessful");
    //       setErrorMessage("Captcha verification failed");
    //     }
    //   })
    //   .catch((error) => {
    //     // Error during captcha verification
    //     console.error("Error during captcha verification:", error);
    //     setErrorMessage("An error occurred during captcha verification");
    //   });