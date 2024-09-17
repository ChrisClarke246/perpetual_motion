import React, { useState, useRef } from "react";
import "../css/home.css";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from 'react-google-recaptcha';

function Home() {
  const captchaRef = useRef(null);
  localStorage.clear();
  const [ig, setIG] = useState("");
  const [errormsg, setErrorMessage] = useState("");

  // React Router navigation hook
  const navigate = useNavigate();

  // Function to handle form submission
  const handleClick = (e) => {
    e.preventDefault();
    // Reset error message
    setErrorMessage("");

    if (!ig.includes("@")) {
      setErrorMessage("Enter a valid ig username (with an @)");
      // Reset input fields
      setIG("");
      return;
    }

    const token = captchaRef.current.getValue();

    if (!token) {
      setErrorMessage("Please complete the reCAPTCHA.");
      return;
    }

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

    //       // Save the IG username and navigate to the winner page
    //       localStorage.setItem("user", JSON.stringify(ig));
    //       navigate("/winner/");
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

    localStorage.setItem("user", JSON.stringify(ig));
    navigate("/winner/");

    captchaRef.current.reset();
  };

  return (
    <div className="guess-container">
      <div className="guess-card">
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
          </div>
          {errormsg && <p className="error-message">{errormsg}</p>}
          <div className="captcha">
            <ReCAPTCHA
              theme="dark"
              size="small"
              render="explicit"
              sitekey={import.meta.env.VITE_REACT_APP_SITE_KEY || ""}
              ref={captchaRef}
            />
          </div>
          <button type="submit" className="btn">
            Play
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;

